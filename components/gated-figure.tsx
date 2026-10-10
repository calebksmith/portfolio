import { Button, Figure } from "@/components/cksui";
import { getMessages } from "@/lib/i18n/server";
import { site } from "@/lib/site";

import { GatedImage } from "./gated-image";

/**
 * A screenshot from inside Vimocity's app, for people I've sent an access
 * link. Screens anyone can open without an account are plain figures; these
 * aren't, and their files never enter the repository.
 *
 * Both versions are in the static page, and the theme script picks one before
 * first paint: the image in its reserved frame for a granted visitor, a locked
 * frame for everyone else. Neither shifts the layout. The caption shows either
 * way, because the point it makes holds without the picture.
 *
 * The locked frame is the same size and shape as the screenshot, with a
 * blurred, generic screen behind a request for access. It reads as something
 * there to be seen rather than as an empty notice, which is the point: the
 * full case study is one message away. The silhouette is drawn, not derived
 * from the image, so nothing of the real screen reaches the page.
 *
 * `src` is the image's path in the private store, e.g.
 * `challenges/choose-team.webp`; the file itself lives in `private/media/`
 * and is uploaded with `npm run media:upload`.
 */
export async function GatedFigure({
  src,
  alt,
  width,
  height,
  ratio,
  caption,
  frame = "inline",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  ratio: string;
  caption: string;
  frame?: "inline" | "breakout";
}) {
  const t = (await getMessages()).gated;

  return (
    <div data-slot="gated-figure">
      <Figure
        ratio={ratio}
        caption={caption}
        width={frame}
        className="hidden access:block"
      >
        <GatedImage
          src={`/api/media/${src}`}
          alt={alt}
          width={width}
          height={height}
        />
      </Figure>

      <Figure
        ratio={ratio}
        caption={caption}
        width={frame}
        className="access:hidden"
      >
        <div className="relative h-full w-full">
          <ScreenSilhouette />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="flex max-w-xs flex-col items-center gap-2 rounded-lg border border-border bg-card px-5 py-4 text-center text-card-foreground shadow-lift">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <LockIcon />
                {t.title}
              </p>
              {/* On a phone the frame is short; the title, the button, and the
                  caption beneath already say enough, and the screen behind
                  is what makes it read as locked. */}
              <p className="hidden text-xs text-pretty text-muted-foreground sm:block">
                {t.note}
              </p>
              <Button asChild size="sm" className="mt-1">
                <a href={site.links.linkedin}>{t.ask}</a>
              </Button>
            </div>
          </div>
        </div>
      </Figure>
    </div>
  );
}

/**
 * A generic app screen — a header, a title, a row of cards — blurred past
 * reading. It stands in for the screenshot's presence, not its content.
 */
function ScreenSilhouette() {
  const cards = [24, 176, 328];

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full scale-110 opacity-70 blur-sm"
    >
      <rect width="480" height="36" className="fill-muted" />
      <rect
        x="16"
        y="12"
        width="56"
        height="12"
        rx="3"
        className="fill-accent"
      />
      {[312, 364, 416].map((x) => (
        <rect
          key={x}
          x={x}
          y="13"
          width="44"
          height="10"
          rx="5"
          className="fill-current text-muted-foreground"
        />
      ))}

      <rect
        x="24"
        y="60"
        width="184"
        height="16"
        rx="4"
        className="fill-current text-foreground"
      />
      <rect
        x="24"
        y="86"
        width="264"
        height="9"
        rx="4"
        className="fill-current text-muted-foreground"
      />

      {cards.map((x) => (
        <g key={x}>
          <rect
            x={x}
            y="112"
            width="128"
            height="184"
            rx="8"
            className="fill-muted"
          />
          <rect
            x={x + 8}
            y="120"
            width="112"
            height="72"
            rx="5"
            className="fill-accent"
          />
          <rect
            x={x + 8}
            y="204"
            width="96"
            height="9"
            rx="4"
            className="fill-current text-foreground"
          />
          <rect
            x={x + 8}
            y="222"
            width="72"
            height="8"
            rx="4"
            className="fill-current text-muted-foreground"
          />
          <rect
            x={x + 8}
            y="260"
            width="64"
            height="22"
            rx="11"
            className="fill-primary"
          />
        </g>
      ))}
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4 shrink-0 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}
