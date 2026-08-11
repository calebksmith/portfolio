import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, letting a later Tailwind utility win over an earlier one
 * in the same group.
 *
 * Without this, `cn("p-2", "p-4")` would emit both and the winner would depend
 * on stylesheet order rather than call order — which makes a component's
 * `className` prop unreliable as an override.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
