"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/cksui";
import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";

/**
 * Code becomes UI, live.
 *
 * TSX types itself on the left; the component on the right is a real cksUI
 * `<Button>` rendering from the props the typed code has produced so far — not
 * a picture of one, and not a mock. That is the whole argument: the design and
 * the code are the same act.
 *
 * The props are *derived from the typed text* rather than run on a parallel
 * timeline. Each frame's code is the source of truth for what renders, so the
 * two panes cannot drift out of sync, and the causality a viewer infers is
 * real rather than choreographed.
 */

/**
 * The sequence. Each frame is a complete snippet; the typewriter diffs from the
 * previous one, backspacing to the common prefix before typing forward — which
 * is what makes the third frame read as *editing* rather than retyping.
 */
const FRAMES = [
  { code: `<Button variant="primary" size="lg">\n  Continue\n</Button>`, hold: 2600 },
  { code: `<Button variant="outline" size="lg">\n  Continue\n</Button>`, hold: 2600 },
] as const;

const TYPE_MS = 34;
const DELETE_MS = 18;

/** What the typed text has declared so far. */
function propsFromCode(code: string) {
  const variant = /variant="(primary|outline|secondary|ghost)"/.exec(code)?.[1];
  const size = /size="(sm|md|lg)"/.exec(code)?.[1];

  // The label only exists once the closing bracket of the opening tag has been
  // typed and something follows it.
  const label = /^<Button[^>]*>\s*\n?\s*([A-Za-z ]+)/.exec(code)?.[1]?.trim();

  return {
    // A <Button> with no variant yet still renders — that is the component's
    // default, and showing it is more honest than hiding the element.
    started: code.startsWith("<Button"),
    variant: variant as "primary" | "outline" | undefined,
    size: size as "sm" | "md" | "lg" | undefined,
    label,
  };
}

function commonPrefix(a: string, b: string) {
  let index = 0;
  while (index < a.length && index < b.length && a[index] === b[index]) index++;
  return index;
}

export function CodeToUi() {
  const reduced = usePrefersReducedMotion();
  const [typed, setTyped] = useState("");

  /**
   * Reduced motion gets the finished snippet, derived during render rather than
   * written into state by an effect — there is only one source of truth for
   * what is shown, and no timer starts at all.
   */
  const shown = reduced ? FRAMES[0].code : typed;

  useEffect(() => {
    if (reduced) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let current = "";
    let frame = 0;

    const step = (fn: () => void, delay: number) => {
      timer = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
    };

    const run = () => {
      const target = FRAMES[frame].code;
      const shared = commonPrefix(current, target);

      if (current.length > shared) {
        current = current.slice(0, -1);
        setTyped(current);
        step(run, DELETE_MS);
        return;
      }

      if (current.length < target.length) {
        current = target.slice(0, current.length + 1);
        setTyped(current);
        // Pause at line ends, the way someone actually types.
        step(run, current.endsWith("\n") ? TYPE_MS * 6 : TYPE_MS);
        return;
      }

      step(() => {
        frame = (frame + 1) % FRAMES.length;
        run();
      }, FRAMES[frame].hold);
    };

    run();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced]);

  const { started, variant, size, label } = propsFromCode(shown);

  return (
    <figure className="m-0 overflow-hidden rounded-lg border border-input bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <span className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
          sign-in.tsx
        </span>
      </div>

      <div className="grid sm:grid-cols-2">
        <pre className="min-h-[9rem] overflow-x-auto border-b border-border p-4 text-xs leading-relaxed sm:border-r sm:border-b-0">
          <code>
            <Highlighted code={shown} />
            {reduced ? null : (
              <span className="ck-caret inline-block w-[1ch] bg-primary align-text-bottom">
                &nbsp;
              </span>
            )}
          </code>
        </pre>

        {/*
          `inert` keeps this out of the tab order and off the pointer: it is a
          real, focusable Button, and a decorative demo should not put a stray
          stop between the page's actual controls.
        */}
        <div
          inert
          className="flex min-h-[9rem] items-center justify-center bg-background p-4"
        >
          {started ? (
            <Button variant={variant} size={size}>
              {label ?? " "}
            </Button>
          ) : null}
        </div>
      </div>

      <figcaption className="border-t border-border px-4 py-3 text-xs text-pretty text-muted-foreground">
        The panel on the right is a real component from this site&rsquo;s
        library, rendering from the props the code has declared so far — not a
        mockup of one. Turn on <strong className="text-foreground">Inspect</strong>{" "}
        and it reports its own tokens.
      </figcaption>
    </figure>
  );
}

/**
 * Minimal highlighting: string literals take the accent, the tag name the
 * foreground, everything else recedes. Not a tokeniser — three colours is
 * enough to make the shape of the code legible at a glance, and a real
 * highlighter would be a dependency for decoration.
 */
function Highlighted({ code }: { code: string }) {
  const parts = code.split(/("(?:[^"\\]|\\.)*")/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('"')) {
          return (
            <span key={index} className="text-primary">
              {part}
            </span>
          );
        }
        return (
          <span key={index} className="text-muted-foreground">
            {part.split(/(<\/?Button)/g).map((chunk, chunkIndex) =>
              chunk.startsWith("<") ? (
                <span key={chunkIndex} className="text-foreground">
                  {chunk}
                </span>
              ) : (
                chunk
              ),
            )}
          </span>
        );
      })}
    </>
  );
}
