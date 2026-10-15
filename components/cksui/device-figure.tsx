import type { ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * One screen shown twice: in a desktop monitor, with the same state on a
 * phone beside it. For a product designer's case study the pair is the
 * argument: the layout holds at both sizes, from the same data.
 *
 * Each screen reserves its own space from its ratio, so nothing shifts while
 * the images load, the same promise `Figure` makes. The frames are drawn in
 * the muted pair and the control boundary, so they read as hardware in every
 * theme without competing with the screen inside.
 *
 * On a wide layout the phone overlaps the monitor's corner. On a narrow one a
 * phone that small would be unreadable, so the two stack and the phone gets
 * the room it needs.
 *
 * `overlay` sits over the whole composition. The locked version of a gated
 * figure uses it for the request for access. `controls` sit above it, at the
 * right, for anything that acts on the screens, like a light and dark switch.
 */
export function DeviceFigure({
  desktop,
  phone,
  desktopRatio,
  phoneRatio,
  caption,
  overlay,
  controls,
  className,
}: {
  /** The desktop screen's content, usually an image. */
  desktop: ReactNode;
  /** The same state at phone width. */
  phone: ReactNode;
  /** CSS aspect-ratio of each screen, e.g. "1440/900" and "390/844". */
  desktopRatio: string;
  phoneRatio: string;
  caption: string;
  overlay?: ReactNode;
  controls?: ReactNode;
  className?: string;
}) {
  return (
    <figure
      data-slot="device-figure"
      className={cn("mt-8 max-w-none", className)}
    >
      {controls ? (
        <div className="mb-3 flex justify-end">{controls}</div>
      ) : null}
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:gap-0">
        <div data-slot="device-desktop" className="w-full sm:w-4/5">
          <div className="rounded-screen border border-input bg-muted p-2 text-muted-foreground shadow-lift">
            <div
              style={{ aspectRatio: desktopRatio }}
              className="overflow-hidden rounded-md bg-card text-card-foreground"
            >
              {desktop}
            </div>
          </div>
          {/* The stand: a neck and a foot, so the frame reads as a monitor
              rather than a card with a thick border. */}
          <div
            aria-hidden="true"
            className="mx-auto h-6 w-1/6 border-x border-input bg-muted"
          />
          <div
            aria-hidden="true"
            className="mx-auto h-2 w-1/3 rounded-t-md border border-input bg-muted"
          />
        </div>

        <div
          data-slot="device-phone"
          className="relative w-1/2 max-w-xs sm:-ml-12 sm:w-1/4 lg:w-1/5"
        >
          <div className="rounded-phone border border-input bg-muted p-2 text-muted-foreground shadow-lift">
            <div
              style={{ aspectRatio: phoneRatio }}
              className="overflow-hidden rounded-screen bg-card text-card-foreground"
            >
              {phone}
            </div>
          </div>
        </div>

        {overlay}
      </div>

      <figcaption className="mt-3 max-w-measure text-sm text-pretty text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}
