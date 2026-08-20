import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * The small uppercase label: section headings, card kickers, spec terms,
 * fieldset legends, table captions.
 *
 * This is the most-repeated text style on the site, and before this component
 * existed it was written by hand 33 times in 10 different spellings — four
 * sizes, three tracking values, three colours. Two of those sizes were arbitrary
 * values (`text-[0.625rem]`, `text-[0.6875rem]`) that resolved to no token at
 * all, which CLAUDE.md forbids outright.
 *
 * That is the failure mode a design system exists to prevent, on a site whose
 * argument is design systems. One definition now; the values live in
 * `--ck-label-*` and reach here as `text-label` and `tracking-label`.
 */
const eyebrow = cva("uppercase", {
  variants: {
    tone: {
      /** The default. Labels are secondary to what they label. */
      muted: "text-muted-foreground",
      /** Brand accent — for a label that is itself a claim, like the role line. */
      primary: "text-primary",
      /** Full-strength, for labels doing structural work inside a card. */
      strong: "text-foreground",
      /** Takes its colour from whatever it sits in — links, hover groups. */
      inherit: "",
    },
    size: {
      md: "text-label tracking-label",
      /** Dense contexts only, where a full-size label would crowd the content. */
      sm: "text-label-sm tracking-label",
    },
  },
  defaultVariants: { tone: "muted", size: "md" },
});

export type EyebrowProps = ComponentProps<"p"> &
  VariantProps<typeof eyebrow> & {
    /**
     * Render the child element instead of a `<p>`. Call sites need `h2`, `h3`,
     * `dt`, `legend` and `span` — the element carries the semantics and this
     * only carries the look, so the two must stay separable.
     */
    asChild?: boolean;
  };

export function Eyebrow({
  className,
  tone,
  size,
  asChild = false,
  ...props
}: EyebrowProps) {
  const Component = asChild ? Slot : "p";

  return (
    <Component
      data-slot="eyebrow"
      className={cn(eyebrow({ tone, size }), className)}
      {...props}
    />
  );
}
