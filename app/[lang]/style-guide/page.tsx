import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Eyebrow, ThemeSwitcher } from "@/components/cksui";
import { RichText } from "@/components/rich-text";
import { isLocale } from "@/lib/i18n/config";
import { alternates } from "@/lib/i18n/metadata";
import { messages } from "@/lib/i18n/messages";

import { ContrastTable } from "./contrast-table";
import { Motion } from "./motion";
import { Playground } from "./playground";
import { SectionNav } from "./section-nav";
import { TokenTable } from "./token-table";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/style-guide">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = messages[lang].styleGuide;

  return {
    title: t.title,
    description: t.metaDescription,
    alternates: alternates(lang, "/style-guide"),
  };
}

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

const SECTION_IDS = [
  "theme",
  "color",
  "contrast",
  "typography",
  "motion",
  "components",
] as const;

/** The specimen rows, in order. The classes are the point; the copy is not. */
const TYPE_ROWS = [
  {
    key: "display",
    className: "font-display text-3xl font-semibold tracking-[-0.03em]",
  },
  {
    key: "heading",
    className: "font-display text-lg font-semibold tracking-[-0.01em]",
  },
  { key: "body", className: "text-sm" },
  {
    key: "label",
    className: "text-label uppercase tracking-label text-muted-foreground",
  },
] as const;

export default async function StyleGuidePage({
  params,
}: PageProps<"/[lang]/style-guide">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = messages[lang].styleGuide;
  const sections = SECTION_IDS.map((id) => ({ id, label: t.sections[id] }));

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-full max-w-page px-6 py-14 sm:px-10"
    >
      <header className="border-b border-border pb-8">
        <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
          {t.title}
        </h1>
        <p className="mt-5 max-w-measure-wide text-pretty text-muted-foreground">
          {t.intro}
        </p>
      </header>

      <div className="mt-10 gap-10 lg:grid lg:grid-cols-[12rem_1fr]">
        {/* Sticky index. In-page links, so they work without JS; the section
            you are reading is marked once JS is there. Reading order stays
            sensible on a phone, where it sits above the content. */}
        <SectionNav sections={sections} label={t.nav} />

        <div className="min-w-0 space-y-16">
          <Section id="theme" title={t.sections.theme}>
            <p className="max-w-measure-wide text-pretty text-muted-foreground">
              <RichText>{t.theme}</RichText>
            </p>
            <div className="mt-6 rounded-lg border border-border bg-card p-5">
              <ThemeSwitcher labels={messages[lang].themeSwitcher} />
            </div>
          </Section>

          <Section id="color" title={t.sections.color}>
            <p className="max-w-measure-wide text-pretty text-muted-foreground">
              <RichText>{t.color}</RichText>
            </p>
            <TokenTable labels={t.tokenTable} />
          </Section>

          <Section id="contrast" title={t.sections.contrast}>
            <p className="max-w-measure-wide text-pretty text-muted-foreground">
              {t.contrast}
            </p>
            <ContrastTable labels={t.contrastTable} />
            <p className="mt-6 max-w-measure-wide text-xs text-muted-foreground">
              <RichText>{t.contrastNote}</RichText>
            </p>
          </Section>

          <Section id="typography" title={t.sections.typography}>
            <p className="max-w-measure-wide text-pretty text-muted-foreground">
              {t.typography}
            </p>

            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
              {TYPE_ROWS.map((row) => (
                <div key={row.key} className="p-5">
                  <p className="mb-3 text-xs text-muted-foreground">
                    {t.typeSamples[row.key].label}
                  </p>
                  <p className={`${row.className} text-card-foreground`}>
                    {t.typeSamples[row.key].sample}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="motion" title={t.sections.motion}>
            <p className="max-w-measure-wide text-pretty text-muted-foreground">
              <RichText>{t.motion}</RichText>
            </p>
            <Motion labels={t.motionPanel} />
          </Section>

          <Section id="components" title={t.sections.components}>
            <p className="max-w-measure-wide text-pretty text-muted-foreground">
              <RichText>{t.components}</RichText>
            </p>

            <div className="mt-6 rounded-lg border border-input bg-card p-5">
              <Eyebrow>{t.inspectorEyebrow}</Eyebrow>
              <p className="mt-2 max-w-measure-wide text-pretty text-card-foreground">
                <RichText>{t.inspectorBody}</RichText>
              </p>
              <p className="mt-3 max-w-measure-wide text-pretty text-xs text-muted-foreground">
                <RichText>{t.inspectorNote}</RichText>
              </p>
            </div>

            <div className="mt-8">
              <Playground labels={t.playground} />
            </div>

            <p className="mt-4 max-w-measure-wide text-pretty text-xs text-muted-foreground">
              <RichText>{t.playgroundNote}</RichText>
            </p>
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
