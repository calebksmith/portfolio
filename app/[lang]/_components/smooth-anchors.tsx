"use client";

import { useEffect } from "react";

/**
 * Smooth scrolling for in-page links only.
 *
 * `scroll-behavior: smooth` on `html` was the obvious way to do this and it was
 * wrong: it applies to every scroll, including the one the router performs when
 * a navigation lands. Leaving the homepage from the bottom meant the next page
 * mounted at that offset and then visibly scrolled itself to the top — an
 * animation nobody asked for, on content that had not been read yet.
 *
 * So the behaviour lives on the interaction instead. One delegated listener,
 * matching same-document anchors and nothing else. Navigation jumps, as it
 * should; a link to a heading on the page you are already on glides.
 *
 * Focus moves with the scroll. A smooth-scroll handler that only moves the
 * viewport leaves a keyboard user's focus where it was, so the next Tab jumps
 * back to the top of the page — the link appears to do nothing for them. The
 * heading takes focus without stealing the scroll, and gives it up again after,
 * so it never becomes a permanent tab stop.
 */
export function SmoothAnchors() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Let the browser handle anything that is not a plain left click.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href?.startsWith("#") || href === "#") return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      history.pushState(null, "", href);

      // Focus the destination so the keyboard follows the eye. Headings are not
      // focusable by default, so it borrows a tabindex and hands it back.
      const hadTabIndex = target.hasAttribute("tabindex");
      if (!hadTabIndex) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      if (!hadTabIndex) {
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          {
            once: true,
          },
        );
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
