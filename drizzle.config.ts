import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * drizzle-kit configuration.
 *
 * Migrations are generated as plain SQL files into ./drizzle and committed to
 * the repository. That is deliberate: schema changes are reviewable in a pull
 * request as SQL, and production is never migrated by a process that infers
 * what to do at runtime.
 *
 *   npm run db:generate   write a migration from schema changes
 *   npm run db:migrate    apply pending migrations
 *   npm run db:studio     browse the data
 */
export default defineConfig({
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
