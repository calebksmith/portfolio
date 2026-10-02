import { Figure } from "@/components/cksui";
import { getMessages } from "@/lib/i18n/server";
import { site } from "@/lib/site";

import { GatedImage } from "./gated-image";

/**
 * A screenshot from inside Vimocity's app, for people I've sent an access
 * link. Screens anyone can open without an account are plain figures; these
 * aren't, and their files never enter the repository.
 *
 * Both versions are in the static page, and the theme script picks one before
 * first paint: the image in its reserved frame for a granted visitor, a
 * one-line note for everyone else. Neither shifts the layout. The caption
 * shows either way, because the point it makes holds without the picture.
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

      <figure className="mt-8 max-w-measure-wide access:hidden">
        <div className="flex flex-wrap items-center gap-x-3 rounded-lg border border-dashed border-input bg-card px-5 py-2 text-card-foreground">
          <LockIcon />
          <p className="text-sm text-muted-foreground">{t.note}</p>
          <a
            href={site.links.linkedin}
            className="inline-flex min-h-tap items-center rounded-sm text-sm text-primary underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {t.ask}
          </a>
        </div>
        <figcaption className="mt-3 max-w-measure text-sm text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      </figure>
    </div>
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
