/**
 * Why a crew of five can beat a team of fifty.
 *
 * The mechanism is the whole argument, so the drawing is the mechanism: one dot
 * per team member, filled when that person completed their Daily 5, and the
 * score beside it. Seeing fifty dots is also the point — it is visibly harder to
 * fill them all than to fill five, which is the edge the handicap exists to
 * bound.
 *
 * Scores carry the semantic colours because they are the outcome being compared.
 * Everything else is structure.
 */

/** One member. Filled means they completed the routine that day. */
function Dot({ x, y, done }: { x: number; y: number; done: boolean }) {
  return (
    <circle
      cx={x}
      cy={y}
      r="5"
      className={done ? "fill-current" : "fill-muted"}
      stroke="currentColor"
      strokeWidth={done ? 0 : 1}
    />
  );
}

export function TeamScoring() {
  // 45 of 50, laid out ten to a row.
  const big = Array.from({ length: 50 }, (_, i) => ({
    x: 196 + (i % 10) * 22,
    y: 132 + Math.floor(i / 10) * 20,
    done: i < 45,
  }));

  return (
    <svg
      viewBox="0 0 700 300"
      role="img"
      aria-label="A crew of five with all five completing scores 100 for the day. A team of fifty with forty-five completing scores 90. A crew of four, below a minimum of five, scores at most 80."
      className="h-full w-full"
      fill="none"
    >
      <text
        x="24"
        y="28"
        fontSize="11"
        letterSpacing="1.4"
        className="fill-current text-muted-foreground"
      >
        ONE DAY OF A LEADERBOARD CHALLENGE
      </text>

      {/* Crew of five — everyone in */}
      <g className="text-foreground">
        <text x="24" y="70" fontSize="13" className="fill-current">
          Crew of 5
        </text>
        {[0, 1, 2, 3, 4].map((i) => (
          <Dot key={i} x={196 + i * 22} y={65} done />
        ))}
        <text
          x="330"
          y="70"
          fontSize="12"
          className="fill-current text-muted-foreground"
        >
          5 of 5 completed
        </text>
      </g>
      <text
        x="620"
        y="74"
        textAnchor="end"
        fontSize="22"
        className="fill-current text-positive-foreground"
      >
        100
      </text>
      <text
        x="676"
        y="74"
        textAnchor="end"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        pts
      </text>

      <path
        d="M24 96 H676"
        stroke="currentColor"
        strokeWidth="1"
        className="text-border"
      />

      {/* Team of fifty — five short */}
      <g className="text-foreground">
        <text x="24" y="176" fontSize="13" className="fill-current">
          Team of 50
        </text>
        {big.map((dot, i) => (
          <Dot key={i} x={dot.x} y={dot.y} done={dot.done} />
        ))}
        <text
          x="24"
          y="196"
          fontSize="12"
          className="fill-current text-muted-foreground"
        >
          45 of 50
        </text>
      </g>
      <text
        x="620"
        y="180"
        textAnchor="end"
        fontSize="22"
        className="fill-current text-foreground"
      >
        90
      </text>
      <text
        x="676"
        y="180"
        textAnchor="end"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        pts
      </text>

      <path
        d="M24 226 H676"
        stroke="currentColor"
        strokeWidth="1"
        className="text-border"
      />

      {/* Below the minimum — allowed in, ceiling reduced */}
      <g className="text-foreground">
        <text x="24" y="262" fontSize="13" className="fill-current">
          Crew of 4
        </text>
        <text
          x="24"
          y="280"
          fontSize="11"
          className="fill-current text-muted-foreground"
        >
          minimum is 5
        </text>
        {[0, 1, 2, 3].map((i) => (
          <Dot key={i} x={196 + i * 22} y={257} done />
        ))}
        <circle
          cx="284"
          cy="257"
          r="5"
          className="fill-none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text
          x="330"
          y="262"
          fontSize="12"
          className="fill-current text-muted-foreground"
        >
          4 of 4, but a place short
        </text>
      </g>
      <text
        x="620"
        y="266"
        textAnchor="end"
        fontSize="22"
        className="fill-current text-destructive-foreground"
      >
        80
      </text>
      <text
        x="676"
        y="266"
        textAnchor="end"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        max
      </text>
    </svg>
  );
}
