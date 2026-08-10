# 0005 — Tailored CVs as views, shared by capability URL

**Status:** accepted · **Date:** 2026-08-10

## Context

The requirement: produce a CV aimed at a specific job opening and hand it to a
recruiter as a link. Over a job search that means many CVs that overlap heavily
— the same jobs, mostly the same bullets, reordered and reworded for emphasis.

## Decision

### A CV is a view over canonical content, not a document

`resume` holds only what is genuinely specific to one opening: an internal
title, the target role and company, a headline, a tailored summary. Everything
else is a join:

- `resume_position` — which jobs appear, in what order, with an optional
  summary override
- `resume_highlight` — which individual achievement bullets appear
- `resume_case_study` — which work is surfaced, with an optional blurb override
- `resume_skill` — which skills to foreground

This is why `position_highlight` stores one row per bullet rather than a text
blob. A CV aimed at a design-systems role can include three bullets from a job
while one aimed at a platform role includes a different three — with no
duplicated prose to keep in sync.

The property that makes this worth the extra tables: **fix a job title once and
every CV ever shared shows the correction.** A snapshot model would leave stale
copies in the hands of exactly the people you least want reading them.

### The URL is the credential

A shared CV has no login. Requiring a recruiter to create an account to read a
CV is an effective way to not have the CV read.

The security boundary is therefore the token's entropy, and it is treated as
such: 32 bytes from a CSPRNG, base64url-encoded, generated inside the repository
layer and never accepted as an argument, so no call site can supply a weak one.

Accepted honestly: anyone holding the link can read it and can forward it. This
is a CV — a document whose entire purpose is to be handed to strangers — so the
exposure is bounded by what the document already is. The mitigations are
proportionate rather than theatrical:

- `status = 'revoked'` turns a link off without deleting its history
- `rotateShareToken()` issues a new token, invalidating a link that travelled
  somewhere unintended
- `expires_at` bounds a link's life
- `robots: noindex, nofollow` keeps a pasted token out of search results
- revoked, expired, draft, and nonexistent all return an identical 404, so a
  recipient cannot learn that a link was turned off — or that a particular
  company was ever sent one

### View logging is minimal on purpose

"Did they actually open it" is genuinely useful. But the visitor is a
counterparty in a hiring process, not a user of this site, and they consented to
nothing. So: no cookies, no fingerprinting, no third-party analytics on this
route. The IP is stored only as a salted SHA-256 hash, enough to collapse repeat
views, and rotating `VISITOR_HASH_SALT` severs the link to everything previously
logged.

Hashing an IP is not strong anonymisation — the address space is small enough to
brute force — which is precisely why the salt is secret rather than a constant.

Logging runs in `after()`, so it happens once the response is already sent, and
it swallows its own errors. A failure to record analytics must never stop a
recruiter reading the CV.

## Consequences

- Assembling a CV is one query with several joins rather than a single row read.
  At this scale that is free, and the indexes on the join tables exist.
- Deleting a canonical position removes it from every CV that used it. That is
  the intended behavior of a view, and worth a confirmation step in the admin UI.
- PDF export is not built. When it is, it should render this same view rather
  than becoming a second, divergent representation.
