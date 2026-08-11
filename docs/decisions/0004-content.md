# 0004 — Case studies as MDX files, structured data in Postgres

**Status:** accepted · **Date:** 2026-08-11
**Supersedes:** the original 0004, which put case study bodies in the database.

## Context

Case studies are long-form prose with structure — headings, lists, the
occasional embedded component. The two candidate homes are MDX files in the
repository or rows in the database.

An earlier version of this decision chose the database, reasoning that a
tailored CV needs to reference a case study and that foreign keys are the honest
way to model that.

`PROJECT-CONTEXT.md` overrides it, and it is right to:

> Case studies live as MDX in `src/content/work/*.mdx` with frontmatter.
> Adding a case study should mean adding a file, not editing components.

## Decision

**Case study prose lives in `src/content/work/*.mdx`.** Frontmatter carries
`title, role, year, platforms, summary, weight`. The bento index maps over the
files; adding one is adding a file.

Reasons the file wins here that the earlier reasoning undervalued:

- Case studies are written in long sittings, in an editor, with revisions. That
  is what a text file and git are for. A web form is a worse authoring surface
  for the most important writing on the site.
- Version history for the strongest claims on the portfolio comes free and is
  reviewable in a pull request.
- The site can be cloned and run with no database at all, which matters for a
  repo that may be public as a work sample.

**Structured data stays in Postgres.** Job history, skills, and tailored CVs are
records, not prose, and the CV feature needs runtime writes. The context
document anticipates this — "design the content layer to accept structured data,
not just prose."

**A CV references a case study by slug, not foreign key.** That is the cost of
the split: the database cannot enforce that a referenced case study exists. A
build-time check that every referenced slug resolves to a file is the mitigation,
and it is cheap.

**MDX is compiled in a Server Component**, so no MDX runtime reaches the browser.
The component map in `components/mdx.tsx` remains the guardrail: prose cannot
introduce its own colors, spacing, or type, because every element it can produce
maps to a token-styled component. Content decides structure; that file decides
appearance.

## Consequences

- The `case_study` table and its `body` column are no longer the source of truth
  for prose. The table is removed rather than left to rot as a second home.
- Editing a case study means editing a file and deploying — no admin screen for
  it, by design.
- A malformed MDX file is a build error rather than a per-route render error.
  That is the right blast radius when the content is committed.
