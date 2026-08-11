import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs whitespace-nowrap",
  {
    variants: {
      variant: {
        outline: "border border-border text-muted-foreground",
        solid: "bg-primary text-primary-foreground",
        soft: "bg-accent text-accent-foreground",
      },
    },
    defaultVariants: { variant: "outline" },
  },
);

export type BadgeProps = ComponentProps<"span"> & VariantProps<typeof badge>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badge({ variant }), className)}
      {...props}
    />
  );
}
