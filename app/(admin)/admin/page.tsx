import type { Metadata } from "next";

import { Eyebrow } from "@/components/cksui";
import { requireAdmin } from "@/lib/auth-guard";
import { caseStudies } from "@/lib/content/work";
import { listLettersForAdmin } from "@/lib/repositories/cover-letters";

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

  const letters = await listLettersForAdmin();

  const shared = letters.filter((letter) => letter.status === "shared").length;
  const opened = letters.filter((letter) => letter.views.length > 0).length;

  const stats = [
    { label: "Cover letters", value: letters.length, note: `${shared} shared` },
    { label: "Opened", value: opened, note: "letters with at least one view" },
    {
      label: "Case studies",
      value: caseStudies.length,
      // Files, not rows — nothing to edit here. See ADR 0004.
      note: "MDX files in src/content/work",
    },
  ];

  return (
    <>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Overview
      </h1>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-5">
            <Eyebrow asChild>
              <dt>{stat.label}</dt>
            </Eyebrow>
            <dd className="mt-2 font-display text-3xl font-semibold text-foreground">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs text-muted-foreground">{stat.note}</dd>
          </div>
        ))}
      </dl>

      {letters.length > 0 ? (
        <table className="mt-10 w-full border-collapse text-sm">
          <caption className="sr-only">
            Cover letters, with their most recent views
          </caption>
          <thead>
            <tr className="border-b border-input text-left">
              <th scope="col" className="py-2 pr-4 font-medium">
                Letter
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Status
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Recent views
              </th>
            </tr>
          </thead>
          <tbody>
            {letters.map((letter) => (
              <tr key={letter.id} className="border-b border-border">
                <th scope="row" className="py-3 pr-4 font-normal">
                  {letter.title}
                  <span className="block text-xs text-muted-foreground">
                    {letter.role} · {letter.company}
                  </span>
                </th>
                <td className="py-3 pr-4 text-muted-foreground">
                  {letter.status}
                </td>
                <td className="py-3 text-right tabular-nums text-muted-foreground">
                  {letter.views.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <p className="mt-10 max-w-measure text-muted-foreground">
        Editing screens are not built yet. The schema, repositories, and this
        gate are in place, so each one is a form wired to a Server Action that
        calls into <code className="text-foreground">lib/repositories/</code>.
      </p>
    </>
  );
}
