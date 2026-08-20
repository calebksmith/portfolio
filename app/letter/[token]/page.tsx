import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { after } from "next/server";

import { Eyebrow } from "@/components/cksui";
import { Mdx } from "@/components/mdx";
import { getCaseStudy } from "@/lib/content/work";
import { showLetters } from "@/lib/flags";
import {
  getSharedLetterByToken,
  recordLetterView,
} from "@/lib/repositories/cover-letters";
import { site } from "@/lib/site";

/**
 * A cover letter, reachable only by its share token.
 *
 * The URL is the credential — there is no login, because asking a hiring
 * manager to create an account to read a cover letter is a good way to not have
 * it read. See docs/decisions/0005-cover-letters.md.
 *
 * HTML only, no PDF. A letter is a page someone opens once from an email; a
 * downloadable file is a second artifact of the same content that goes stale
 * the moment a sentence changes here.
 */

export const dynamic = "force-dynamic";

/**
 * Never index a shared letter. Without this, a token pasted into a crawled page
 * would put a letter written for one person into search results.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function SharedLetterPage({
  params,
}: PageProps<"/letter/[token]">) {
  // No database in production yet, so this would only ever 500. Same 404 as
  // every other miss. See lib/flags.ts.
  if (!showLetters()) notFound();

  const { token } = await params;
  const letter = await getSharedLetterByToken(token);

  // Revoked, expired, draft, and nonexistent all land here identically.
  if (!letter) notFound();

  const requestHeaders = await headers();

  /**
   * Log the view after the response is sent, so the reader's page load is never
   * on the write path.
   */
  after(async () => {
    await recordLetterView({
      letterId: letter.id,
      ip: requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: requestHeaders.get("user-agent"),
      referrer: requestHeaders.get("referer"),
    });
  });

  // Referenced by slug rather than foreign key — case studies are files.
  const referenced = letter.caseStudies
    .map((entry) => getCaseStudy(entry.slug))
    .filter((study) => study !== undefined);

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 sm:px-10">
      <header className="border-b border-border pb-8">
        <Eyebrow>
          {letter.role} · {letter.company}
        </Eyebrow>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.03em] text-balance text-foreground">
          {site.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{site.role}</p>
      </header>

      <article className="pt-8">
        {letter.recipient ? (
          <p className="mb-6 text-foreground">{letter.recipient},</p>
        ) : null}

        <Mdx source={letter.body} />
      </article>

      {referenced.length > 0 ? (
        <section className="mt-14 border-t border-border pt-8">
          <Eyebrow asChild>
            <h2>Most relevant work</h2>
          </Eyebrow>

          <ul className="mt-4 space-y-4">
            {referenced.map((study) => (
              <li key={study.slug}>
                <h3 className="font-display text-base font-semibold tracking-[-0.01em] text-foreground">
                  <Link
                    href={`/work/${study.slug}`}
                    className="underline decoration-input underline-offset-4 hover:decoration-primary"
                  >
                    {study.title}
                  </Link>
                </h3>
                <p className="mt-1 text-pretty text-muted-foreground">
                  {study.summary}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="mt-14 border-t border-border pt-6 text-xs text-muted-foreground">
        <Link
          href="/"
          className="underline decoration-input underline-offset-4 hover:text-foreground hover:decoration-primary"
        >
          {site.url.replace(/^https?:\/\//, "")}
        </Link>
      </footer>
    </main>
  );
}
