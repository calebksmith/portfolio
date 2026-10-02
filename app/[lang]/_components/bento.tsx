import Link from "next/link";

import { Button, Eyebrow, cn } from "@/components/cksui";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";
import { getLocale, getMessages } from "@/lib/i18n/server";
import { site } from "@/lib/site";

import { STRETCH } from "./case-study-card";
import { WorkViews } from "./work-views";
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
  opensInNewTab,
  className,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  external?: boolean;
  opensInNewTab: string;
  className?: string;
}) {
  return (
    <div
      data-slot="pointer-card"
      data-glow=""
      className={cn(
        "group relative flex h-full cursor-pointer flex-col gap-2 rounded-lg border border-border bg-background p-6",
        "transition-[color,background-color,border-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lift focus-within:-translate-y-0.5 focus-within:shadow-lift",
        "hover:border-input hover:bg-muted focus-within:border-input focus-within:bg-muted",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
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
            <span className="sr-only"> {opensInNewTab}</span>
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
function pointers(locale: Locale, t: Messages["home"]["pointers"]) {
  return [
    { href: site.links.vimui, external: true, ...t.vimui },
    { href: site.links.practice, external: true, ...t.practice },
    {
      href: localizePath(locale, "/colophon"),
      external: false,
      ...t.colophon,
    },
    {
      href: localizePath(locale, "/style-guide"),
      external: false,
      ...t.styleGuide,
    },
    { href: site.links.source, external: true, ...t.source },
    { href: site.links.linkedin, external: true, ...t.linkedin },
  ];
}

export async function Bento() {
  const locale = await getLocale();
  const t = await getMessages();

  return (
    /* No content container. Pages run the full width of the window and the
       measure lives on the text that needs it — `max-w-[NNch]` on the
       paragraphs below, not a wrapper around everything. A container sets one
       width for prose, grids, and headings alike, which is one decision doing
       three jobs. */
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-full max-w-page px-6 sm:px-10"
    >
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
            <Eyebrow tone="primary">{t.site.role}</Eyebrow>

            {/* Tight internal rhythm: role, name, and the typed lines read as
                one block. The section's own height is what gives the hero room —
                spacing inside it would only pull the group apart. */}
            <h1 className="mt-3 font-display text-[clamp(2.5rem,9vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-balance text-foreground">
              {site.name}
            </h1>

            {/* Close to the name — the statement belongs to it. The gap that
                matters is the one inside HeroPrompt, between the statement and
                the question, which is a change of speaker. */}
            <HeroPrompt
              className="mt-4"
              locale={locale}
              intro={t.site.lede}
              copy={t.home.hero}
            />
          </section>

          {/* Carries the work section's heading, and sits on the fold. */}
          <ScrollCue label={t.home.scrollCue} />
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
          {/* The case studies: where each sits in Vimocity, or all of them as
              cards — one control switches between the two. */}
          <WorkViews />

          {/* Everything that isn't a case study: utility pages and outside
              proof. Three to a row, so six tiles fill two rows exactly. */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-4 lg:grid-cols-6">
            {pointers(locale, t.home.pointers).map((card, index) => (
              <Reveal
                key={card.href}
                index={index}
                className="sm:col-span-2 lg:col-span-2"
              >
                <PointerCard {...card} opensInNewTab={t.chrome.opensInNewTab} />
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
          {t.home.tldr.heading}
        </h2>

        {t.home.tldr.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={cn(
              "mx-auto max-w-[58ch] text-pretty text-muted-foreground",
              index === 0 ? "mt-4" : "mt-3",
            )}
          >
            {paragraph}
          </p>
        ))}

        {/* Names the destination rather than its size. "The long version" was
            the other half of the TL;DR joke, but it prices the click — telling
            someone a page is long is a reason not to open it. */}
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href={localizePath(locale, "/experience")}>
              {t.home.tldr.cta}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
