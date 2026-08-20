import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * The closing line for every public page.
 *
 * No rule above it. The page sections already end with their own spacing, and a
 * border on top of that reads as a second boundary — the same reason the
 * homepage dropped the divider between its sections. Distance does the
 * separating.
 *
 * `mt-auto` is what keeps it at the bottom of a short page without pinning it to
 * the viewport: the body and the site layout are both flex columns, so the
 * footer takes up the slack rather than floating over content.
 *
 * It carries no copy of its own — the line is passed in, so the one place the
 * name and year are written stays outside the component library.
 */
export function SiteFooter({
  className,
  children,
  ...props
}: ComponentProps<"footer">) {
  return (
    <footer
      data-slot="site-footer"
      // Modest top padding on purpose. Every page already ends with 3.5–6rem of
      // its own bottom padding, so the footer only has to add enough to read as
      // separate — matching a full section gap here would double it.
      className={cn("mt-auto px-6 pb-12 pt-10 sm:px-10", className)}
      {...props}
    >
      <p className="text-center text-xs text-muted-foreground">{children}</p>
    </footer>
  );
}
