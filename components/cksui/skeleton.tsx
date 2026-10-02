import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * A placeholder block, sized to the content it stands in for.
 *
 * The guardrails work at Vimocity has a rule that loading states use skeletons
 * rather than each page inventing one; this is that rule, kept here. A skeleton
 * is only worth anything if it has the shape of the thing arriving — a
 * centred spinner tells you to wait, a skeleton tells you what for, and the
 * layout does not jump when the content lands.
 *
 * The pulse is opacity only, so it composites rather than repainting, and it
 * stops entirely under `prefers-reduced-motion` — a flashing block is worse
 * than a still one for anyone it affects.
 */
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("ck-skeleton rounded-sm bg-muted", className)}
      {...props}
    />
  );
}
