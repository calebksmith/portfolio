/**
 * Read the visitor log: page views, where visitors are, and access link opens.
 *
 *   npm run analytics:report                 the last 30 days, as Markdown
 *   npm run analytics:report -- 90           the last 90 days
 *   npm run analytics:report -- 30 --json    the same numbers as JSON
 *
 * Reads the production database through DATABASE_URL in .env.local. Access
 * link ids are matched to who they were sent to from private/access-links.json,
 * which stays on this machine; the database only ever holds the ids.
 *
 * "Visitors" are visitor-days: the hash changes daily (ADR 0008), so someone
 * who comes back on three days counts three times. "Unique views" count each
 * visitor once per page per day.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { neon } from "@neondatabase/serverless";

const args = process.argv.slice(2);
const json = args.includes("--json");
const days = Number(args.find((arg) => /^\d+$/.test(arg)) ?? 30);

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL isn't set. Add the production one to .env.local.",
  );
  process.exit(1);
}
const sql = neon(process.env.DATABASE_URL);
const since = new Date(Date.now() - days * 864e5);

async function registry() {
  try {
    const path = join(process.cwd(), "private/access-links.json");
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return [];
  }
}

const [[totals], pages, places, opens, linkVisits, links] = await Promise.all([
  sql.query(
    `select count(*)::int as views,
            count(distinct (visitor_hash, path, viewed_at::date))::int as unique_views,
            count(distinct visitor_hash)::int as visitors
       from page_view where viewed_at >= $1`,
    [since],
  ),
  sql.query(
    `select path, count(*)::int as views,
            count(distinct (visitor_hash, viewed_at::date))::int as unique_views
       from page_view where viewed_at >= $1
      group by path order by unique_views desc, views desc`,
    [since],
  ),
  sql.query(
    `select coalesce(country, '?') as country, coalesce(region, '') as region,
            coalesce(city, '') as city,
            count(distinct visitor_hash)::int as visitors,
            count(*)::int as views
       from page_view where viewed_at >= $1
      group by 1, 2, 3 order by visitors desc, views desc`,
    [since],
  ),
  sql.query(
    `select link_id, count(*)::int as opens,
            count(*) filter (where outcome <> 'active')::int as after_expiry,
            min(opened_at) as first_opened, max(opened_at) as last_opened,
            string_agg(distinct nullif(concat_ws(', ', city, region, country), ''), '; ') as places
       from access_link_open where opened_at >= $1
      group by link_id`,
    [since],
  ),
  sql.query(
    `select access_link_id as link_id,
            count(distinct visitor_hash)::int as visitors,
            count(*)::int as views,
            count(distinct path)::int as pages
       from page_view where viewed_at >= $1 and access_link_id is not null
      group by access_link_id`,
    [since],
  ),
  registry(),
]);

const byId = (rows) => new Map(rows.map((row) => [row.link_id, row]));
const openRows = byId(opens);
const visitRows = byId(linkVisits);
const ids = new Set([
  ...links.map((l) => l.id),
  ...openRows.keys(),
  ...visitRows.keys(),
]);
const accessLinks = [...ids].map((id) => {
  const link = links.find((l) => l.id === id);
  const open = openRows.get(id);
  const visit = visitRows.get(id);
  return {
    id,
    to: link?.to ?? "(not in this machine's registry)",
    opens: open?.opens ?? 0,
    opensAfterExpiry: open?.after_expiry ?? 0,
    firstOpened: open?.first_opened ?? null,
    lastOpened: open?.last_opened ?? null,
    openedFrom: open?.places ?? null,
    visitorsWithLink: visit?.visitors ?? 0,
    pagesViewedWithLink: visit?.views ?? 0,
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  since: since.toISOString(),
  days,
  totals,
  pages,
  places,
  accessLinks,
};

if (json) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

const day = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "—";
const table = (head, rows) =>
  [
    `| ${head.join(" | ")} |`,
    `| ${head.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");

console.log(`# Portfolio analytics, last ${days} days

Since ${day(report.since)} · generated ${report.generatedAt}

${totals.views} page views · ${totals.unique_views} unique · ${totals.visitors} visitors

## Pages

${table(
  ["Page", "Unique views", "Views"],
  pages.map((p) => [p.path, p.unique_views, p.views]),
)}

## Where visitors are

${table(
  ["Country", "Region", "City", "Visitors", "Views"],
  places.map((p) => [p.country, p.region, p.city, p.visitors, p.views]),
)}

## Access links

${table(
  [
    "For",
    "Id",
    "Opens",
    "After expiry",
    "First",
    "Last",
    "Opened from",
    "Visitors",
    "Pages viewed",
  ],
  accessLinks.map((l) => [
    l.to,
    l.id,
    l.opens,
    l.opensAfterExpiry,
    day(l.firstOpened),
    day(l.lastOpened),
    l.openedFrom ?? "—",
    l.visitorsWithLink,
    l.pagesViewedWithLink,
  ]),
)}`);
