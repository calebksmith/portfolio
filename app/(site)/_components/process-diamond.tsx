/**
 * The double diamond that loops.
 *
 * Two diamonds of diverge/converge, traced by a dot. When the dot reaches the
 * end it does not exit to Launch; it curves back to Discover and runs again.
 * The dashed tangent is drawn but never travelled — that is the scope claim,
 * made without a sentence asserting it.
 *
 * The phase labels are HTML, not SVG text. SVG text scales with the viewBox, so
 * it went illegibly small on a narrow screen and could not use the site's type
 * scale. As HTML they stay crisp at every width, sit on the real type ramp, and
 * are readable content rather than graphics — which also means the diagram
 * needs no separate text alternative.
 *
 * Geometry is laid out on a 1000-unit grid of five equal columns, so the SVG
 * vertices and the HTML label columns share centres at 100/300/500/700/900 and
 * stay aligned at any width.
 */

const JOURNEY =
  "M0,95 L200,30 L400,95 L600,30 L800,95 C850,215 -50,215 0,95";

/**
 * SVG `pathLength` renormalises the path for dash purposes, so the draw
 * animation needs no measured constant and cannot fall out of sync if the
 * geometry above is edited.
 */
const JOURNEY_LENGTH = 1000;

const PHASES = [
  { name: "Discover", note: "Interviews, evidence", Icon: SearchIcon },
  { name: "Define", note: "The brief", Icon: TargetIcon },
  { name: "Develop", note: "Prototypes in code", Icon: BlocksIcon },
  { name: "Refine", note: "Test, adjust, repeat", Icon: LoopIcon },
] as const;

export function ProcessDiamond() {
  return (
    <figure className="m-0">
      <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-[repeat(4,1fr)_0.8fr]">
        {PHASES.map(({ name, note, Icon }) => (
          <li key={name} className="flex flex-col items-center gap-2 text-center">
            <Icon />
            <span className="text-sm font-medium text-foreground">{name}</span>
            <span className="text-xs text-pretty text-muted-foreground">
              {note}
            </span>
          </li>
        ))}

        {/* Muted and dashed, because it is the one step handed off. */}
        <li className="flex flex-col items-center gap-2 border-l border-dashed border-border text-center sm:pl-4">
          <ExitIcon />
          <span className="text-sm font-medium text-muted-foreground">
            Launch
          </span>
          <span className="text-xs text-pretty text-muted-foreground">
            Handed off
          </span>
        </li>
      </ol>

      <svg
        viewBox="-12 20 1024 210"
        className="mt-6 w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* Stops are tokens, not literals — the high-contrast theme sets both
              to the same value, so it degrades to a solid stroke rather than
              shipping a gradient to someone who needs maximum separation. */}
          <linearGradient id="ck-journey" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--ck-gradient-from)" />
            <stop offset="100%" stopColor="var(--ck-gradient-to)" />
          </linearGradient>
        </defs>

        {/* The full shape, always present. */}
        <path
          d="M0,95 L200,30 L400,95 L200,160 Z M400,95 L600,30 L800,95 L600,160 Z"
          fill="none"
          stroke="var(--ck-border)"
          strokeWidth="1.5"
        />

        {/* The part handed off. The dot never reaches it. */}
        <path
          d="M800,95 L960,95"
          fill="none"
          stroke="var(--ck-border)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />

        {/* The traced journey. */}
        <path
          className="ck-trace"
          style={{ ["--ck-path-length" as string]: JOURNEY_LENGTH }}
          d={JOURNEY}
          pathLength={JOURNEY_LENGTH}
          fill="none"
          stroke="url(#ck-journey)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          className="ck-ride"
          style={{ ["--ck-path" as string]: `path("${JOURNEY}")` }}
          r="7"
          fill="var(--ck-gradient-to)"
        />

        <text
          x="400"
          y="228"
          textAnchor="middle"
          className="fill-[var(--ck-muted-foreground)] text-[22px] tracking-[0.16em] uppercase"
        >
          Iterate
        </text>
      </svg>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */

const ICON =
  "size-5 stroke-[1.4] text-primary";

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" className={ICON} fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="m12.5 12.5 4 4" strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 20 20" className={ICON} fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}

function BlocksIcon() {
  return (
    <svg viewBox="0 0 20 20" className={ICON} fill="none" stroke="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="11" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="11" width="6" height="6" rx="1" />
      <path d="M11 14h6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg viewBox="0 0 20 20" className={ICON} fill="none" stroke="currentColor" aria-hidden="true">
      <path
        d="M16 10a6 6 0 1 1-1.8-4.3"
        strokeLinecap="round"
      />
      <path d="M16.5 2.5V6H13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="size-5 stroke-[1.4] text-muted-foreground"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path d="M3 10h11" strokeLinecap="round" strokeDasharray="3 3" />
      <path d="M11 6.5 14.5 10 11 13.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
