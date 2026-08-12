"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  buildTokenIndex,
  inspectElement,
  nearestSlot,
  type Inspection,
} from "@/lib/inspect";
import { INSPECT_ATTRIBUTE } from "@/lib/theme";

import { useHtmlAttribute } from "./lib/use-html-attribute";

/**
 * The design-system inspector.
 *
 * Turned on from the header's control cluster, it annotates the live page:
 * point at or tab to anything and it reports which component you are on, which
 * tokens its rendered values resolve back to, and the rule that governs it.
 *
 * Two things make it more than a novelty:
 *
 *   - It reads `getComputedStyle` and resolves values *backwards* to token
 *     names, so it reports on the token layer rather than dumping CSS. A value
 *     that resolves to no token is a violation of the rule in CLAUDE.md, and it
 *     says so rather than hiding it.
 *   - It is keyboard operable. On an accessibility-forward site, an inspector
 *     that only answers a mouse would undercut the argument it exists to make —
 *     so while it is on, every `[data-slot]` becomes a tab stop.
 */
export function Inspector() {
  const active = useHtmlAttribute<"on" | "off">(INSPECT_ATTRIBUTE, "off");

  // The overlay holds all the state, so turning inspection off unmounts it and
  // discards that state as a consequence. Clearing it by hand in an effect
  // would mean a second copy of "is this on" that can disagree with the DOM.
  return active === "on" ? <InspectorOverlay /> : null;
}

function InspectorOverlay() {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const inspect = useCallback((element: HTMLElement | null) => {
    if (!element) return;
    targetRef.current = element;
    setInspection(inspectElement(element, buildTokenIndex()));
    setRect(element.getBoundingClientRect());
  }, []);

  /**
   * Makes every slot a tab stop while inspecting, and restores the DOM exactly
   * on exit. Recording what was there beforehand matters — some slots are
   * already focusable, and clobbering their tabindex would be a real
   * regression left behind by a debugging tool.
   */
  useEffect(() => {
    const slots = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slot]"),
    );
    const previous = new Map<HTMLElement, string | null>();

    for (const slot of slots) {
      previous.set(slot, slot.getAttribute("tabindex"));
      if (slot.tabIndex < 0) slot.tabIndex = 0;
    }

    return () => {
      for (const [slot, tabindex] of previous) {
        if (tabindex === null) slot.removeAttribute("tabindex");
        else slot.setAttribute("tabindex", tabindex);
      }
    };
  }, []);

  /** Pointer and focus both drive inspection; Escape leaves. */
  useEffect(() => {
    const onPointerOver = (event: PointerEvent) =>
      inspect(nearestSlot(event.target));
    const onFocusIn = (event: FocusEvent) => inspect(nearestSlot(event.target));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      document.documentElement.removeAttribute(INSPECT_ATTRIBUTE);
    };

    // The highlight is drawn in viewport coordinates, so it has to follow the
    // element when the page moves under it.
    const reposition = () => {
      if (targetRef.current) setRect(targetRef.current.getBoundingClientRect());
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);

    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [inspect]);

  return (
    <>
      {rect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[70] rounded-sm outline-2 outline-offset-2 outline-ring"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ) : null}

      <aside
        data-slot="inspector-panel"
        aria-label="Inspector"
        className="fixed bottom-4 left-4 z-[71] w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-input bg-card p-4 text-card-foreground shadow-lg"
      >
        {/*
          Announced politely: the panel changes as the pointer moves, and an
          assertive region would interrupt continuously.
        */}
        <div aria-live="polite">
          {inspection ? (
            <>
              <p className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                Component
              </p>
              <p className="mt-1 font-display text-base font-semibold tracking-[-0.01em]">
                {inspection.slot}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  &lt;{inspection.tag}&gt;
                </span>
              </p>

              <p className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                Tokens
              </p>
              <ul className="mt-1 space-y-1">
                {inspection.tokens.map((entry) => (
                  <li
                    key={entry.property}
                    className="flex items-baseline justify-between gap-3 text-xs"
                  >
                    <span className="text-muted-foreground">{entry.label}</span>
                    {entry.token ? (
                      <span className="text-right">--ck-{entry.token}</span>
                    ) : (
                      // Saying so is the point: an unresolvable value is a
                      // violation of the token rule, not a gap in the tool.
                      <span className="text-right text-muted-foreground">
                        {entry.value} — no token
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {inspection.rule ? (
                <>
                  <p className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                    Rule
                  </p>
                  <p className="mt-1 text-xs text-pretty text-muted-foreground">
                    {inspection.rule}
                  </p>
                </>
              ) : null}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Hover or tab to any element to inspect it.
            </p>
          )}
        </div>

        <p className="mt-4 border-t border-border pt-3 text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
          Esc to exit
        </p>
      </aside>
    </>
  );
}
