import { getMessages } from "@/lib/i18n/server";

/**
 * What an admin does to run a challenge, and what runs without them.
 *
 * The case study's point is that a challenge stopped being a support request,
 * so the drawing is three columns, start to end, and every step in them is one
 * of two kinds: filled where the admin acts, outlined where it happens on its
 * own. The middle column has nothing filled in it, and that gap is the
 * feature: once it's published, the admin isn't needed until it ends.
 *
 * The admin's steps are the accent pair, the one place a person acts. The
 * automatic ones are structure, in `currentColor`.
 */

const LEFT = 20;
const COLUMN = 213;
const GAP = 40;
const TOP = 74;
const ROW = 46;
const PILL = 36;

type Step = { label: string; admin?: boolean };

function Pill({ x, y, step }: { x: number; y: number; step: Step }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={COLUMN}
        height={PILL}
        rx="6"
        strokeWidth="1.25"
        stroke={step.admin ? undefined : "currentColor"}
        className={
          step.admin ? "fill-accent" : "fill-none text-muted-foreground"
        }
      />
      <text
        x={x + COLUMN / 2}
        y={y + PILL / 2 + 4}
        textAnchor="middle"
        fontSize="12"
        className={
          step.admin
            ? "fill-current text-accent-foreground"
            : "fill-current text-foreground"
        }
      >
        {step.label}
      </text>
    </g>
  );
}

export async function ChallengeRun() {
  const t = (await getMessages()).diagrams.challengeRun;

  const columns: { phase: string; steps: Step[] }[] = [
    {
      phase: t.phases.setup,
      steps: [{ label: t.setup, admin: true }, { label: t.invitation }],
    },
    {
      phase: t.phases.run,
      steps: [{ label: t.reminders }, { label: t.entries }],
    },
    {
      phase: t.phases.end,
      steps: [
        { label: t.draw, admin: true },
        { label: t.complete, admin: true },
        { label: t.results },
      ],
    },
  ];

  return (
    <svg
      viewBox="0 0 760 270"
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

      {columns.map((column, c) => {
        const x = LEFT + c * (COLUMN + GAP);
        return (
          <g key={column.phase}>
            <text
              x={x}
              y="58"
              fontSize="13"
              fontWeight="600"
              className="fill-current text-foreground"
            >
              {column.phase}
            </text>
            {column.steps.map((step, s) => (
              <Pill key={step.label} x={x} y={TOP + s * ROW} step={step} />
            ))}
            {c < columns.length - 1 ? (
              <path
                d={`M${x + COLUMN + 8} ${TOP + PILL / 2} H ${x + COLUMN + GAP - 8}`}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                markerEnd="url(#cr-arrow)"
                className="text-muted-foreground"
              />
            ) : null}
          </g>
        );
      })}

      {/* The key: which steps are the admin's. */}
      <g>
        <rect
          x={LEFT}
          y="240"
          width="14"
          height="14"
          rx="3"
          className="fill-accent"
        />
        <text
          x={LEFT + 22}
          y="251"
          fontSize="11"
          className="fill-current text-muted-foreground"
        >
          {t.admin}
        </text>
        <rect
          x={LEFT + 140}
          y="240"
          width="14"
          height="14"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.25"
          className="fill-none text-muted-foreground"
        />
        <text
          x={LEFT + 162}
          y="251"
          fontSize="11"
          className="fill-current text-muted-foreground"
        >
          {t.automatic}
        </text>
      </g>
    </svg>
  );
}
