"use client";

import type { ReactNode } from "react";

import { cn } from "@/components/cksui";
import { useInView } from "@/components/cksui/lib/use-in-view";
import { useTypewriter } from "@/components/cksui/lib/use-typewriter";

/**
 * One phase of the build: a snippet that types itself, and the real components
 * it produces.
 *
 * `width` is what draws the double diamond. Discover and Develop diverge wide,
 * Define and Refine converge narrow — so the silhouette of the content *is* the
 * shape, rather than a diagram drawn beside it. Nothing here renders a diamond.
 *
 * The preview holds real cksUI components, so it is `inert`: they are focusable
 * and interactive, and a demonstration should not put stray tab stops between
 * the page's actual controls.
 */

const WIDTH = {
  /** Diverge — many inputs, fanned out. */
  wide: "max-w-3xl",
  /** Converge — one decision. */
  narrow: "max-w-sm",
} as const;

export function Phase({
  index,
  name,
  produces,
  code,
  width,
  children,
}: {
  index: string;
  name: string;
  produces: string;
  code: string;
  width: keyof typeof WIDTH;
  children: ReactNode;
}) {
  const { ref, inView } = useInView<HTMLElement>();
  const { text, complete, caret } = useTypewriter(code, inView);

  return (
    <section ref={ref} className="flex flex-col items-center">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-primary">{index}</span> · {name}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{produces}</p>

      <pre className="mt-5 w-full max-w-md overflow-x-auto rounded-lg border border-border bg-card p-4 text-xs leading-relaxed">
        <code>
          <span className="text-muted-foreground">{text}</span>
          {caret ? (
            <span className="ck-caret inline-block w-[1ch] bg-primary align-text-bottom">
              &nbsp;
            </span>
          ) : null}
        </code>
      </pre>

      {/* The output appears only once its code exists, so the causality reads
          as real rather than as two things animating side by side. */}
      <div
        inert
        className={cn(
          "mt-6 w-full transition-opacity duration-500",
          WIDTH[width],
          complete ? "opacity-100" : "opacity-0",
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** The hairline spine the phases thread onto. */
export function Spine({ tone = "solid" }: { tone?: "solid" | "dashed" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mx-auto h-12 w-px",
        tone === "dashed"
          ? "bg-[repeating-linear-gradient(to_bottom,var(--ck-border)_0_4px,transparent_4px_10px)]"
          : "bg-border",
      )}
    />
  );
}
