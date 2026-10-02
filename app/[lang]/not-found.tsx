import Link from "next/link";

import { Button, Eyebrow } from "@/components/cksui";
import { getCaseStudies } from "@/lib/content/work";
import { localizePath } from "@/lib/i18n/config";
import { getLocale, getMessages } from "@/lib/i18n/server";

/**
 * Not found, inside the site's own chrome and in the reader's language.
 *
 * It lives under `[lang]`, so the root layout around it supplies the header and
 * footer. Two things land here: a `notFound()` call (an unknown case study
 * slug), and any URL that matches no route at all — `[...missing]` beside it
 * catches those and calls `notFound()`, because an unmatched URL would
 * otherwise never reach a layout and would get Next's bare default instead.
 *
 * Next's default is an unstyled black-and-white page with no way back — exactly
 * the wrong thing to hand someone who followed a link from an old résumé.
 *
 * It offers the case studies rather than only apologising. A dead end is a
 * navigation problem, and the fix for a navigation problem is somewhere to go.
 */
export default async function NotFound() {
  const locale = await getLocale();
  const t = (await getMessages()).notFound;
  const caseStudies = getCaseStudies(locale);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-page flex-1 flex-col justify-center px-6 py-20 sm:px-10"
    >
      <Eyebrow tone="primary">{t.eyebrow}</Eyebrow>

      <h1 className="mt-3 font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
        {t.title}
      </h1>

      <p className="mt-5 max-w-measure text-pretty text-muted-foreground">
        {t.body}
      </p>

      <div className="mt-8">
        <Button asChild size="lg">
          <Link href={localizePath(locale, "/")}>{t.home}</Link>
        </Button>
      </div>

      <section
        aria-labelledby="nf-work"
        className="mt-16 border-t border-border pt-8"
      >
        <Eyebrow asChild>
          <h2 id="nf-work">{t.work}</h2>
        </Eyebrow>

        <ul className="mt-4 space-y-1">
          {caseStudies.map((study) => (
            <li key={study.slug}>
              <Link
                href={localizePath(locale, `/work/${study.slug}`)}
                className="inline-flex min-h-tap items-center rounded-sm text-pretty text-foreground underline decoration-input underline-offset-4 transition-colors hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {study.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
