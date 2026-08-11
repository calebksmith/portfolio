import Link from "next/link";

import { Badge, cn } from "@/components/cksui";
import { caseStudies, type Weight } from "@/lib/content/work";
import { site } from "@/lib/site";

/**
 * The bento index.
 *
 * Three kinds of card, deliberately not interchangeable:
 *
 *   identity    who this is — the top of the hierarchy, one per page
 *   case study  work with a story behind it, grouped under a heading and
 *               marked with an accent edge and a "Read case study" affordance
 *   pointer     a utility page or an outside example; visually lighter, and
 *               external ones say so rather than surprising you with a new tab
 *
 * Hierarchy is carried by type scale and padding, not only by column span.
 * Span collapses to one column on a phone, so a layout that leans on span alone
 * flattens to nine identical boxes exactly where the reading order matters most.
 */

/** Column span out of 6, and the type scale that survives the collapse. */
const CASE_STUDY_STYLE: Record<Weight, { span: string; title: string; pad: string }> = {
  large: {
    span: "lg:col-span-3",
    title: "text-xl sm:text-2xl",
    pad: "p-6",
  },
  medium: {
    span: "lg:col-span-2",
    title: "text-base sm:text-lg",
    pad: "p-5",
  },
  small: {
    span: "lg:col-span-2",
    title: "text-base",
    pad: "p-5",
  },
};

function ExternalIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3h7v7M13 3 4 12" />
    </svg>
  );
}

/**
 * The stretched-link pattern: one link per card, named by its heading, with a
 * pseudo-element covering the tile. A div with an onClick would not be
 * focusable, and a link wrapping the whole card would announce every word in it
 * as the link's name.
 */
const STRETCH =
  "after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none";

function CaseStudyCard({
  slug,
  title,
  role,
  year,
  summary,
  platforms,
  weight,
}: (typeof caseStudies)[number]) {
  const style = CASE_STUDY_STYLE[weight];

  return (
    <article
      data-slot="case-study-card"
      className={cn(
        "group relative flex flex-col gap-3 rounded-lg border border-border bg-card text-card-foreground transition-colors",
        // The accent edge is what says "case study" at a glance, at every width.
        "border-l-2 border-l-primary",
        "hover:border-input hover:border-l-primary focus-within:border-input focus-within:border-l-primary",
        style.span,
        style.pad,
        "sm:col-span-2",
      )}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {role} · {year}
      </p>

      <h3
        className={cn(
          "font-display font-semibold tracking-[-0.01em] text-balance",
          style.title,
        )}
      >
        <Link
          href={`/work/${slug}`}
          className={cn(
            STRETCH,
            "decoration-primary underline-offset-4 group-hover:underline group-focus-within:underline",
          )}
        >
          {title}
        </Link>
      </h3>

      <p className="text-pretty text-muted-foreground">{summary}</p>

      {platforms.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {platforms.map((platform) => (
            <li key={platform}>
              <Badge>{platform}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-auto pt-2 text-xs text-primary">Read case study →</p>
    </article>
  );
}

/**
 * A pointer to somewhere else — a utility page on this site, or an outside
 * example. Lighter than a case study on purpose: no card fill, no accent edge,
 * so it reads as navigation rather than as work.
 */
function PointerCard({
  href,
  eyebrow,
  title,
  description,
  external = false,
  className,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  external?: boolean;
  className?: string;
}) {
  const linkClass = cn(
    STRETCH,
    "decoration-input underline-offset-4 group-hover:underline group-focus-within:underline",
  );

  return (
    <div
      data-slot="pointer-card"
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border border-border bg-background p-5 transition-colors hover:border-input focus-within:border-input sm:col-span-2",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {eyebrow}
      </p>

      <h3 className="flex items-center gap-1.5 font-display text-base font-semibold tracking-[-0.01em] text-balance text-foreground">
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={linkClass}
          >
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <Link href={href} className={linkClass}>
            {title}
          </Link>
        )}
        {external ? <ExternalIcon /> : null}
      </h3>

      <p className="text-sm text-pretty text-muted-foreground">{description}</p>
    </div>
  );
}

export function Bento() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
      <h1 className="sr-only">
        {site.name} — {site.role}
      </h1>

      {/* Identity — the top of the hierarchy, and the only card at this scale. */}
      <div
        data-slot="identity-card"
        className="group relative flex flex-col gap-4 rounded-lg border border-input bg-card p-6 text-card-foreground transition-colors hover:border-primary focus-within:border-primary sm:p-8"
      >
        <p className="text-xs uppercase tracking-[0.16em] text-primary">
          {site.role}
        </p>
        <p className="font-display text-[clamp(1.75rem,5vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance">
          <Link href="/resume" className={cn(STRETCH, "hover:underline decoration-primary underline-offset-4")}>
            {site.name}
          </Link>
        </p>
        <p className="max-w-[52ch] text-lg text-pretty text-muted-foreground">
          {site.lede}
        </p>
        <p className="text-xs text-primary">Résumé and full background →</p>
      </div>

      <section aria-labelledby="selected-work" className="mt-10">
        <h2
          id="selected-work"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          Selected work
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug} {...study} />
          ))}
        </div>
      </section>

      <section aria-labelledby="elsewhere" className="mt-10">
        <h2
          id="elsewhere"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          Elsewhere
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          <PointerCard
            href={site.links[1].href}
            external
            eyebrow="Storybook"
            title="VimUI, live"
            description="The public component library — 51 components across four platforms."
            className="lg:col-span-2"
          />

          {site.playlistUrl ? (
            <PointerCard
              href={site.playlistUrl}
              external
              eyebrow="Vimocity"
              title="A playlist I built"
              description="Content collections, shareable across an organization and embeddable in company intranets."
              className="lg:col-span-2"
            />
          ) : null}

          <PointerCard
            href="/colophon"
            eyebrow="About this site"
            title="Colophon"
            description="The stack, the alternatives that lost, and what each choice cost."
            className="lg:col-span-2"
          />

          <PointerCard
            href="/style-guide"
            eyebrow="About this site"
            title="Style guide"
            description="Tokens, type, and every component — measured live, in whichever theme you are viewing."
            className="lg:col-span-2"
          />

          <PointerCard
            href={site.links[0].href}
            external
            eyebrow="Profile"
            title="LinkedIn"
            description="Background, roles, and the longer version of all this."
            className="lg:col-span-2"
          />
        </div>
      </section>
    </main>
  );
}
