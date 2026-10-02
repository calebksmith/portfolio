import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";

import { Badge, Eyebrow, SpecList, SpecRow } from "@/components/cksui";
import { Mdx } from "@/components/mdx";
import { getCaseStudies, getCaseStudy } from "@/lib/content/work";
import { LOCALES, isLocale, localizePath } from "@/lib/i18n/config";
import { alternates } from "@/lib/i18n/metadata";
import { messages } from "@/lib/i18n/messages";

import { CaseStudyCard } from "../../_components/case-study-card";
import { CaseStudyChips } from "../../_components/case-study-chips";
import { Reveal } from "../../_components/reveal";

/**
 * Prerender every case study at build time. The content comes from files in the
 * repository, so the full set is known — there is nothing to render on demand.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((lang) =>
    getCaseStudies(lang).map((study) => ({ lang, slug: study.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const study = getCaseStudy(lang, slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    alternates: alternates(lang, `/work/${slug}`),
    openGraph: { title: study.title, description: study.summary },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const study = getCaseStudy(lang, slug);
  if (!study) notFound();
  const caseStudies = getCaseStudies(lang);
  const connected = study.connects
    .map((slug) => caseStudies.find((item) => item.slug === slug))
    .filter((item) => item !== undefined);
  const t = messages[lang];

  // The next three in order, wrapping past the end. Taking "the first three
  // that are not this one" would show the same trio on four of five pages.
  const index = caseStudies.findIndex((item) => item.slug === study.slug);
  const others = [1, 2, 3]
    .map((step) => caseStudies[(index + step) % caseStudies.length])
    .filter((item) => item.slug !== study.slug);

  // No breadcrumb in the page — the site header carries the path, and the Work
  // crumb in it lists the other case studies.
  return (
    /* Pairs with loading.tsx's `reveal-out`: the skeleton yields downward and
       the real content arrives from below, rather than one popping in where
       the other was. */
    <ViewTransition enter="reveal-in" default="none">
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-page px-6 py-14 sm:px-10"
      >
        <article>
          {/* The header answers, in order: what is it, did it work, and why it
              mattered — before any of the how. The descriptor is the only
              subheading; the summary sits in the page description instead,
              where search results and link previews read it. */}
          <header>
            <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
              {study.name}
              <span className="sr-only">: </span>
              <span className="mt-2 block text-xl font-normal tracking-[-0.01em] text-muted-foreground sm:text-2xl">
                {study.descriptor}
              </span>
            </h1>

            {/* The same chips as the card that led here, so the page opens on
                the facts the reader clicked. */}
            <CaseStudyChips
              impact={study.impact}
              role={study.role}
              year={study.year}
              className="mt-5"
            />

            {/* Who it helped and what it was worth, side by side: the user's
                side first, the business's second. A definition list, because
                each is a labelled answer. */}
            <dl className="mt-8 grid rounded-lg border border-border bg-card text-card-foreground sm:grid-cols-2">
              <div className="p-5 sm:p-6">
                <Eyebrow asChild tone="primary">
                  <dt>{t.caseStudy.userValue}</dt>
                </Eyebrow>
                <dd className="mt-2 text-pretty">{study.user}</dd>
              </div>
              <div className="border-t border-border p-5 sm:border-t-0 sm:border-l sm:p-6">
                <Eyebrow asChild tone="primary">
                  <dt>{t.caseStudy.businessValue}</dt>
                </Eyebrow>
                <dd className="mt-2 text-pretty">{study.business}</dd>
              </div>
            </dl>

            {/* Reference, not argument: what it was built with, and where it
                sits among the other case studies. The last rule closes the
                header. Baseline-aligned, so a label sits on the line of its
                first value even when the links are tap-height or wrap; the
                label column is widened so "Related case studies" stays on one
                line. */}
            <SpecList className="mt-8">
              {study.stack.length > 0 ? (
                <SpecRow
                  label={t.caseStudy.stack}
                  className="sm:grid-cols-[12rem_1fr] sm:items-baseline"
                >
                  <ul className="flex flex-wrap gap-1.5">
                    {study.stack.map((tool) => (
                      <li key={tool}>
                        <Badge>{tool}</Badge>
                      </li>
                    ))}
                  </ul>
                </SpecRow>
              ) : null}
              {connected.length > 0 ? (
                <SpecRow
                  label={t.caseStudy.connects}
                  className="sm:grid-cols-[12rem_1fr] sm:items-baseline"
                >
                  <ul className="flex flex-wrap gap-x-4">
                    {connected.map((other) => (
                      <li key={other.slug}>
                        <Link
                          href={localizePath(lang, `/work/${other.slug}`)}
                          className="inline-flex min-h-tap items-center rounded-sm text-sm text-primary underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          {other.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SpecRow>
              ) : null}
            </SpecList>
          </header>

          <Mdx source={study.body} locale={lang} trusted />
        </article>

        {/*
          The end of a case study is a dead end otherwise — the header's Work menu
          is the only way on, and it is a menu you have to know to open. Three
          tiles here mean finishing one piece of work offers the next.
        */}
        {others.length > 0 ? (
          <section
            aria-labelledby="more-work"
            className="mt-16 border-t border-border pt-10 pb-4"
          >
            <Eyebrow asChild>
              <h2 id="more-work">{t.caseStudy.moreWork}</h2>
            </Eyebrow>

            <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((other, index) => (
                <Reveal key={other.slug} index={index}>
                  <CaseStudyCard {...other} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </ViewTransition>
  );
}
