"use client";

import { createElement, type ElementType, type ReactNode } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ControlBar,
  ControlButton,
  ControlToggle,
  Eyebrow,
  SpecList,
  SpecRow,
  StatusDot,
} from "@/components/cksui";

/**
 * The playground's component specimens, described as trees rather than as JSX.
 *
 * This is the whole point of the file. A playground that keeps a rendered
 * example next to a hand-written code sample has two sources of truth, and the
 * sample is wrong the first time someone edits the example and forgets it. Here
 * a recipe returns one `Element` tree, and the tree is projected two ways:
 * `renderNode` builds it out of the real cksUI exports, and `tokenize` writes it
 * out as JSX. Neither can describe something the other doesn't.
 *
 * So the code on screen is not a description of the component beside it. It is
 * the same object, printed.
 */

/** A prop that has to be written as a JSX expression rather than a string. */
type Expression = { expr: string; value: ReactNode };

export type PropValue = string | boolean | Expression;

export type Element = {
  tag: string;
  props?: Record<string, PropValue>;
  children?: Child[];
};

export type Child = Element | string;

const isExpression = (value: PropValue): value is Expression =>
  typeof value === "object" && value !== null && "expr" in value;

/**
 * Tags the recipes may use, resolved to the real components.
 *
 * Anything not listed falls through to an intrinsic element, which is how the
 * one `<p>` in the card recipe renders. Keeping the map explicit means a typo in
 * a recipe produces a `<Button>` literal on the page rather than silently
 * rendering nothing.
 */
const REGISTRY: Record<string, ElementType> = {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ControlBar,
  ControlButton,
  ControlToggle,
  Eyebrow,
  SpecList,
  SpecRow,
  StatusDot,
};

/* --- Projection one: the live component ----------------------------------- */

export function renderNode(node: Child, key?: number): ReactNode {
  if (typeof node === "string") return node;

  const type = REGISTRY[node.tag] ?? node.tag;
  const props: Record<string, unknown> = key === undefined ? {} : { key };

  for (const [name, value] of Object.entries(node.props ?? {})) {
    // `false` means "not written", matching how the printer omits it.
    if (value === false) continue;
    props[name] = isExpression(value) ? value.value : value;
  }

  const children = node.children?.map((child, index) => renderNode(child, index));

  return children
    ? createElement(type, props, ...children)
    : createElement(type, props);
}

/* --- Projection two: the JSX ---------------------------------------------- */

export type TokenKind = "tag" | "prop" | "value" | "text" | "punct";
export type Token = { text: string; kind: TokenKind };

/**
 * Writes a tree as JSX.
 *
 * Emitted as tokens rather than a string so the code panel can color it by
 * meaning. Highlighting a finished string with regular expressions would be
 * guessing at a structure this already knows.
 */
export function tokenize(node: Child): Token[] {
  const out: Token[] = [];
  emit(node, 0, out);
  return out;
}

function emit(node: Child, depth: number, out: Token[]) {
  const pad = "  ".repeat(depth);

  if (typeof node === "string") {
    out.push({ text: pad + node, kind: "text" });
    return;
  }

  out.push({ text: `${pad}<`, kind: "punct" });
  out.push({ text: node.tag, kind: "tag" });

  for (const [name, value] of Object.entries(node.props ?? {})) {
    if (value === false) continue;

    out.push({ text: " ", kind: "punct" });
    out.push({ text: name, kind: "prop" });

    // A boolean prop is written bare — `disabled`, not `disabled={true}`.
    if (value === true) continue;

    out.push({ text: "=", kind: "punct" });

    if (isExpression(value)) {
      out.push({ text: "{", kind: "punct" });
      out.push({ text: value.expr, kind: "tag" });
      out.push({ text: "}", kind: "punct" });
    } else {
      out.push({ text: `"${value}"`, kind: "value" });
    }
  }

  const children = node.children ?? [];

  if (children.length === 0) {
    out.push({ text: " />", kind: "punct" });
    return;
  }

  out.push({ text: ">", kind: "punct" });

  // A lone string child stays on the tag's own line, the way it would be typed.
  if (children.length === 1 && typeof children[0] === "string") {
    out.push({ text: children[0], kind: "text" });
    out.push({ text: "</", kind: "punct" });
    out.push({ text: node.tag, kind: "tag" });
    out.push({ text: ">", kind: "punct" });
    return;
  }

  for (const child of children) {
    out.push({ text: "\n", kind: "punct" });
    emit(child, depth + 1, out);
  }

  out.push({ text: `\n${pad}</`, kind: "punct" });
  out.push({ text: node.tag, kind: "tag" });
  out.push({ text: ">", kind: "punct" });
}

