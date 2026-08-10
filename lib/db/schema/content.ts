import { relations } from "drizzle-orm";
import {
  boolean,
  date,
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
 * Canonical portfolio content: case studies, job history, and skills.
 *
 * This is the source of truth. Tailored CVs (see ./resume.ts) never copy any of
 * it — they select from it and reorder it. That way fixing a typo in a job
 * title fixes it in every CV you have ever shared.
 */

export const publishStatus = pgEnum("publish_status", [
  "draft",
  "published",
  "archived",
]);

/* -------------------------------------------------------------------------- */
/* Job history                                                                 */
/* -------------------------------------------------------------------------- */

export const positions = pgTable(
  "position",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organization: text("organization").notNull(),
    title: text("title").notNull(),
    /** e.g. "Full-time", "Contract", "Freelance". */
    employmentType: text("employment_type"),
    location: text("location"),
    startDate: date("start_date").notNull(),
    /** NULL means this is the current role. */
    endDate: date("end_date"),
    /** Short paragraph of context. Individual achievements go in highlights. */
    summary: text("summary"),
    status: publishStatus("status").notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  // Matches the public listing: filter by status, order by start date.
  (t) => [index("position_status_start_idx").on(t.status, t.startDate)],
);

/**
 * Achievement bullets, stored one row per bullet rather than as a text blob.
 *
 * This granularity is the whole point: a CV tailored to a design-systems role
 * can include three bullets from a job while a CV tailored to a platform role
 * includes a different three, with no duplicated prose to keep in sync.
 */
export const positionHighlights = pgTable(
  "position_highlight",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    positionId: uuid("position_id")
      .notNull()
      .references(() => positions.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  // Every job render fetches its bullets by position_id, already ordered.
  (t) => [
    index("position_highlight_position_idx").on(t.positionId, t.sortOrder),
  ],
);

/* -------------------------------------------------------------------------- */
/* Case studies                                                                */
/* -------------------------------------------------------------------------- */

export const caseStudies = pgTable(
  "case_study",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    /** One-paragraph teaser, used in listings and in CV excerpts. */
    summary: text("summary").notNull(),
    /** MDX source, compiled at render time. See docs/decisions/0004-content.md. */
    body: text("body").notNull(),
    client: text("client"),
    role: text("role"),
    yearStart: integer("year_start"),
    yearEnd: integer("year_end"),
    coverImageUrl: text("cover_image_url"),
    /** Optional link back to the job during which this work happened. */
    positionId: uuid("position_id").references(() => positions.id, {
      onDelete: "set null",
    }),
    status: publishStatus("status").notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
  },
  // The public listing filters on status and orders by featured/sortOrder.
  (t) => [
    index("case_study_status_idx").on(t.status, t.featured, t.sortOrder),
    index("case_study_position_idx").on(t.positionId),
  ],
);

export const tags = pgTable("tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const caseStudyTags = pgTable(
  "case_study_tag",
  {
    caseStudyId: uuid("case_study_id")
      .notNull()
      .references(() => caseStudies.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  // The composite PK indexes case_study_id; the reverse lookup needs its own.
  (t) => [
    primaryKey({ columns: [t.caseStudyId, t.tagId] }),
    index("case_study_tag_tag_idx").on(t.tagId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Skills                                                                      */
/* -------------------------------------------------------------------------- */

export const skills = pgTable("skill", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  /** Grouping label, e.g. "Language", "Framework", "Practice". */
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* -------------------------------------------------------------------------- */
/* Relations                                                                   */
/* -------------------------------------------------------------------------- */

export const positionsRelations = relations(positions, ({ many }) => ({
  highlights: many(positionHighlights),
  caseStudies: many(caseStudies),
}));

export const positionHighlightsRelations = relations(
  positionHighlights,
  ({ one }) => ({
    position: one(positions, {
      fields: [positionHighlights.positionId],
      references: [positions.id],
    }),
  }),
);

export const caseStudiesRelations = relations(caseStudies, ({ one, many }) => ({
  position: one(positions, {
    fields: [caseStudies.positionId],
    references: [positions.id],
  }),
  tags: many(caseStudyTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  caseStudies: many(caseStudyTags),
}));

export const caseStudyTagsRelations = relations(caseStudyTags, ({ one }) => ({
  caseStudy: one(caseStudies, {
    fields: [caseStudyTags.caseStudyId],
    references: [caseStudies.id],
  }),
  tag: one(tags, { fields: [caseStudyTags.tagId], references: [tags.id] }),
}));
