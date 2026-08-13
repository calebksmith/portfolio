"use client";

import type { ReactNode } from "react";

import { useInView } from "@/components/cksui/lib/use-in-view";
import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";

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
  const { ref, inView } = useInView<HTMLDivElement>("-10% 0px");
  const shown = reduced || inView;

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-500 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className ?? ""}`}
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
