import type { ComponentProps, ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * A label/value list drawn with hairline rules.
 *
 * A <dl> rather than a table, because these are term/description pairs and not
 * tabular data — a screen reader should announce "Focus, design systems", not
 * "row 1, column 1".
 */
export function SpecList({ className, ...props }: ComponentProps<"dl">) {
  return (
    <dl
      data-slot="spec-list"
      className={cn("border-t border-border", className)}
      {...props}
    />
  );
}

export function SpecRow({
  label,
  children,
  className,
  ...props
}: Omit<ComponentProps<"div">, "children"> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="spec-row"
      className={cn(
        "grid grid-cols-1 gap-1 border-b border-border py-3 sm:grid-cols-[8rem_1fr] sm:gap-6",
        className,
      )}
      {...props}
    >
      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="flex items-center gap-2.5 text-foreground">{children}</dd>
    </div>
  );
}
