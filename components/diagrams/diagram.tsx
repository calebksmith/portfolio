import type { ComponentProps } from "react";

import { cn } from "@/components/cksui";

/**
 * The <svg> every diagram is drawn in, sized so its type matches the page.
 *
 * SVG text scales with its drawing. A diagram stretched to the frame's width
 * grew its 11- and 12-unit labels to 16 and 17 pixels, larger than the prose
 * beside it. Capped at its own viewBox width, one unit is never more than one
 * pixel: the title sits at the eyebrow's size and the labels at the caption's,
 * and on a narrower screen the drawing scales down as a whole. The frame
 * hugs it rather than stretching to the page, so a small drawing gets a small
 * frame.
 *
 * The type scale, in viewBox units: 11 with tracking for the title (the
 * eyebrow), 11 for notes, 12 for labels, 13 for the names that lead a group.
 * A figure's own numbers can run larger; that's the drawing, not its text.
 */
export function Diagram({
  width,
  height,
  label,
  className,
  children,
  ...props
}: Omit<ComponentProps<"svg">, "viewBox" | "width" | "height"> & {
  width: number;
  height: number;
  /** What the drawing shows, for anyone who can't see it. */
  label: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      style={{ width, maxWidth: "100%" }}
      className={cn("block h-auto", className)}
      fill="none"
      {...props}
    >
      {children}
    </svg>
  );
}
