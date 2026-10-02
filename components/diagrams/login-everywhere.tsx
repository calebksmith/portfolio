import { getMessages } from "@/lib/i18n/server";

/**
 * One login, three surfaces.
 *
 * The point of the unified login is that it is the same screen everywhere — the
 * web portal in a browser, the iOS and Android apps through a webview, and the
 * Windows desktop app — so the drawing shows exactly that: three device frames,
 * one screenshot. The frames are drawn, not photographed, so they follow the
 * theme; the screens are the real login.
 *
 * Frames take `currentColor` and the muted surface; nothing else is coloured.
 * One SVG with a fixed viewBox, so it scales as a unit and reserves its space.
 */

const WEB = "/media/login/web-login-wide.webp";
const MOBILE = "/media/login/mobile-login.webp";

export async function LoginEverywhere() {
  const t = (await getMessages()).diagrams.loginEverywhere;

  return (
    <svg
      viewBox="0 0 900 400"
      role="img"
      aria-label={t.label}
      className="h-full w-full"
      fill="none"
    >
      <defs>
        <clipPath id="login-everywhere-browser">
          <rect x="21" y="67" width="328" height="262" rx="0" />
        </clipPath>
        <clipPath id="login-everywhere-phone">
          <rect x="397" y="27" width="136" height="296" rx="16" />
        </clipPath>
        <clipPath id="login-everywhere-desktop">
          <rect x="581" y="99" width="298" height="230" />
        </clipPath>
      </defs>

      {/* Browser — the web portal */}
      <rect
        x="20"
        y="40"
        width="330"
        height="290"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
        className="fill-muted text-input"
      />
      <circle cx="36" cy="53" r="3.5" className="fill-current text-input" />
      <circle cx="48" cy="53" r="3.5" className="fill-current text-input" />
      <circle cx="60" cy="53" r="3.5" className="fill-current text-input" />
      <rect
        x="76"
        y="46"
        width="200"
        height="14"
        rx="7"
        className="fill-card"
      />
      <text
        x="88"
        y="56.5"
        fontSize="9"
        className="fill-current text-muted-foreground"
      >
        {t.url}
      </text>
      <image
        href={WEB}
        x="21"
        y="67"
        width="328"
        height="262"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#login-everywhere-browser)"
      />

      {/* Phone — the mobile apps, through a webview */}
      <rect
        x="390"
        y="20"
        width="150"
        height="310"
        rx="22"
        stroke="currentColor"
        strokeWidth="1.5"
        className="fill-muted text-input"
      />
      <image
        href={MOBILE}
        x="397"
        y="27"
        width="136"
        height="296"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#login-everywhere-phone)"
      />

      {/* Windows window — V-minder, the desktop app */}
      <rect
        x="580"
        y="70"
        width="300"
        height="260"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.5"
        className="fill-muted text-input"
      />
      <text
        x="594"
        y="89"
        fontSize="10"
        className="fill-current text-muted-foreground"
      >
        {t.appTitle}
      </text>
      {/* Minimise, maximise, close — the Windows title bar, not the Mac one. */}
      <g
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="text-muted-foreground"
      >
        <path d="M820 85h8" />
        <rect x="840" y="80" width="8" height="8" rx="1" />
        <path d="M860 80l8 8M868 80l-8 8" />
      </g>
      <image
        href={WEB}
        x="581"
        y="99"
        width="298"
        height="230"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#login-everywhere-desktop)"
      />

      {/* What each one is. Below the small breakpoint the drawing is about a
          third of its drawn size and these would render at 6px, so they step
          aside: the caption names the three in the same order. */}
      <g className="max-sm:hidden">
        <text
          x="185"
          y="362"
          textAnchor="middle"
          fontSize="13"
          className="fill-current text-foreground"
        >
          {t.web}
        </text>
        <text
          x="465"
          y="362"
          textAnchor="middle"
          fontSize="13"
          className="fill-current text-foreground"
        >
          {t.mobile}
        </text>
        <text
          x="730"
          y="362"
          textAnchor="middle"
          fontSize="13"
          className="fill-current text-foreground"
        >
          {t.desktop}
        </text>
        <text
          x="465"
          y="384"
          textAnchor="middle"
          fontSize="11"
          className="fill-current text-muted-foreground"
        >
          {t.mobileNote}
        </text>
      </g>
    </svg>
  );
}
