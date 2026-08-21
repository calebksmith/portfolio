import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge, Eyebrow } from "@/components/cksui";
import { Mdx } from "@/components/mdx";
import { caseStudies, getCaseStudy } from "@/lib/content/work";

import { CaseStudyCard } from "../../_components/case-study-card";
import { Reveal } from "../../_components/reveal";

/**
 * Prerender every case study at build time. The content comes from files in the
 * repository, so the full set is known — there is nothing to render on demand.
 */
export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  return {
    title: study.title,
    description: study.summary,
    openGraph: { title: study.title, description: study.summary },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  // The next three in order, wrapping past the end. Taking "the first three
  // that are not this one" would show the same trio on four of five pages.
  const index = caseStudies.findIndex((item) => item.slug === study.slug);
  const others = [1, 2, 3]
    .map((step) => caseStudies[(index + step) % caseStudies.length])
    .filter((item) => item.slug !== study.slug);

  // No breadcrumb in the page — the site header carries the path, and the Work
  // crumb in it lists the other case studies.
  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-full max-w-page px-6 py-14 sm:px-10"
    >
      <article>
        <header className="border-b border-border pb-8">
          <Eyebrow>
            {study.role} · {study.year}
          </Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
            {study.title}
          </h1>
          <p className="mt-5 max-w-measure-wide text-lg text-pretty text-muted-foreground">
            {study.summary}
          </p>

          {study.stack.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {study.stack.map((tool) => (
                <li key={tool}>
                  <Badge>{tool}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <Mdx source={study.body} />
      </article>

      {/*
        The end of a case study is a dead end otherwise — the header's Work menu
        is the only way on, and it is a menu you have to know to open. Three
        tiles here mean finishing one piece of work offers the next.

        Rendered as `medium` regardless of each study's own weight: the index
        uses weight to build a bento, and this is a row of three equals.
      */}
      {others.length > 0 ? (
        <section
          aria-labelledby="more-work"
          className="mt-16 border-t border-border pt-10 pb-4"
        >
          <Eyebrow asChild>
            <h2 id="more-work">More of my work</h2>
          </Eyebrow>

          <div className="mt-5 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, index) => (
              <Reveal key={other.slug} index={index}>
                <CaseStudyCard {...other} weight="medium" />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
