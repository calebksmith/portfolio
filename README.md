# calebksmith.com

Personal site for Caleb Smith — design engineer. It is also the work sample: the
component library, the token system, and the checks that hold them are the point,
not the decoration.

**Live:** [calebksmith.com](https://calebksmith.com) ·
**Why it is built this way:** [/colophon](https://calebksmith.com/colophon) ·
**What it is built from:** [/style-guide](https://calebksmith.com/style-guide)

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment variables are needed for the public site. `/admin` and
`/letter/[token]` need the values in `.env.example`; without them those routes
are the only thing that will not run.

---

## The idea

Three rules, each enforced by something that runs rather than by remembering:

**Every colour, size, and duration resolves to a `--ck-*` token.** A hex value in
a component is a reviewable error. Themes are alternate value sets for the same
names, which is what makes the high-contrast theme a value swap instead of a
rewrite.

**Every surface travels with its foreground.** `bg-card text-card-foreground`,
never `bg-card text-foreground`. Contrast is a property of the pair, so the pair
is the unit — and every pair is measured, in all three themes and both modes,
by a script that reads `globals.css` directly and therefore cannot disagree with
what ships.

**Accessibility is a gate, not an intention.** WCAG AA everywhere, AAA in the
high-contrast theme, 44px minimum targets, `prefers-reduced-motion` honoured by
every animation, and `eslint-plugin-jsx-a11y` running strict. Lighthouse
accessibility is 100 on every page.

## Checks

```bash
npm run check:contrast   # every token pair, 3 themes × 2 modes
npm run check:copy       # copy conventions the linter cannot see
npm run typecheck
npm run lint
npm run build
```

CI runs all five on every push and pull request. `check:contrast` and
`check:copy` are the interesting two: the first parses the stylesheet and
computes WCAG ratios so the documentation and the gate read the same source; the
second catches the things style guides lose to — one spelling of "frontend", one
component count across eight files.

## Layout

```
app/
  (site)/          public pages, and the chrome they share
  (admin)/         authenticated, gated per route
  letter/[token]/  a cover letter behind an unguessable URL
  opengraph-image  link preview, generated from lib/site.ts
components/cksui/  the component library — copied-in source, not a dependency
lib/               content layer, tokens, inspector, auth guard
src/content/work/  case studies as MDX; adding one is adding a file
scripts/           the two checks
docs/decisions/    architecture decision records
```

**cksUI** is built on shadcn/ui's patterns — copied-in source, Radix for
behaviour, `cva` for variants — with every value rewritten onto the tokens. It is
source this repository owns, which is the whole reason it can be held to the
rules above.

**The inspector** (press *Inspect* in the header) reads computed styles off any
element and resolves them *backwards* to token names. Anything that resolves to
no token is a violation, and the panel says so rather than hiding it.

## Deliberately absent

- **No UI library.** Installing one would run a second design system beside this
  one.
- **No CMS.** Case studies are MDX in the repository; the content layer reads
  files at module scope so they are baked into static HTML.
- **No committed PDF résumé, no committed OG image.** Both would be second copies
  of content that lives elsewhere, stale the moment it changes. Both are
  generated.
- **No browser storage.** Theme preference is a cookie, read by a script before
  first paint, so there is no flash.
- **Cache Components are off.** Considered, not overlooked — see
  `docs/decisions/0001`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 ·
Drizzle + Neon · Auth.js · deployed on Vercel from `main`.

Conventions and constraints are in `CLAUDE.md`, which is written for whoever
works on this next — human or otherwise.
