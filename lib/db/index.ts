import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";

import * as schema from "./schema";

/**
 * The database client.
 *
 * This is the ONLY file in the codebase that knows the database is Neon.
 * Everything else goes through lib/repositories/*, which imports `getDb()` and
 * nothing vendor-specific. Moving to Supabase, RDS, or plain local Postgres is
 * a change to this file plus a driver swap — not a rewrite.
 * See docs/decisions/0002-database.md.
 *
 * The Neon HTTP driver speaks to Postgres over fetch rather than a TCP socket,
 * which is what makes it safe in a serverless function: there is no connection
 * pool to exhaust because there are no persistent connections.
 *
 * Constructed lazily so that importing this module never requires DATABASE_URL
 * to be present — see lib/env.ts.
 */

let client: NeonHttpDatabase<typeof schema> | undefined;

export function getDb(): NeonHttpDatabase<typeof schema> {
  if (!client) {
    client = drizzle(neon(env.databaseUrl), { schema });
  }
  return client;
}

export { schema };
