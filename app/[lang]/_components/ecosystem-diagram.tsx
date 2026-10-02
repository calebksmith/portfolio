import Link from "next/link";

import { Eyebrow, cn } from "@/components/cksui";
import type { Area, CaseStudy } from "@/lib/content/frontmatter";
import { getCaseStudies } from "@/lib/content/work";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getLocale, getMessages } from "@/lib/i18n/server";

/**
 * The product map — where each case study sits in Vimocity.
 *
 * Different people use Vimocity for different jobs, so the diagram is drawn by
 * persona: a column each for workers, safety leaders, and admins, with the
 * layers they all share — identity and the platform — spanning underneath.
 *
 * Abbreviated on purpose: names only. Case studies are solid and link to their
 * page; parts of Vimocity that aren't case studies are dashed and inert, so the
 * product's breadth shows without pretending everything was written up. The
 * cards in the other view carry the detail.
 */

const PERSONAS: Area[] = ["workers", "safety-leaders", "admins"];
const SHARED: Area[] = ["identity", "platform"];

export async function EcosystemDiagram() {
  const locale = await getLocale();
  const t = (await getMessages()).home.work.ecosystem;
  const studies = getCaseStudies(locale);
  const inArea = (area: Area) => studies.filter((s) => s.area === area);

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-3">
        {PERSONAS.map((area) => (
          <Area key={area} id={area} {...t.areas[area]}>
            <ul className="flex flex-col gap-2">
              {(t.context[area] ?? []).map((node) => (
                <ContextNode key={node.label} {...node} />
              ))}
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
            className="size-3 rounded-sm border border-dashed border-input"
          />
          {t.legend.context}
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
        wide && "lg:grid lg:grid-cols-[13rem_1fr] lg:items-center lg:gap-4",
      )}
    >
      <div className={cn(!wide && "mb-3", wide && "mb-3 lg:mb-0")}>
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

/** Part of Vimocity that isn't a case study: dashed, and not a link. */
function ContextNode({ label, note }: { label: string; note?: string }) {
  return note ? (
    <li className="flex min-h-tap items-center justify-between gap-2 rounded-md border border-dashed border-primary bg-accent px-3 text-sm text-accent-foreground">
      <span className="font-medium">{label}</span>
      <span className="text-xs">{note}</span>
    </li>
  ) : (
    <li className="flex min-h-tap items-center rounded-md border border-dashed border-input px-3 text-sm text-muted-foreground">
      {label}
    </li>
  );
}
