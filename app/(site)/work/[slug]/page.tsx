import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/components/cksui";
import { Mdx } from "@/components/mdx";
import { caseStudies, getCaseStudy } from "@/lib/content/work";

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

  // No breadcrumb in the page — the site header carries the path, and the Work
  // crumb in it lists the other case studies.
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-10">
      <article>
        <header className="border-b border-border pb-8">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {study.role} · {study.year}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
            {study.title}
          </h1>
          <p className="mt-5 max-w-[52ch] text-lg text-pretty text-muted-foreground">
            {study.summary}
          </p>

          {study.platforms.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {study.platforms.map((platform) => (
                <li key={platform}>
                  <Badge>{platform}</Badge>
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <Mdx source={study.body} />
      </article>
    </main>
  );
}
