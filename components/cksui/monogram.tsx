import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * The mark: CS on an ink tile, in the display face.
 *
 * Fixed colours, not tokens that follow the theme. A logo that changes with the
 * reader's settings is not a logo — and the favicon and the link preview are
 * static files that could not follow a theme even if it were a good idea. The
 * tile therefore looks the same on every ground the site has, which is the
 * reason this direction was chosen over a solid brand tile that would have had
 * to flip its letters between light and dark.
 *
 * Rendered as text rather than as outlined paths, because on the site Archivo
 * is already loaded and real letterforms beat traced ones. The favicon at
 * `app/icon.svg` is the same mark drawn without that assumption.
 *
 * The 22% radius is shared with the favicon and the OG image, so the three read
 * as one object rather than three drawings of one.
 */
export function Monogram({
  size = 22,
  className,
  ...props
}: Omit<ComponentProps<"span">, "children"> & {
  /** Rendered size in pixels. The type scales with it. */
  size?: number;
}) {
  return (
    <span
      data-slot="monogram"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "22%",
        // 0.43 is where the letters stop crowding the corners and start
        // reading as a pair. Below ~0.38 they float; above ~0.47 they touch.
        fontSize: size * 0.43,
      }}
      className={cn(
        "inline-flex flex-none select-none items-center justify-center",
        "bg-mark-ground font-display font-medium tracking-[-0.02em] text-mark-ink",
        className,
      )}
      {...props}
    >
      CS
    </span>
  );
}
