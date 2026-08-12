"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the visitor asked for reduced motion.
 *
 * Most motion on this site is CSS and handled by a media query, which is the
 * right tool. This exists for the cases where the animation is driven by
 * JavaScript and has to not *start*, rather than be styled away — a typewriter
 * effect that keeps running invisibly is still a timer firing forty times a
 * second at someone who asked for stillness.
 *
 * Subscribed rather than read once, so a visitor who changes the setting gets
 * the new behavior without a reload.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    // The server cannot know; assume motion is fine and let the client correct
    // it, which matches how the rest of the site hydrates.
    () => false,
  );
}
