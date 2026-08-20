"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";

/**
 * Holds back everything under the hero until the tagline has said its piece —
 * or until the visitor scrolls, whichever happens first.
 *
 * The second half of that is the important half. Gating content on an animation
 * finishing is a bet that the visitor will wait, and they won't: the first thing
 * anyone does on a page like this is scroll. So any scroll at all releases the
 * page immediately, and the tagline's finish is only the fallback for someone
 * who sat still through it.
 *
 * The default value outside a provider is `true`, so `Reveal` behaves normally
 * on every other page rather than needing to know whether it is on the homepage.
 */
type HeroReveal = { revealed: boolean; markSettled: () => void };

const HeroRevealContext = createContext<HeroReveal>({
  revealed: true,
  markSettled: () => {},
});

export const useHeroReveal = () => useContext(HeroRevealContext);

export function HeroRevealProvider({ children }: { children: ReactNode }) {
  // Under reduced motion the tagline never types, so there is no finish to wait
  // for and nothing to stagger. The page is simply all there.
  const reduced = usePrefersReducedMotion();
  const [settled, setSettled] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const markSettled = useCallback(() => setSettled(true), []);

  useEffect(() => {
    const release = () => setScrolled(true);

    // Arriving already scrolled — a restored position on a back navigation, or
    // a #work link — counts. Without this the browser would jump to content
    // still being held back and land on a blank stretch of page.
    //
    // Deferred a frame rather than set here: state written straight into an
    // effect body is a cascading render, and the release is not urgent.
    if (window.scrollY > 0) {
      const frame = requestAnimationFrame(release);
      return () => cancelAnimationFrame(frame);
    }

    window.addEventListener("scroll", release, { passive: true, once: true });
    return () => window.removeEventListener("scroll", release);
  }, []);

  const value = useMemo(
    () => ({ revealed: reduced || settled || scrolled, markSettled }),
    [reduced, settled, scrolled, markSettled],
  );

  return (
    <HeroRevealContext.Provider value={value}>
      {children}
    </HeroRevealContext.Provider>
  );
}
