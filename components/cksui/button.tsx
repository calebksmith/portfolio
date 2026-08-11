import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "./lib/cn";

/**
 * Every variant pairs a surface with its foreground, so each one stays legible
 * in all three themes without a per-theme override.
 */
const button = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md font-medium transition-colors",
    // 44px minimum target, enforced here rather than remembered at call sites.
    "min-h-tap",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-accent text-accent-foreground hover:opacity-90",
        outline:
          "border border-input bg-background text-foreground hover:bg-muted hover:text-muted-foreground",
        ghost: "text-foreground hover:bg-muted hover:text-muted-foreground",
      },
      size: {
        // Padding varies; the 44px floor above does not.
        sm: "px-3 text-xs",
        md: "px-4 text-sm",
        lg: "px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof button> & {
    /** Render as the child element instead of a <button>, e.g. wrapping a Link. */
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      data-slot="button"
      className={cn(button({ variant, size }), className)}
      {...props}
    />
  );
}
