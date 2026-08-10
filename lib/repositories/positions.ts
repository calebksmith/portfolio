import "server-only";

import { asc, desc, eq } from "drizzle-orm";

import { getDb, schema } from "@/lib/db";

/**
 * Job history reads.
 *
 * Ordering is by start date descending rather than by `sortOrder` alone, so a
 * newly added role lands in the right place without anyone renumbering the
 * whole list. `sortOrder` exists only to break ties between roles that began in
 * the same month.
 */

export type PositionWithHighlights = Awaited<
  ReturnType<typeof listPublishedPositions>
>[number];

export async function listPublishedPositions() {
  return getDb().query.positions.findMany({
    where: eq(schema.positions.status, "published"),
    orderBy: [desc(schema.positions.startDate), asc(schema.positions.sortOrder)],
    with: {
      highlights: {
        orderBy: [asc(schema.positionHighlights.sortOrder)],
      },
    },
  });
}

export async function listAllPositionsForAdmin() {
  return getDb().query.positions.findMany({
    orderBy: [desc(schema.positions.startDate), asc(schema.positions.sortOrder)],
    with: {
      highlights: {
        orderBy: [asc(schema.positionHighlights.sortOrder)],
      },
    },
  });
}

export async function listSkills() {
  return getDb().query.skills.findMany({
    orderBy: [asc(schema.skills.category), asc(schema.skills.sortOrder)],
  });
}
