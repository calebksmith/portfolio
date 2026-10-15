import "server-only";

import { getDb, schema } from "@/lib/db";
import type { Visitor } from "@/lib/visitor";

/**
 * Visitor log writes.
 *
 * Both run after the response is sent and swallow their own errors, like the
 * cover letter log: a failure to count a visit must never stop the visit. With
 * no database configured they do nothing at all. Reading the log is the job of
 * `npm run analytics:report`, not the site. See ADR 0008.
 */

export async function recordPageView(
  input: Visitor & {
    path: string;
    referrer: string | null;
    accessLinkId: string | null;
  },
): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await getDb().insert(schema.pageViews).values(input);
  } catch {
    // Intentionally ignored: analytics must not break the site.
  }
}

export async function recordAccessLinkOpen(
  input: Visitor & {
    linkId: string;
    outcome: "active" | "expired" | "revoked";
  },
): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  try {
    await getDb().insert(schema.accessLinkOpens).values(input);
  } catch {
    // Intentionally ignored: analytics must not break the link.
  }
}
