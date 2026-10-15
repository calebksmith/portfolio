import { useId, type ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * A medal for a piece of work: one per case study, so a list of them can be
 * told apart at a glance instead of read line by line.
 *
 * Built the way an award in a fitness app is: a shaped body, a soft gradient
 * across it, an inset ring, a sheen on the top half, and one glyph. Each medal
 * differs in two ways at once, its outline and its glyph, so two never read as
 * the same even at the smallest size, where the glyph is a few pixels across.
 *
 * Everything is drawn in the primary pair, so it follows the theme and the
 * mode like the rest of the site; the glyph is the primary foreground the
 * contrast gate measures against it. The medal is decorative: the name beside
 * it carries the meaning, so it's hidden from screen readers.
 *
 * A new medal is an entry in `MEDALS`: a shape from `SHAPES` and a glyph.
 */

/** Outlines, on a 64-unit grid centred at 32,32. */
const SHAPES = {
  circle: "M32 2a30 30 0 1 1 0 60a30 30 0 1 1 0-60Z",
  hexagon: "M32 2 58 17v30L32 62 6 47V17Z",
  octagon: "M20.5 4h23L60 20.5v23L43.5 60h-23L4 43.5v-23Z",
  shield: "M32 2 58 11v19c0 16-12 27-26 32C18 57 6 46 6 30V11Z",
  squircle: "M32 2c22 0 30 8 30 30s-8 30-30 30S2 54 2 32 10 2 32 2Z",
  diamond: "M32 1.5 62.5 32 32 62.5 1.5 32Z",
  rosette: rosette(),
} as const;

/** A seal's scalloped edge: 24 points, alternating between two radii. */
function rosette() {
  const points = Array.from({ length: 24 }, (_, i) => {
    const angle = (i * Math.PI) / 12 - Math.PI / 2;
    const radius = i % 2 === 0 ? 30.5 : 26.5;
    const x = 32 + radius * Math.cos(angle);
    const y = 32 + radius * Math.sin(angle);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  return `M${points.join("L")}Z`;
}

type Shape = keyof typeof SHAPES;

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

/** Every medal: its outline and its glyph. Case studies name one of these. */
export const MEDALS = {
  podium: { shape: "rosette", glyph: "podium" },
  checklist: { shape: "shield", glyph: "checklist" },
  layers: { shape: "hexagon", glyph: "layers" },
  playlist: { shape: "circle", glyph: "playlist" },
  key: { shape: "octagon", glyph: "key" },
  components: { shape: "squircle", glyph: "components" },
  rails: { shape: "diamond", glyph: "rails" },
  bell: { shape: "circle", glyph: "bell" },
} as const satisfies Record<
  string,
  { shape: Shape; glyph: keyof typeof GLYPHS }
>;

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
  const { shape, glyph } = MEDALS[name];
  const outline = SHAPES[shape];
  // One id per instance, not per medal: a gradient defined inside a hidden
  // menu doesn't paint, so a shared id would blank every other copy of it.
  const id = `ck-medal-${useId().replace(/[^\w-]/g, "")}`;

  return (
    <svg
      data-slot="medal"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 64 64"
      className={cn("shrink-0", SIZES[size], className)}
    >
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="currentColor" className="text-primary" />
          <stop
            offset="1"
            stopColor="currentColor"
            className="text-primary-hover"
          />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            stopColor="currentColor"
            stopOpacity="0.28"
            className="text-primary-foreground"
          />
          <stop
            offset="0.55"
            stopColor="currentColor"
            stopOpacity="0"
            className="text-primary-foreground"
          />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={outline} />
        </clipPath>
      </defs>

      <path d={outline} fill={`url(#${id}-fill)`} />
      <rect
        width="64"
        height="40"
        fill={`url(#${id}-sheen)`}
        clipPath={`url(#${id}-clip)`}
      />
      {/* The inset ring: the outline again, a step smaller. */}
      <path
        d={outline}
        transform="translate(32 32) scale(0.84) translate(-32 -32)"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        className="text-primary-foreground"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary-foreground"
      >
        {GLYPHS[glyph]}
      </g>
    </svg>
  );
}
