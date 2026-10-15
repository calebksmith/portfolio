"use client";

import { useState, useSyncExternalStore } from "react";

import { ControlBar, ControlToggle, Icon } from "@/components/cksui";

export type ScreenMode = "light" | "dark";

export type ScreenModeLabels = { group: string; light: string; dark: string };

/** The site's own mode, so a reader in dark mode starts on the dark screens. */
const subscribe = () => () => {};
const siteMode = (): ScreenMode => {
  const set = document.documentElement.getAttribute("data-mode");
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
const onServer = (): ScreenMode => "light";

/**
 * Which mode a screenshot is showing: the site's own until the reader picks
 * one. Held in component state and nowhere else.
 */
export function useScreenMode() {
  const initial = useSyncExternalStore(subscribe, siteMode, onServer);
  const [chosen, setChosen] = useState<ScreenMode | null>(null);
  return [chosen ?? initial, setChosen] as const;
}

/**
 * The light and dark switch over a screenshot captured in both modes: a sun
 * and a moon, with their names for screen readers and as tooltips.
 */
export function ScreenModeSwitch({
  mode,
  onChange,
  labels,
}: {
  mode: ScreenMode;
  onChange: (mode: ScreenMode) => void;
  labels: ScreenModeLabels;
}) {
  return (
    <ControlBar label={labels.group} variant="segmented">
      {(["light", "dark"] as const).map((m) => (
        <ControlToggle
          key={m}
          icon={<Icon name={m === "light" ? "sun" : "moon"} />}
          label={labels[m]}
          pressed={mode === m}
          iconOnly
          onClick={() => onChange(m)}
        />
      ))}
    </ControlBar>
  );
}
