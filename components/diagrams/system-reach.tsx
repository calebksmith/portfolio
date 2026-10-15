import { getMessages } from "@/lib/i18n/server";

import { Diagram } from "./diagram";

/**
 * How far VimUI actually reaches.
 *
 * The claim the case study makes is easy to overstate — "a design system across
 * four platforms" is true of the tokens and false of the components. So the
 * drawing is a reach map with the seam in it: one dashed vertical line, web on
 * the left of it, React Native and Electron on the right. Everything that
 * crosses that line crosses it by hand.
 *
 * The bottom row is the interesting one. Login runs in a webview, so it is the
 * single case where real VimUI components render on all four platforms — the
 * row visibly ignores the seam. That was a side effect of building login once,
 * not a plan, and drawing it as the exception is the honest version.
 */

const COLS = [
  { x: 240, key: "web" },
  { x: 376, key: "ios" },
  { x: 506, key: "android" },
  { x: 636, key: "windows" },
] as const;

const SEAM = 370;
const LABEL_X = 220;

/**
 * A cell: a mark and a word, not a box. Words in a box read as a button, and
 * nothing in a diagram can be pressed. The mark carries the state: filled for
 * VimUI, dashed for copied by hand, open for the platform's own.
 */
function Cell({
  x,
  y,
  state,
  children,
}: {
  x: number;
  y: number;
  state: "vimui" | "byHand" | "separate";
  children: string;
}) {
  const cy = y + 26;

  return (
    <g>
      {state === "vimui" ? (
        <circle cx={x + 6} cy={cy} r="5.5" className="fill-primary" />
      ) : (
        <circle
          cx={x + 6}
          cy={cy}
          r="5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray={state === "byHand" ? "2 2" : undefined}
          // A dashed mark carries meaning, so it takes `input`, which is held
          // to 3:1; the plain one is structure.
          className={
            state === "byHand" ? "text-input" : "text-muted-foreground"
          }
        />
      )}
      <text
        x={x + 18}
        y={cy + 4}
        fontSize="12"
        className={
          state === "vimui"
            ? "fill-current text-foreground"
            : "fill-current text-muted-foreground"
        }
      >
        {children}
      </text>
    </g>
  );
}

/** Right-aligned row label plus its qualifier. */
function RowLabel({
  y,
  name,
  note,
}: {
  y: number;
  name: string;
  note: string;
}) {
  return (
    <g>
      <text
        x={LABEL_X}
        y={y + 22}
        textAnchor="end"
        fontSize="13"
        className="fill-current text-foreground"
      >
        {name}
      </text>
      <text
        x={LABEL_X}
        y={y + 40}
        textAnchor="end"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {note}
      </text>
    </g>
  );
}

export async function SystemReach() {
  const t = (await getMessages()).diagrams.systemReach;

  return (
    <Diagram width={760} height={300} label={t.label}>
      <text
        x="24"
        y="20"
        fontSize="11"
        letterSpacing="1.4"
        className="fill-current text-muted-foreground"
      >
        {t.title}
      </text>

      {COLS.map((c) => (
        <text
          key={c.key}
          x={c.x}
          y="48"
          fontSize="12"
          className="fill-current text-foreground"
        >
          {t.columns[c.key]}
        </text>
      ))}

      {/* The seam. Everything to the right of it is a different codebase, and
          nothing crosses it automatically. */}
      <path
        d={`M${SEAM} 58 V 246`}
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="text-muted-foreground"
      />
      <text
        x={SEAM + 8}
        y="266"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {t.separateCodebases}
      </text>
      <text
        x={SEAM - 8}
        y="266"
        textAnchor="end"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        {t.oneCodebase}
      </text>

      {/* Tokens: everywhere, but only one platform reads them at the source. */}
      <RowLabel y={66} name={t.tokens.name} note={t.tokens.note} />
      <Cell x={COLS[0].x} y={66} state="vimui">
        {t.sourceOfTruth}
      </Cell>
      {COLS.slice(1).map((c) => (
        <Cell key={c.key} x={c.x} y={66} state="byHand">
          {t.copiedByHand}
        </Cell>
      ))}

      {/* Components: one platform. */}
      <RowLabel y={132} name={t.components.name} note={t.components.note} />
      <Cell x={COLS[0].x} y={132} state="vimui">
        {t.vimui}
      </Cell>
      {COLS.slice(1).map((c) => (
        <Cell key={c.key} x={c.x} y={132} state="separate">
          {t.itsOwn}
        </Cell>
      ))}

      {/* The exception, and the only row that ignores the seam. */}
      <RowLabel y={198} name={t.login.name} note={t.login.note} />
      {COLS.map((c) => (
        <Cell key={c.key} x={c.x} y={198} state="vimui">
          {t.vimui}
        </Cell>
      ))}
    </Diagram>
  );
}
