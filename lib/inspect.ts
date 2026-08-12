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

/** The CSS properties worth reporting, and what to call them. */
const INSPECTED_PROPERTIES: { property: string; label: string }[] = [
  { property: "background-color", label: "Surface" },
  { property: "color", label: "Text" },
  { property: "border-top-color", label: "Border" },
  { property: "outline-color", label: "Ring" },
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
  label: string;
  property: string;
  value: string;
  /** The `--ck-*` name, or null when the value came from outside the system. */
  token: string | null;
};

export type Inspection = {
  slot: string;
  tag: string;
  tokens: ResolvedToken[];
  rule: string | null;
};

/**
 * Short statements of what governs each component.
 *
 * The rule is the third column the context document asks for — component,
 * tokens, and the rule behind them. Only slots with a rule worth stating are
 * listed; the rest report their tokens and nothing invented.
 */
const RULES: Record<string, string> = {
  button:
    "Every variant pairs a surface with its foreground. Minimum target 44px, enforced in the component.",
  badge: "Pairs only — a badge never sets a foreground its surface doesn't own.",
  card: "Carries text-card-foreground with its background, so nested content inherits a legible color.",
  "card-title": "Display face, balanced wrapping, no color of its own.",
  "card-description": "muted-foreground on the card surface.",
  "spec-list": "A <dl>, not a table — term and description, not tabular data.",
  "spec-row": "Label in muted-foreground, value in foreground.",
  "status-dot":
    "Decorative: aria-hidden, visible at rest, no-op under reduced motion. The label carries the meaning.",
  "control-bar":
    "Ghost by design — no border against the header's own rule. Grouped by proximity and announced once.",
  "control-button": "Instrument, not navigation. Inset focus ring so it never spills past the header.",
  "control-toggle": "aria-pressed, because it turns a page mode on rather than submitting a value.",
  "site-header": "Two zones: the path is plain text, the instruments are controls.",
  "theme-switcher":
    "Radio inputs, so arrow-key navigation and correct announcements come from the platform.",
  "case-study-card":
    "Filled surface plus an accent label — the label survives the single-column collapse a border would not.",
  "pointer-card": "Unfilled, so navigation never reads as work.",
  "bento-tile": "Span follows content weight; hierarchy also carried by type scale.",
};

/** Reads one element's slot, resolved tokens, and rule. */
export function inspectElement(
  element: HTMLElement,
  index: Map<string, string>,
): Inspection {
  const styles = getComputedStyle(element);

  const tokens = INSPECTED_PROPERTIES.map(({ property, label }) => {
    const value = styles.getPropertyValue(property).trim();
    const key = colorKey(value);
    return {
      label,
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

  const slot = element.dataset.slot ?? "unknown";

  return {
    slot,
    tag: element.tagName.toLowerCase(),
    tokens,
    rule: RULES[slot] ?? null,
  };
}

/** The nearest ancestor that declares a slot, including the element itself. */
export function nearestSlot(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>("[data-slot]");
}
