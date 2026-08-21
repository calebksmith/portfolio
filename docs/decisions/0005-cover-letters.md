# 0005 — Cover letters, shared by capability URL

**Status:** accepted · **Date:** 2026-08-12
**Supersedes:** 0005 — Tailored CVs, which solved the wrong problem.

## Context

The original requirement was recorded as "tailored CVs": a CV assembled per job
opening and shared by link. That was a misreading, carried from the first
conversation about this site and not caught until the model was built.

The actual need is **cover letters** — a letter written for one opening and sent
to one hiring manager, at a link.

The difference is not cosmetic. A CV is a document assembled from reusable
parts, which is why the old model was a _view_: joins selecting positions,
bullets, and skills, with overrides. A cover letter is prose addressed to a
specific reader. There is nothing to select and reorder. Building selection
machinery for it would be elaborate infrastructure around a `text` column.

## Decision

**A cover letter is one row of prose.** `cover_letter` holds an internal title,
the role and company it names, an optional recipient, and an MDX body. Nothing
is assembled.

**HTML only. No PDF.** A letter is a page someone opens once from an email. A
downloadable file would be a second artifact of the same content that goes stale
the moment a sentence changes — and unlike the résumé, nobody uploads a cover
letter to an applicant tracking system.

**A letter may reference case studies by slug.** "The two pieces most relevant
to this role" is the one genuinely useful structured addition. `slug` is a plain
column, not a foreign key, because case studies are MDX files (ADR 0004); the
database cannot enforce that one exists, and a build-time check is the
mitigation.

**The URL is the credential.** No login: asking a hiring manager to register to
read a cover letter is an effective way to not have it read. The boundary is the
token's entropy — 32 bytes from a CSPRNG, generated in the repository layer and
never accepted as an argument.

Accepted honestly: anyone holding the link can read and forward it. Mitigations
are proportionate rather than theatrical — revoke, rotate, expire, `noindex`,
and an identical 404 for revoked, expired, draft, and nonexistent alike, so a
recipient cannot learn a link was turned off, or that a particular company was
ever written to.

**View logging stays minimal.** "Did they open it" is the single most useful
signal in a job search. But the reader is a counterparty in a hiring process who
consented to nothing: no cookies, no fingerprinting, no third-party analytics.
The IP is stored only as a salted hash, and rotating the salt severs the link to
everything previously logged. Hashing an IP is not strong anonymisation, which
is exactly why the salt is secret. The write happens after the response is sent
and swallows its errors — analytics failing must never stop a letter being read.

## Consequences

- **Six tables were removed**, not migrated: `case_study`, `case_study_tag`,
  `tag`, `position`, `position_highlight`, and `skill`. Every one existed to
  assemble a tailored CV. Case studies are files (ADR 0004) and the résumé is
  structured data in `lib/content/resume.ts`, so none of them had a reader left.
  The migration had never been applied anywhere, so it was regenerated rather
  than migrated.
- The database is now auth plus cover letters. That is a much better match for
  "simple databases" than what it replaced.
- `/cv/[token]` became `/letter/[token]`. No links were ever shared from the old
  path, so there is no redirect.
- If tailored CVs are ever genuinely wanted, this decision is not in the way —
  but it should be driven by a real need rather than a misremembered one.
