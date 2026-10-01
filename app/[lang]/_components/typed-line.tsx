"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";

/**
 * Writing text out a character at a time, at an even pace.
 *
 * Extracted so the hero's question and its answers are the same machinery. They
 * are the same effect and should stay identical without anyone maintaining two
 * copies of the timing.
 *
 * An earlier version could mark phrases inside a line and pause mid-sentence
 * while each one drew its own underline. It was removed rather than left in
 * unused: the answers read better without the interruption, and an option
 * nothing calls is a guess about the future that still has to be maintained.
 */

const TYPE_MS = 26;

type Options = {
  /** Blank line with a live cursor before the first character. */
  delayMs?: number;
  /**
   * Whether to run at all. Lines that follow one another gate on the previous
   * line's `complete`, so a sequence types in order rather than all at once.
   */
  enabled?: boolean;
  /** Fired once, from inside the timer that writes the last character. */
  onDone?: () => void;
};

export function useTypedText(text: string, options: Options = {}) {
  const { delayMs = 0, enabled = true, onDone } = options;

  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState("");
  const [waiting, setWaiting] = useState(delayMs > 0);

  useEffect(() => {
    // Reduced motion does not style the animation away, it never starts it. A
    // typewriter running invisibly is still a timer firing forty times a second
    // at someone who asked for stillness.
    if (reduced || !enabled) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const later = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    if (waiting) {
      later(() => setWaiting(false), delayMs);
    } else if (typed.length < text.length) {
      later(() => {
        const next = text.slice(0, typed.length + 1);
        setTyped(next);

        // Announced from inside the timer that caused it rather than from an
        // effect watching for it, so the signal fires with the change.
        if (next.length === text.length) onDone?.();
      }, TYPE_MS);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced, enabled, waiting, typed, text, delayMs, onDone]);

  return {
    /** What to render. Derived, so there is one source of truth for it. */
    text: reduced ? text : typed,
    /** Nothing written yet, and nothing about to be for a moment. */
    waiting: !reduced && waiting,
    /** Actively putting characters on screen — the caret is solid for this. */
    writing: !reduced && enabled && !waiting && typed.length < text.length,
    complete: reduced || typed.length >= text.length,
  };
}

/**
 * A line being typed, holding its finished height from the start.
 *
 * The full text is rendered invisibly underneath and the typed copy is laid over
 * it, so the line occupies exactly the space it will end up needing at every
 * breakpoint. The alternative is a hand-picked `min-height` per line per
 * breakpoint, which is a magic number that goes wrong the moment the copy
 * changes by a word.
 */
export function TypedLine({
  full,
  typed,
  caret,
  className,
}: {
  full: string;
  typed: string;
  caret?: React.ReactNode;
  className?: string;
}) {
  return (
    <p aria-hidden="true" className={`relative ${className ?? ""}`}>
      <span className="invisible">{full}</span>
      <span className="absolute inset-0">
        {typed}
        {caret}
      </span>
    </p>
  );
}

/**
 * The block caret, in two states: solid while characters are appearing,
 * shimmering while the line is waiting to start or resting at the end. A hard
 * blink would read as an idle terminal; the soft oscillation reads as thinking.
 */
export function Caret({ writing }: { writing: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`ml-[0.1em] inline-block h-[1.05em] w-[0.5em] rounded-[1px] bg-primary align-[-0.2em] ${
        writing ? "ck-caret-writing" : "ck-caret-thinking"
      }`}
    />
  );
}
