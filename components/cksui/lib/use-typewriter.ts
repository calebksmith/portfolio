"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "./use-reduced-motion";

/**
 * Types a string out one character at a time, once, when told to start.
 *
 * Gated on `active` rather than running on mount, so a sequence of these down a
 * page can each begin as they scroll into view instead of all racing invisibly
 * above the fold.
 *
 * Under reduced motion it returns the finished string and never starts a timer.
 * Styling a running animation away still leaves it running.
 */
export function useTypewriter(code: string, active: boolean, speed = 26) {
  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (reduced || !active || doneRef.current) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let index = 0;

    const step = () => {
      index += 1;
      setTyped(code.slice(0, index));

      if (index >= code.length) {
        doneRef.current = true;
        return;
      }

      // A beat at line ends, the way someone actually types.
      timer = setTimeout(
        () => {
          if (!cancelled) step();
        },
        code[index - 1] === "\n" ? speed * 7 : speed,
      );
    };

    timer = setTimeout(() => {
      if (!cancelled) step();
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [code, active, reduced, speed]);

  return {
    // Derived, not stored: one source of truth for what is shown.
    text: reduced ? code : typed,
    complete: reduced || typed.length >= code.length,
    caret: !reduced && active && typed.length < code.length,
  };
}
