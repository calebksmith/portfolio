import { getMessages } from "@/lib/i18n/server";

/**
 * How the web portal was rebuilt: one page at a time, the same four steps.
 *
 * The case study's claim is that the migration was a loop, not a big bang, so
 * the drawing is the loop: read, rebuild, check, review, then back to the start
 * for the next page. The arrow above it is the direction of the whole thing,
 * from the legacy web portal to one codebase.
 *
 * Review is the accent pair because it is the step where people take over from
 * the agent and the checks. Everything else is structure.
 */

const BOX = { w: 150, h: 76, y: 70 };
const XS = [20, 210, 400, 590];
const LOOP_Y = 180;

export async function PageByPage() {
  const t = (await getMessages()).diagrams.pageByPage;
  const last = t.steps.length - 1;

  return (
    <svg
      viewBox="0 0 760 240"
      role="img"
      aria-label={t.label}
      className="h-full w-full"
      fill="none"
    >
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
            <rect
              x={x}
              y={BOX.y}
              width={BOX.w}
              height={BOX.h}
              rx="8"
              stroke="currentColor"
              strokeWidth={review ? 0 : 1}
              className={review ? "fill-accent" : "text-border"}
            />
            <text
              x={x + 14}
              y={BOX.y + 26}
              fontSize="14"
              className={
                review
                  ? "fill-current text-accent-foreground"
                  : "fill-current text-foreground"
              }
            >
              {step.what}
            </text>
            {step.note.map((line, n) => (
              <text
                key={line}
                x={x + 14}
                y={BOX.y + 48 + n * 16}
                fontSize="11"
                className={
                  review
                    ? "fill-current text-accent-foreground"
                    : "fill-current text-muted-foreground"
                }
              >
                {line}
              </text>
            ))}

            {i < last ? (
              <path
                d={`M${x + BOX.w + 6} ${BOX.y + BOX.h / 2} H ${XS[i + 1] - 6}`}
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
        d={`M${XS[last] + BOX.w / 2} ${BOX.y + BOX.h + 6} V ${LOOP_Y} H ${
          XS[0] + BOX.w / 2
        } V ${BOX.y + BOX.h + 8}`}
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
    </svg>
  );
}
