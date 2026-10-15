import { Badge, cn } from "@/components/cksui";
import type { CaseStudy } from "@/lib/content/work";

/**
 * Tags first, then the result, as two separate rows.
 *
 * The tags say what kind of work it is and where it sits: who it serves
 * (Field-based workers, Admins, Platform), the kind of work — the lead of the role,
 * "Product design", "Frontend" — and when. The result is the headline figure,
 * kept apart so it reads as an outcome rather than one more label.
 *
 * Both rows hold to one line and cut off with an ellipsis rather than wrap or
 * push past the card's padding: a long tag or figure loses its end, not the
 * layout. The full text stays in `title`, and in the case study itself.
 */

/** Truncates inside its row instead of widening it. */
const TRUNCATE = "block max-w-full truncate";

export function CaseStudyTags({
  area,
  role,
  year,
  wrap = false,
  compact = false,
  className,
}: Pick<CaseStudy, "role" | "year"> & {
  /** The area's label, e.g. "Field-based workers". */
  area: string;
  /** Wrap onto more lines, where there's room for them (the page header). */
  wrap?: boolean;
  /**
   * On a card: the kind of work drops out when the card is narrow, leaving
   * who it serves and when. Read from the card's width (its `@container`),
   * not the window's, because the same card sits in two- and three-across
   * grids.
   */
  compact?: boolean;
  className?: string;
}) {
  // Only the kind of work gives way when the row runs out: on a narrow card it
  // isn't shown at all, and elsewhere it's the one that truncates. Who it
  // serves and when mean nothing cut off.
  const tags = [
    { text: area, shrink: false, optional: false },
    { text: role.split(",")[0], shrink: true, optional: true },
    { text: year, shrink: false, optional: false },
  ];

  return (
    <ul
      className={cn(
        "flex min-w-0 gap-1.5",
        wrap ? "flex-wrap" : "flex-nowrap overflow-hidden",
        className,
      )}
    >
      {tags.map((tag) => (
        <li
          key={tag.text}
          className={cn(
            "min-w-0",
            tag.shrink ? "shrink" : "shrink-0",
            compact && tag.optional && "hidden @md:block",
          )}
        >
          <Badge className={TRUNCATE} title={tag.text}>
            {tag.text}
          </Badge>
        </li>
      ))}
    </ul>
  );
}

export function CaseStudyResult({
  impact,
  className,
}: Pick<CaseStudy, "impact"> & { className?: string }) {
  if (!impact) return null;

  return (
    <p className={cn("flex min-w-0 overflow-hidden", className)}>
      <Badge variant="soft" className={TRUNCATE} title={impact}>
        {impact}
      </Badge>
    </p>
  );
}
