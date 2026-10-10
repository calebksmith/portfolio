"use client";

import { useId, useRef, type ReactNode } from "react";

import { Eyebrow } from "./eyebrow";
import { cn } from "./lib/cn";

/**
 * A button that opens a modal with more context.
 *
 * Built on the platform's own `<dialog>` rather than an installed primitive:
 * `showModal()` already traps focus, makes the page behind it inert, closes on
 * Escape, and hands focus back to the button that opened it, and `closedby`
 * closes it on a click outside the panel. What's left is the styling and a
 * close button.
 *
 * No animation, so there is nothing for reduced motion to switch off.
 *
 * Every string arrives as a prop; the library ships no copy.
 */
export function Dialog({
  trigger,
  triggerClassName,
  eyebrow,
  title,
  closeLabel,
  children,
}: {
  /** What the button shows. It is the whole control, so make it say enough. */
  trigger: ReactNode;
  triggerClassName?: string;
  eyebrow?: string;
  title: string;
  /** Accessible name of the close button. */
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        data-slot="dialog-trigger"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
        className={cn(
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          triggerClassName,
        )}
      >
        {trigger}
      </button>

      <dialog
        ref={ref}
        data-slot="dialog"
        aria-labelledby={titleId}
        // Light dismiss: a click on the backdrop closes it, as Escape does.
        // Native, so there's no click handler on a non-interactive element.
        // Where a browser doesn't support it yet, Escape and the close button
        // still work.
        closedby="any"
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(34rem,calc(100%-2rem))] overflow-y-auto rounded-lg border border-border bg-card p-0 text-card-foreground shadow-lift backdrop:bg-background/80"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {eyebrow ? <Eyebrow tone="primary">{eyebrow}</Eyebrow> : null}
              <h2
                id={titleId}
                className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] text-balance"
              >
                {title}
              </h2>
            </div>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => ref.current?.close()}
              className="-mt-2 -mr-2 inline-flex min-h-tap min-w-tap shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 16 16"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </dialog>
    </>
  );
}
