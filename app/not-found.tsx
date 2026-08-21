import Link from "next/link";

import {
  Button,
  Eyebrow,
  Inspector,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "@/components/cksui";
import { caseStudies } from "@/lib/content/work";
import { site } from "@/lib/site";

/**
 * Not found, inside the site's own chrome.
 *
 * At the root rather than in the (site) group, because an unmatched URL never
 * reaches a route group — group folders do not create path segments, so their
 * `not-found` only catches `notFound()` calls from inside them. This is the one
 * that a mistyped or stale link actually lands on, and it renders in the root
 * layout, so it carries the header and footer itself.
 *
 * Next's default is an unstyled black-and-white page with no way back — exactly
 * the wrong thing to hand someone who followed a link from an old résumé.
 *
 * It offers the case studies rather than only apologising. A dead end is a
 * navigation problem, and the fix for a navigation problem is somewhere to go.
 */
export default function NotFound() {
  const work = caseStudies.map(({ slug, title }) => ({ slug, title }));

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SkipLink>Skip to content</SkipLink>
      <SiteHeader work={work} />

      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-page flex-1 flex-col justify-center px-6 py-20 sm:px-10"
      >
        <Eyebrow tone="primary">404</Eyebrow>

        <h1 className="mt-3 font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
          That page doesn&rsquo;t exist
        </h1>

        <p className="mt-5 max-w-measure text-pretty text-muted-foreground">
          The link may be out of date, or I may have moved something. Neither is
          your fault.
        </p>

        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/">Back to the homepage →</Link>
          </Button>
        </div>

        <section
          aria-labelledby="nf-work"
          className="mt-16 border-t border-border pt-8"
        >
          <Eyebrow asChild>
            <h2 id="nf-work">Or read some work</h2>
          </Eyebrow>

          <ul className="mt-4 space-y-1">
            {caseStudies.map((study) => (
              <li key={study.slug}>
                <Link
                  href={`/work/${study.slug}`}
                  className="inline-flex min-h-tap items-center rounded-sm text-pretty text-foreground underline decoration-input underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {study.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter>© {site.name} · Designed and built by me</SiteFooter>
      <Inspector />
    </div>
  );
}
