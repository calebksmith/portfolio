"use client";

import { useEffect, useState } from "react";

import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";
import { site } from "@/lib/site";

/**
 * The tagline, written and rewritten.
 *
 * "I ___ products" holds as a fixed frame while the verb slot cycles. Each verb
 * types, is struck through, and is deleted — so the sentence is edited in front
 * of you rather than retyped, and the revision is legible as a revision. The
 * last verb stays, the rest of the line types on, and the finished sentence is
 * the approved lede.
 *
 * It lands on `design` last on purpose: after research, define, prototype, and
 * test, ending on design says that all of them *are* design. That is the
 * argument the sequence exists to make.
 *
 * Then it disassembles — the tail deletes, `design` is struck, and it begins
 * again. The cycle is the point, and it never needed a diagram.
 */

const PREFIX = "I ";
const NOUN = " products";
const VERBS = ["research", "define", "prototype", "test", "design"] as const;
const TAIL = " and write the frontend code they're built from.";

const TYPE_MS = 34;
const DELETE_MS = 16;
const HOLD_MS = 700;
const STRIKE_MS = 380;
const REST_MS = 5200;

type Stage =
  | "verb-typing"
  | "verb-hold"
  | "verb-strike"
  | "verb-delete"
  | "tail-typing"
  | "rest"
  | "tail-delete"
  | "final-strike";

export function TypedTagline({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [stage, setStage] = useState<Stage>("verb-typing");
  const [verbIndex, setVerbIndex] = useState(0);
  const [verb, setVerb] = useState("");
  const [tail, setTail] = useState("");

  const target = VERBS[verbIndex];
  const isLastVerb = verbIndex === VERBS.length - 1;
  const struck = stage === "verb-strike" || stage === "final-strike";

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const later = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
    };

    switch (stage) {
      case "verb-typing":
        if (verb.length < target.length) {
          later(() => setVerb(target.slice(0, verb.length + 1)), TYPE_MS);
        } else {
          later(() => setStage("verb-hold"), HOLD_MS);
        }
        break;

      case "verb-hold":
        // The last verb is never struck — the sentence completes around it.
        later(() => setStage(isLastVerb ? "tail-typing" : "verb-strike"), 0);
        break;

      case "verb-strike":
        later(() => setStage("verb-delete"), STRIKE_MS + 180);
        break;

      case "verb-delete":
        if (verb.length > 0) {
          later(() => setVerb(verb.slice(0, -1)), DELETE_MS);
        } else {
          later(() => {
            setVerbIndex((index) => index + 1);
            setStage("verb-typing");
          }, 120);
        }
        break;

      case "tail-typing":
        if (tail.length < TAIL.length) {
          later(() => setTail(TAIL.slice(0, tail.length + 1)), TYPE_MS);
        } else {
          later(() => setStage("rest"), 0);
        }
        break;

      case "rest":
        later(() => setStage("tail-delete"), REST_MS);
        break;

      case "tail-delete":
        if (tail.length > 0) {
          later(() => setTail(tail.slice(0, -1)), DELETE_MS);
        } else {
          later(() => setStage("final-strike"), 200);
        }
        break;

      case "final-strike":
        later(() => {
          setVerbIndex(0);
          setVerb("");
          setTail("");
          setStage("verb-typing");
        }, STRIKE_MS + 260);
        break;
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced, stage, verb, tail, target, isLastVerb]);

  /**
   * The caret is always present; only its state changes. Solid while characters
   * are actually appearing or disappearing, shimmering while the line is
   * between revisions — the difference between writing and deciding, which is
   * what makes it read as something composing rather than a terminal idling.
   */
  const writing =
    stage === "verb-typing" ||
    stage === "verb-delete" ||
    stage === "tail-typing" ||
    stage === "tail-delete";

  return (
    <p className={className}>
      {/* The real content, announced once. The animation below is decorative. */}
      <span className="sr-only">{site.lede}</span>

      <span aria-hidden="true">
        {reduced ? (
          site.lede
        ) : (
          <>
            {PREFIX}
            <span className="relative inline-block whitespace-pre">
              {verb}
              {/* The strike sweeps across the verb it is replacing. */}
              <span
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden transition-[width] ease-out"
                style={{
                  width: struck ? "100%" : "0%",
                  transitionDuration: `${STRIKE_MS}ms`,
                }}
              >
                <span className="h-[0.08em] w-full bg-primary" />
              </span>
            </span>
            {NOUN}
            {tail}
            <span
              className={`ml-[0.1em] inline-block h-[1.05em] w-[0.5em] rounded-[1px] bg-primary align-[-0.2em] ${
                writing ? "ck-caret-writing" : "ck-caret-thinking"
              }`}
            />
          </>
        )}
      </span>
    </p>
  );
}
