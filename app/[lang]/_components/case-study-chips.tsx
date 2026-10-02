import { Badge, cn } from "@/components/cksui";
import type { CaseStudy } from "@/lib/content/work";

/**
 * The facts that help someone decide whether to read a case study: the
 * headline result where there is a number, the kind of work, and when.
 *
 * One component for the card and the case study header, so the facts a reader
 * clicked on are the facts the page opens with. The kind of work is the lead
 * of the role — "Product design", "Design systems", "Frontend" — the part a
 * reader can compare across case studies.
 */
export function CaseStudyChips({
  impact,
  role,
  year,
  className,
}: Pick<CaseStudy, "impact" | "role" | "year"> & { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {impact ? (
        <li>
          <Badge variant="soft">{impact}</Badge>
        </li>
      ) : null}
      <li>
        <Badge>{role.split(",")[0]}</Badge>
      </li>
      <li>
        <Badge>{year}</Badge>
      </li>
    </ul>
  );
}
