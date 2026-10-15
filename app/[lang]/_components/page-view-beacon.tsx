"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Counts the page as seen: one small POST each time the path changes, on the
 * first load and on every navigation inside the site. No cookie, no storage,
 * no third-party script; the server keeps a daily hash, never an address.
 * Automated browsers are skipped here, crawlers on the server.
 * See docs/decisions/0008-visitor-analytics.md.
 */
export function PageViewBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (navigator.webdriver) return;
    const body = JSON.stringify({
      path: pathname,
      referrer: document.referrer,
    });
    // sendBeacon survives the tab closing; fetch is the fallback.
    if (!navigator.sendBeacon?.("/api/view", body)) {
      void fetch("/api/view", { method: "POST", body, keepalive: true }).catch(
        () => {},
      );
    }
  }, [pathname]);

  return null;
}
