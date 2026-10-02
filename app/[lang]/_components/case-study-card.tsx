import Link from "next/link";

import { cn } from "@/components/cksui";
import type { CaseStudy } from "@/lib/content/work";
import { localizePath } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";

import { CaseStudyChips } from "./case-study-chips";

/**
 * A case study card: what it is, the facts that help decide, and a way in.
 *
 * Name and what it is, then one row of chips: the headline result where there
 * is a number, the kind of work, and when. Chips rather than a sentence — a
 * sentence restated the descriptor, where chips answer the questions a reader
 * is actually asking ("did it work? what did he do? how recent?") at a glance.
 * The summary, role, and stack are on the case study page.
 *
 * The arrow is the only call to action, and it is an icon: the whole card is
 * the link, so a label would only repeat what the card already is.
 *
 * Rendered by the homepage and by the "more of my work" row on every case
 * study, so it lives once.
 */

/**
 * The stretched-link pattern: one link per card, named by its heading, with a
 * pseudo-element covering the tile. A div with an onClick would not be
 * focusable, and a link wrapping the whole card would announce every word in it
 * as the link's name.
 */
export const STRETCH =
  "after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none";

export async function CaseStudyCard({
  as: Heading = "h3",
  slug,
  name,
  descriptor,
  impact,
  role,
  year,
}: CaseStudy & {
  /** The card's heading level, so the page outline stays in order. */
  as?: "h3" | "h4";
}) {
  const locale = await getLocale();

  return (
    <article
      data-slot="case-study-card"
      data-glow="end"
      // Grid placement lives on the Reveal wrapper, since that is what the grid
      // actually lays out. `h-full` keeps the card filling its cell.
      className={cn(
        "group relative flex h-full cursor-pointer flex-col gap-3 rounded-lg border border-border bg-card p-6 text-card-foreground",
        // The lift is transform and shadow, so it is named explicitly —
        // `transition-colors` would animate the fill and snap the movement.
        "transition-[color,background-color,border-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lift focus-within:-translate-y-0.5 focus-within:shadow-lift",
        // The whole tile is the target, so the whole tile responds.
        "hover:border-input hover:bg-muted focus-within:border-input focus-within:bg-muted",
        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
      )}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        className="absolute top-6 right-6 size-4 text-primary transition-transform group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>

      <Heading className="pr-8 font-display text-base font-semibold tracking-[-0.01em] text-balance sm:text-lg">
        {/* No underline on hover. The stretched link covers the whole tile, so
            underlining the heading says the heading is the target when it is
            not — the card responds instead. */}
        <Link href={localizePath(locale, `/work/${slug}`)} className={STRETCH}>
          {name}
          {/* The colon is for the ear: read aloud it is one title, "Name:
              What it is". On screen the two parts are two lines. */}
          <span className="sr-only">: </span>
          <span className="mt-1 block font-sans text-sm font-normal tracking-normal text-pretty text-muted-foreground">
            {descriptor}
          </span>
        </Link>
      </Heading>

      <CaseStudyChips
        impact={impact}
        role={role}
        year={year}
        className="mt-auto pt-1"
      />
    </article>
  );
}
