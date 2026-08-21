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

**No installed UI library. A library we own instead: cksUI.**

_Superseded an earlier version of this ADR that proposed adopting shadcn/ui for
the admin surface. `PROJECT-CONTEXT.md` is explicit — "no UI component library;
the point of this site is that he builds the UI" — and that constraint is
correct for a portfolio whose central claim is owning a design system._

The distinction that resolves it: shadcn/ui is not a library you install. It is
source you copy in and own. So `components/cksui/` is built on its patterns —
Radix primitives for behavior, `cva` for variants, `data-slot` on every
component — with every visual value rewritten onto the `--ck-*` pairs. No
`node_modules` package ships anyone else's UI, and there is no second design
system running alongside the first.

Radix is a dependency, and a justified one: it supplies focus management,
keyboard interaction, and ARIA, which is the expensive part to get right and the
part where a subtle mistake is invisible until it reaches someone using a screen
reader.

The side benefit is that cksUI stands in the same relation to this site that
VimUI does to Vimocity's product — which makes the portfolio itself an example
of the thing it claims.

**Cache Components is not enabled.** Next 16 ships `cacheComponents: true`,
which turns on Partial Prerendering and requires every uncached read to sit
behind an explicit `<Suspense>` boundary. The structural discipline it enforces
is good and the code here is already written in that shape — data access pushed
toward the leaves, no `await params` at layout level. It is left off until the
database-backed routes exist and can be verified against it, rather than turned
on speculatively against routes that are still shells.

## Consequences

- Adding a color means editing one file. Adding a color _without_ editing that
  file is a reviewable error.
- The public site's performance floor is high, because there is nothing to
  hydrate.
- Two visual idioms will coexist — hand-rolled public pages and a
  library-assisted admin. They share tokens, which is what keeps that honest.
