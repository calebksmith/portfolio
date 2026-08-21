"use client";

import { useSyncExternalStore } from "react";

/**
 * Reads an attribute off <html> as a reactive value.
 *
 * The `<html>` element is the source of truth for theme and mode, not React
 * state — the pre-paint script in `<body>` sets it before React exists, and the
 * stylesheet reads it directly. So this subscribes to the DOM rather than
 * mirroring it into state, which is what `useSyncExternalStore` is for and why
 * nothing here writes state in an effect.
 *
 * The server snapshot is the default, which is also what the server-rendered
 * markup shows — so hydration matches, and the store corrects it afterwards if
 * the visitor has a saved preference.
 */
export function useHtmlAttribute<T extends string>(
  attribute: string,
  fallback: T,
): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      const observer = new MutationObserver(onStoreChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: [attribute],
      });
      return () => observer.disconnect();
    },
    () =>
      (document.documentElement.getAttribute(attribute) as T | null) ??
      fallback,
    () => fallback,
  );
}
