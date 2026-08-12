import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Cover letters, written per job opening and shared by link.
 *
 * One letter, one opening, one hiring manager. A letter is prose addressed to a
 * specific reader — not a document assembled from reusable parts — so unlike
 * the tailored-CV model this replaces, there is nothing to select and reorder.
 * The letter is the content. See docs/decisions/0005-cover-letters.md.
 *
 * Each letter is reachable at /letter/<share_token> by anyone holding the link.
 * There is no login for the recipient, so the token is the credential.
 */

export const letterStatus = pgEnum("letter_status", [
  "draft",
  "shared",
  "revoked",
]);

export const coverLetters = pgTable(
  "cover_letter",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Internal label, never shown to the recipient. e.g. "Acme — Staff FE". */
    title: text("title").notNull(),

    /** Shown to the recipient, so the letter names what it is for. */
    role: text("role").notNull(),
    company: text("company").notNull(),
    /** Optional, e.g. "Dana Lee" — omitted when the reader is unknown. */
    recipient: text("recipient"),

    /** The letter itself. MDX, rendered by components/mdx.tsx. */
    body: text("body").notNull(),

    /**
     * The capability URL. High-entropy and unguessable; generated in the
     * repository layer and never accepted from user input.
     */
    shareToken: text("share_token").notNull().unique(),

    status: letterStatus("status").notNull().default("draft"),
    /** NULL means the link never expires. */
    expiresAt: timestamp("expires_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("cover_letter_status_idx").on(t.status)],
);

/**
 * Case studies to surface alongside a letter — "the two pieces most relevant to
 * this role".
 *
 * `slug` is a plain column, not a foreign key: case studies are MDX files in
 * src/content/work/, so the database cannot enforce that one exists. That is
 * the accepted cost of ADR 0004, and the mitigation is a build-time check that
 * every referenced slug resolves to a file.
 */
export const coverLetterCaseStudies = pgTable(
  "cover_letter_case_study",
  {
    letterId: uuid("letter_id")
      .notNull()
      .references(() => coverLetters.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.letterId, t.slug] })],
);

/**
 * One row per view — the "did they open it" signal.
 *
 * Deliberately minimal. The reader is a counterparty in a hiring process, not a
 * user of this site, and they consented to nothing: no cookies, no
 * fingerprinting, and the IP stored only as a salted hash so repeat views can
 * be collapsed without the raw address ever being written down.
 */
export const coverLetterViews = pgTable(
  "cover_letter_view",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    letterId: uuid("letter_id")
      .notNull()
      .references(() => coverLetters.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Salted hash. Never store the raw IP. */
    visitorHash: text("visitor_hash"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
  },
  (t) => [index("cover_letter_view_letter_idx").on(t.letterId, t.viewedAt)],
);

export const coverLettersRelations = relations(coverLetters, ({ many }) => ({
  caseStudies: many(coverLetterCaseStudies),
  views: many(coverLetterViews),
}));

export const coverLetterCaseStudiesRelations = relations(
  coverLetterCaseStudies,
  ({ one }) => ({
    letter: one(coverLetters, {
      fields: [coverLetterCaseStudies.letterId],
      references: [coverLetters.id],
    }),
  }),
);

export const coverLetterViewsRelations = relations(
  coverLetterViews,
  ({ one }) => ({
    letter: one(coverLetters, {
      fields: [coverLetterViews.letterId],
      references: [coverLetters.id],
    }),
  }),
);
