import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge resolves conflicts by name, and it only knows Tailwind's
 * default scale. A name it doesn't know, it guesses at — and it guessed that
 * `text-label`, a type size, was a colour. So `text-muted-foreground
 * text-label` merged to `text-label`, and every eyebrow on the site lost its
 * tone without a warning.
 *
 * The theme's own names are listed here. `cn.test.ts` reads `globals.css` and
 * fails when one is missing, so a new token can't bring the bug back.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["label", "label-sm"],
      tracking: ["label"],
      shadow: ["lift"],
      container: ["measure", "measure-wide", "page"],
      // `h-tap`, `min-h-tap`, `min-w-tap`, `size-tap`: sizes, not spacing
      // tokens, but tailwind-merge sorts sizes by the spacing scale.
      spacing: ["tap"],
    },
  },
});

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
