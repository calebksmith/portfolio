import { notFound } from "next/navigation";

/**
 * Any path under a locale that matches no route.
 *
 * Without this, an unmatched URL never reaches the `[lang]` layout, so it gets
 * Next's unstyled default — no header, no way back, and in English whatever
 * language the reader was in. Calling `notFound()` here hands it to
 * `../not-found.tsx` instead, inside the site's own chrome.
 */
export default function Missing() {
  notFound();
}
