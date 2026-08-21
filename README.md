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
accessibility is 100 on every page, measured on every push — below 100 fails
the build.

## Checks

```bash
npm run check:format     # prettier
npm run check:contrast   # every token pair, 3 themes × 2 modes
npm run check:copy       # copy conventions the linter cannot see
npm run typecheck
npm run lint
npm test                 # vitest
npm run build
```

CI runs all seven on every push and pull request, cheapest first.

Three of them are the interesting ones. **`check:contrast`** parses
`globals.css` and computes WCAG ratios, so the style guide and the gate read the
same source and cannot disagree. **`check:copy`** catches what style guides lose
to — one spelling of "frontend", one component count across eight files.
**The tests** cover the colour maths, a hand-written frontmatter parser, and the
content's own integrity: every `/work/<slug>` link in the MDX _and in the
components_ has to resolve, and the case study titles quoted in the homepage hero
have to still match the case studies. Renaming a study without updating the hero
is valid TypeScript, passes lint, builds, and 404s for a reader — so a test
catches it instead.

There is deliberately no component rendering in the test suite. `check:contrast`,
strict `jsx-a11y`, and a Lighthouse accessibility score of 100 already cover what
a render assertion would, and better.

## Lighthouse, on every push

```bash
npm run lighthouse           # five pages, three runs each
npm run lighthouse:summary   # the table
```

Five pages, three runs each, scored on Lighthouse's default **mobile** profile —
a mid-range Android on throttled 4G. Desktop scores this site 100 across the
board, which is true and flattering; mobile is what Google ranks on and what
someone opening a link on a phone actually gets, so it is what gets gated.

Accessibility, best practices and SEO **fail the build below 100**. Performance
is a budget rather than a gate, because the homepage hero types its own text and
Lighthouse correctly measures that as slow paint. The largest contentful paint
element on the homepage _is_ the animation. That is a trade that was measured
and taken, not a regression — and the budget is there so that if it gets worse
for some other reason, someone finds out.

Scores land in the GitHub Actions job summary on every run, passing or failing.
A number nobody reads is a number nobody notices moving.

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

**The inspector** (press _Inspect_ in the header) reads computed styles off any
element and resolves them _backwards_ to token names. Anything that resolves to
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
