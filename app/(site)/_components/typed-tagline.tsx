"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";
import { site } from "@/lib/site";

/**
 * The tagline, written a line at a time and then resolved into one.
 *
 * Four lines accumulate — nothing is struck through and nothing is erased while
 * they build, because an earlier version struck each line out and that reads as
 * a mind being changed: "I research; scratch that, I define." The claim is the
 * opposite. All of it is the same job.
 *
 * When the fifth line lands, the four above it collapse away and it rises to
 * the top alone. That is the resolution: the process is not discarded, it is
 * absorbed into the sentence that summarises it — which happens to be the
 * approved lede.
 */

/**
 * Three lines, not five.
 *
 * An earlier pass gave each phase its own sentence, which asked the reader to
 * hold four claims plus a summary. Pairing them halves that without losing a
 * verb — and the pairs are not arbitrary: research and define are the first
 * diamond, prototype and test are the second. The structure of the work is in
 * the line breaks.
 *
 * Line one is deliberately business-framed. "What's worth building" is a
 * judgement about value, not a description of gathering input — which is the
 * difference between a designer who runs research and one who decides scope.
 *
 * Line two pairs "real components" with "real customers" on purpose: neither is
 * a proxy for the thing. It is also the copy deck's own language, so the
 * tagline and the résumé make the same claim in the same words.
 *
 * The last line is the approved lede, and it is what remains.
 */
const LINES = [
  "I research and define what's worth building.",
  "I prototype in real components and test with real customers.",
  site.lede,
] as const;

const LAST = LINES.length - 1;

const TYPE_MS = 26;
const LINE_PAUSE_MS = 420;
const SETTLE_MS = 900;
const COLLAPSE_MS = 600;
const REST_MS = 4200;

type Phase = "typing" | "collapsing" | "resting";

export function TypedTagline({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const later = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    if (phase === "typing") {
      const target = LINES[line];

      if (typed.length < target.length) {
        later(() => setTyped(target.slice(0, typed.length + 1)), TYPE_MS);
      } else if (line === LAST) {
        // Let the finished set be read before it resolves.
        later(() => setPhase("collapsing"), SETTLE_MS);
      } else {
        later(() => {
          setLine((current) => current + 1);
          setTyped("");
        }, LINE_PAUSE_MS);
      }
    }

    if (phase === "collapsing") {
      later(() => setPhase("resting"), COLLAPSE_MS);
    }

    if (phase === "resting") {
      later(() => {
        setLine(0);
        setTyped("");
        setPhase("typing");
      }, REST_MS);
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced, line, typed, phase]);

  /** After the last line lands, the four above it fold away. */
  const collapsed = phase === "collapsing" || phase === "resting";

  return (
    <div className={className}>
      {/* The real content, announced once. The animation is decorative. */}
      <span className="sr-only">{site.lede}</span>

      {/*
        The lines below are typed by the client, so without JavaScript the hero
        would be visually empty. The sr-only lede above covers assistive
        technology and crawlers; this covers someone actually looking at it.
      */}
      <noscript>
        <p className="text-foreground">{site.lede}</p>
      </noscript>

      <ul aria-hidden="true" className="flex flex-col">
        {LINES.map((text, index) => {
          const isFinal = index === LAST;
          const finished = reduced || index < line || collapsed;
          const active = !reduced && index === line && phase === "typing";
          if (!finished && !active) return null;

          // Only the process lines fold; the final line stays and rises.
          const folding = collapsed && !isFinal;

          return (
            <li
              key={text}
              className={[
                "overflow-hidden transition-all ease-out",
                isFinal ? "text-foreground" : "text-muted-foreground",
                folding ? "mb-0 max-h-0 opacity-0" : "mb-1 max-h-[6em] opacity-100",
              ].join(" ")}
              style={{ transitionDuration: `${COLLAPSE_MS}ms` }}
            >
              {finished ? text : typed}

              {/* The caret sits at the end of whatever is being written, and
                  shimmers rather than blinks while the line rests. */}
              {active || (isFinal && collapsed) ? (
                <span
                  className={[
                    "ml-[0.1em] inline-block h-[1.05em] w-[0.5em] rounded-[1px] bg-primary align-[-0.2em]",
                    active && typed.length < text.length
                      ? "ck-caret-writing"
                      : "ck-caret-thinking",
                  ].join(" ")}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
