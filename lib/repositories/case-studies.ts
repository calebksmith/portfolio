import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";

/**
 * Case study reads.
 *
 * Every query against the case_study table lives here. Route components call
 * these functions; they never build queries themselves. Two reasons: the
 * published/draft filter can only be forgotten in one place, and swapping the
 * database vendor touches this layer rather than every page.
 *
 * `server-only` makes importing this from a Client Component a build error
 * rather than a leaked connection string.
 */

export type CaseStudyListItem = Awaited<
  ReturnType<typeof listPublishedCaseStudies>
>[number];

/** Public listing. Drafts and archived entries are never returned. */
export async function listPublishedCaseStudies() {
  return getDb().query.caseStudies.findMany({
    where: eq(schema.caseStudies.status, "published"),
    orderBy: [
      desc(schema.caseStudies.featured),
      asc(schema.caseStudies.sortOrder),
      desc(schema.caseStudies.publishedAt),
    ],
    with: {
      tags: { with: { tag: true } },
    },
  });
}

/**
 * Public detail read. Returns undefined for drafts as well as for genuinely
 * missing slugs, so an unpublished URL is indistinguishable from a typo.
 */
export async function getPublishedCaseStudyBySlug(slug: string) {
  return getDb().query.caseStudies.findFirst({
    where: and(
      eq(schema.caseStudies.slug, slug),
      eq(schema.caseStudies.status, "published"),
    ),
    with: {
      tags: { with: { tag: true } },
      position: true,
    },
  });
}

/** Slugs for generateStaticParams. Published only. */
export async function listPublishedCaseStudySlugs() {
  const rows = await getDb()
    .select({ slug: schema.caseStudies.slug })
    .from(schema.caseStudies)
    .where(eq(schema.caseStudies.status, "published"));
  return rows.map((row) => row.slug);
}

/**
 * Admin listing — includes drafts.
 *
 * Named `...ForAdmin` rather than overloading the public function with a flag,
 * so that a call site which forgot to authorize is visible in review.
 * Authorization itself is the caller's job; see lib/auth.ts.
 */
export async function listAllCaseStudiesForAdmin() {
  return getDb().query.caseStudies.findMany({
    orderBy: [asc(schema.caseStudies.sortOrder), desc(schema.caseStudies.updatedAt)],
    with: { tags: { with: { tag: true } } },
  });
}
