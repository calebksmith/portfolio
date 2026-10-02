import type { ComponentProps, ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * An image or diagram, framed and captioned.
 *
 * One place to make the decisions every figure would otherwise make for itself.
 * The label style drifted into ten spellings before `Eyebrow` existed; images
 * are the same risk with more ways to go wrong, because a figure that forgets
 * to reserve its space costs layout stability rather than just consistency.
 *
 * Two widths and no others, because the layout supports two: `inline` sits in
 * the prose column, `breakout` spans the content width. A third would be a
 * number someone picked.
 *
 * `ratio` is required. Cumulative Layout Shift on this site is 0, and the usual
 * way to lose that is an image that has no height until it loads and then shoves
 * the paragraph under it down the page.
 */
export function Figure({
  children,
  caption,
  width = "inline",
  ratio,
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children"> & {
  children: ReactNode;
  /** Shown beneath, and tied to the figure rather than floating after it. */
  caption: string;
  width?: "inline" | "breakout";
  /** CSS aspect-ratio, e.g. "16/7". Reserves the space before anything loads. */
  ratio: string;
}) {
  return (
    <figure
      data-slot="figure"
      className={cn(
        "mt-8",
        width === "breakout" ? "max-w-none" : "max-w-measure-wide",
        className,
      )}
      {...props}
    >
      <div
        style={{ aspectRatio: ratio }}
        className="overflow-hidden rounded-lg border border-border bg-card"
      >
        {children}
      </div>

      <figcaption className="mt-3 max-w-measure text-sm text-pretty text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
