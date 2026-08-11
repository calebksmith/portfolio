import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * A small pulsing dot marking a status.
 *
 * Decorative by design: it is `aria-hidden`, the pulse is a no-op under
 * prefers-reduced-motion, and the dot is fully visible at rest. The adjacent
 * label always carries the meaning, so nothing here is communicated by color or
 * motion alone.
 */
export function StatusDot({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="status-dot"
      aria-hidden="true"
      className={cn("relative inline-flex size-2 shrink-0", className)}
      {...props}
    >
      <span className="ck-pulse absolute inset-0 rounded-full bg-primary" />
      <span className="absolute inset-0 rounded-full bg-primary opacity-40" />
    </span>
  );
}
