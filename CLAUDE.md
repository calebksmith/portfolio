@AGENTS.md

# calebksmith.com

Personal portfolio for Caleb Smith — product designer and design engineer.
Positioning: design systems, production frontend, and AI guardrails for
design-to-code.

The site is a work sample. Every decision should survive the question:
_would an engineer interviewing me respect this?_

The site's copy lives in the code that renders it — see **Content** below.
Architecture: `docs/ARCHITECTURE.md`; rationale per decision: `docs/decisions/`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 ·
deployed on Vercel from `main`.

## Rules

These are the same kind of guardrails I maintain on VimUI at work. Follow them.

### Tokens

- All color, type-size, and spacing values resolve to a `--ck-*` custom property
  defined in `app/globals.css`. No raw hex, no `rgb()`, no arbitrary `[13px]`.
- Need a value that doesn't exist? Add it to the token block first, then use it.
- **Colors are paired, not flat.** Every surface has a foreground:
  `background/foreground`, `card/card-foreground`, `muted/muted-foreground`,
  `primary/primary-foreground`, `accent/accent-foreground`. A surface is only
  drawn with a foreground the contrast gate measures — its own pair, or an
  equivalent measured one (see `ck/paired-surface` below). Don't create a token
  just to complete a pair. This is what makes a new theme a value swap.
- `--ck-border` is the decorative hairline; `--ck-input` is a control boundary
  and is held to 3:1. They are separate tokens for that reason.
- Themes are alternate value sets for the same names, applied via `data-theme`
  on `<html>`. Light/dark via `data-mode`, defaulting to `prefers-color-scheme`.
  Every dark theme is declared twice — in the media query and under
  `[data-mode="dark"]` — and the two must stay identical.
- `npm run check:contrast` proves every pair clears AA (AAA for high contrast)
  in all three themes and both modes. It reads `globals.css` directly. Run it
  after touching a color.

### Components

- **cksUI (`components/cksui/`) is this site's component library.** Built on
  shadcn/ui patterns — copied-in source, Radix for behavior, `cva` for variants
  — restyled onto the `--ck-*` pairs. It is source we own, not a dependency.
  See `components/cksui/README.md` before adding to it.
- Reach for cksUI before writing a one-off. If it isn't there, add it there.
- Function components. Named files in kebab-case.
- Every component sets `data-slot`, so the inspector overlay can report what it
  is. Same attribute and meaning as the VimUI convention.
- No hardcoded user-facing strings inside reusable components — pass via props.
  Pages don't write copy inline either; it comes from the dictionary (see
  **Content**).

### Accessibility — non-negotiable

- Semantic HTML. No click handlers on non-interactive elements.
- Everything keyboard-operable, with a visible `:focus-visible` style.
- WCAG AA contrast in every theme and both modes.
- Touch targets ≥ 44px — use `min-h-tap` / `min-w-tap`.
- Honor `prefers-reduced-motion` for every animation and transition.
- `eslint-plugin-jsx-a11y` (strict) runs on lint; do not disable rules to pass.

### Content

- The repo is the source of truth for copy. There is no separate copy document
  to keep in sync. See `docs/decisions/0006-localization.md`.
- **Interface copy** lives in `lib/i18n/messages/<locale>.ts`, never as a
  literal in a page or component. English defines the shape; other locales
  are typed against it. Inline emphasis uses `<code>`, `<strong>`, `<em>` in
  the string, rendered with `<RichText>`.
- **Long-form copy** is MDX per locale: case studies in
  `src/content/work/<locale>/`, page bodies in `src/content/pages/<locale>/`.
  Internal links in MDX are written locale-free (`/work/login`).
- Internal hrefs go through `localizePath(locale, path)`. Server Components get
  the locale from `getLocale()` / `getMessages()` in `lib/i18n/server.ts`.
- Only English is enabled. Do not add Spanish until asked — the content is
  being revised first.
- Case studies have frontmatter — `title`, `role`, `year`, `stack`, `summary`,
  `user`, `business`, `connects`, `area`, `order`, `impact`. Titles are
  `Name: What it is` — the second part is its own line under the name, so it
  starts with a capital. They are written for a hiring manager skimming in about
  a minute, at roughly 250–400 words:
  - **Problem** — two or three sentences: who it hurt, and why it mattered.
  - **The call** — one blockquote right after the problem: the hardest decision,
    what was weighed (customer needs first, business needs when they win), and
    why. This is the one place a trade-off is argued; don't add more callouts.
  - **What I did** — three to five bullets, each opening with a bold lead-in.
    Where the work started with research, the first bullet says so in a line
    or two: what it found, specific to this feature. Most of these case studies
    started that way, so the process is never boilerplate repeated across them.
  - **Outcome** — the approved figures, caveats attached.
  - **Who did what** — one bold-labelled line.
  - Optional: one "What I'd change" or "Trade-offs" blockquote at the end.
