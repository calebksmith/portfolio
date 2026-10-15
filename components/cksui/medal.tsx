import type { ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * A medal for a piece of work: one per case study, so a list of them can be
 * told apart at a glance instead of read line by line.
 *
 * Drawn as the logo is drawn: a tile with the same 22% radius, in the mark's
 * ground and ink, with one glyph where the monogram has its letters. A medal
 * then reads as part of the same family as the mark in the corner, the way an
 * app's icons share one tile shape and differ only in what's on them. The
 * glyph is what tells two apart, so each is a distinct silhouette that holds
 * at the smallest size.
 *
 * The medal is decorative: the name beside it carries the meaning, so it's
 * hidden from screen readers.
 *
 * A new medal is a glyph added to `GLYPHS` and named in `MEDALS`.
 */

/** Glyphs, drawn in strokes on the same grid, inside roughly 18–46. */
const GLYPHS = {
  // Three steps of a podium, with a star over the top step.
  podium: (
    <>
      <path d="M18 45h28M21 45v-9h7v9M28 45V29h8v16M36 45v-6h7v6" />
      <path
        d="m32 16 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5Z"
        fill="currentColor"
        strokeWidth="1"
      />
    </>
  ),
  // A checklist: two steps done, one to go.
  checklist: (
    <path d="m21 22 3 3 5-6M33 22h11M21 32l3 3 5-6M33 32h11M22 41h6M33 42h11" />
  ),
  // Layers settling into one stack.
  layers: (
    <path d="M32 18 45 25 32 32 19 25ZM19 32l13 7 13-7M19 39l13 7 13-7" />
  ),
  // A play button over a list.
  playlist: (
    <>
      <path d="M21 19v14l11-7Z" fill="currentColor" />
      <path d="M37 22h7M37 30h7M21 39h23M21 46h23" />
    </>
  ),
  // A key.
  key: (
    <>
      <circle cx="25" cy="26" r="6.5" />
      <path d="m30 31 14 14M39 40l3-3M43 44l3-3" />
    </>
  ),
  // Four components, one of them filled: a system of parts.
  components: (
    <>
      <rect x="19" y="19" width="11" height="11" rx="2.5" fill="currentColor" />
      <rect x="34" y="19" width="11" height="11" rx="2.5" />
      <rect x="19" y="34" width="11" height="11" rx="2.5" />
      <rect x="34" y="34" width="11" height="11" rx="2.5" />
    </>
  ),
  // Two rails and the line that runs between them.
  rails: <path d="M23 17v30M41 17v30M32 41V24M27 29l5-5 5 5" />,
  // A bell, ringing.
  bell: (
    <path d="M24 39v-8a8 8 0 0 1 16 0v8l3 4H21ZM29 46a3 3 0 0 0 6 0M17 30a15 15 0 0 1 4-9M47 30a15 15 0 0 0-4-9" />
  ),
} satisfies Record<string, ReactNode>;

/** Every medal a case study can name. */
export const MEDALS = {
  podium: "podium",
  checklist: "checklist",
  layers: "layers",
  playlist: "playlist",
  key: "key",
  components: "components",
  rails: "rails",
  bell: "bell",
} as const satisfies Record<string, keyof typeof GLYPHS>;

export type MedalName = keyof typeof MEDALS;

const SIZES = {
  sm: "size-8",
  md: "size-12",
  lg: "size-20",
} as const;

export function Medal({
  name,
  size = "md",
  className,
}: {
  name: MedalName;
  /** sm in a menu row, md on a card, lg in a page header. */
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <svg
      data-slot="medal"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 64"
      className={cn("shrink-0", SIZES[size], className)}
    >
      {/* The logo's tile: 22% of 64 is the corner radius. */}
      <rect width="64" height="64" rx="14" className="fill-mark-ground" />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-mark-ink"
      >
        {GLYPHS[MEDALS[name]]}
      </g>
    </svg>
  );
}
