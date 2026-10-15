"use client";

import { useState, useSyncExternalStore } from "react";

import { ControlBar, ControlToggle, DeviceFigure } from "@/components/cksui";

import { GatedImage } from "./gated-image";

export type Screen = {
  src: string;
  /** The same state captured in the product's dark mode. */
  dark?: string;
  alt: string;
  width: number;
  height: number;
};

type ScreenMode = "light" | "dark";

/** The site's own mode, so a reader in dark mode starts on the dark screens. */
const subscribe = () => () => {};
const siteMode = (): ScreenMode => {
  const set = document.documentElement.getAttribute("data-mode");
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
const onServer = (): ScreenMode => "light";

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
  labels: { group: string; light: string; dark: string };
  className?: string;
}) {
  const initial = useSyncExternalStore(subscribe, siteMode, onServer);
  const [chosen, setChosen] = useState<ScreenMode | null>(null);
  const mode = chosen ?? initial;
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
            <ControlBar label={labels.group}>
              {(["light", "dark"] as const).map((m) => (
                <ControlToggle
                  key={m}
                  icon={m === "light" ? <SunIcon /> : <MoonIcon />}
                  label={labels[m]}
                  pressed={mode === m}
                  onClick={() => setChosen(m)}
                />
              ))}
            </ControlBar>
          ) : null
        }
      />
    </div>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7Z" />
    </svg>
  );
}
