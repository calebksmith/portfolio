import { Badge, cn } from "@/components/cksui";
import type { CaseStudy } from "@/lib/content/work";

/**
 * Tags first, then the result, as two separate rows.
 *
 * The tags say what kind of work it is and where it sits: who it serves
 * (Workers, Admins, Platform), the kind of work — the lead of the role,
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
  className,
}: Pick<CaseStudy, "role" | "year"> & {
  /** The area's label, e.g. "Workers". */
  area: string;
  /** Wrap onto more lines, where there's room for them (the page header). */
  wrap?: boolean;
  className?: string;
}) {
  // Only the kind of work gives way when the row runs out: who it serves and
  // when are short and mean nothing cut off, while "Product des…" still reads.
  const tags = [
    { text: area, shrink: false },
    { text: role.split(",")[0], shrink: true },
    { text: year, shrink: false },
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
          className={cn("min-w-0", tag.shrink ? "shrink" : "shrink-0")}
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
