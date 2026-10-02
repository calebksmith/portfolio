import { parseColor } from "@/lib/contrast";

/**
 * Resolving a rendered value back to the token that produced it.
 *
 * The browser gives you `rgb(238, 240, 242)`. The design system calls that
 * `--ck-background`. Going backwards is what makes the inspector report on the
 * token layer rather than just dumping CSS — and it only works because every
 * value on this site comes from a token in the first place. An element whose
 * color resolves to no token is, by definition, a violation of the rule in
 * CLAUDE.md.
 */

/**
 * The color tokens, by name.
 *
 * A list of names, not values — the values are always read from the live DOM,
 * so this cannot drift into a second palette. Enumerating custom properties off
 * `getComputedStyle` is possible but inconsistent across browsers, and a wrong
 * answer here would be silent.
 */
const COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "muted",
  "muted-foreground",
  "primary",
  "primary-foreground",
  "accent",
  "accent-foreground",
  "border",
  "input",
  "ring",
] as const;

/**
 * The color properties worth reporting. What to call each one is copy, and
 * lives with the inspector's other labels in `lib/i18n/messages/`.
 */
const INSPECTED_PROPERTIES = [
  "background-color",
  "color",
  "border-top-color",
  "outline-color",
];

/** Normalises any parsable color to a comparable `r,g,b` key. */
function colorKey(value: string): string | null {
  const parsed = parseColor(value);
  return parsed ? parsed.join(",") : null;
}

/**
 * Builds value → token-name lookup from the live theme.
 *
 * Rebuilt on every inspection rather than cached, because switching theme or
 * mode changes every value. A stale index would confidently report the wrong
 * token, which is worse than reporting none.
 */
export function buildTokenIndex(): Map<string, string> {
  const styles = getComputedStyle(document.documentElement);
  const index = new Map<string, string>();

  for (const token of COLOR_TOKENS) {
    const key = colorKey(styles.getPropertyValue(`--ck-${token}`).trim());
    // First name wins: two tokens can legitimately hold the same value (in the
    // high-contrast theme, `card` and `background` are both white), and the
    // earlier entry in COLOR_TOKENS is the more general one.
    if (key && !index.has(key)) index.set(key, token);
  }

  return index;
}

export type ResolvedToken = {
  property: string;
  value: string;
  /** The `--ck-*` name, or null when the value came from outside the system. */
  token: string | null;
};

export type TypeFacts = {
  /** Which of the site's two faces, or the raw family name for anything else. */
  family: "display" | "body" | string;
  size: string;
  weight: string;
  lineHeight: string;
};

export type Inspection = {
  tag: string;
  /** The element's own slot, when it declares one. */
  slot: string | null;
  /** The component this element sits inside, when it is not one itself. */
  owner: string | null;
  tokens: ResolvedToken[];
  /** Present for elements that actually render text. */
  type: TypeFacts | null;
};

/** Elements that render text directly, rather than only arranging children. */
const TEXT_TAGS = new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "span",
  "a",
  "li",
  "dt",
  "dd",
  "strong",
  "em",
  "code",
  "label",
  "legend",
  "blockquote",
  "caption",
  "th",
  "td",
  "figcaption",
  "button",
]);

/**
 * Which family a computed font-family string belongs to.
 *
 * Matching the head of the stack is enough: the browser returns the whole
 * fallback list, and only the first name was ever chosen deliberately.
 */
function familyName(fontFamily: string): string {
  const head = fontFamily.split(",")[0]?.replace(/["']/g, "").trim() ?? "";
  if (/archivo/i.test(head)) return "display";
  if (/plex mono/i.test(head)) return "body";
  return head || "unknown";
}

/**
 * Reads one element: its own slot if it has one, the component it sits in if it
 * does not, its resolved tokens, and — for text — the type facts.
 *
 * Inspecting the element rather than climbing to the nearest component is the
 * point. A heading inside a card has its own color and its own type; reporting
 * the card's would be reporting something the visitor is not looking at.
 */
export function inspectElement(
  element: HTMLElement,
  index: Map<string, string>,
): Inspection {
  const styles = getComputedStyle(element);
  const tag = element.tagName.toLowerCase();

  const tokens = INSPECTED_PROPERTIES.map((property) => {
    const value = styles.getPropertyValue(property).trim();
    const key = colorKey(value);
    return {
      property,
      value,
      token: key ? (index.get(key) ?? null) : null,
    };
  })
    // Transparent and fully-unset values say nothing useful.
    .filter(
      (entry) =>
        entry.value &&
        entry.value !== "rgba(0, 0, 0, 0)" &&
        entry.value !== "transparent",
    );

  const slot = element.dataset.slot ?? null;

  // The owning component, only when the element is not one itself.
  const owner = slot
    ? null
    : (element.parentElement?.closest<HTMLElement>("[data-slot]")?.dataset
        .slot ?? null);

  const type = TEXT_TAGS.has(tag)
    ? {
        family: familyName(styles.fontFamily),
        size: styles.fontSize,
        weight: styles.fontWeight,
        lineHeight: styles.lineHeight,
      }
    : null;

  return {
    tag,
    slot,
    owner,
    tokens,
    type,
  };
}

/**
 * The element to inspect: whatever is actually under the pointer or focus.
 *
 * The inspector's own chrome is excluded — pointing at the panel should not
 * inspect the panel, and the highlight is aria-hidden decoration.
 */
export function inspectTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement)) return null;
  if (target.closest("[data-inspector-chrome]")) return null;
  if (target === document.body || target === document.documentElement) {
    return null;
  }
  return target;
}
