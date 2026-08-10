import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { after } from "next/server";

import { Mdx } from "@/components/mdx";
import { showFullSite } from "@/lib/flags";
import {
  getSharedResumeByToken,
  recordResumeView,
} from "@/lib/repositories/resumes";
import { site } from "@/lib/site";

/**
 * A tailored CV, reachable only by its share token.
 *
 * The URL is the credential — there is no login, because asking a recruiter to
 * create an account to read your CV is a good way to not have your CV read.
 * See docs/decisions/0005-shareable-cvs.md for what that costs and why it is
 * an acceptable trade.
 */

export const dynamic = "force-dynamic";

/**
 * Never index a shared CV. Without this, a token pasted into a crawled page
 * would put a link intended for one recruiter into search results.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

function formatRange(start: string, end: string | null) {
  const format = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  return `${format(start)} — ${end ? format(end) : "Present"}`;
}

export default async function SharedCvPage({
  params,
}: PageProps<"/cv/[token]">) {
  // No database in production yet, so this would only ever 500. Same 404 as
  // every other miss. See lib/flags.ts.
  if (!showFullSite()) notFound();

  const { token } = await params;
  const resume = await getSharedResumeByToken(token);

  // Revoked, expired, draft, and nonexistent all land here identically.
  if (!resume) notFound();

  const requestHeaders = await headers();

  /**
   * Log the view after the response is sent. `after()` keeps the recruiter's
   * page load off the write path entirely.
   */
  after(async () => {
    await recordResumeView({
      resumeId: resume.id,
      ip:
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: requestHeaders.get("user-agent"),
      referrer: requestHeaders.get("referer"),
    });
  });

  // Bullets chosen for this CV, grouped by the job they belong to.
  const chosenHighlights = new Map<string, typeof resume.highlights>();
  for (const entry of resume.highlights) {
    const list = chosenHighlights.get(entry.highlight.positionId) ?? [];
    list.push(entry);
    chosenHighlights.set(entry.highlight.positionId, list);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10">
      <header className="border-b border-rule pb-8">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.03em] text-ink">
          {site.name}
        </h1>
        {resume.headline ? (
          <p className="mt-3 text-lg text-ink-muted">{resume.headline}</p>
        ) : null}
        {resume.targetRole ? (
          <p className="mt-4 text-xs uppercase tracking-[0.14em] text-ink-faint">
            Prepared for {resume.targetRole}
            {resume.targetCompany ? ` · ${resume.targetCompany}` : ""}
          </p>
        ) : null}
      </header>

      {resume.summary ? (
        <section className="pt-8">
          <Mdx source={resume.summary} />
        </section>
      ) : null}

      {resume.skills.length > 0 ? (
        <section className="pt-10">
          <h2 className="text-xs uppercase tracking-[0.14em] text-ink-faint">
            Selected skills
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {resume.skills.map((entry) => (
              <li
                key={entry.skillId}
                className="rounded-sm border border-rule px-2 py-1 text-xs text-ink-muted"
              >
                {entry.skill.name}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {resume.positions.length > 0 ? (
        <section className="pt-12">
          <h2 className="text-xs uppercase tracking-[0.14em] text-ink-faint">
            Experience
          </h2>

          {resume.positions.map((entry) => {
            const bullets =
              chosenHighlights.get(entry.positionId) ??
              // No explicit selection for this job: fall back to every bullet.
              entry.position.highlights.map((highlight) => ({
                highlightId: highlight.id,
                highlight,
              }));

            return (
              <article key={entry.positionId} className="mt-8">
                <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                  {entry.position.title}
                  <span className="text-ink-faint"> · {entry.position.organization}</span>
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-faint">
                  {formatRange(entry.position.startDate, entry.position.endDate)}
                  {entry.position.location ? ` · ${entry.position.location}` : ""}
                </p>

                {(entry.summaryOverride ?? entry.position.summary) ? (
                  <p className="mt-3 max-w-[62ch] text-ink-muted">
                    {entry.summaryOverride ?? entry.position.summary}
                  </p>
                ) : null}

                {bullets.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-muted">
                    {bullets.map((bullet) => (
                      <li key={bullet.highlightId}>{bullet.highlight.content}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : null}

      {resume.caseStudies.length > 0 ? (
        <section className="pt-12">
          <h2 className="text-xs uppercase tracking-[0.14em] text-ink-faint">
            Selected work
          </h2>

          {resume.caseStudies.map((entry) => (
            <article key={entry.caseStudyId} className="mt-6">
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                {entry.caseStudy.title}
              </h3>
              <p className="mt-2 max-w-[62ch] text-ink-muted">
                {entry.blurbOverride ?? entry.caseStudy.summary}
              </p>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
