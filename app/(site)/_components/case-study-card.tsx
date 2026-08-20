import Link from "next/link";

import { Badge, Eyebrow, cn } from "@/components/cksui";
import type { CaseStudy, Weight } from "@/lib/content/work";

/**
 * A case study tile.
 *
 * Lives here rather than inside the bento because two pages render it now — the
 * index, and the "keep reading" row at the foot of every case study. A second
 * copy would look identical on the day it was written and stop being identical
 * on the first edit.
 */

/** Column span out of 6, and the type scale that survives the collapse. */
export const CASE_STUDY_STYLE: Record<
  Weight,
  { span: string; title: string; pad: string }
> = {
  large: { span: "lg:col-span-3", title: "text-xl sm:text-2xl", pad: "p-6 sm:p-7" },
  medium: { span: "lg:col-span-2", title: "text-base sm:text-lg", pad: "p-6" },
  small: { span: "lg:col-span-2", title: "text-base", pad: "p-6" },
};

/**
 * The stretched-link pattern: one link per card, named by its heading, with a
 * pseudo-element covering the tile. A div with an onClick would not be
 * focusable, and a link wrapping the whole card would announce every word in it
 * as the link's name.
 */
export const STRETCH =
  "after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none";

export function CaseStudyCard({
  slug,
  title,
  role,
  year,
  summary,
  stack,
  weight,
}: CaseStudy) {
  const style = CASE_STUDY_STYLE[weight];

  return (
    <article
      data-slot="case-study-card"
      // Grid placement lives on the Reveal wrapper, since that is what the grid
      // actually lays out. `h-full` keeps the card filling its cell.
      className={cn(
        "group relative flex h-full flex-col gap-3 rounded-lg border border-border bg-card text-card-foreground transition-colors",
        // The whole tile is the target, so the whole tile responds. The border
        // alone was too quiet to read as "this is clickable".
        "hover:border-input hover:bg-muted focus-within:border-input focus-within:bg-muted",
        style.pad,
      )}
    >
      {/* The kind of thing this is, said outright. Replaces the accent edge:
          a label survives the single-column collapse and says what a colored
          border could only imply. */}
      <Eyebrow tone="primary" className="flex items-center gap-2">
        Case study
        <span aria-hidden="true" className="text-muted-foreground">
          ·
        </span>
        <span className="text-muted-foreground">{year}</span>
      </Eyebrow>

      <h3
        className={cn(
          "font-display font-semibold tracking-[-0.01em] text-balance",
          style.title,
        )}
      >
        {/* No underline on hover. The stretched link covers the whole tile, so
            underlining the heading says the heading is the target when it is
            not — the card responds instead. */}
        <Link href={`/work/${slug}`} className={STRETCH}>
          {title}
        </Link>
      </h3>

      <p className="text-pretty text-muted-foreground">{summary}</p>

      <p className="text-xs text-muted-foreground">{role}</p>

      {stack.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {stack.map((tool) => (
            <li key={tool}>
              <Badge>{tool}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-auto pt-3 text-xs text-primary">Read case study →</p>
    </article>
  );
}
