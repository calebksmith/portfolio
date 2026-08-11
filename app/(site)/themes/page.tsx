import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ThemeSwitcher } from "@/components/cksui";
import { showFullSite } from "@/lib/flags";

import { ContrastTable } from "./contrast-table";

export const metadata: Metadata = {
  title: "Themes and contrast",
  description:
    "Every color on this site comes from a token, and every token pair is measured.",
};

export default async function ThemesPage() {
  if (!showFullSite()) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-18 sm:px-10">
      <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
        Themes and contrast
      </h1>
      <p className="mt-5 max-w-[52ch] text-pretty text-muted-foreground">
        Every color on this site comes from a token, and every token pair is
        measured. Switch themes or modes and the numbers below update —
        including the ones that would fail.
      </p>

      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Current theme
        </h2>
        <ThemeSwitcher className="mt-4" />
      </section>

      <section className="mt-12">
        <h2 className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Contrast pairs
        </h2>
        <ContrastTable />

        <div className="mt-8 max-w-[62ch] space-y-3 text-xs text-muted-foreground">
          <p>
            Contrast is measured between a surface and the text or icon drawn on
            it, not between individual colors. Pairing them in the token layer
            means a component is legible in every theme without anyone
            remembering which color goes where.
          </p>
          <p>
            WCAG AA requires 4.5:1 for body text and 3:1 for large text. AAA
            requires 7:1.
          </p>
          <p>
            The high-contrast theme is built to clear AAA on every pair, for
            anyone who needs more separation than the default themes provide.
          </p>
        </div>
      </section>
    </main>
  );
}
