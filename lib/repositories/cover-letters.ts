import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";
import { generateShareToken, hashVisitor } from "@/lib/tokens";

/**
 * Cover letter reads and writes.
 *
 * Every query against these tables lives here. Route components call these
 * functions; they never build queries themselves — so the status and expiry
 * checks exist in one place and cannot be forgotten per page, and the database
 * vendor stays swappable.
 */

export type SharedLetter = NonNullable<
  Awaited<ReturnType<typeof getSharedLetterByToken>>
>;

/**
 * Resolve a share token to a letter, or undefined.
 *
 * Status and expiry are enforced here rather than in the page, so no future
 * call site can render a revoked letter by forgetting to check. Revoked,
 * expired, draft, and nonexistent all return undefined alike — the recipient
 * cannot distinguish "this link was turned off" from "this link never existed",
 * which avoids confirming that a given company was ever written to.
 */
export async function getSharedLetterByToken(token: string) {
  const letter = await getDb().query.coverLetters.findFirst({
    where: eq(schema.coverLetters.shareToken, token),
    with: {
      caseStudies: {
        orderBy: [asc(schema.coverLetterCaseStudies.sortOrder)],
      },
    },
  });

  if (!letter) return undefined;
  if (letter.status !== "shared") return undefined;
  if (letter.expiresAt && letter.expiresAt.getTime() < Date.now()) {
    return undefined;
  }

  return letter;
}

/**
 * Log a view.
 *
 * Called after the response is sent, and it swallows its own errors — a failure
 * to record analytics must never stop a hiring manager reading the letter.
 */
export async function recordLetterView(input: {
  letterId: string;
  ip?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
}): Promise<void> {
  try {
    await getDb()
      .insert(schema.coverLetterViews)
      .values({
        letterId: input.letterId,
        visitorHash: input.ip ? hashVisitor(input.ip) : null,
        userAgent: input.userAgent ?? null,
        referrer: input.referrer ?? null,
      });
  } catch {
    // Intentionally ignored: analytics must not break delivery.
  }
}

/** Admin listing, with enough view data to answer "did they open it?". */
export async function listLettersForAdmin() {
  return getDb().query.coverLetters.findMany({
    orderBy: [desc(schema.coverLetters.updatedAt)],
    with: {
      views: {
        orderBy: [desc(schema.coverLetterViews.viewedAt)],
        limit: 5,
      },
    },
  });
}

/**
 * Create a letter.
 *
 * The share token is generated here and never accepted as an argument, so there
 * is no path by which a caller supplies a weak one.
 */
export async function createLetter(input: {
  title: string;
  role: string;
  company: string;
  recipient?: string;
  body: string;
}) {
  const [created] = await getDb()
    .insert(schema.coverLetters)
    .values({ ...input, shareToken: generateShareToken() })
    .returning();

  return created;
}

/** Turn a link off without deleting the letter or its view history. */
export async function revokeLetter(id: string) {
  await getDb()
    .update(schema.coverLetters)
    .set({ status: "revoked", updatedAt: new Date() })
    .where(eq(schema.coverLetters.id, id));
}

/**
 * Issue a fresh share token, invalidating the old link.
 *
 * The recovery path for a link forwarded somewhere it was not intended to go.
 */
export async function rotateShareToken(id: string) {
  const [updated] = await getDb()
    .update(schema.coverLetters)
    .set({ shareToken: generateShareToken(), updatedAt: new Date() })
    .where(eq(schema.coverLetters.id, id))
    .returning();

  return updated;
}
