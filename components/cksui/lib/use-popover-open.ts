"use client";

import { useEffect, useState } from "react";

/**
 * Whether a native popover is currently open.
 *
 * The Popover API puts `:popover-open` on the panel, not on the button that
 * opened it — so a trigger has no way to know its own state without being told.
 * This listens to the panel's `toggle` event and reports it back.
 *
 * The CSS alternative is `button:has(+ [popover]:popover-open)`, which works and
 * needs no JavaScript, but it ties the styling to the two elements staying
 * siblings forever and puts half the component's appearance in a stylesheet the
 * component does not own. This keeps it in the component.
 *
 * Subscribed rather than read once: the platform closes these on Escape and on
 * click-outside without telling React, and a trigger left looking open after its
 * panel has gone is worse than one that never looked open at all.
 */
export function usePopoverOpen(id: string): boolean {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const panel = document.getElementById(id);
    if (!panel) return;

    // setState from an event callback, which is what effects are for — this is
    // subscribing to an external system, not deriving state from props.
    const onToggle = (event: Event) => {
      setOpen((event as Event & { newState?: string }).newState === "open");
    };

    panel.addEventListener("toggle", onToggle);
    return () => panel.removeEventListener("toggle", onToggle);
  }, [id]);

  return open;
}
