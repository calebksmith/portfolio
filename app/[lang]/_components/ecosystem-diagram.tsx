import Link from "next/link";

import { Dialog, Eyebrow, SpecList, SpecRow, cn } from "@/components/cksui";
import type { Area, CaseStudy } from "@/lib/content/frontmatter";
import { getCaseStudies } from "@/lib/content/work";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { getLocale, getMessages } from "@/lib/i18n/server";

/**
 * The product map — where each case study sits in Vimocity.
 *
 * Different people use Vimocity for different jobs, so the diagram is drawn by
 * persona: a column each for workers, safety leaders, and admins, with the
 * layers they all share — identity and the platform — spanning underneath.
 *
 * Abbreviated on purpose: names only, and only what a reader can open. Case
 * studies link to their page. The Daily 5 isn't a case study, but it is the
 * habit several of them build on, so it opens a short overview instead. Parts
 * of Vimocity with nothing behind them aren't drawn: a node you can't open is
 * a dead end. The cards in the other view carry the detail.
 *
 * Three columns from medium width up, so a tablet sees the map as a map rather
 * than a list; a phone stacks it.
 */

/** Case studies the Daily 5 overview points to, in order. */
const DAILY_5_RELATED = ["challenges", "playlists"] as const;

const PERSONAS: Area[] = ["workers", "safety-leaders", "admins"];
const SHARED: Area[] = ["identity", "platform"];

export async function EcosystemDiagram() {
  const locale = await getLocale();
  const t = (await getMessages()).home.work.ecosystem;
  const studies = getCaseStudies(locale);
  const inArea = (area: Area) => studies.filter((s) => s.area === area);

  return (
    <div>
      {/* Names the three columns as one group: the product, by who uses it.
          The bands below name themselves. */}
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-foreground">
          {t.group.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{t.group.note}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PERSONAS.map((area) => (
          <Area key={area} id={area} {...t.areas[area]}>
            <ul className="flex flex-col gap-2">
              {area === "workers" ? (
                <Daily5Node
                  t={t.daily5}
                  locale={locale}
                  related={DAILY_5_RELATED.flatMap(
                    (slug) => studies.find((s) => s.slug === slug) ?? [],
                  )}
                />
              ) : null}
              {inArea(area).map((study) => (
                <StudyNode key={study.slug} study={study} locale={locale} />
              ))}
            </ul>
          </Area>
        ))}
      </div>

      <div className="mt-4 grid gap-4">
        {SHARED.map((area) => (
          <Area key={area} id={area} {...t.areas[area]} wide>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {inArea(area).map((study, _, all) => (
                <StudyNode
                  key={study.slug}
                  study={study}
                  locale={locale}
                  // Alone in its band, a node takes two columns: it stays on
                  // the grid the rows share, and a longer name stays on one
                  // line instead of wrapping in a third of the row.
                  solo={all.length === 1}
                />
              ))}
            </ul>
          </Area>
        ))}
      </div>

      {/* The key. Swatches are decorative; the words carry the meaning. */}
      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-3 rounded-sm border border-input bg-card"
          />
          {t.legend.study}
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-3 rounded-sm border border-primary bg-accent"
          />
          {t.legend.overview}
        </li>
      </ul>
    </div>
  );
}

/** One area: who it serves (or what it is), the job, and what sits in it. */
function Area({
  id,
  label,
  note,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  note: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={`area-${id}`}
      className={cn(
        "rounded-lg border border-border p-4",
        wide && "md:grid md:grid-cols-[13rem_1fr] md:items-center md:gap-4",
      )}
    >
      <div className={cn(!wide && "mb-3", wide && "mb-3 md:mb-0")}>
        <Eyebrow id={`area-${id}`}>{label}</Eyebrow>
        <p className="mt-1 font-display text-sm font-semibold text-foreground">
          {note}
        </p>
      </div>
      {children}
    </section>
  );
}

/** A case study: solid, and the whole node links to it. */
function StudyNode({
  study,
  locale,
  solo = false,
}: {
  study: CaseStudy;
  locale: Locale;
  solo?: boolean;
}) {
  return (
    <li
      className={cn(
        solo && "sm:col-span-2",
        "relative flex min-h-tap items-center justify-between gap-2 rounded-md border border-input bg-card px-3 text-sm font-medium transition-colors hover:bg-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
      )}
    >
      <Link
        href={localizePath(locale, `/work/${study.slug}`)}
        className="after:absolute after:inset-0 after:rounded-md focus-visible:outline-none"
      >
        {study.name}
      </Link>
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        className="size-3.5 shrink-0 text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </li>
  );
}

/**
 * The Daily 5: not a case study, so not a link, but the habit the workers'
 * column is built around. It opens a short overview: what it is, why it
 * matters, and which case studies it shows up in.
 */
function Daily5Node({
  t,
  locale,
  related,
}: {
  t: Messages["home"]["work"]["ecosystem"]["daily5"];
  locale: Locale;
  related: CaseStudy[];
}) {
  return (
    <li>
      <Dialog
        eyebrow={t.eyebrow}
        title={t.title}
        closeLabel={t.close}
        triggerClassName="flex min-h-tap w-full items-center justify-between gap-2 rounded-md border border-primary bg-accent px-3 text-left text-sm text-accent-foreground transition-colors hover:bg-accent-hover"
        trigger={
          <>
            <span className="font-medium">{t.label}</span>
            <span className="flex items-center gap-2 text-xs">
              {t.note}
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 16 16"
                className="size-3.5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="8" cy="8" r="6.25" />
                <path d="M8 7.25v4M8 4.75v.01" />
              </svg>
            </span>
          </>
        }
      >
        <p className="text-pretty">{t.lede}</p>
        <SpecList className="mt-5">
          {t.facts.map((fact) => (
            <SpecRow key={fact.label} label={fact.label}>
              {fact.value}
            </SpecRow>
          ))}
        </SpecList>
        {related.length > 0 ? (
          <>
            <Eyebrow className="mt-6">{t.related}</Eyebrow>
            <ul className="mt-2 flex flex-col">
              {related.map((study) => (
                <li key={study.slug}>
                  <Link
                    href={localizePath(locale, `/work/${study.slug}`)}
                    className="inline-flex min-h-tap flex-wrap items-baseline gap-x-2 rounded-sm text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="text-primary underline underline-offset-4">
                      {study.name}
                    </span>
                    <span className="text-muted-foreground">
                      {t.relatedNotes[study.slug]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Dialog>
    </li>
  );
}
