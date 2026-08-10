import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

/**
 * Auth.js tables.
 *
 * The shape here is dictated by @auth/drizzle-adapter — the TypeScript property
 * names must match what the adapter expects, so resist renaming them even where
 * they break this project's snake_case habit. The database column names are
 * ours to choose, which is why they are snake_case below.
 *
 * These are database sessions, not JWTs. That is a deliberate choice: it means
 * every leg of the OAuth authorization-code flow leaves a row you can inspect.
 * After signing in with GitHub you can literally SELECT from `account` and see
 * the access token GitHub handed back in exchange for the authorization code.
 * See docs/decisions/0003-authentication.md.
 */

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

/**
 * One row per linked OAuth provider. Populated at the end of the
 * authorization-code exchange: `access_token` and friends are what the provider
 * returned when Auth.js POSTed the one-time code to its token endpoint.
 */
export const accounts = pgTable(
  "account",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    index("account_user_idx").on(account.userId),
  ],
);

/** The opaque session token stored in the browser cookie maps to a row here. */
export const sessions = pgTable(
  "session",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  // Needed to cascade a user delete without a sequential scan.
  (session) => [index("session_user_idx").on(session.userId)],
);

/** Unused with OAuth-only sign-in, but the adapter contract requires it. */
export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);
