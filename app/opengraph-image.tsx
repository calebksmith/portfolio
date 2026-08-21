import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

/**
 * The link preview.
 *
 * Every URL from this site pasted into LinkedIn, Slack, or a message rendered
 * as a bare text card until this existed — which is the first thing a hiring
 * manager sees, and it was nothing.
 *
 * Generated rather than committed as a PNG, for the same reason the résumé has
 * no PDF: a committed image is a second copy of the name and the lede, and it
 * goes stale the moment either changes. This reads both from `lib/site.ts`.
 *
 * The colours are the mark's own fixed values, not tokens — an image file has
 * no theme to follow, and this is the one place that constraint is absolute.
 */
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A dark card, so it carries the mark's dark form: purple tile, ink letters.
// The ink tile it used first was 1.05:1 against this ground — invisible — and
// briefly wore a ring to compensate. Inverting is the real fix, and it is the
// same inversion the header and the favicon make.
const GROUND = "#0e1013";
const TILE = "#a78bfa";
const TILE_INK = "#14161b";
const MARK = "#a78bfa";
const FG = "#e9ebee";
const MUTED = "#9aa2ac";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: GROUND,
        padding: 84,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        {/* The same tile as the favicon and the header, at 22% radius. */}
        <div
          style={{
            width: 108,
            height: 108,
            borderRadius: 24,
            background: TILE,
            color: TILE_INK,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            fontWeight: 500,
            letterSpacing: -1,
          }}
        >
          CS
        </div>
        <div
          style={{
            color: FG,
            fontSize: 62,
            fontWeight: 600,
            letterSpacing: -1.8,
          }}
        >
          {site.name}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          color: FG,
          fontSize: 44,
          lineHeight: 1.3,
          maxWidth: 900,
          letterSpacing: -0.6,
        }}
      >
        {site.lede}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          color: MUTED,
          fontSize: 24,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: MARK }}>{site.role}</span>
        <span>·</span>
        <span>calebksmith.com</span>
      </div>
    </div>,
    size,
  );
}
