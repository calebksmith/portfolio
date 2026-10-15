"use client";

import { DeviceFigure } from "@/components/cksui";

import { GatedImage } from "./gated-image";
import {
  ScreenModeSwitch,
  useScreenMode,
  type ScreenModeLabels,
} from "./screen-mode";

export type Screen = {
  src: string;
  /** The same state captured in the product's dark mode. */
  dark?: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * The granted half of a gated device pair: a monitor and a phone showing the
 * same state, with a light and dark switch when both modes were captured.
 *
 * Only the chosen mode's images are requested; the other loads when someone
 * asks for it. The choice is held in component state and nowhere else.
 */
export function GatedScreens({
  desktop,
  phone,
  caption,
  labels,
  className,
}: {
  desktop: Screen;
  phone: Screen;
  caption: string;
  labels: ScreenModeLabels;
  className?: string;
}) {
  const [mode, setMode] = useScreenMode();
  const toggles = Boolean(desktop.dark && phone.dark);

  const image = (screen: Screen) => (
    <GatedImage
      key={mode}
      src={`/api/media/${mode === "dark" && screen.dark ? screen.dark : screen.src}`}
      alt={screen.alt}
      width={screen.width}
      height={screen.height}
      fit="cover"
    />
  );

  return (
    <div data-slot="gated-screens" className={className}>
      <DeviceFigure
        caption={caption}
        desktopRatio={`${desktop.width}/${desktop.height}`}
        phoneRatio={`${phone.width}/${phone.height}`}
        desktop={image(desktop)}
        phone={image(phone)}
        controls={
          toggles ? (
            <ScreenModeSwitch mode={mode} onChange={setMode} labels={labels} />
          ) : null
        }
      />
    </div>
  );
}
