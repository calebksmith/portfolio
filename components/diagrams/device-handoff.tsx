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

  return (
    <svg
      viewBox="0 0 700 260"
      role="img"
      aria-label={t.label}
      className="h-full w-full"
      fill="none"
    >
      {/* Phone — where the email lands */}
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
        y="36"
        textAnchor="middle"
        fontSize="13"
        className="fill-current text-foreground"
      >
        {t.phone}
      </text>
      <text
        x="100"
        y="230"
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.emailArrives}
      </text>

      {/* Work machine — where the person actually is */}
      <rect
        x="536"
        y="70"
        width="128"
        height="88"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-input"
      />
      <rect
        x="548"
        y="82"
        width="104"
        height="64"
        rx="3"
        className="fill-muted"
      />
      <path
        d="M516 176 H684"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="text-input"
      />
      <path
        d="M580 158 h40 l10 18 h-60 z"
        className="fill-muted"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <text
        x="600"
        y="36"
        textAnchor="middle"
        fontSize="13"
        className="fill-current text-foreground"
      >
        {t.workMachine}
      </text>
      <text
        x="600"
        y="230"
        textAnchor="middle"
        fontSize="12"
        className="fill-current text-muted-foreground"
      >
        {t.signingIn}
      </text>

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

      {/* The link: leaves the phone and returns to it. */}
      <g className="text-destructive-foreground">
        <path
          d="M176 104 C 250 104, 250 72, 300 72 C 350 72, 350 104, 300 104"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#dh-arrow)"
        />
        <text x="316" y="78" fontSize="12" className="fill-current">
          {t.linkOpens}
        </text>
        <text x="316" y="96" fontSize="12" className="fill-current opacity-80">
          {t.staysSignedOut}
        </text>
      </g>

      {/* The code: crosses. */}
      <g className="text-positive-foreground">
        <path
          d="M176 168 H 520"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#dh-arrow)"
        />
        <text x="240" y="158" fontSize="12" className="fill-current">
          {t.code}
        </text>
      </g>
    </svg>
  );
}
