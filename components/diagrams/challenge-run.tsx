import { getMessages } from "@/lib/i18n/server";

import { Diagram } from "./diagram";

/**
 * What an admin does to run a challenge, and what runs without them.
 *
 * The case study's point is that a challenge stopped being a support request,
 * so the drawing is one challenge on a line from start to end, with each
 * phase's steps listed under it. Every step is marked as one of two kinds: a
 * filled mark with a person in it where the admin acts, an open mark with a
 * clock where it happens on its own. The middle phase has no filled marks, and
 * that gap is the feature: once it's published, the admin isn't needed until
 * it ends.
 *
 * Steps are text beside a mark, never text in a box: a box with words in it
 * reads as a button, and nothing in a diagram can be pressed.
 *
 * The admin's mark is the primary pair, the one place a person acts. The rest
 * is structure, in `currentColor`.
 */

const LEFT = 20;
const RIGHT = 740;
const COLUMN = 240;
const LINE_Y = 52;
const TOP = 108;
const ROW = 30;

type Step = { label: string; admin?: boolean };

/** A step's mark: a person for the admin, a clock for what runs on its own. */
function Mark({ x, y, admin }: { x: number; y: number; admin?: boolean }) {
  return admin ? (
    <g>
      <circle cx={x} cy={y} r="9" className="fill-primary" />
      <g
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        className="text-primary-foreground"
      >
        <circle cx={x} cy={y - 2.5} r="2.2" />
        <path d={`M${x - 4.5} ${y + 5} a4.5 4 0 0 1 9 0`} />
      </g>
    </g>
  ) : (
    <g stroke="currentColor" className="text-muted-foreground">
      <circle cx={x} cy={y} r="8.5" strokeWidth="1.25" />
      <path
        d={`M${x} ${y - 4.5} V ${y} l3 2`}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
    <Diagram width={760} height={222} label={t.label}>
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

      {/* The challenge itself, start to end. */}
      <path
        d={`M${LEFT} ${LINE_Y} H ${RIGHT - 4}`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        markerEnd="url(#cr-arrow)"
        className="text-foreground"
      />

      {columns.map((column, c) => {
        const x = LEFT + c * COLUMN;
        return (
          <g key={column.phase}>
            <circle
              cx={x + 4}
              cy={LINE_Y}
              r="4"
              className="fill-current text-foreground"
            />
            <text
              x={x}
              y={LINE_Y + 30}
              fontSize="13"
              className="fill-current text-foreground"
            >
              {column.phase}
            </text>
            {column.steps.map((step, s) => {
              const y = TOP + s * ROW;
              return (
                <g key={step.label}>
                  <Mark x={x + 9} y={y - 4} admin={step.admin} />
                  <text
                    x={x + 28}
                    y={y}
                    fontSize="12"
                    className="fill-current text-foreground"
                  >
                    {step.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* The key: the same two marks, named. */}
      <Mark x={LEFT + 9} y={202} admin />
      <text
        x={LEFT + 28}
        y="206"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {t.admin}
      </text>
      <Mark x={LEFT + 169} y={202} />
      <text
        x={LEFT + 188}
        y="206"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {t.automatic}
      </text>
    </Diagram>
  );
}
