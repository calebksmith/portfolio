"use client";

import { createElement, type ElementType, type ReactNode } from "react";

import type { Messages } from "@/lib/i18n/messages";

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
  DeviceFigure,
  Eyebrow,
  Figure,
  Icon,
  Medal,
  Monogram,
  PageTitle,
  PrintButton,
  Skeleton,
  SpecList,
  SpecRow,
  Stat,
  StatGroup,
  StatusDot,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
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

/**
 * A prop that has to be written as a JSX expression rather than a string: an
 * element, a number, or an array of items. `expr` is what the code panel
 * prints; `value` is what the component receives.
 */
type Expression = { expr: string; value: unknown };

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
  DeviceFigure,
  Eyebrow,
  Figure,
  Icon,
  Medal,
  Monogram,
  PageTitle,
  PrintButton,
  Skeleton,
  SpecList,
  SpecRow,
  Stat,
  StatGroup,
  StatusDot,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
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

  const children = node.children?.map((child, index) =>
    renderNode(child, index),
  );

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

/** The playground's copy: names, descriptions, labels, and sample content. */
export type RecipeCopy = Messages["styleGuide"]["recipes"];

export type Control = {
  /** Matches the key the recipe reads from `choices`. */
  name: string;
  label: string;
  /** First value is the default. These are keys, never shown on their own. */
  values: readonly string[];
  /**
   * What each value is called on screen, when it isn't the value itself. A
   * prop value like `primary` or `16/9` is shown as written.
   */
  options?: Record<string, string>;
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

/** The icon prop, written as the expression it is rather than as a string. */
const ICON: Expression = {
  expr: '<Icon name="sliders" />',
  value: <Icon name="sliders" />,
};

/** The words every recipe shows about itself, picked from its copy. */
const text = ({
  name,
  description,
  notes,
}: {
  name: string;
  description: string;
  notes?: string[];
}) => ({ name, description, notes });

/** How many of a list a count option asks for. */
const COUNT: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
};

/**
 * Every specimen, with its words from the dictionary. The recipes own the
 * structure (which component, which props, which choices); the copy owns what
 * any of it says.
 */
