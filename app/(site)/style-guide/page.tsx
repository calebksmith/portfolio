import type { Metadata } from "next";

import { Badge, ThemeSwitcher } from "@/components/cksui";
import { showFullSite } from "@/lib/flags";
import { notFound } from "next/navigation";

import { ContrastTable } from "./contrast-table";
import { specimens } from "./_components";
import { TokenTable } from "./token-table";

export const metadata: Metadata = {
  title: "Style guide",
  description:
    "The tokens, type, and components this site is built from — measured live, in whichever theme you are viewing.",
};

/**
 * The style guide.
 *
 * A Storybook substitute that lives inside the site it documents. That is the
 * point: components are imported from cksUI and rendered live, so a broken
 * component breaks visibly here, and every measured value is read from the
 * running page rather than transcribed. Documentation that keeps its own copy
 * of the values is documentation that can lie.
 *
 * It also absorbs the old /themes page, which was the same idea at smaller
 * scope — one place to check the system rather than two.
 */

const SECTIONS = [
  { id: "theme", label: "Theme" },
  { id: "color", label: "Color" },
  { id: "contrast", label: "Contrast" },
  { id: "typography", label: "Typography" },
  { id: "components", label: "Components" },
] as const;

export default async function StyleGuidePage() {
  if (!showFullSite()) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14 sm:px-10">
      <header className="border-b border-border pb-8">
        <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
          Style guide
        </h1>
        <p className="mt-5 max-w-[58ch] text-pretty text-muted-foreground">
          Every color on this site comes from a token, and every token pair is
          measured. Switch themes or modes and the numbers below update —
          including the ones that would fail. Components are rendered from the
          same library the site is built from, so nothing here is a screenshot.
        </p>
      </header>

      <div className="mt-10 gap-10 lg:grid lg:grid-cols-[12rem_1fr]">
        {/* Sticky index. A <nav> of in-page links, so it works without JS and
            reading order stays sensible on a phone, where it sits above. */}
        <nav
          aria-label="Style guide sections"
          className="mb-8 lg:sticky lg:top-20 lg:mb-0 lg:self-start"
        >
          <ul className="flex flex-wrap gap-x-4 gap-y-1 lg:flex-col lg:gap-y-1">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-tap items-center text-xs uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-16">
          <Section id="theme" title="Theme">
            <p className="max-w-[62ch] text-pretty text-muted-foreground">
              Three themes across light and dark, applied with{" "}
              <Code>data-theme</Code> and <Code>data-mode</Code> on{" "}
              <Code>&lt;html&gt;</Code>. Each is the same token names with
              different values, which is what makes the high-contrast theme a
              value swap rather than a rewrite. The preference is a cookie, read
              by a script before first paint — no browser storage, no flash.
            </p>
            <div className="mt-6 rounded-lg border border-border bg-card p-5">
              <ThemeSwitcher />
            </div>
          </Section>

          <Section id="color" title="Color">
            <p className="max-w-[62ch] text-pretty text-muted-foreground">
              Colors are not a flat palette. Every surface has a paired
              foreground, so a component written as{" "}
              <Code>bg-card text-card-foreground</Code> is legible in every theme
              without anyone remembering which color goes where. Values below are
              read from the running page.
            </p>
            <TokenTable />
          </Section>

          <Section id="contrast" title="Contrast">
            <p className="max-w-[62ch] text-pretty text-muted-foreground">
              Contrast is measured between a surface and the text or icon drawn
              on it, not between individual colors. WCAG AA requires 4.5:1 for
              body text and 3:1 for large text. AAA requires 7:1. The
              high-contrast theme is built to clear AAA on every pair.
            </p>
            <ContrastTable />
            <p className="mt-6 max-w-[62ch] text-xs text-muted-foreground">
              The same math runs at build time in{" "}
              <Code>npm run check:contrast</Code>, reading{" "}
              <Code>globals.css</Code> directly, so this page and the gate cannot
              disagree. Note that <Code>--ck-border</Code> is not held to 3:1:
              WCAG 1.4.11 governs control boundaries, not decorative hairlines,
              which is why <Code>--ck-input</Code> exists separately.
            </p>
          </Section>

          <Section id="typography" title="Typography">
            <p className="max-w-[62ch] text-pretty text-muted-foreground">
              Archivo carries display type — headings and the name. IBM Plex Mono
              carries everything else: body copy, labels, tables, UI. The
              inversion of the usual serif-on-cream portfolio is deliberate.
            </p>

            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
              {[
                {
                  label: "Display · Archivo 600",
                  className:
                    "font-display text-3xl font-semibold tracking-[-0.03em]",
                  sample: "Design systems and the standards behind them",
                },
                {
                  label: "Heading · Archivo 600",
                  className:
                    "font-display text-lg font-semibold tracking-[-0.01em]",
                  sample: "VimUI, a design system across four platforms",
                },
                {
                  label: "Body · IBM Plex Mono 400",
                  className: "text-sm",
                  sample:
                    "I design products and write the frontend code they're built from.",
                },
                {
                  label: "Label · IBM Plex Mono 400, uppercase, 0.14em",
                  className:
                    "text-xs uppercase tracking-[0.14em] text-muted-foreground",
                  sample: "Selected work",
                },
              ].map((row) => (
                <div key={row.label} className="p-5">
                  <p className="mb-3 text-xs text-muted-foreground">
                    {row.label}
                  </p>
                  <p className={`${row.className} text-card-foreground`}>
                    {row.sample}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="components" title="Components">
            <p className="max-w-[62ch] text-pretty text-muted-foreground">
              cksUI — this site&rsquo;s component library. Built on
              shadcn/ui&rsquo;s patterns as source copied in and owned, not as an
              installed dependency, with every value rewritten onto the tokens
              above. Every component declares a <Code>data-slot</Code>, the same
              convention VimUI uses, which is what the inspector overlay will
              read.
            </p>

            <div className="mt-8 space-y-10">
              {specimens.map((specimen) => (
                <article
                  key={specimen.id}
                  id={specimen.id}
                  className="scroll-mt-20 border-t border-border pt-6"
                >
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground">
                      {specimen.name}
                    </h3>
                    <Badge>data-slot=&quot;{specimen.slot}&quot;</Badge>
                  </div>

                  <p className="mt-2 max-w-[62ch] text-pretty text-muted-foreground">
                    {specimen.description}
                  </p>

                  {specimen.notes ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {specimen.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-5 rounded-lg border border-border bg-card p-5">
                    {specimen.demo}
                  </div>
                </article>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20">
      <h2
        id={`${id}-heading`}
        className="mb-4 font-display text-2xl font-semibold tracking-[-0.02em] text-foreground"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-sm bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground">
      {children}
    </code>
  );
}
