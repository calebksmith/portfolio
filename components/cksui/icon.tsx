import type { ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * The site's icons, drawn once.
 *
 * Every icon here was a private function in whichever file first needed it,
 * each repeating the same sixteen-unit grid, stroke, and hiding from assistive
 * technology. One component keeps those decisions in one place: a new icon is
 * a path added to the map below, not another copy of the wrapper.
 *
 * Icons are decorative: the control or link they sit in carries the name.
 * They draw in `currentColor`, so they take the color of the text beside them.
 */
const PATHS = {
  "arrow-right": <path d="M3 8h10M9 4l4 4-4 4" />,
  "arrow-down": <path d="M8 2.5v11M3.5 9.5 8 14l4.5-4.5" />,
  external: <path d="M6 3h7v7M13 3 4 12" />,
  lock: (
    <>
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </>
  ),
  sun: (
    <>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
    </>
  ),
  moon: <path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7Z" />,
  crosshair: (
    <>
      <circle cx="8" cy="8" r="4.25" />
      <path d="M8 .75v2.5M8 12.75v2.5M.75 8h2.5M12.75 8h2.5" />
    </>
  ),
  sliders: (
    <>
      <path d="M2 4.5h5M11 4.5h3M2 11.5h3M9 11.5h5" />
      <circle cx="9" cy="4.5" r="1.75" />
      <circle cx="7" cy="11.5" r="1.75" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  className,
}: {
  name: IconName;
  /** Size and color. Defaults to `size-4`, the size of a line of body text. */
  className?: string;
}) {
  return (
    <svg
      data-slot="icon"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className={cn("size-4 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </svg>
  );
}
