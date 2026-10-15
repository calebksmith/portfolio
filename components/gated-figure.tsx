import { Button, DeviceFigure, Figure, Icon } from "@/components/cksui";
import { getMessages } from "@/lib/i18n/server";
import { site } from "@/lib/site";

import { GatedImage } from "./gated-image";
import { GatedScreens, type Screen } from "./gated-screens";

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
 * The locked frame is the same size and shape as the screenshot, with a few
 * neutral shapes blurred past recognition behind a request for access. It
 * reads as something there to be seen rather than as an empty notice, which is
 * the point: the full case study is one message away. The shapes are drawn,
 * not derived from the image, and carry none of this site's colors, so the
 * frame hints at a different product without describing it.
 *
 * `src` is the image's path in the private store, e.g.
 * `challenges/choose-team.webp`; the file itself lives in `private/media/`
 * and is uploaded with `npm run media:upload`.
 *
 * Pass `phone` too and the figure becomes a pair: the same state captured at
 * desktop and phone width, drawn in a monitor and a phone (`DeviceFigure`).
 * Each screen's ratio comes from its own width and height. Give each screen
 * a `dark` path as well and the pair gets a light and dark switch.
 */
export async function GatedFigure({
  src,
  alt,
  width,
  height,
  ratio,
  caption,
  frame = "inline",
  dark,
  phone,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  ratio?: string;
  caption: string;
  frame?: "inline" | "breakout";
  /** The desktop screen in the product's dark mode. */
  dark?: string;
  phone?: Screen;
}) {
  const messages = await getMessages();
  const t = messages.gated;

  const request = (
    <div className="flex max-w-xs flex-col items-center gap-2 rounded-lg border border-border bg-card px-5 py-4 text-center text-card-foreground shadow-lift">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <Icon name="lock" className="text-muted-foreground" />
        {t.title}
      </p>
      {/* On a phone the frame is short; the title, the button, and the
          caption beneath already say enough, and the screen behind is what
          makes it read as locked. */}
      <p className="hidden text-xs text-pretty text-muted-foreground sm:block">
        {t.note}
      </p>
      <Button asChild size="sm" className="mt-1">
        <a href={site.links.linkedin}>{t.ask}</a>
      </Button>
    </div>
  );

  if (phone) {
    const desktopRatio = `${width}/${height}`;
    const phoneRatio = `${phone.width}/${phone.height}`;

    return (
      <div data-slot="gated-figure">
        <GatedScreens
          className="hidden access:block"
          caption={caption}
          desktop={{ src, dark, alt, width, height }}
          phone={phone}
          labels={messages.screenModes}
        />

        <DeviceFigure
          className="access:hidden"
          caption={caption}
          desktopRatio={desktopRatio}
          phoneRatio={phoneRatio}
          desktop={<ObscuredScreen />}
          phone={<ObscuredScreen />}
          overlay={
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {request}
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div data-slot="gated-figure">
      <Figure
        ratio={ratio ?? `${width}/${height}`}
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
        ratio={ratio ?? `${width}/${height}`}
        caption={caption}
        width={frame}
        className="access:hidden"
      >
        <div className="relative h-full w-full">
          <Obscured />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {request}
          </div>
        </div>
      </Figure>
    </div>
  );
}

/**
 * A screen, blurred until nothing on it can be read: a band across the top and
 * three soft blocks, in the muted neutrals only. Enough to say an image is
 * here; not enough to guess what it shows, or to mistake it for this site.
 */
function Obscured() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 480 320"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full scale-125 opacity-50 blur-2xl"
    >
      <rect
        width="480"
        height="64"
        className="fill-current text-muted-foreground"
      />
      <rect
        x="24"
        y="104"
        width="208"
        height="192"
        rx="32"
        className="fill-current text-muted-foreground"
      />
      <rect
        x="256"
        y="104"
        width="200"
        height="84"
        rx="32"
        className="fill-muted"
      />
      <rect
        x="256"
        y="212"
        width="200"
        height="84"
        rx="32"
        className="fill-current text-muted-foreground"
      />
    </svg>
  );
}

/** The same blur, clipped to one device's screen. */
function ObscuredScreen() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Obscured />
    </div>
  );
}
