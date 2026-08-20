import { Inspector, SiteFooter, SiteHeader } from "@/components/cksui";
import { caseStudies } from "@/lib/content/work";
import { site } from "@/lib/site";

/**
 * Chrome for the public site.
 *
 * The header and footer live here rather than in the root layout, so the admin
 * area and the recruiter-facing cover letter pages don't inherit them — a shared
 * document should be the document and nothing else.
 *
 * Case study titles are read here, on the server, and handed to the header as
 * plain data. The header is a client component (it needs the current pathname),
 * and the content layer touches the filesystem — so the boundary sits here.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  const work = caseStudies.map(({ slug, title }) => ({ slug, title }));

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader work={work} />
      {children}
      {/* No year: a notice needs a holder, not a date, and a date is a thing to
          remember to change. The name appears once, as the copyright holder,
          and the credit uses the same first person as the rest of the site
          rather than repeating it. */}
      <SiteFooter>© {site.name} · Designed and built by me</SiteFooter>
      <Inspector />
    </div>
  );
}
