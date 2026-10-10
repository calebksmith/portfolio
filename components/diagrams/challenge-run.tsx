import { getMessages } from "@/lib/i18n/server";

/**
 * What an admin does to run a challenge, and what runs without them.
 *
 * The case study's point is that a challenge stopped being a support request,
 * so the drawing is one challenge on a timeline with two lanes: the admin's
 * steps above it, at the start and the end, and everything that happens on its
 * own below it. The middle of the admin lane is empty on purpose — that gap is
 * the feature.
 *
 * The admin's steps are the accent pair, the one place a person acts. Emails
 * and entries are structure, in `currentColor`.
 */

const LEFT = 20;
const RIGHT = 740;
const SETUP_END = 200;
const RUN_END = 560;
const TIMELINE_Y = 132;

/** A small envelope, top-left at (x, y). */
function Envelope({ x, y }: { x: number; y: number }) {
  return (
    <g className="text-muted-foreground">
      <rect
        x={x}
        y={y}
        width="22"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d={`M${x + 1} ${y + 1} L${x + 11} ${y + 9} L${x + 21} ${y + 1}`}
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </g>
  );
}

export async function ChallengeRun() {
  const t = (await getMessages()).diagrams.challengeRun;

  // Entries build through the run: one bar per stretch of days, rising.
  const entries = Array.from({ length: 14 }, (_, i) => ({
    x: 272 + i * 20,
    h: 3 + i * 1.5,
  }));

  return (
    <svg
      viewBox="0 0 760 300"
      role="img"
      aria-label={t.label}
      className="h-full w-full"
      fill="none"
    >
      <defs>
        <marker
          id="cr-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
        </marker>
      </defs>

      <text
        x={LEFT}
        y="20"
        fontSize="11"
        letterSpacing="1.4"
        className="fill-current text-muted-foreground"
      >
        {t.title}
      </text>

      {/* The admin's lane: the start and the end, nothing in between. */}
      <text
        x={LEFT}
        y="44"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {t.admin}
      </text>
      <g>
        <rect
          x={LEFT}
          y="54"
          width="176"
          height="52"
          rx="6"
          className="fill-accent"
        />
        <text
          x={LEFT + 88}
          y="84"
          textAnchor="middle"
          fontSize="12"
          className="fill-current text-accent-foreground"
        >
          {t.setup}
        </text>
      </g>
      <g>
        <rect
          x={RIGHT - 176}
          y="54"
          width="176"
          height="52"
          rx="6"
          className="fill-accent"
        />
        <text
          x={RIGHT - 88}
          y="76"
          textAnchor="middle"
          fontSize="12"
          className="fill-current text-accent-foreground"
        >
          {t.draw}
        </text>
        <text
          x={RIGHT - 88}
          y="94"
          textAnchor="middle"
          fontSize="12"
          className="fill-current text-accent-foreground"
        >
          {t.complete}
        </text>
      </g>

      {/* The challenge itself, left to right, with its three phases. */}
      <path
        d={`M${LEFT} ${TIMELINE_Y} H ${RIGHT - 4}`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        markerEnd="url(#cr-arrow)"
        className="text-foreground"
      />
      {[SETUP_END, RUN_END].map((x) => (
        <path
          key={x}
          d={`M${x} ${TIMELINE_Y - 7} V ${TIMELINE_Y + 7}`}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground"
        />
      ))}
      {[
        { x: (LEFT + SETUP_END) / 2, label: t.phases.setup },
        { x: (SETUP_END + RUN_END) / 2, label: t.phases.run },
        { x: (RUN_END + RIGHT) / 2, label: t.phases.end },
      ].map((phase) => (
        <text
          key={phase.label}
          x={phase.x}
          y={TIMELINE_Y + 22}
          textAnchor="middle"
          fontSize="11"
          className="fill-current text-muted-foreground"
        >
          {phase.label}
        </text>
      ))}

      {/* Everything that happens on its own. */}
      <text
        x={LEFT}
        y="186"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {t.automatic}
      </text>

      <Envelope x={SETUP_END + 4} y={202} />
      <text
        x={SETUP_END + 34}
        y="214"
        fontSize="12"
        className="fill-current text-foreground"
      >
        {t.invitation}
      </text>

      {[330, 362, 394].map((x) => (
        <Envelope key={x} x={x} y={202} />
      ))}
      <text
        x="426"
        y="214"
        fontSize="12"
        className="fill-current text-foreground"
      >
        {t.reminders}
      </text>

      <Envelope x={RUN_END + 4} y={202} />
      <text
        x={RUN_END + 34}
        y="214"
        fontSize="12"
        className="fill-current text-foreground"
      >
        {t.results}
      </text>

      <text
        x={LEFT}
        y="270"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {t.entries}
      </text>
      {entries.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={274 - bar.h}
          width="12"
          height={bar.h}
          rx="1"
          className="fill-current text-muted-foreground"
        />
      ))}
    </svg>
  );
}
