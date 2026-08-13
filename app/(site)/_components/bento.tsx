import Link from "next/link";

import { Badge, Button, cn } from "@/components/cksui";
import { caseStudies, type Weight } from "@/lib/content/work";
import { site } from "@/lib/site";

import { Reveal } from "./reveal";
import { TypedTagline } from "./typed-tagline";


/**
 * The bento index.
 *
 * Three kinds of block, deliberately not interchangeable:
 *
 *   hero        who this is. Not a card — plain type on the page ground, with
 *               a single CTA as the only interactive element.
 *   case study  work with a story behind it. A filled surface, an accent
 *               "Case study" label, and a read affordance.
 *   pointer     a utility page or an outside example. No fill, muted label, no
 *               CTA — it reads as navigation rather than as work. External ones
 *               say so rather than surprising you with a new tab.
 *
 * Hierarchy is carried by type scale, fill, and label, not by column span.
 * Span collapses to one column on a phone, so a layout leaning on span alone
 * flattens to identical boxes exactly where reading order matters most.
 */

/** Column span out of 6, and the type scale that survives the collapse. */
const CASE_STUDY_STYLE: Record<
  Weight,
  { span: string; title: string; pad: string }
> = {
  large: { span: "lg:col-span-3", title: "text-xl sm:text-2xl", pad: "p-6 sm:p-7" },
  medium: { span: "lg:col-span-2", title: "text-base sm:text-lg", pad: "p-6" },
  small: { span: "lg:col-span-2", title: "text-base", pad: "p-6" },
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
      // Grid placement lives on the Reveal wrapper, since that is what the grid
      // actually lays out. `h-full` keeps the card filling its cell.
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-lg border border-border bg-card text-card-foreground transition-colors",
        "hover:border-input focus-within:border-input",
        style.pad,
      )}
    >
      {/* The kind of thing this is, said outright. Replaces the accent edge:
          a label survives the single-column collapse and says what a colored
          border could only imply. */}
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-primary">
        Case study
        <span aria-hidden="true" className="text-muted-foreground">
          ·
        </span>
        <span className="text-muted-foreground">{year}</span>
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

      <p className="text-xs text-muted-foreground">{role}</p>

      {platforms.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {platforms.map((platform) => (
            <li key={platform}>
              <Badge>{platform}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-auto pt-3 text-xs text-primary">Read case study →</p>
    </article>
  );
}

/**
 * A pointer to somewhere else — a utility page on this site, or an outside
 * example. No fill and no read affordance, so it reads as navigation rather
 * than as work.
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
        "group relative flex h-full flex-col gap-2 rounded-lg border border-border bg-background p-6 transition-colors hover:border-input focus-within:border-input",
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
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
    <main className="mx-auto w-full max-w-5xl px-6 sm:px-10">
      {/*
        Hero. Not a card: type on the page ground, with the CTA as the only
        interactive element. Sized so the section heading below sits
        just at the fold — enough of it visible to read as an invitation to
        scroll without the hero feeling cropped.

        `svh` rather than `vh` so mobile browser chrome doesn't push the next
        section off screen.
      */}
      <section className="flex min-h-[80svh] flex-col justify-center py-16">
        <p className="text-xs uppercase tracking-[0.16em] text-primary">
          {site.role}
        </p>

        {/* Tight internal rhythm: role, name, lede, and CTA read as one block.
            The section's own height is what gives the hero room — spacing
            inside it would only pull the group apart. */}
        <h1 className="mt-3 font-display text-[clamp(2.5rem,9vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-balance text-foreground">
          {site.name}
        </h1>

        {/* The body face is monospace, so `ch` is close to literal characters:
            the lede is 65 of them and 64ch orphaned its last word. 70ch clears
            all three lines with margin. Min-height reserves the finished set's
            space so nothing below shifts while it types or when the first two
            lines fold away. */}
        <TypedTagline className="mt-6 min-h-[11em] max-w-[70ch] text-lg text-pretty sm:min-h-[6.5em]" />
      </section>

      <section aria-labelledby="selected-work" className="pb-24">
        <h2
          id="selected-work"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          A few things I&rsquo;ve designed, built, or created
        </h2>

        {/* Half the gap the grid uses: the heading belongs to the grid it
            labels, so it sits closer to it than the cards sit to each other. */}
        <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-4 lg:grid-cols-6">
          {caseStudies.map((study, index) => (
            <Reveal
              key={study.slug}
              index={index}
              className={cn(CASE_STUDY_STYLE[study.weight].span, "sm:col-span-2")}
            >
              <CaseStudyCard {...study} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* No rule between the sections — the section padding already separates
          them, and a border on top of that is a second boundary. */}
      <section aria-labelledby="elsewhere" className="pb-24">
        <h2
          id="elsewhere"
          className="text-xs uppercase tracking-[0.16em] text-muted-foreground"
        >
          If you&rsquo;re curious
        </h2>

        {/* Built from a list so the reveal stagger indexes stay correct when the
            playlist card is absent. */}
        <div className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-4 lg:grid-cols-6">
          {[
            {
              href: site.links[1].href,
              external: true,
              eyebrow: "Storybook",
              title: "VimUI, live",
              description:
                "Vimocity's design system, public — 51 components across four platforms.",
            },
            ...(site.playlistUrl
              ? [
                  {
                    href: site.playlistUrl,
                    external: true,
                    eyebrow: "Vimocity",
                    title: "A playlist I built",
                    description:
                      "Content collections, shareable across an organization and embeddable in company intranets.",
                  },
                ]
              : []),
            {
              href: "/colophon",
              external: false,
              eyebrow: "About this site",
              title: "Colophon",
              description:
                "The stack, the alternatives that lost, and what each choice cost.",
            },
            {
              href: "/style-guide",
              external: false,
              eyebrow: "About this site",
              title: "Style guide",
              description:
                "Tokens, type, and every component — measured live, in whichever theme you are viewing.",
            },
            {
              href: site.links[0].href,
              external: true,
              eyebrow: "Profile",
              title: "LinkedIn",
              description: "Background, roles, and the longer version of all this.",
            },
          ].map((card, index) => (
            <Reveal
              key={card.href}
              index={index}
              className="sm:col-span-2 lg:col-span-2"
            >
              <PointerCard {...card} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* The CTA closes the page rather than competing with the hero, where the
          tagline is doing the work. Someone who has read this far is the person
          most likely to want the résumé. */}
      <section
        aria-labelledby="more-about-me"
        className="border-t border-border py-20 text-center"
      >
        <h2
          id="more-about-me"
          className="font-display text-2xl font-semibold tracking-[-0.02em] text-balance text-foreground"
        >
          TL;DR about me
        </h2>

        {/* Every figure here is approved copy from the deck — 51 components,
            four platforms, nine and five years. Nothing extrapolated. */}
        {/* Vimocity comes first: VimUI is a system I own *there*, not a product
            of my own, and naming the employer is what makes that legible to
            someone who has never heard of either. */}
        <p className="mx-auto mt-4 max-w-[58ch] text-pretty text-muted-foreground">
          I&rsquo;m a design engineer at Vimocity in Seattle, a workplace health
          platform on web, iOS, Android, and Windows desktop. I own VimUI, our
          design system — 51 components — along with the standards and automated
          checks that keep design and code in sync. I define what gets built,
          then build the frontend it ships on.
        </p>
        <p className="mx-auto mt-3 max-w-[58ch] text-pretty text-muted-foreground">
          Nine years in design, five writing production frontend.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Button asChild size="lg">
            <Link href="/resume">Full résumé →</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            The roles, the dates, and the work behind all of it.
          </p>
        </div>
      </section>
    </main>
  );
}
