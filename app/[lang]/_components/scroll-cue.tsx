"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";

import { useHeroReveal } from "./hero-reveal";
import { REVEAL_TRANSITION, revealState } from "./reveal";

/**
 * A beat after the question's options land, before the cue joins them.
 *
 * Arriving together made them one event and put two invitations on screen at
 * the same moment. Letting the options settle first means the cue reads as what
 * it is — the answer to "and if none of those?" — rather than competing with
 * them for the same glance.
 */
const CUE_DELAY_MS = 1500;

/**
 * The prompt that closes the first screen.
 *
 * It is a link, not a caption. A visible arrow pointing down is an affordance,
 * and people click affordances — one that does nothing when clicked is a small
 * lie. This one jumps to the work, which also means it is reachable by keyboard
 * and gives someone tabbing through the page a way past the hero.
 *
 * It is not a heading. It used to carry the work section's name, but it fades
 * in after the hero, and a heading that is hidden until then isn't in the
 * outline — which ran h1 → h3 for as long as the cue was waiting. The section
 * names itself now, with an h2 that is always there.
 */
export function ScrollCue({ label }: { label: string }) {
  const { revealed } = useHeroReveal();
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(false);

  // Latches: once the cue is up it stays up. Written from inside the timer
  // rather than the effect body, which is a cascading render.
  useEffect(() => {
    if (!revealed) return;

    const timer = setTimeout(() => setShown(true), reduced ? 0 : CUE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [revealed, reduced]);

  return (
    <div
      data-reveal
      // The same lift and fade the case study cards make, from the same
      // constants — this is the first of them, so it should not arrive
      // differently.
      className={`pb-10 text-center ${REVEAL_TRANSITION} ${revealState(shown)}`}
    >
      <a
        href="#work"
        className="group inline-flex min-h-tap flex-col items-center gap-2 rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {label}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 16 16"
          className="ck-scroll-cue size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 2.5v11M3.5 9.5 8 14l4.5-4.5" />
        </svg>
      </a>
    </div>
  );
}
