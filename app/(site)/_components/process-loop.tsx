/**
 * Option B — the straight line that bends into a cycle.
 *
 * Opens as the conventional left-to-right pipeline every portfolio shows, then
 * cross-fades into a ring carrying the same phases. The claim is the transition
 * itself: this is not a line with an end, it is a loop.
 *
 * Two label sets rather than one that moves, because repositioning text around
 * a path in SVG needs JavaScript and this needs none. Under reduced motion the
 * linear state is hidden entirely and the ring is held — the cycle is the point,
 * so that is the state worth keeping.
 */

const PHASES = ["Research", "Define", "Prototype", "Build", "Refine"] as const;

/** Linear layout: evenly spaced along the rule. */
const LINE_X = [90, 205, 330, 455, 570];

/** Ring layout: the same five phases, clockwise from the top. */
const RING = { cx: 340, cy: 105, r: 62 };
const RING_LABELS = PHASES.map((phase, index) => {
  // Start at the top and step clockwise; the label sits outside the ring.
  const angle = (index / PHASES.length) * 2 * Math.PI - Math.PI / 2;
  return {
    phase,
    x: RING.cx + Math.cos(angle) * (RING.r + 26),
    y: RING.cy + Math.sin(angle) * (RING.r + 26) + 4,
  };
});

const ORBIT = `M${RING.cx},${RING.cy - RING.r} A${RING.r},${RING.r} 0 1 1 ${RING.cx - 0.01},${RING.cy - RING.r}`;

export function ProcessLoop() {
  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 680 210"
        className="w-full"
        aria-hidden="true"
        focusable="false"
      >
        {/* --- The pipeline, which turns out to be wrong --- */}
        <g className="ck-linear">
          <path
            d="M70,105 L590,105"
            fill="none"
            stroke="var(--ck-border)"
            strokeWidth="1"
          />
          {PHASES.map((phase, index) => (
            <g key={phase}>
              <circle
                cx={LINE_X[index]}
                cy="105"
                r="3"
                fill="var(--ck-primary)"
              />
              <text
                x={LINE_X[index]}
                y="88"
                textAnchor="middle"
                className="fill-[var(--ck-foreground)] text-[11px] tracking-[0.14em] uppercase"
              >
                {phase}
              </text>
            </g>
          ))}
        </g>

        {/* --- The same phases, as what they actually are --- */}
        <g className="ck-ring">
          <circle
            cx={RING.cx}
            cy={RING.cy}
            r={RING.r}
            fill="none"
            stroke="var(--ck-border)"
            strokeWidth="1"
          />

          {/* Launch leaves the ring and does not come back. */}
          <path
            d={`M${RING.cx + RING.r},${RING.cy} L640,${RING.cy}`}
            fill="none"
            stroke="var(--ck-border)"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
          <text
            x="648"
            y={RING.cy + 4}
            textAnchor="end"
            className="fill-[var(--ck-muted-foreground)] text-[11px] tracking-[0.14em] uppercase"
          >
            Launch
          </text>

          {RING_LABELS.map(({ phase, x, y }) => (
            <text
              key={phase}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-[var(--ck-foreground)] text-[11px] tracking-[0.14em] uppercase"
            >
              {phase}
            </text>
          ))}

          <circle
            className="ck-orbit"
            style={{ ["--ck-path" as string]: `path("${ORBIT}")` }}
            r="4"
            fill="var(--ck-primary)"
          />
        </g>
      </svg>

      <figcaption className="sr-only">
        The product development cycle: research, define, prototype, build, and
        refine — a loop rather than a pipeline. Launch leaves the cycle and is
        handed off.
      </figcaption>
    </figure>
  );
}