export function makeRecipes(copy: RecipeCopy): Recipe[] {
  return [
    {
      id: "button",
      slot: "button",
      ...text(copy.button),
      controls: [
        {
          name: "variant",
          label: copy.button.controls.variant,
          values: ["primary", "secondary", "outline", "ghost"],
        },
        {
          name: "size",
          label: copy.button.controls.size,
          values: ["md", "sm", "lg"],
        },
        {
          name: "state",
          label: copy.button.controls.state,
          values: ["default", "disabled"],
        },
      ],
      build: (choices) => ({
        tag: "Button",
        props: {
          ...(choices.variant === "primary"
            ? {}
            : { variant: choices.variant }),
          ...(choices.size === "md" ? {} : { size: choices.size }),
          ...(choices.state === "disabled" ? { disabled: true } : {}),
        },
        children: [copy.button.sample],
      }),
    },
    {
      id: "badge",
      slot: "badge",
      ...text(copy.badge),
      controls: [
        {
          name: "variant",
          label: copy.badge.controls.variant,
          values: ["outline", "soft", "solid"],
        },
        {
          name: "label",
          label: copy.badge.controls.label,
          values: copy.badge.samples,
        },
      ],
      build: (choices) => ({
        tag: "Badge",
        props: {
          ...(choices.variant === "outline"
            ? {}
            : { variant: choices.variant }),
        },
        children: [choices.label],
      }),
    },
    {
      id: "card",
      slot: "card",
      ...text(copy.card),
      controls: [
        {
          name: "content",
          label: copy.card.controls.content,
          values: ["title", "description", "body"],
          options: copy.card.options.content,
        },
      ],
      build: (choices) => ({
        tag: "Card",
        children: [
          {
            tag: "CardHeader",
            children: [
              { tag: "CardTitle", children: [copy.card.sample.title] },
              ...(choices.content === "title"
                ? []
                : [
                    {
                      tag: "CardDescription",
                      children: [copy.card.sample.description],
                    },
                  ]),
            ],
          },
          ...(choices.content === "body"
            ? [
                {
                  tag: "CardContent",
                  children: [
                    {
                      tag: "p",
                      props: { className: "text-sm text-muted-foreground" },
                      children: [copy.card.sample.body],
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
      slot: "spec-list",
      ...text(copy["spec-list"]),
      controls: [
        {
          name: "rows",
          label: copy["spec-list"].controls.rows,
          values: ["two", "three", "four"],
          options: copy["spec-list"].options.rows,
        },
      ],
      build: (choices) => ({
        tag: "SpecList",
        children: copy["spec-list"].samples
          .slice(0, COUNT[choices.rows] ?? 2)
          .map(({ label, value }) => ({
            tag: "SpecRow",
            props: { label },
            children: [value],
          })),
      }),
    },
    {
      id: "stat",
      slot: "stat-group",
      ...text(copy.stat),
      controls: [
        {
          name: "count",
          label: copy.stat.controls.count,
          values: ["two", "three", "four"],
          options: copy.stat.options.count,
        },
      ],
      build: (choices) => ({
        tag: "StatGroup",
        children: copy.stat.samples
          .slice(0, COUNT[choices.count] ?? 2)
          .map(({ value, label }) => ({
            tag: "Stat",
            props: { value, label },
          })),
      }),
    },
    {
      id: "status-dot",
      slot: "status-dot",
      ...text(copy["status-dot"]),
      controls: [],
      build: () => ({ tag: "StatusDot" }),
    },
    {
      id: "eyebrow",
      slot: "eyebrow",
      ...text(copy.eyebrow),
      controls: [
        {
          name: "tone",
          label: copy.eyebrow.controls.tone,
          values: ["muted", "primary", "strong"],
        },
        {
          name: "size",
          label: copy.eyebrow.controls.size,
          values: ["md", "sm"],
        },
      ],
      build: (choices) => ({
        tag: "Eyebrow",
        props: {
          ...(choices.tone === "muted" ? {} : { tone: choices.tone }),
          ...(choices.size === "md" ? {} : { size: choices.size }),
        },
        children: [copy.eyebrow.sample],
      }),
    },
    {
      id: "control-bar",
      slot: "control-bar",
      ...text(copy["control-bar"]),
      controls: [
        {
          name: "items",
          label: copy["control-bar"].controls.items,
          values: ["appearance", "inspect", "both"],
          options: copy["control-bar"].options.items,
        },
        {
          name: "inspect",
          label: copy["control-bar"].controls.inspect,
          values: ["off", "on"],
        },
        {
          name: "variant",
          label: copy["control-bar"].controls.variant,
          values: ["bare", "segmented"],
        },
      ],
      build: (choices) => {
        const sample = copy["control-bar"].sample;

        return {
          tag: "ControlBar",
          props: {
            label: sample.label,
            ...(choices.variant === "segmented"
              ? { variant: "segmented" }
              : {}),
          },
          children: [
            {
              tag: "ControlButton",
              props: { icon: ICON, label: sample.appearance },
            },
            ...(choices.items === "appearance"
              ? []
              : [
                  {
                    tag: "ControlToggle",
                    props: {
                      icon: ICON,
                      label: sample.inspect,
                      ...(choices.inspect === "on" ? { pressed: true } : {}),
                    },
                  },
                ]),
            ...(choices.items === "both"
              ? [
                  {
                    tag: "ControlToggle",
                    props: { icon: ICON, label: sample.grid, pressed: true },
                  },
                ]
              : []),
          ],
        };
      },
    },
    {
      id: "figure",
      slot: "figure",
      ...text(copy.figure),
      controls: [
        {
          name: "ratio",
          label: copy.figure.controls.ratio,
          values: ["16/9", "4/3", "1/1"],
        },
      ],
      build: (choices) => ({
        tag: "Figure",
        props: { ratio: choices.ratio, caption: copy.figure.sample },
        children: [
          {
            tag: "div",
            props: {
              className:
                "grid h-full place-items-center text-sm text-muted-foreground",
            },
            children: [choices.ratio],
          },
        ],
      }),
    },
    {
      id: "tabs",
      slot: "tabs",
      ...text(copy.tabs),
      controls: [
        {
          name: "tabs",
          label: copy.tabs.controls.tabs,
          values: ["two", "three"],
          options: copy.tabs.options.tabs,
        },
      ],
      build: (choices) => {
        const items = copy.tabs.sample.items.slice(0, COUNT[choices.tabs] ?? 2);
        const expr = `[${items
          .map(
            (item) =>
              `{ value: "${item.value}", label: "${item.label}", content: "${item.content}" }`,
          )
          .join(", ")}]`;

        return {
          tag: "Tabs",
          props: {
            label: copy.tabs.sample.label,
            items: { expr, value: items },
          },
        };
      },
    },
    {
      id: "skeleton",
      slot: "skeleton",
      ...text(copy.skeleton),
      controls: [
        {
          name: "lines",
          label: copy.skeleton.controls.lines,
          values: ["three", "two", "one"],
          options: copy.skeleton.options.lines,
        },
      ],
      build: (choices) => {
        const widths = ["w-3/4", "w-full", "w-1/2"];

        return {
          tag: "div",
          props: { className: "flex w-64 flex-col gap-2" },
          children: widths.slice(0, COUNT[choices.lines] ?? 3).map((width) => ({
            tag: "Skeleton",
            props: { className: `h-4 ${width}` },
          })),
        };
      },
    },
    {
      id: "monogram",
      slot: "monogram",
      ...text(copy.monogram),
      controls: [
        {
          name: "size",
          label: copy.monogram.controls.size,
          values: ["32", "48", "24"],
        },
      ],
      build: (choices) => ({
        tag: "Monogram",
        props: { size: { expr: choices.size, value: Number(choices.size) } },
      }),
    },
    {
      id: "print-button",
      slot: "print-button",
      ...text(copy["print-button"]),
      controls: [],
      build: () => ({
        tag: "PrintButton",
        props: { label: copy["print-button"].sample },
      }),
    },
    {
      id: "page-title",
      slot: "page-title",
      ...text(copy["page-title"]),
      controls: [],
      build: () => ({
        tag: "PageTitle",
        children: [copy["page-title"].sample],
      }),
    },
    {
      id: "icon",
      slot: "icon",
      ...text(copy.icon),
      controls: [
        {
          name: "name",
          label: copy.icon.controls.name,
          values: [
            "arrow-right",
            "arrow-down",
            "external",
            "lock",
            "sun",
            "moon",
            "crosshair",
            "sliders",
          ],
        },
      ],
      build: (choices) => ({
        tag: "Icon",
        props: { name: choices.name, className: "size-6" },
      }),
    },
    {
      id: "table",
      slot: "table",
      ...text(copy.table),
      controls: [
        {
          name: "rows",
          label: copy.table.controls.rows,
          values: ["three", "two", "one"],
        },
      ],
      build: (choices) => {
        const sample = copy.table.sample;
        return {
          tag: "Table",
          props: { "aria-label": sample.label },
          children: [
            {
              tag: "TableHeader",
              children: [
                {
                  tag: "TableRow",
                  children: [
                    sample.platform,
                    sample.tokens,
                    sample.components,
                  ].map((head) => ({
                    tag: "TableHead",
                    props: { scope: "col" },
                    children: [head],
                  })),
                },
              ],
            },
            {
              tag: "TableBody",
              children: sample.rows
                .slice(0, COUNT[choices.rows] ?? 3)
                .map(([platform, tokens, components]) => ({
                  tag: "TableRow",
                  children: [
                    {
                      tag: "TableHead",
                      props: { scope: "row" },
                      children: [platform],
                    },
                    { tag: "TableCell", children: [tokens] },
                    { tag: "TableCell", children: [components] },
                  ],
                })),
            },
          ],
        };
      },
    },
    {
      id: "medal",
      slot: "medal",
      ...text(copy.medal),
      controls: [
        {
          name: "name",
          label: copy.medal.controls.name,
          values: [
            "podium",
            "checklist",
            "layers",
            "playlist",
            "key",
            "components",
            "rails",
            "bell",
          ],
        },
        {
          name: "size",
          label: copy.medal.controls.size,
          values: ["lg", "md", "sm"],
        },
      ],
      build: (choices) => ({
        tag: "Medal",
        props: { name: choices.name, size: choices.size },
      }),
    },
    {
      id: "device-figure",
      slot: "device-figure",
      ...text(copy["device-figure"]),
      controls: [],
      build: () => {
        const screen = (label: string): Element => ({
          tag: "div",
          props: {
            className:
              "grid h-full place-items-center text-xs text-muted-foreground",
          },
          children: [label],
        });
        return {
          tag: "div",
          props: { className: "w-full max-w-xl" },
          children: [
            {
              tag: "DeviceFigure",
              props: {
                desktopRatio: "16/10",
                phoneRatio: "375/812",
                caption: copy["device-figure"].sample,
                desktop: {
                  expr: "<img … />",
                  value: renderNode(screen("1280")),
                },
                phone: {
                  expr: "<img … />",
                  value: renderNode(screen("375")),
                },
              },
            },
          ],
        };
      },
    },
  ];
}
