# 0004 — Case study bodies as MDX stored in the database

**Status:** accepted · **Date:** 2026-08-10

## Context

Case studies are long-form prose with structure — headings, lists, the
occasional embedded component. The two obvious homes are MDX files in the
repository or rows in the database.

## Decision

**Body text is MDX, stored in a `text` column, compiled at render time in a
Server Component.**

MDX files in the repository were rejected for one reason that outweighs their
very real advantages (editing in a proper editor, free version history): a
tailored CV needs to reference a case study, reorder it against others, and
sometimes override its summary for one recipient. Those are foreign keys. With
prose in files and metadata in rows, there are two sources of truth and a whole
category of bug where they disagree.

**Rendering happens on the server** via `next-mdx-remote/rsc`, so no MDX runtime
reaches the browser.

**The component map is a guardrail, not a convenience.** Prose written in the
admin panel cannot introduce its own colors, spacing, or type, because every
element it can produce is mapped in `components/mdx.tsx` to a token-styled
component. Content decides structure; that file decides appearance. Extending
what authors can express means adding a mapped component, not permitting raw
HTML.

## Consequences

- Authoring depends on the admin editor existing. Until it does, content is
  seeded by script or by hand.
- Version history for prose is whatever the database provides. If revision
  history matters later, that is a `case_study_revision` table, not a return to
  files.
- A malformed MDX body is a render error on one route rather than a build
  failure, which is the right blast radius.