/* --- The recipes ---------------------------------------------------------- */

export type Control = {
  /** Matches the key the recipe reads from `choices`. */
  name: string;
  label: string;
  /** First value is the default. */
  values: readonly string[];
};

export type Recipe = {
  id: string;
  name: string;
  slot: string;
  description: string;
  notes?: string[];
  controls: Control[];
  build: (choices: Record<string, string>) => Element;
};

function DemoIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M2 4.5h5M11 4.5h3M2 11.5h3M9 11.5h5" />
      <circle cx="9" cy="4.5" r="1.75" />
      <circle cx="7" cy="11.5" r="1.75" />
    </svg>
  );
}

/** The icon prop, written as the expression it is rather than as a string. */
const ICON: Expression = { expr: "<Icon />", value: <DemoIcon /> };

export const recipes: Recipe[] = [
  {
    id: "button",
    name: "Button",
    slot: "button",
    description:
      "Four variants, each pairing a surface with its foreground so every one stays legible in all three themes.",
    notes: [
      "The 44px minimum height is enforced in the component, not remembered at call sites.",
      "asChild renders the child element instead of a <button>, for wrapping a link.",
    ],
    controls: [
      {
        name: "variant",
        label: "Variant",
        values: ["primary", "secondary", "outline", "ghost"],
      },
      { name: "size", label: "Size", values: ["md", "sm", "lg"] },
      { name: "state", label: "State", values: ["default", "disabled"] },
    ],
    build: (choices) => ({
      tag: "Button",
      props: {
        ...(choices.variant === "primary" ? {} : { variant: choices.variant }),
        ...(choices.size === "md" ? {} : { size: choices.size }),
        ...(choices.state === "disabled" ? { disabled: true } : {}),
      },
      children: ["Read case study"],
    }),
  },
  {
    id: "badge",
    name: "Badge",
    slot: "badge",
    description: "A small label. Used for platforms and for pass/fail results.",
    controls: [
      { name: "variant", label: "Variant", values: ["outline", "soft", "solid"] },
      { name: "label", label: "Label", values: ["Web", "iOS", "AA pass"] },
    ],
    build: (choices) => ({
      tag: "Badge",
      props: {
        ...(choices.variant === "outline" ? {} : { variant: choices.variant }),
      },
      children: [choices.label],
    }),
  },
  {
    id: "card",
    name: "Card",
    slot: "card",
    description:
      "A surface that carries text-card-foreground with its background, so anything nested inherits a legible color without restating it.",
    notes: [
      "Changing the content option changes the shape of the tree, not a class — which is why the code below grows and shrinks with it.",
    ],
    controls: [
      {
        name: "content",
        label: "Content",
        values: ["Title", "With description", "With body"],
      },
    ],
    build: (choices) => ({
      tag: "Card",
      children: [
        {
          tag: "CardHeader",
          children: [
            { tag: "CardTitle", children: ["VimUI"] },
            ...(choices.content === "Title"
              ? []
              : [
                  {
                    tag: "CardDescription",
                    children: ["A design system, in code."],
                  },
                ]),
          ],
        },
        ...(choices.content === "With body"
          ? [
              {
                tag: "CardContent",
                children: [
                  {
                    tag: "p",
                    props: { className: "text-sm text-muted-foreground" },
                    children: ["50+ components, one shared codebase."],
                  },
                ],
              },
            ]
          : []),
      ],
    }),
  },
  {
    id: "spec-list",
    name: "Spec list",
    slot: "spec-list",
    description:
      "Label and value pairs drawn with hairline rules. A <dl>, not a table — these are term/description pairs rather than tabular data, so a screen reader announces “Focus, design systems” instead of “row 1, column 1”.",
    controls: [{ name: "rows", label: "Rows", values: ["Two", "Three", "Four"] }],
    build: (choices) => {
      const count = { Two: 2, Three: 3, Four: 4 }[choices.rows] ?? 2;

      return {
        tag: "SpecList",
        children: [
          { label: "Focus", value: "Design systems, product design, frontend" },
          { label: "Stack", value: "TypeScript, React, Next.js, Tailwind" },
          { label: "Platforms", value: "Web, iOS, Android, Desktop" },
          { label: "Based", value: "Seattle, Washington" },
        ]
          .slice(0, count)
          .map(({ label, value }) => ({
            tag: "SpecRow",
            props: { label },
            children: [value],
          })),
      };
    },
  },
  {
    id: "status-dot",
    name: "Status dot",
    slot: "status-dot",
    description:
      "A pulsing marker. Decorative by design — aria-hidden, fully visible at rest, and a no-op under prefers-reduced-motion.",
    notes: [
      "Nothing to configure, and that is the design. A variant here would be a color carrying a meaning on its own; the adjacent label carries it instead.",
    ],
    controls: [],
    build: () => ({ tag: "StatusDot" }),
  },
  {
    id: "eyebrow",
    name: "Eyebrow",
    slot: "eyebrow",
    description:
      "The small uppercase label — section headings, card kickers, spec terms, fieldset legends. The most-repeated text style on the site.",
    notes: [
      "Before this existed the same style was written by hand 33 times in 10 spellings — four sizes, three tracking values, three colours. Two of those sizes were arbitrary values resolving to no token at all.",
      "asChild renders the child element instead of a <p>, because these need to be h2, h3, dt, legend and span depending on what they are labelling.",
    ],
    controls: [
      { name: "tone", label: "Tone", values: ["muted", "primary", "strong"] },
      { name: "size", label: "Size", values: ["md", "sm"] },
    ],
    build: (choices) => ({
      tag: "Eyebrow",
      props: {
        ...(choices.tone === "muted" ? {} : { tone: choices.tone }),
        ...(choices.size === "md" ? {} : { size: choices.size }),
      },
      children: ["Case study"],
    }),
  },
  {
    id: "control-bar",
    name: "Control bar",
    slot: "control-bar",
    description:
      "The site control cluster in the header. One group so the instruments announce once rather than as loose buttons.",
    notes: [
      "ControlToggle uses aria-pressed, because it turns a page mode on rather than submitting a value.",
      "This is the real cluster from the header — the Inspect button above is this component.",
    ],
    controls: [
      {
        name: "items",
        label: "Contents",
        values: ["Appearance", "Add inspect", "Both toggles"],
      },
      { name: "inspect", label: "Inspect", values: ["off", "on"] },
    ],
    build: (choices) => ({
      tag: "ControlBar",
      props: { label: "Site controls" },
      children: [
        { tag: "ControlButton", props: { icon: ICON, label: "Appearance" } },
        ...(choices.items === "Appearance"
          ? []
          : [
              {
                tag: "ControlToggle",
                props: {
                  icon: ICON,
                  label: "Inspect",
                  ...(choices.inspect === "on" ? { pressed: true } : {}),
                },
              },
            ]),
        ...(choices.items === "Both toggles"
          ? [
              {
                tag: "ControlToggle",
                props: { icon: ICON, label: "Grid", pressed: true },
              },
            ]
          : []),
      ],
    }),
  },
];
