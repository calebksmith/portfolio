"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  buildTokenIndex,
  inspectElement,
  inspectTarget,
  type Inspection,
} from "@/lib/inspect";
import { INSPECT_ATTRIBUTE } from "@/lib/theme";

import { Eyebrow } from "./eyebrow";

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
      inspect(inspectTarget(event.target));
    const onFocusIn = (event: FocusEvent) => inspect(inspectTarget(event.target));

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
          data-inspector-chrome=""
          className="pointer-events-none fixed z-30 rounded-sm outline-2 outline-offset-2 outline-ring"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ) : null}

      {/*
        Docked right, the way browser devtools dock — out of the reading column
        rather than sitting on top of it. Below the header in z-order, so the
        Inspect toggle stays reachable and you are never trapped in the mode.
      */}
      <aside
        data-inspector-chrome=""
        /* Labelled by the visible heading rather than a duplicate aria-label,
           so the name a screen reader announces is the one on screen. */
        aria-labelledby="ck-inspector-title"
        /* Starts flush beneath the header rather than padding itself down past
           it, so the title sits on the header's own baseline and the panel
           tracks the header if its height ever changes. */
        style={{
          top: "var(--ck-header-height)",
          width: "min(var(--ck-inspector-width), 100vw)",
        }}
        className="fixed right-0 bottom-0 z-30 overflow-y-auto border-l border-input bg-card p-5 text-card-foreground shadow-lg"
      >
        <header className="mb-5 border-b border-border pb-3">
          <h2
            id="ck-inspector-title"
            className="font-display text-sm font-semibold tracking-[-0.01em]"
          >
            Inspector
          </h2>
          <p className="mt-1 text-xs text-pretty text-muted-foreground">
            What each element is, and which tokens it resolves to.
          </p>
        </header>

        {/*
          Announced politely: the panel changes as the pointer moves, and an
          assertive region would interrupt continuously.
        */}
        <div aria-live="polite">
          {inspection ? (
            <>
              <Label>{inspection.slot ? "Component" : "Element"}</Label>
              <p className="mt-1 font-display text-base font-semibold tracking-[-0.01em]">
                {inspection.slot ?? `<${inspection.tag}>`}
                {inspection.slot ? (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    &lt;{inspection.tag}&gt;
                  </span>
                ) : null}
              </p>

              {inspection.owner ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  inside {inspection.owner}
                </p>
              ) : null}

              {inspection.tokens.length > 0 ? (
                <>
                  <Label className="mt-5">Tokens</Label>
                  <ul className="mt-1 space-y-1">
                    {inspection.tokens.map((entry) => (
                      <li
                        key={entry.property}
                        className="flex items-baseline justify-between gap-3 text-xs"
                      >
                        <span className="text-muted-foreground">
                          {entry.label}
                        </span>
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
                </>
              ) : null}

              {inspection.type ? (
                <>
                  <Label className="mt-5">Type</Label>
                  <ul className="mt-1 space-y-1 text-xs">
                    <Row label="Family" value={inspection.type.family} />
                    <Row label="Size" value={inspection.type.size} />
                    <Row label="Weight" value={inspection.type.weight} />
                    <Row label="Leading" value={inspection.type.lineHeight} />
                  </ul>
                </>
              ) : null}

              {inspection.rule ? (
                <>
                  <Label className="mt-5">Rule</Label>
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

        <Eyebrow size="sm" className="mt-6 border-t border-border pt-3">
          Esc to exit
        </Eyebrow>
      </aside>
    </>
  );
}

function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Eyebrow size="sm" className={className}>
      {children}
    </Eyebrow>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right tabular-nums">{value}</span>
    </li>
  );
}