- Structured records — the résumé, skills, selected work — live as typed data
  in `lib/content/resume/<locale>.ts`.
- Adding a case study should mean adding a file, not editing components.
- The content layer must accept structured data, not just prose.

### The gate

The rules above that a parser can check are checked: `eslint-rules/ck.mjs`,
run by `npm run lint` and in CI. Don't silence a rule to pass — fix the code, or
change the rule in the open.

- `ck/no-raw-color` — no hex/rgb/palette colors in class strings.
- `ck/no-arbitrary-px` — no `[Npx]`; use the scale or add a token.
- `ck/paired-surface` — a surface is only drawn with a foreground the contrast
  gate measures (`scripts/contrast-pairs.mjs`). Loose on purpose: any measured
  foreground will do, and inheriting the page foreground is fine where that
  pair is measured. Don't invent a token just to make a pair; measure the
  equivalent one instead.
- `ck/require-data-slot` — exported cksUI components set `data-slot`.
- `ck/no-literal-copy` — no words written into page or library markup.

What the gate can't judge is the `design-review` skill
(`.claude/skills/design-review/`). The same list is public on the style guide
under Rules — keep the three in step when a rule changes.

### Reference material

Employer and client documents are reference only. Read them where they are, or
put them in `private/` (gitignored); never commit them, and never copy them
verbatim — write this site's own version. `npm run check:copy` fails on ticket
keys, private workspace links, and email addresses anywhere in the repo.

## Next.js 16 specifics

This version differs from older App Router code in ways that matter:

- `params` and `searchParams` are **Promises**. Await them.
- Use the generated `PageProps<"/route">` and `LayoutProps<"/route">` types
  rather than hand-writing prop types.
- **Middleware is called Proxy** and lives in `proxy.ts`. There is deliberately
  no `proxy.ts` here — authorization sits next to the data in `requireAdmin()`.
- Cache Components (`use cache`) is **not** enabled. That is considered, not an
  oversight; see `docs/decisions/0001`.
- Consult `node_modules/next/dist/docs/` before writing framework code. It is
  the version actually installed.

## What is published

`lib/flags.ts` decides. The whole portfolio is published. The cover-letter
system (sign-in, admin, letters) turns on only where `DATABASE_URL` is set, and
in development; elsewhere those routes call `notFound()`. Screenshots from
inside Vimocity's app are shown only to people with a personal access link
(`npm run access:link`); everyone else sees a note in their place.

## Voice

Plain and specific. Active voice, sentence case. Say what a thing does rather
than selling it. No filler adjectives. If a sentence could appear on any
designer's portfolio, cut or rewrite it.

Fine to use: double diamond, atomic design, generative and evaluative research,
design tokens, component library. Avoid `cva`, `semver`, and other library- or
spec-level terms in user-facing copy — say "style variants," "versioned
releases."

Metrics in copy are approved and defensible. Do not invent or extrapolate.
One number, one meaning: "about 80%" is always the share of prototyped frontend
code that reaches production, wherever it appears. Product metrics are figures
Caleb has approved for publication; keep their caveats attached to the numbers.

**This repo is public.** Source material stays out of it: internal reports,
analytics exports, raw data, and anything else from an employer. Only the
approved figures, as they appear in the copy, are committed. Employer product
metrics appear as percentages, ratios, or multiples — never raw counts of
users, organizations, or events. The one exception is the company-scale line
on the résumé (~50,000 users across 75+ organizations).

**Case study badges name the stack** — `Next.js`, `Storybook`, `shadcn/ui`. This
is the one place library-level terms belong in user-facing copy, because naming
the tool is the information. Everywhere else the rule above still holds.

**Frontend is one word.** Not "front-end", not "front end" — in body copy, labels,
frontmatter, and spec rows alike. No exceptions — `npm run check:copy` enforces
it across `app`, `components`, `lib`, `src`, and `docs`.

## Before opening a PR

```
npm run check:contrast
npm run check:copy
npm run typecheck
npm run lint
npm run build
```

Then: dark mode checked with the theme flipped, keyboard pass through every
interactive element, Lighthouse accessibility and performance ≥ 95.

## Do not

- Add a dependency without a clear reason it beats writing it.
- Use `localStorage` or any browser storage. Cookies or server state only.
- Install a UI library. cksUI is the UI — copied-in source we own is the point.
- Put a screenshot from behind Vimocity's login in the repository. Screens
  anyone can open without an account (the login, a shared playlist, the public
  Storybook at vimui.vimocity.com) are ordinary images, allowlisted in
  `lib/content/integrity.test.ts`. Everything else is a `<GatedFigure>`, served
  from the private Blob store. See `docs/decisions/0007-gated-screens.md`.
