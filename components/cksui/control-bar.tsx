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
        // No borders at all — not around the cluster, not between items. The
        // header already carries a bottom rule, and any edge here reads as a
        // second barrier stacked on it. Grouping comes from proximity and the
        // shared hover treatment, which is enough for a handful of controls.
        "flex items-stretch gap-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Ghost by default — no border, no fill until hovered. Instruments live in a
 * header that already carries a rule, so an outlined control there stacks
 * barriers. Presence comes from the label and the hover surface instead.
 *
 * The focus ring is inset (`-outline-offset`) so it never spills past the
 * header's own edge.
 */
const CONTROL_ITEM = [
  "inline-flex min-h-tap items-center justify-center gap-2 px-2.5 sm:px-3",
  "text-label uppercase tracking-label transition-colors rounded-sm",
  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
].join(" ");

/**
 * The three states every instrument has, in one place so the two components
 * cannot drift apart.
 *
 *   rest    nothing. The header is a translucent, blurred bar; an instrument
 *           that paints its own opaque fill at rest shows as a patch whose
 *           edges move as content scrolls underneath it. That is what the
 *           unpressed toggle used to do, with `bg-background`, and it is why a
 *           line appeared to come and go along its bottom edge.
 *   hover   the muted surface. Present on the active state too — a control
 *           that stops responding once it is on has stopped saying it is a
 *           control.
 *   active  the accent pair, deepening one step on hover. Same `accent-hover`
 *           token the secondary button uses, so "on" responds to the pointer
 *           the way every other filled surface on the site does.
 */
const CONTROL_REST = "text-foreground hover:bg-muted hover:text-muted-foreground";
const CONTROL_ACTIVE =
  "bg-accent text-accent-foreground hover:bg-accent-hover";

/**
 * An instrument that opens something — a panel, a menu.
 *
 * The label collapses to screen-reader-only below `sm`, so the cluster stays a
 * row of icons on a phone without losing its accessible names.
 */
export function ControlButton({
  icon,
  label,
  active = false,
  className,
  ...props
}: ComponentProps<"button"> & {
  icon: ReactNode;
  label: string;
  /**
   * Whether the thing it opens is currently open. A trigger that looks
   * untouched while its panel is on screen makes the panel look like it
   * belongs to something else.
   */
  active?: boolean;
}) {
  return (
    <button
      type="button"
      data-slot="control-button"
      // Not aria-pressed: this opens a panel rather than turning a mode on, and
      // the panel's own visibility is what assistive technology follows.
      data-state={active ? "open" : "closed"}
      className={cn(
        CONTROL_ITEM,
        active ? CONTROL_ACTIVE : CONTROL_REST,
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
        pressed ? CONTROL_ACTIVE : CONTROL_REST,
        className,
      )}
      {...props}
    >
      {icon}
      <span className="sr-only sm:not-sr-only">{label}</span>
    </button>
  );
}
