import Link from "next/link";

import { Button, Eyebrow, cn } from "@/components/cksui";
import { caseStudies } from "@/lib/content/work";
import { site } from "@/lib/site";

import { CASE_STUDY_STYLE, CaseStudyCard, STRETCH } from "./case-study-card";
import { HeroPrompt } from "./hero-prompt";
import { HeroRevealProvider } from "./hero-reveal";
import { Reveal } from "./reveal";
import { ScrollCue } from "./scroll-cue";


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
  return (
    <div
      data-slot="pointer-card"
      className={cn(
        "group relative flex h-full flex-col gap-2 rounded-lg border border-border bg-background p-6 transition-colors",
        "hover:border-input hover:bg-muted focus-within:border-input focus-within:bg-muted",
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>

      <h3 className="flex items-center gap-1.5 font-display text-base font-semibold tracking-[-0.01em] text-balance text-foreground">
        {external ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className={STRETCH}
          >
            {title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <Link href={href} className={STRETCH}>
            {title}
          </Link>
        )}
        {external ? <ExternalIcon /> : null}
      </h3>

      <p className="text-sm text-pretty text-muted-foreground">{description}</p>
    </div>
  );
}

/** The non-case-study tiles: utility pages on this site, and outside proof. */
function pointers() {
  return [
    {
      href: site.links[1].href,
      external: true,
      eyebrow: "Storybook",
      title: "VimUI, live",
      description:
        "Vimocity's design system, public — 50+ web components on shared tokens.",
    },
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
  ];
}

export function Bento() {
  return (
    /* No content container. Pages run the full width of the window and the
       measure lives on the text that needs it — `max-w-[NNch]` on the
       paragraphs below, not a wrapper around everything. A container sets one
       width for prose, grids, and headings alike, which is one decision doing
       three jobs. */
    <main className="w-full px-6 sm:px-10">
      <HeroRevealProvider>
        {/*
          The first screen, exactly: the sticky header plus this and nothing
          else. Subtracting the header from the viewport is what puts the scroll
          prompt on the fold rather than just below it.

          `svh` rather than `vh` so mobile browser chrome doesn't push the prompt
          off the bottom of the screen it is supposed to sit on.
        */}
        <div className="flex min-h-[calc(100svh_-_var(--ck-header-height))] flex-col">
          {/* Not a card: type on the page ground. The hero takes the slack, so
              the block stays optically centred whatever the viewport does. */}
          {/* Tighter padding on a phone: three stacked chips plus the reserved
              answer height is most of a small screen, and the scroll prompt has
              to stay on it. */}
          <section className="flex flex-1 flex-col justify-center py-10 sm:py-16">
            <Eyebrow tone="primary">{site.role}</Eyebrow>

            {/* Tight internal rhythm: role, name, and the typed lines read as
                one block. The section's own height is what gives the hero room —
                spacing inside it would only pull the group apart. */}
            <h1 className="mt-3 font-display text-[clamp(2.5rem,9vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-balance text-foreground">
              {site.name}
            </h1>

            {/* Close to the name — the statement belongs to it. The gap that
                matters is the one inside HeroPrompt, between the statement and
                the question, which is a change of speaker. */}
            <HeroPrompt className="mt-4" />
          </section>

          {/* Carries the work section's heading, and sits on the fold. */}
          <ScrollCue />
        </div>

        {/*
          One grid, not two. The hierarchy is carried by the cards themselves —
          case studies are filled surfaces with an accent "Case study" label and
          a read affordance; pointers have no fill, a muted eyebrow, and no CTA.
          That difference survives the collapse to a single column on a phone,
          which is exactly where a section heading stops helping and starts
          being another thing to scroll past.
        */}
        <section
          id="work"
          aria-labelledby="selected-work"
          className="scroll-mt-20 pb-24"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4 lg:grid-cols-6">
            {caseStudies.map((study, index) => (
              <Reveal
                key={study.slug}
                index={index}
                className={cn(
                  CASE_STUDY_STYLE[study.weight].span,
                  "sm:col-span-2",
                )}
              >
                <CaseStudyCard {...study} />
              </Reveal>
            ))}

            {/* The stagger restarts here rather than continuing the count. The
                case studies fill their rows exactly, so the pointers begin a
                fresh band and should enter like one. */}
            {pointers().map((card, index) => (
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
      </HeroRevealProvider>

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

        {/* Approved copy from the deck. Vimocity comes first: VimUI is a system
            built *there*, not a product of his own, and naming the employer is
            what makes that legible to someone who has never heard of either. */}
        <p className="mx-auto mt-4 max-w-[58ch] text-pretty text-muted-foreground">
          I&rsquo;m a design engineer and product manager at Vimocity, a
          workplace health and safety platform based in Seattle. I lead design
          there. I built our design system — VimUI — and I maintain the
          standards and automated checks that keep our design and code in sync.
        </p>
        <p className="mx-auto mt-3 max-w-[58ch] text-pretty text-muted-foreground">
          Nine years in design, five writing production frontend.
        </p>

        {/* Names the destination rather than its size. "The long version" was
            the other half of the TL;DR joke, but it prices the click — telling
            someone a page is long is a reason not to open it. */}
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/experience">My experience →</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
