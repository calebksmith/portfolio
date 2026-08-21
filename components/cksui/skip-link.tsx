import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * The first thing in the tab order, and invisible until it is focused.
 *
 * WCAG 2.4.1 (Bypass Blocks, Level A). Every page puts a breadcrumb, a menu and
 * two instruments before the content — a keyboard user was tabbing through all
 * of it on every page, forever, with no way past.
 *
 * `sr-only focus:not-sr-only` rather than an offscreen transform: the link has
 * to be genuinely in the accessibility tree and the tab order at all times, and
 * only its *appearance* is conditional. Hiding it with `display: none` or
 * `visibility: hidden` would take it out of the tab order, which is the one
 * thing it exists to be in.
 */
export function SkipLink({
  href = "#main",
  className,
  children,
  ...props
}: ComponentProps<"a">) {
  return (
    <a
      href={href}
      data-slot="skip-link"
      className={cn(
        "sr-only",
        // Once focused it becomes a real control, above the sticky header.
        "focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50",
        "focus:inline-flex focus:min-h-tap focus:items-center focus:rounded-md",
        "focus:bg-primary focus:px-4 focus:text-sm focus:font-medium focus:text-primary-foreground",
        "focus:outline-2 focus:outline-offset-2 focus:outline-ring",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
