import { getMessages } from "@/lib/i18n/server";

/**
 * Why the login flow uses a code and not a magic link.
 *
 * The claim is a comparison, so the drawing is one: the same two devices, the
 * same person, two mechanisms — and the difference is whether the arrow reaches
 * the second device at all. A link cannot; it opens where it was read.
 *
 * `currentColor` for structure so it follows the theme, and the two semantic
 * tokens for the one thing being compared. Nothing else is coloured.
 */
export async function DeviceHandoff() {
  const t = (await getMessages()).diagrams.deviceHandoff;

  // Laid out on measured text: the labels are 12-unit monospace, about 7.2
  // units a character. Both devices sit 40 in from the edges and centre on the
  // same line, and each lane's label clears its arrow and the devices by 15.
  return (
    <svg
      viewBox="0 0 700 260"
      role="img"
      aria-label={t.label}
      className="h-full w-full"
      fill="none"
    >
      <defs>
        <marker
          id="dh-arrow"
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

      {/* Phone — where the email lands */}
      <text
        x="100"
        y="36"
        textAnchor="middle"
        fontSize="13"
        className="fill-current text-foreground"
      >
        {t.phone}
      </text>
      <rect
        x="40"
        y="52"
        width="120"
        height="156"
        rx="14"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-input"
      />
      <rect
        x="56"
        y="76"
        width="88"
        height="108"
        rx="4"
        className="fill-muted"
      />
      <text
        x="100"
        y="232"
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.emailArrives}
      </text>

      {/* Shared terminal — where the person is signing in */}
      <text
        x="580"
        y="36"
        textAnchor="middle"
        fontSize="13"
        className="fill-current text-foreground"
      >
        {t.terminal}
      </text>
      <rect
        x="500"
        y="64"
        width="160"
        height="104"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-input"
      />
      <rect
        x="512"
        y="76"
        width="136"
        height="80"
        rx="3"
        className="fill-muted"
      />
      <path
        d="M568 168 h24 l8 28 h-40 z"
        className="fill-muted text-input"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M500 196 H660"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-input"
      />
      <text
        x="580"
        y="232"
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.signingIn}
      </text>

      {/* The link: leaves the phone and turns straight back. Its label sits
          beside the turn, not on it. */}
      <g className="text-destructive-foreground">
        <path
          d="M168 108 H202 A14 14 0 0 0 202 80 H168"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd="url(#dh-arrow)"
        />
        <text x="232" y="90" fontSize="12" className="fill-current">
          {t.linkOpens}
        </text>
        <text x="232" y="108" fontSize="12" className="fill-current">
          {t.staysSignedOut}
        </text>
      </g>

      {/* The code: crosses the whole gap and lands on the screen. */}
      <g className="text-positive-foreground">
        <text
          x="330"
          y="144"
          textAnchor="middle"
          fontSize="12"
          className="fill-current"
        >
          {t.code}
        </text>
        <path
          d="M168 156 H492"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#dh-arrow)"
        />
      </g>
    </svg>
  );
}
