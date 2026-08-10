/**
 * The complete database schema.
 *
 * drizzle-kit reads this file to generate migrations, and the Drizzle client is
 * constructed with it so the relational query API works. Every new table must
 * be re-exported here or it will silently not exist.
 */

export * from "./auth";
export * from "./content";
export * from "./resume";
