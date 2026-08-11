import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth-guard";
import { listAllCaseStudiesForAdmin } from "@/lib/repositories/case-studies";
import { listAllPositionsForAdmin } from "@/lib/repositories/positions";
import { listResumesForAdmin } from "@/lib/repositories/resumes";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * Rendered per request: it reads the database and shows live counts, so there
 * is nothing worth prerendering. This also keeps `next build` from needing a
 * database connection.
 */
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  // Independent reads, so issue them together rather than in sequence.
  const [caseStudies, positions, resumes] = await Promise.all([
    listAllCaseStudiesForAdmin(),
    listAllPositionsForAdmin(),
    listResumesForAdmin(),
  ]);

  const published = caseStudies.filter(
    (study) => study.status === "published",
  ).length;
  const shared = resumes.filter((resume) => resume.status === "shared").length;
  const views = resumes.reduce((total, resume) => total + resume.views.length, 0);

  const stats = [
    { label: "Case studies", value: caseStudies.length, note: `${published} published` },
    { label: "Positions", value: positions.length, note: "job history entries" },
    { label: "Tailored CVs", value: resumes.length, note: `${shared} shared` },
    { label: "Recent views", value: views, note: "last 5 per CV" },
  ];

  return (
    <>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Overview
      </h1>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-5">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {stat.label}
            </dt>
            <dd className="mt-2 font-display text-3xl font-semibold text-foreground">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">{stat.note}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 max-w-[62ch] text-muted-foreground">
        Editing screens are not built yet. The schema, repositories, and this
        gate are in place, so each one is a form wired to a Server Action that
        calls into <code className="text-foreground">lib/repositories/</code>.
      </p>
    </>
  );
}
