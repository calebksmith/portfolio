import { getMessages } from "@/lib/i18n/server";

import { Diagram } from "./diagram";

/**
 * How the web portal was rebuilt: one page at a time, the same four steps.
 *
 * The case study's claim is that the migration was a loop, not a big bang, so
 * the drawing is the loop: read, rebuild, check, review, then back to the start
 * for the next page. The arrow above it is the direction of the whole thing,
 * from the legacy web portal to one codebase.
 *
 * Review is the primary pair because it is the step where people take over from
 * the agent and the checks. Everything else is structure. Each step is a
 * numbered mark with its name beside it, never a box around words, which
 * would read as a button.
 */

const XS = [20, 210, 400, 590];
const MARK = 12;
const STEP_Y = 86;
const LOOP_Y = 180;

export async function PageByPage() {
  const t = (await getMessages()).diagrams.pageByPage;
  const last = t.steps.length - 1;

  return (
    <Diagram width={760} height={240} label={t.label}>
      <defs>
        <marker
          id="pp-arrow"
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

      {/* The direction of the whole migration. */}
      <text
        x="20"
        y="42"
        fontSize="12"
        className="fill-current text-foreground"
      >
        {t.from}
      </text>
      <text
        x="740"
        y="42"
        textAnchor="end"
        fontSize="12"
        className="fill-current text-foreground"
      >
        {t.to}
      </text>
      <path
        d="M20 52 H 736"
        stroke="currentColor"
        strokeWidth="1"
        markerEnd="url(#pp-arrow)"
        className="text-muted-foreground"
      />

      {t.steps.map((step, i) => {
        const x = XS[i];
        const review = i === last;

        return (
          <g key={step.what}>
            {/* A numbered mark and the step beside it, not a box: words in a
                box read as a button, and nothing here can be pressed. */}
            <circle
              cx={x + MARK}
              cy={STEP_Y}
              r={MARK}
              stroke="currentColor"
              strokeWidth={review ? 0 : 1.25}
              className={review ? "fill-primary" : "text-muted-foreground"}
            />
            <text
              x={x + MARK}
              y={STEP_Y + 4}
              textAnchor="middle"
              fontSize="11"
              className={
                review
                  ? "fill-current text-primary-foreground"
                  : "fill-current text-foreground"
              }
            >
              {i + 1}
            </text>
            <text
              x={x + MARK * 2 + 10}
              y={STEP_Y + 5}
              fontSize="13"
              className="fill-current text-foreground"
            >
              {step.what}
            </text>
            {step.note.map((line, n) => (
              <text
                key={line}
                x={x + MARK * 2 + 10}
                y={STEP_Y + 28 + n * 16}
                fontSize="11"
                className="fill-current text-muted-foreground"
              >
                {line}
              </text>
            ))}

            {i < last ? (
              <path
                d={`M${x + 120} ${STEP_Y} H ${XS[i + 1] - 8}`}
                stroke="currentColor"
                strokeWidth="1.5"
                markerEnd="url(#pp-arrow)"
                className="text-foreground"
              />
            ) : null}
          </g>
        );
      })}

      {/* Back to the start, for the next page. */}
      <path
        d={`M${XS[last] + MARK} ${STEP_Y + MARK + 4} V ${LOOP_Y} H ${
          XS[0] + MARK
        } V ${STEP_Y + MARK + 6}`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinejoin="round"
        markerEnd="url(#pp-arrow)"
        className="text-muted-foreground"
      />
      <text
        x="380"
        y={LOOP_Y + 22}
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.next}
      </text>
    </Diagram>
  );
}
