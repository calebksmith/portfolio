import { getMessages } from "@/lib/i18n/server";

import { Diagram } from "./diagram";

/**
 * Where the guardrails check the standard.
 *
 * The case study's call is "three places, because a rule checked one way has
 * a gap in it", so the drawing is those three places hung off one change as it
 * moves from prompt to merge. The gate is the only one that can refuse, which
 * is why it alone carries the two severities: an error stops the merge, a
 * warning lets a deliberate exception through for someone to look at.
 *
 * `currentColor` for structure; the destructive token for the one outcome
 * that blocks. A warning blocks nothing, so it stays muted.
 */

const CARD = { y: 40 };
const XS = [20, 264, 508];
const LINE_Y = 228;

export async function Enforcement() {
  const t = (await getMessages()).diagrams.enforcement;

  return (
    <Diagram width={760} height={280} label={t.label}>
      <defs>
        <marker
          id="en-arrow"
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
        x="20"
        y="20"
        fontSize="11"
        letterSpacing="1.4"
        className="fill-current text-muted-foreground"
      >
        {t.title}
      </text>

      {t.stages.map((stage, i) => {
        const x = XS[i];
        const gate = i === t.stages.length - 1;

        return (
          <g key={stage.what}>
            {/* A rule down the left of each stage, not a box around it:
                words in a box read as a button, and nothing here can be
                pressed. The gate's rule is the control boundary (`input`, held
                to 3:1), because it's the one check that can refuse. */}
            <path
              d={`M${x} ${CARD.y} V ${LINE_Y}`}
              stroke="currentColor"
              strokeWidth={gate ? 2 : 1}
              strokeDasharray={gate ? undefined : "3 3"}
              className={gate ? "text-input" : "text-muted-foreground"}
            />
            <text
              x={x + 16}
              y={CARD.y + 24}
              fontSize="11"
              letterSpacing="0.6"
              className="fill-current text-muted-foreground"
            >
              {stage.when}
            </text>
            <text
              x={x + 16}
              y={CARD.y + 52}
              fontSize="13"
              className="fill-current text-foreground"
            >
              {stage.what}
            </text>
            {stage.note.map((line, n) => (
              <text
                key={line}
                x={x + 16}
                y={CARD.y + 76 + n * 18}
                fontSize="12"
                className="fill-current text-muted-foreground"
              >
                {line}
              </text>
            ))}

            {/* Where this check sits on the change. */}
            <circle
              cx={x}
              cy={LINE_Y}
              r="4"
              className="fill-current text-foreground"
            />
          </g>
        );
      })}

      {/* The gate's two outcomes, inside the gate. */}
      <g>
        <circle
          cx={XS[2] + 20}
          cy={CARD.y + 100}
          r="4"
          className="fill-current text-destructive-foreground"
        />
        <text
          x={XS[2] + 32}
          y={CARD.y + 104}
          fontSize="12"
          className="fill-current text-destructive-foreground"
        >
          {t.error}
        </text>
        <circle
          cx={XS[2] + 20}
          cy={CARD.y + 120}
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted-foreground"
        />
        <text
          x={XS[2] + 32}
          y={CARD.y + 124}
          fontSize="12"
          className="fill-current text-muted-foreground"
        >
          {t.warning}
        </text>
      </g>

      {/* The change itself, left to right. */}
      <path
        d={`M20 ${LINE_Y} H 736`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        markerEnd="url(#en-arrow)"
        className="text-foreground"
      />
      <text
        x="20"
        y={LINE_Y + 28}
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.change}
      </text>
    </Diagram>
  );
}
