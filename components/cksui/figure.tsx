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
 * `ratio` is required for an image. Cumulative Layout Shift on this site is 0,
 * and the usual way to lose that is an image that has no height until it loads
 * and then shoves the paragraph under it down the page. A diagram leaves it
 * out: it's inline SVG, so it has its height from the first paint, and it
 * sizes itself (see `components/diagrams/diagram.tsx`) so its type matches the
 * page's instead of growing with the frame.
 */
export function Figure({
  children,
  caption,
  width = "inline",
  ratio,
  controls,
  className,
  ...props
}: Omit<ComponentProps<"figure">, "children"> & {
  children: ReactNode;
  /** Shown beneath, and tied to the figure rather than floating after it. */
  caption: string;
  width?: "inline" | "breakout";
  /**
   * CSS aspect-ratio, e.g. "16/7". Reserves the space before anything loads.
   * Leave it out only for content that has its size on first paint.
   */
  ratio?: string;
  /** Over the frame's top-right corner: anything that acts on the figure. */
  controls?: ReactNode;
}) {
  return (
    <figure
      data-slot="figure"
      className={cn(
        "relative mt-8",
        width === "breakout" ? "max-w-none" : "max-w-measure-wide",
        className,
      )}
      {...props}
    >
      {/* Controls straddle the frame's top edge at the right on a wide screen,
          so they overlap the figure without covering what's in it; on a
          narrow one they sit above it. */}
      {controls ? (
        <div className="mb-3 flex justify-end sm:absolute sm:-top-6 sm:right-4 sm:z-10 sm:mb-0">
          {controls}
        </div>
      ) : null}
      <div
        style={ratio ? { aspectRatio: ratio } : undefined}
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-card",
          !ratio && "w-fit max-w-full p-4 sm:p-6",
        )}
      >
        {children}
      </div>

      <figcaption className="mt-3 max-w-measure text-sm text-pretty text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
