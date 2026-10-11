import { getCaseStudies } from "@/lib/content/work";
import { getLocale, getMessages } from "@/lib/i18n/server";

import { CaseStudyCard } from "./case-study-card";
import { Reveal } from "./reveal";

/**
 * The work at Vimocity, as cards.
 *
 * The section opens by saying what Vimocity is and what the team is working
 * toward, so the reader has context before the cards. The cards arrive in the
 * hand-picked order set by each study's `order`, and each one names who the
 * work serves in a small label, so the grouping shows without headings
 * breaking up the grid.
 */
export async function WorkList() {
  const locale = await getLocale();
  const t = (await getMessages()).home.work;
  const studies = getCaseStudies(locale);

  return (
    <>
      {/* The section's heading: the work section is labelled by it, and the
          cards under it are h3s. */}
      <h2
        id="work-heading"
        className="font-display text-3xl font-semibold tracking-[-0.02em] text-foreground"
      >
        {t.heading}
      </h2>
      <p className="mt-3 max-w-measure-wide text-pretty text-muted-foreground">
        {t.intro}
      </p>

      {/* Two across at most: the descriptor is a full phrase in a wide
          monospace face, and four across cut it to a few words a line. */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {studies.map((study, index) => (
          <Reveal key={study.slug} index={index}>
            <CaseStudyCard {...study} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
