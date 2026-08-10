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

import {
  caseStudies,
  positionHighlights,
  positions,
  skills,
} from "./content";

/**
 * Tailored CVs.
 *
 * The central idea: a CV is not a document, it is a *view* over the canonical
 * content in ./content.ts — a selection, an ordering, and an optional override.
 * Nothing is copied. Fix a job title once and every CV you have ever shared
 * shows the correction.
 *
 * Each CV is reachable at /cv/<share_token> by anyone holding the link. There
 * is no login for the recruiter, so the token is the credential — see
 * docs/decisions/0005-shareable-cvs.md for the threat model and why that is an
 * acceptable trade for this use case.
 */

export const resumeStatus = pgEnum("resume_status", [
  "draft",
  "shared",
  "revoked",
]);

export const resumes = pgTable("resume", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Internal label, never shown to the recipient. e.g. "Acme — Staff FE". */
  title: text("title").notNull(),
  targetRole: text("target_role"),
  targetCompany: text("target_company"),
  /** Headline shown at the top of the rendered CV. */
  headline: text("headline"),
  /** Tailored opening paragraph. MDX, same pipeline as case study bodies. */
  summary: text("summary"),

  /**
   * The capability URL. High-entropy and unguessable; generated in the
   * repository layer, never accepted from user input.
   */
  shareToken: text("share_token").notNull().unique(),

  status: resumeStatus("status").notNull().default("draft"),
  /** NULL means the link never expires. */
  expiresAt: timestamp("expires_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* -------------------------------------------------------------------------- */
/* Selection tables                                                            */
/* -------------------------------------------------------------------------- */

/** Which jobs appear on this CV, in what order, optionally reworded. */
export const resumePositions = pgTable(
  "resume_position",
  {
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    positionId: uuid("position_id")
      .notNull()
      .references(() => positions.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    /** Replaces positions.summary for this CV only. NULL = use canonical. */
    summaryOverride: text("summary_override"),
  },
  (t) => [
    primaryKey({ columns: [t.resumeId, t.positionId] }),
    index("resume_position_position_idx").on(t.positionId),
  ],
);

/** Which achievement bullets appear, chosen per CV. */
export const resumeHighlights = pgTable(
  "resume_highlight",
  {
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    highlightId: uuid("highlight_id")
      .notNull()
      .references(() => positionHighlights.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.resumeId, t.highlightId] }),
    index("resume_highlight_highlight_idx").on(t.highlightId),
  ],
);

/** Which case studies are surfaced, with an optional CV-specific blurb. */
export const resumeCaseStudies = pgTable(
  "resume_case_study",
  {
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    caseStudyId: uuid("case_study_id")
      .notNull()
      .references(() => caseStudies.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    /** Replaces caseStudies.summary for this CV only. */
    blurbOverride: text("blurb_override"),
  },
  (t) => [
    primaryKey({ columns: [t.resumeId, t.caseStudyId] }),
    index("resume_case_study_case_study_idx").on(t.caseStudyId),
  ],
);

/** Which skills to foreground for this particular opening. */
export const resumeSkills = pgTable(
  "resume_skill",
  {
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skills.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.resumeId, t.skillId] }),
    index("resume_skill_skill_idx").on(t.skillId),
  ],
);

/* -------------------------------------------------------------------------- */
/* Access log                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * One row per view of a shared CV — the "did they actually open it" signal.
 *
 * Deliberately minimal. The visitor is a job applicant's counterparty, not a
 * user of this site, and they never consented to analytics: no cookies, no
 * fingerprinting, and the IP is stored only as a salted hash so repeat views
 * can be collapsed without the raw address ever being written down.
 */
export const resumeViews = pgTable(
  "resume_view",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Salted hash. Never store the raw IP. */
    visitorHash: text("visitor_hash"),
    userAgent: text("user_agent"),
    referrer: text("referrer"),
  },
  // The fastest-growing table, and always read as "latest views for this CV".
  (t) => [index("resume_view_resume_idx").on(t.resumeId, t.viewedAt)],
);

/* -------------------------------------------------------------------------- */
/* Relations                                                                   */
/* -------------------------------------------------------------------------- */

export const resumesRelations = relations(resumes, ({ many }) => ({
  positions: many(resumePositions),
  highlights: many(resumeHighlights),
  caseStudies: many(resumeCaseStudies),
  skills: many(resumeSkills),
  views: many(resumeViews),
}));

export const resumePositionsRelations = relations(
  resumePositions,
  ({ one }) => ({
    resume: one(resumes, {
      fields: [resumePositions.resumeId],
      references: [resumes.id],
    }),
    position: one(positions, {
      fields: [resumePositions.positionId],
      references: [positions.id],
    }),
  }),
);

export const resumeHighlightsRelations = relations(
  resumeHighlights,
  ({ one }) => ({
    resume: one(resumes, {
      fields: [resumeHighlights.resumeId],
      references: [resumes.id],
    }),
    highlight: one(positionHighlights, {
      fields: [resumeHighlights.highlightId],
      references: [positionHighlights.id],
    }),
  }),
);

export const resumeCaseStudiesRelations = relations(
  resumeCaseStudies,
  ({ one }) => ({
    resume: one(resumes, {
      fields: [resumeCaseStudies.resumeId],
      references: [resumes.id],
    }),
    caseStudy: one(caseStudies, {
      fields: [resumeCaseStudies.caseStudyId],
      references: [caseStudies.id],
    }),
  }),
);

export const resumeSkillsRelations = relations(resumeSkills, ({ one }) => ({
  resume: one(resumes, {
    fields: [resumeSkills.resumeId],
    references: [resumes.id],
  }),
  skill: one(skills, {
    fields: [resumeSkills.skillId],
    references: [skills.id],
  }),
}));

export const resumeViewsRelations = relations(resumeViews, ({ one }) => ({
  resume: one(resumes, {
    fields: [resumeViews.resumeId],
    references: [resumes.id],
  }),
}));
