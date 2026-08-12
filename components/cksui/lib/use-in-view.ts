"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Whether an element has scrolled into view — once, and then stays true.
 *
 * Latching rather than toggling is deliberate for this use: the phases below
 * type themselves as you reach them, and a phase that re-typed every time it
 * scrolled back past would be a fidget, not a demonstration.
 */
export function useInView<T extends HTMLElement>(rootMargin = "-20% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No IntersectionObserver: reveal everything rather than leaving the page
    // permanently mid-animation. Deferred a frame so it is not a synchronous
    // state write during the effect.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}
