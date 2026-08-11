/**
 * Theme and mode options.
 *
 * Two independent axes, both stamped on <html>:
 *   data-theme  the color set   (default is the absence of the attribute)
 *   data-mode   light or dark   (system is the absence of the attribute)
 *
 * Persistence is a cookie, not localStorage — browser storage is off limits in
 * this codebase, and a cookie has the useful property of being readable before
 * first paint, which is what keeps the page from flashing the wrong theme.
 */

export const THEME_COOKIE = "ck-theme";
export const MODE_COOKIE = "ck-mode";

/** A year. The preference is not sensitive and should outlive the session. */
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEMES = [
  { value: "default", label: "Default" },
  { value: "ember", label: "Ember" },
  { value: "contrast", label: "High contrast" },
] as const;

export const MODES = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

export type Theme = (typeof THEMES)[number]["value"];
export type Mode = (typeof MODES)[number]["value"];

export const DEFAULT_THEME: Theme = "default";
export const DEFAULT_MODE: Mode = "system";
