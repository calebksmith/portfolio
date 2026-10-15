# 0008 — A visitor log of our own

**Status:** accepted · **Date:** 2026-10-15

## Context

Three questions come up in a job search: is anyone reading the portfolio, where
are they, and did the access link I sent get opened. The site couldn't answer
any of them.

Vercel Web Analytics would answer the first two from a dashboard. It can't
answer the third: opening an access link is a server redirect that its page
script never sees. And ADR 0005 already settled how this site treats its
readers, who are mostly people in a hiring process who consented to nothing: no
cookies, no fingerprinting, no third-party analytics, never a raw IP.

## Decision

**Two tables in the existing database**, `page_view` and `access_link_open`,
and nothing else on the page. A small client component sends one POST to
`/api/view` each time the path changes, so navigations inside the site count as
well as first loads. Opening `/access/<token>` is counted by the route itself.
Both write after the response is sent and swallow their errors.

**What a row holds.** A path, a time, a location, and a hash. The location is
the country, region and city Vercel's edge already adds as headers; nothing
here looks an address up. The hash is a SHA256 digest of a secret salt, the
day, the IP and the user agent, so a visitor counts once a day and can't be
followed from one day to the next. Rotating `VISITOR_HASH_SALT` severs every hash. A
referrer is kept as another site's host, never its full URL.

**Access links.** An open is counted when the token is genuinely ours, with
whether it was still active, expired or revoked. A token that isn't ours
isn't recorded, so a guess leaves no trace. Page views from someone holding a
link carry that link's id, read from the cookie the link already sets.

**Bots are left out twice.** The beacon is page script, which crawlers mostly
don't run, and both routes drop known crawler, unfurler and headless agents.

**Reading it is a terminal command**, `npm run analytics:report`, like the
access links it reports on. It reads the database, matches link ids to names
from the gitignored `private/access-links.json`, and prints Markdown or JSON.
The site has no page that shows the numbers.

## Consequences

- Production needs `DATABASE_URL` and `VISITOR_HASH_SALT` in Vercel, and
  `npm run db:migrate` run once against that database. Until then nothing is
  recorded and nothing breaks.
- The cover letter routes now need a GitHub OAuth app as well as a database to
  appear (`lib/flags.ts`), because the database arrives first.
- "Visitors" are visitor-days. A person on two networks, or two people behind
  one office IP with the same browser, are miscounted. Fine for this scale.
- A mail scanner that opens links with a browser's user agent counts as an
  open. A page view carrying the link's id is the stronger sign a person
  arrived.
- My own visits count too. Filtering them out isn't worth building yet.
