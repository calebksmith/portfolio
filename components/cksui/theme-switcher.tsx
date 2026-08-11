"use client";

import { useSyncExternalStore } from "react";

import {
  DEFAULT_MODE,
  DEFAULT_THEME,
  MODES,
  MODE_COOKIE,
  THEMES,
  THEME_COOKIE,
  THEME_COOKIE_MAX_AGE,
  type Mode,
  type Theme,
} from "@/lib/theme";

import { cn } from "./lib/cn";

/**
 * Theme and mode controls.
 *
 * Radio inputs rather than buttons with click handlers. That is not a stylistic
 * preference: a radio group gives arrow-key navigation, roving focus, and the
 * correct "2 of 3" announcement for free, and getting those right by hand is
 * exactly the kind of thing that looks fine and fails in a screen reader.
 * The inputs are transparent but never `display: none`, so they stay focusable
 * and the label styling keys off `peer-focus-visible`.
 */

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

/**
 * Reads an attribute off <html> as a reactive value.
 *
 * The `<html>` element is the source of truth here, not React state — the
 * pre-paint script in `<body>` sets it before React exists, and the stylesheet
 * reads it directly. So this subscribes to the DOM rather than mirroring it
 * into state, which is what `useSyncExternalStore` is for and why there is no
 * effect writing state on mount.
 *
 * The server snapshot is the default, which is also what the server-rendered
 * markup shows — so hydration matches, then the store corrects it if the
 * visitor has a saved preference.
 */
function useHtmlAttribute<T extends string>(attribute: string, fallback: T): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [attribute],
      });
      return () => observer.disconnect();
    },
    () => (document.documentElement.getAttribute(attribute) as T | null) ?? fallback,
    () => fallback,
  );
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const theme = useHtmlAttribute<Theme>("data-theme", DEFAULT_THEME);
  const mode = useHtmlAttribute<Mode>("data-mode", DEFAULT_MODE);

  /**
   * Writes the attribute and the cookie. No setState — the MutationObserver
   * above sees the attribute change and re-renders, so the DOM stays the single
   * source of truth instead of being shadowed by a second copy in React.
   */
  function apply(attribute: string, cookie: string, value: string, fallback: string) {
    const root = document.documentElement;
    if (value === fallback) root.removeAttribute(attribute);
    else root.setAttribute(attribute, value);
    writeCookie(cookie, value);
  }

  const applyTheme = (next: Theme) =>
    apply("data-theme", THEME_COOKIE, next, DEFAULT_THEME);
  const applyMode = (next: Mode) =>
    apply("data-mode", MODE_COOKIE, next, DEFAULT_MODE);

  return (
    <div
      data-slot="theme-switcher"
      className={cn("flex flex-col gap-4", className)}
    >
      <Group
        legend="Theme"
        name="ck-theme"
        options={THEMES}
        value={theme}
        onChange={(value) => applyTheme(value as Theme)}
      />
      <Group
        legend="Mode"
        name="ck-mode"
        options={MODES}
        value={mode}
        onChange={(value) => applyMode(value as Mode)}
      />
    </div>
  );
}

function Group({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset data-slot="theme-switcher-group" className="border-0 p-0">
      <legend className="mb-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="relative inline-flex">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              className={cn(
                "inline-flex min-h-tap items-center rounded-md border px-3 text-sm transition-colors",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring",
                value === option.value
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-input bg-background text-foreground hover:bg-muted hover:text-muted-foreground",
              )}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
