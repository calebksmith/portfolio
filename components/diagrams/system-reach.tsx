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
  { x: 306, label: "Web app" },
  { x: 416, label: "iOS" },
  { x: 526, label: "Android" },
  { x: 636, label: "Windows" },
];

const W = 100;
const SEAM = 411;

/** A cell. `state` decides the fill, the border, and which foreground reads. */
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
  const fill =
    state === "vimui"
      ? "fill-accent"
      : state === "separate"
        ? "fill-muted"
        : "fill-none";

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={W}
        height="52"
        rx="6"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray={state === "byHand" ? "3 3" : undefined}
        // `border` is the decorative hairline. A dashed cell is carrying
        // meaning, so it takes `input`, which is held to 3:1.
        className={`${fill} ${state === "byHand" ? "text-input" : "text-border"}`}
      />
      <text
        x={x + W / 2}
        y={y + 31}
        textAnchor="middle"
        fontSize="12"
        className={
          state === "vimui"
            ? "fill-current text-accent-foreground"
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
        x="296"
        y={y + 22}
        textAnchor="end"
        fontSize="13"
        className="fill-current text-foreground"
      >
        {name}
      </text>
      <text
        x="296"
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

export function SystemReach() {
  return (
    <svg
      viewBox="0 0 760 300"
      role="img"
      aria-label="Tokens reach all four platforms, but only the web app reads them directly — iOS, Android, and Windows get them copied by hand. The VimUI component library reaches the web app alone; the other three carry their own components. Login and account creation are the exception: they run in a webview, so real VimUI components render on all four platforms."
      className="h-full w-full"
      fill="none"
    >
      <text
        x="24"
        y="20"
        fontSize="11"
        letterSpacing="1.4"
        className="fill-current text-muted-foreground"
      >
        WHAT REACHES WHICH PLATFORM
      </text>

      {COLS.map((c) => (
        <text
          key={c.label}
          x={c.x + W / 2}
          y="48"
          textAnchor="middle"
          fontSize="12"
          className="fill-current text-foreground"
        >
          {c.label}
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
        React Native and Electron — separate codebases
      </text>
      <text
        x={SEAM - 8}
        y="266"
        textAnchor="end"
        fontSize="11"
        className="fill-current text-muted-foreground"
      >
        one codebase
      </text>

      {/* Tokens: everywhere, but only one platform reads them at the source. */}
      <RowLabel y={66} name="Tokens" note="color, type, spacing" />
      <Cell x={COLS[0].x} y={66} state="vimui">
        source of truth
      </Cell>
      {COLS.slice(1).map((c) => (
        <Cell key={c.label} x={c.x} y={66} state="byHand">
          copied by hand
        </Cell>
      ))}

      {/* Components: one platform. */}
      <RowLabel y={132} name="Components" note="50+, React and Radix" />
      <Cell x={COLS[0].x} y={132} state="vimui">
        VimUI
      </Cell>
      {COLS.slice(1).map((c) => (
        <Cell key={c.label} x={c.x} y={132} state="separate">
          its own
        </Cell>
      ))}

      {/* The exception, and the only row that ignores the seam. */}
      <RowLabel y={198} name="Login & account" note="runs in a webview" />
      {COLS.map((c) => (
        <Cell key={c.label} x={c.x} y={198} state="vimui">
          VimUI
        </Cell>
      ))}
    </svg>
  );
}
