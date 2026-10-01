"use client";

import type { ReactNode } from "react";

import { useInView } from "@/components/cksui/lib/use-in-view";
import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";

import { useHeroReveal } from "./hero-reveal";

/**
 * Fades and lifts its child in when it scrolls into view, once.
 *
 * A thin client wrapper so the pages holding it can stay server components —
 * the cards themselves never become client code, only the box around them.
 *
 * Two things it deliberately does not do. It does not re-hide on scroll back
 * up: content that fades out again is a distraction, not an entrance. And it
 * does not gate content on the observer firing — under reduced motion, or if
 * IntersectionObserver is missing, the child is simply visible. An animation
 * wrapper must never be the reason something cannot be read.
 */
/**
 * The entrance itself: a short lift and fade, and the held state it starts from.
 *
 * Exported because the scroll cue makes the same entrance without wanting the
 * observer — it is already on screen, so it has nothing to scroll into. Two
 * copies of these values would drift the moment one was tuned.
 *
 * `invisible` rather than opacity alone, so nothing inside can be tabbed to
 * while it is being held back. It is also what the no-JS rule in the root layout
 * overrides, which opacity on its own could not express.
 */
export const REVEAL_TRANSITION =
  "transition-[opacity,transform,visibility] duration-500 ease-out";

export const revealState = (shown: boolean) =>
  shown
    ? "visible translate-y-0 opacity-100"
    : "invisible translate-y-3 opacity-0";

export function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  /** Position in a group, for the stagger. */
  index?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const { revealed } = useHeroReveal();
  const { ref, inView } = useInView<HTMLDivElement>("-10% 0px");

  // `revealed` is true everywhere outside the homepage hero, so this reads as
  // plain in-view behavior unless something is deliberately holding it back.
  const shown = reduced || (revealed && inView);

  return (
    <div
      ref={ref}
      data-reveal
      className={`${REVEAL_TRANSITION} ${revealState(shown)} ${className ?? ""}`}
      style={{
        // Capped so a long row never leaves the last card waiting noticeably
        // longer than the first.
        transitionDelay: shown ? `${Math.min(index, 5) * 70}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
