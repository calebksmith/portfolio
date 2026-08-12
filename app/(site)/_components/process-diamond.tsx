/**
 * Option A — the double diamond that loops.
 *
 * Two diamonds of diverge/converge, traced by a dot. When the dot reaches the
 * end it does not exit to Launch; it curves back to Discover and runs again.
 * The dashed tangent is drawn but never travelled — that is the argument, made
 * without a sentence claiming it.
 *
 * The SVG is aria-hidden and the phases are repeated as real text for screen
 * readers, so the content never depends on the graphic or on motion.
 */

/** The journey: up and over both diamonds, then the return arc. */
const JOURNEY =
  "M60,100 L170,50 L280,100 L390,50 L500,100 C520,195 40,195 60,100";

/**
 * SVG's `pathLength` renormalises the path to this value for dash purposes, so
 * the draw animation needs no measured constant and cannot fall out of sync if
 * the geometry above is ever edited.
 */
const JOURNEY_LENGTH = 1000;

const PHASES = ["Discover", "Define", "Develop", "Refine"] as const;

const PHASE_X = [115, 225, 335, 445];

export function ProcessDiamond() {
  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 680 210"
        className="w-full"
        aria-hidden="true"
        focusable="false"
      >
        {/* The full shape, always present. Under reduced motion this and the
            traced overlay are the entire graphic. */}
        <path
          d="M60,100 L170,50 L280,100 L170,150 Z M280,100 L390,50 L500,100 L390,150 Z"
          fill="none"
          stroke="var(--ck-border)"
          strokeWidth="1"
        />

        {/* The part handed off. Dashed, and the dot never reaches it. */}
        <path
          d="M500,100 L620,100"
          fill="none"
          stroke="var(--ck-border)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        <text
          x="620"
          y="90"
          textAnchor="end"
          className="fill-[var(--ck-muted-foreground)] text-[11px] tracking-[0.14em] uppercase"
        >
          Launch
        </text>

        {/* The traced journey. */}
        <path
          className="ck-trace"
          style={{ ["--ck-path-length" as string]: JOURNEY_LENGTH }}
          d={JOURNEY}
          pathLength={JOURNEY_LENGTH}
          fill="none"
          stroke="var(--ck-primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The dot riding it. */}
        <circle
          className="ck-ride"
          style={{ ["--ck-path" as string]: `path("${JOURNEY}")` }}
          r="4"
          fill="var(--ck-primary)"
        />

        {PHASES.map((phase, index) => (
          <text
            key={phase}
            className="ck-phase fill-[var(--ck-foreground)] text-[11px] tracking-[0.14em] uppercase"
            style={{ ["--ck-phase-index" as string]: index }}
            x={PHASE_X[index]}
            y="30"
            textAnchor="middle"
          >
            {phase}
          </text>
        ))}

        <text
          x="280"
          y="205"
          textAnchor="middle"
          className="fill-[var(--ck-muted-foreground)] text-[11px] tracking-[0.14em] uppercase"
        >
          Iterate
        </text>
      </svg>

      <figcaption className="sr-only">
        My part of the product development cycle: discover, define, develop, and
        refine, returning to discovery rather than ending. Launch is handed off.
      </figcaption>
    </figure>
  );
}
