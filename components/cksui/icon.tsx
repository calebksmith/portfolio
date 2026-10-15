import type { ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * The site's icons, from Heroicons' outline set.
 *
 * Heroicons (MIT, Tailwind Labs) draws on a 24-unit grid with a 1.5 stroke
 * and round ends: the same thin line as the rest of the site. The paths are
 * copied in rather than installed, so this file is the whole set and nothing
 * here waits on a package update. A new icon is its path from
 * heroicons.com (24, outline) added to the map below, under a name that says
 * what it's for on this site.
 *
 * Icons are decorative: the control or link they sit in carries the name.
 * They draw in `currentColor`, so they take the color of the text beside them.
 */
const PATHS = {
  "arrow-right": <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />,
  "arrow-down": <path d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />,
  // arrow-top-right-on-square
  external: (
    <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  ),
  // lock-closed
  lock: (
    <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  ),
  sun: (
    <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  ),
  moon: (
    <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  ),
  // viewfinder-circle: the inspector, which looks at a part of the page
  crosshair: (
    <path d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  ),
  // adjustments-horizontal
  sliders: (
    <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
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
      viewBox="0 0 24 24"
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
