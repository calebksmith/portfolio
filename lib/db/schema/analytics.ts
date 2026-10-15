import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Who visits the portfolio, and who opened an access link.
 *
 * Kept to what answers "is anyone reading it, from where, and did the link I
 * sent get opened". The visitor is usually someone in a hiring process who
 * consented to nothing, so the rules are the cover letter log's: no cookies of
 * our own, no fingerprinting, no third-party script, and never a raw IP. See
 * docs/decisions/0008-visitor-analytics.md.
 *
 * `visitor_hash` is salted and changes every day, so a visitor counts once per
 * day and cannot be followed from one day to the next. Location is what
 * Vercel's edge already infers from the IP: a country, a region, a city.
 */

const location = {
  /** ISO 3166-1 alpha-2, e.g. "US". */
  country: text("country"),
  /** The country's subdivision code, e.g. "WA". */
  region: text("region"),
  city: text("city"),
};

/** One row per page a person (not a bot) loaded or navigated to. */
export const pageViews = pgTable(
  "page_view",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    viewedAt: timestamp("viewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** The address-bar path, without query or fragment: "/work/login". */
    path: text("path").notNull(),
    visitorHash: text("visitor_hash"),
    ...location,
    /** Another site's host only, e.g. "www.linkedin.com". Never a full URL. */
    referrer: text("referrer"),
    /** The id of the access link the visitor holds, if any. */
    accessLinkId: text("access_link_id"),
  },
  (t) => [
    index("page_view_viewed_idx").on(t.viewedAt),
    index("page_view_link_idx").on(t.accessLinkId),
  ],
);

/**
 * One row per time an access link was opened. A link that has expired or been
 * revoked still counts, with its outcome, since "they tried after it ran out"
 * is worth knowing. A token that isn't one of ours is not recorded.
 */
export const accessLinkOpens = pgTable(
  "access_link_open",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    openedAt: timestamp("opened_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    linkId: text("link_id").notNull(),
    /** "active", "expired" or "revoked". */
    outcome: text("outcome").notNull(),
    visitorHash: text("visitor_hash"),
    ...location,
  },
  (t) => [index("access_link_open_link_idx").on(t.linkId, t.openedAt)],
);
