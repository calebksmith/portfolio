import Link from "next/link";

import { ThemeSwitcher } from "./theme-switcher";

/**
 * Site-wide appearance settings.
 *
 * Theme and mode belong somewhere reachable from every page, not on the index
 * only — so this sits fixed in the corner of every public route.
 *
 * Built on the native Popover API rather than a JS disclosure. `popovertarget`
 * gives open/close, Escape to dismiss, click-outside to dismiss, and top-layer
 * stacking with no JavaScript and no focus-trap of my own to get wrong. The
 * only client code on this route is the switcher itself, which needs to write a
 * cookie.
 *
 * Positioning lives in globals.css, because the UA stylesheet centres
 * `[popover]` and that has to be overridden in CSS rather than by a class.
 */
export function SettingsMenu() {
  return (
    <>
      <button
        type="button"
        popoverTarget="ck-settings"
        data-slot="settings-trigger"
        className="fixed right-4 bottom-4 z-50 inline-flex min-h-tap min-w-tap items-center justify-center gap-2 rounded-lg border border-input bg-card px-3 text-card-foreground shadow-sm transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <SlidersIcon />
        <span className="text-xs uppercase tracking-[0.14em]">Appearance</span>
      </button>

      <div
        id="ck-settings"
        popover="auto"
        data-slot="settings-panel"
        aria-label="Appearance settings"
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-input bg-card p-5 text-card-foreground shadow-lg"
      >
        <h2 className="mb-4 font-display text-sm font-semibold tracking-[-0.01em]">
          Appearance
        </h2>

        <ThemeSwitcher />

        <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          <Link
            href="/themes"
            className="underline decoration-input underline-offset-4 hover:decoration-primary hover:text-foreground"
          >
            Measured contrast for every pair →
          </Link>
        </p>
      </div>
    </>
  );
}

function SlidersIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M2 4.5h5M11 4.5h3M2 11.5h3M9 11.5h5" />
      <circle cx="9" cy="4.5" r="1.75" />
      <circle cx="7" cy="11.5" r="1.75" />
    </svg>
  );
}
