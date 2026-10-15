/**
 * The complete database schema.
 *
 * Deliberately small. Case studies are MDX files (ADR 0004) and the résumé is
 * structured data in lib/content/, so neither needs a table. What is left is
 * the things that genuinely require a database: who is signed in, the cover
 * letters written per opening plus their view log, and the visitor log for the
 * portfolio and its access links.
 *
 * drizzle-kit reads this file to generate migrations, and the client is
 * constructed with it so the relational query API works. A new table must be
 * re-exported here or it will silently not exist.
 */

export * from "./auth";
export * from "./cover-letter";
export * from "./analytics";
