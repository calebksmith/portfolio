"use client";

import { Figure } from "@/components/cksui";

import {
  ScreenModeSwitch,
  useScreenMode,
  type ScreenModeLabels,
} from "./screen-mode";

/**
 * A screenshot anyone can see, captured in the product's light and dark
 * modes, with a switch between them. It starts on the reader's own mode.
 *
 * Only the chosen mode's image is in the page; the other loads when someone
 * asks for it.
 */
export function ScreenFigureClient({
  src,
  dark,
  alt,
  width,
  height,
  caption,
  labels,
}: {
  src: string;
  dark: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  labels: ScreenModeLabels;
}) {
  const [mode, setMode] = useScreenMode();

  return (
    <Figure
      width="breakout"
      ratio={`${width}/${height}`}
      caption={caption}
      controls={
        <ScreenModeSwitch mode={mode} onChange={setMode} labels={labels} />
      }
    >
      {/* Public files, but already sized for their frame, so the optimizer
          would add a request without saving a byte. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={mode}
        src={mode === "dark" ? dark : src}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        className="h-full w-full object-contain"
      />
    </Figure>
  );
}
