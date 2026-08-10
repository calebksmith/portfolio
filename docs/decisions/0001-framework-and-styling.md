# 0001 — Framework, styling, and the absence of a component library

**Status:** accepted · **Date:** 2026-08-10

## Context

A portfolio site that will grow three database-backed surfaces: published case
studies, job history, and per-opening tailored CVs shared by link. It is built
and maintained by one person, deployed to Vercel, and its own construction is
meant to be presentable as evidence of judgment.

## Decision

**Next.js 16, App Router, React Server Components by default.** Nearly every
page is a read of content the visitor did not personalise, which is exactly the
shape server rendering is good at. The landing page and sign-in page ship zero
application JavaScript. Client components are added at the leaf when an
interaction genuinely needs one.

**TypeScript in strict mode**, because the value of a typed schema is lost the
moment `any` is allowed to leak out of the data layer.

**Tailwind v4, configured CSS-first.** v4 moved configuration out of
`tailwind.config.js` and into the stylesheet via `@theme`. That is a good fit
here: the `--ck-*` design tokens and the Tailwind utility namespace are defined
in the same file, twelve lines apart, so they cannot drift.

**No component library on the public site.** The design is deliberately not the
consensus portfolio look, and a component library's purpose is to converge on
the consensus. There is also very little to build — a spec table and some type.

**A component library is expected for the admin surface**, where the real UI
lives: forms, reorderable lists, multi-selects, dialogs. shadcn/ui is the
intended choice, because it is copied into the repository as owned source rather
than installed as a dependency, which means its classes can be rewritten onto
the `--ck-*` tokens instead of running a second parallel design system. Radix
underneath handles the expensive part — focus management, keyboard interaction,
ARIA.

**Cache Components is not enabled.** Next 16 ships `cacheComponents: true`,
which turns on Partial Prerendering and requires every uncached read to sit
behind an explicit `<Suspense>` boundary. The structural discipline it enforces
is good and the code here is already written in that shape — data access pushed
toward the leaves, no `await params` at layout level. It is left off until the
database-backed routes exist and can be verified against it, rather than turned
on speculatively against routes that are still shells.

## Consequences

- Adding a color means editing one file. Adding a color *without* editing that
  file is a reviewable error.
- The public site's performance floor is high, because there is nothing to
  hydrate.
- Two visual idioms will coexist — hand-rolled public pages and a
  library-assisted admin. They share tokens, which is what keeps that honest.
