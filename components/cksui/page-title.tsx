import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * A page's one <h1>, in the display face.
 *
 * Five pages set this heading, and each had copied the same fluid size,
 * leading, and tracking. Here it is decided once, so a change to the title
 * scale is one edit rather than five that can drift.
 */
export function PageTitle({
  className,
  children,
  ...props
}: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-title"
      className={cn(
        "font-display text-[clamp(2rem,6vw,3rem)] leading-[1.03] font-semibold tracking-[-0.03em] text-balance text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
