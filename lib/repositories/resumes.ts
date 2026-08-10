import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";
import { generateShareToken, hashVisitor } from "@/lib/tokens";

/**
 * Tailored CV reads and writes.
 *
 * A CV is assembled from canonical content at read time rather than stored as a
 * snapshot. See docs/decisions/0005-shareable-cvs.md.
 */

export type SharedResume = NonNullable<
  Awaited<ReturnType<typeof getSharedResumeByToken>>
>;

/**
 * Resolve a share token to a fully assembled CV, or undefined.
 *
 * The status and expiry checks live here rather than in the page, so that no
 * future call site can render a revoked CV by forgetting to check. Undefined is
 * returned for revoked, expired, draft, and nonexistent alike — the recipient
 * cannot distinguish "this link was turned off" from "this link never existed",
 * which avoids confirming that a given company was ever sent one.
 */
export async function getSharedResumeByToken(token: string) {
  const resume = await getDb().query.resumes.findFirst({
    where: eq(schema.resumes.shareToken, token),
    with: {
      positions: {
        orderBy: [asc(schema.resumePositions.sortOrder)],
        with: {
          position: {
            with: {
              highlights: {
                orderBy: [asc(schema.positionHighlights.sortOrder)],
              },
            },
          },
        },
      },
      highlights: {
        orderBy: [asc(schema.resumeHighlights.sortOrder)],
        with: { highlight: true },
      },
      caseStudies: {
        orderBy: [asc(schema.resumeCaseStudies.sortOrder)],
        with: { caseStudy: true },
      },
      skills: {
        orderBy: [asc(schema.resumeSkills.sortOrder)],
        with: { skill: true },
      },
    },
  });

  if (!resume) return undefined;
  if (resume.status !== "shared") return undefined;
  if (resume.expiresAt && resume.expiresAt.getTime() < Date.now()) {
    return undefined;
  }

  return resume;
}

/**
 * Log a view of a shared CV.
 *
 * Called from the page render, deliberately without awaiting the caller's
 * critical path — a failure to log must never stop a recruiter seeing the CV,
 * which is why this swallows its errors.
 */
export async function recordResumeView(input: {
  resumeId: string;
  ip?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
}): Promise<void> {
  try {
    await getDb()
      .insert(schema.resumeViews)
      .values({
        resumeId: input.resumeId,
        visitorHash: input.ip ? hashVisitor(input.ip) : null,
        userAgent: input.userAgent ?? null,
        referrer: input.referrer ?? null,
      });
  } catch {
    // Intentionally ignored: analytics must not break delivery.
  }
}

/** Admin listing, with enough view data to answer "did they open it?". */
export async function listResumesForAdmin() {
  return getDb().query.resumes.findMany({
    orderBy: [desc(schema.resumes.updatedAt)],
    with: {
      views: {
        orderBy: [desc(schema.resumeViews.viewedAt)],
        limit: 5,
      },
    },
  });
}

/**
 * Create an empty tailored CV.
 *
 * The share token is generated here and never accepted as an argument, so there
 * is no path by which a caller supplies a weak one.
 */
export async function createResume(input: {
  title: string;
  targetRole?: string;
  targetCompany?: string;
}) {
  const [created] = await getDb()
    .insert(schema.resumes)
    .values({
      title: input.title,
      targetRole: input.targetRole,
      targetCompany: input.targetCompany,
      shareToken: generateShareToken(),
    })
    .returning();

  return created;
}

/** Turn a link off without deleting the CV or its view history. */
export async function revokeResume(id: string) {
  await getDb()
    .update(schema.resumes)
    .set({ status: "revoked", updatedAt: new Date() })
    .where(eq(schema.resumes.id, id));
}

/**
 * Issue a fresh share token, invalidating the old link.
 *
 * The recovery path for a link forwarded somewhere you did not intend.
 */
export async function rotateShareToken(id: string) {
  const [updated] = await getDb()
    .update(schema.resumes)
    .set({ shareToken: generateShareToken(), updatedAt: new Date() })
    .where(eq(schema.resumes.id, id))
    .returning();

  return updated;
}
