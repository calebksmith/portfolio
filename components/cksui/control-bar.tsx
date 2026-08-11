import type { ComponentProps, ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * The site control cluster.
 *
 * A single bordered unit holding the instruments that act on the page rather
 * than navigate it — appearance now, the inspector toggle at step 9. Grouping
 * them into one bounded object is what makes it read as a control surface
 * instead of loose buttons: the border says "these belong together and they are
 * not part of the path."
 *
 * `role="group"` with a label means a screen reader announces the cluster once
 * rather than leaving two unrelated buttons floating in the header.
 */
export function ControlBar({
  className,
  children,
  label = "Site controls",
  ...props
}: ComponentProps<"div"> & { label?: string }) {
  return (
    <div
      data-slot="control-bar"
      role="group"
      aria-label={label}
      className={cn(
        "flex items-stretch divide-x divide-border overflow-hidden rounded-md border border-input bg-background",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

const CONTROL_ITEM = [
  "inline-flex min-h-tap items-center justify-center gap-2 px-2.5 sm:px-3",
  "text-xs uppercase tracking-[0.14em] transition-colors",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
].join(" ");

/**
 * An instrument that opens something — a panel, a menu.
 *
 * The label collapses to screen-reader-only below `sm`, so the cluster stays a
 * row of icons on a phone without losing its accessible names.
 */
export function ControlButton({
  icon,
  label,
  className,
  ...props
}: ComponentProps<"button"> & { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      data-slot="control-button"
      className={cn(
        CONTROL_ITEM,
        "text-foreground hover:bg-muted hover:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {icon}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </button>
  );
}

/**
 * An instrument that turns something on and stays on — the inspector overlay.
 *
 * `aria-pressed` rather than a checkbox, because this toggles a mode on the
 * page rather than submitting a value. When pressed it takes the accent pair,
 * so the state is visible in the control and not only in the page's behavior.
 */
export function ControlToggle({
  icon,
  label,
  pressed,
  className,
  ...props
}: ComponentProps<"button"> & {
  icon: ReactNode;
  label: string;
  pressed: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="control-toggle"
      aria-pressed={pressed}
      className={cn(
        CONTROL_ITEM,
        pressed
          ? "bg-accent text-accent-foreground"
          : "text-foreground hover:bg-muted hover:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {icon}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </button>
  );
}
