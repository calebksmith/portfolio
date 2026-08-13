"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";
import { site } from "@/lib/site";

/**
 * The tagline, written a line at a time and then resolved into one.
 *
 * Lines accumulate — nothing is struck through and nothing is erased while they
 * build, because an earlier version struck each line out and that reads as a
 * mind being changed: "I research; scratch that, I define." The claim is the
 * opposite. All of it is the same job.
 *
 * Each key phrase underlines itself the moment it finishes typing, and the
 * typing waits for it. So the emphasis happens mid-sentence, the way someone
 * marking up their own writing would do it — not as a pass applied afterwards.
 *
 * When the last line lands, the two above it fold away and it rises to the top
 * alone. The process is not discarded, it is absorbed into the sentence that
 * summarises it — which is the approved lede.
 */

type Segment = { text: string; mark?: boolean };

/**
 * Three lines, not five. An earlier pass gave each phase its own sentence,
 * which asked the reader to hold four claims plus a summary. Pairing them
 * halves that without losing a verb, and the pairs are not arbitrary: research
 * and define are the first diamond, prototype and test are the second.
 *
 * Line one is business-framed on purpose. "Worth building" is a judgement about
 * value rather than a description of gathering input — the difference between a
 * designer who runs research and one who decides scope.
 *
 * "Real components" and "real customers" are both marked because they are the
 * same argument twice: neither is a proxy for the thing. Both are the copy
 * deck's own words.
 */
const LINES: Segment[][] = [
  [
    { text: "I research and define features that are " },
    { text: "worth building", mark: true },
    { text: "." },
  ],
  [
    { text: "I prototype in " },
    { text: "real components", mark: true },
    { text: " and test with " },
    { text: "real customers", mark: true },
    { text: "." },
  ],
  [{ text: site.lede }],
];

const LAST = LINES.length - 1;

const TYPE_MS = 26;
/** Must match the transition the marks are given below. */
const MARK_DRAW_MS = 460;
/** A beat after the underline lands, before writing resumes. */
const MARK_HOLD_MS = 240;
const LINE_END_MS = 650;
const SETTLE_MS = 1400;
const COLLAPSE_MS = 600;
const REST_MS = 4200;

const lineText = (segments: Segment[]) =>
  segments.map((segment) => segment.text).join("");

/** Character offsets at which a marked phrase finishes. */
function markEnds(segments: Segment[]) {
  const ends: number[] = [];
  let offset = 0;
  for (const segment of segments) {
    offset += segment.text.length;
    if (segment.mark) ends.push(offset);
  }
  return ends;
}

type Phase = "typing" | "collapsing" | "resting";

export function TypedTagline({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  const segments = LINES[line];
  const full = lineText(segments);
  /** True exactly while a just-completed phrase is drawing its underline. */
  const drawing =
    phase === "typing" &&
    typed.length < full.length &&
    markEnds(segments).includes(typed.length);

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
      if (typed.length < full.length) {
        // Having just finished a marked phrase, wait for its underline before
        // writing on — the emphasis should not be racing the next words.
        later(
          () => setTyped(full.slice(0, typed.length + 1)),
          drawing ? MARK_DRAW_MS + MARK_HOLD_MS : TYPE_MS,
        );
      } else if (line === LAST) {
        later(() => setPhase("collapsing"), SETTLE_MS);
      } else {
        later(() => {
          setLine((current) => current + 1);
          setTyped("");
        }, LINE_END_MS);
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
  }, [reduced, line, typed, phase, full, drawing]);

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
        {LINES.map((lineSegments, index) => {
          const isFinal = index === LAST;
          const lineFull = lineText(lineSegments);
          const done = reduced || index < line || collapsed;
          const active = !reduced && index === line && phase === "typing";
          if (!done && !active) return null;

          const shown = done ? lineFull.length : typed.length;
          const folding = collapsed && !isFinal;

          return (
            <li
              key={lineFull}
              className={[
                "overflow-hidden transition-all ease-out",
                isFinal ? "text-foreground" : "text-muted-foreground",
                folding ? "mb-0 max-h-0 opacity-0" : "mb-1 max-h-[6em] opacity-100",
              ].join(" ")}
              style={{ transitionDuration: `${COLLAPSE_MS}ms` }}
            >
              <Line segments={lineSegments} shown={shown} />

              {active || (isFinal && collapsed) ? (
                <span
                  className={[
                    "ml-[0.1em] inline-block h-[1.05em] w-[0.5em] rounded-[1px] bg-primary align-[-0.2em]",
                    // Solid while characters are appearing; shimmering while the
                    // line pauses for an underline or rests at the end.
                    active && typed.length < lineFull.length && !drawing
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

/**
 * Renders a line up to `shown` characters. Each marked phrase underlines itself
 * as soon as its own last character has been typed, independently of the rest
 * of the line.
 */
function Line({ segments, shown }: { segments: Segment[]; shown: number }) {
  // Offsets are derived rather than accumulated in a counter during the map —
  // render must not depend on mutation part-way through.
  const bounds = segments.map((_, index) => {
    const start = segments
      .slice(0, index)
      .reduce((total, segment) => total + segment.text.length, 0);
    return { start, end: start + segments[index].text.length };
  });

  return (
    <>
      {segments.map((segment, index) => {
        const { start, end } = bounds[index];

        const visible = segment.text.slice(0, Math.max(0, shown - start));
        if (!visible) return null;

        if (!segment.mark) return <span key={index}>{visible}</span>;

        return (
          <span
            key={index}
            className="ck-mark"
            style={{
              backgroundSize: shown >= end ? "100% 0.08em" : "0% 0.08em",
              transitionDuration: `${MARK_DRAW_MS}ms`,
            }}
          >
            {visible}
          </span>
        );
      })}
    </>
  );
}
