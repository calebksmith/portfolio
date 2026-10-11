import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * A result, figure first.
 *
 * Outcomes written as sentences bury the number in the middle of a line. Here
 * the figure is the largest thing in the tile and the label says what it
 * counts, read in that order: "+65%, Daily 5 completions among participants".
 * Anything that qualifies the number belongs in the label or the line after
 * the group, never dropped.
 *
 * `StatGroup` lays tiles out as many across as fit, so two, three, or four
 * results sit evenly without a per-count rule. It sets no outer margin or
 * width: where the group sits is the caller's decision.
 */
export function StatGroup({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="stat-group"
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-3",
        className,
      )}
      {...props}
    />
  );
}

export function Stat({
  value,
  label,
  className,
  ...props
}: Omit<ComponentProps<"li">, "children"> & {
  /** The figure itself: "+65%", "10% → 80–90%", "4x". */
  value: string;
  /** What the figure counts, with any caveat that belongs to it. */
  label: string;
}) {
  return (
    <li
      data-slot="stat"
      className={cn(
        "rounded-lg border border-border bg-card p-4 text-card-foreground",
        className,
      )}
      {...props}
    >
      <p className="font-display text-3xl leading-none font-semibold tracking-[-0.02em] text-balance">
        {value}
      </p>
      <p className="mt-2 text-sm text-pretty text-muted-foreground">{label}</p>
    </li>
  );
}
