@AGENTS.md

# calebksmith.com

Personal portfolio for Caleb Smith — product designer and design engineer.
Positioning: design systems, production frontend, and AI guardrails for
design-to-code.

The site is a work sample. Every decision should survive the question:
*would an engineer interviewing me respect this?*

Project background and build order: `docs/PROJECT-CONTEXT.md`.
Approved copy for every page: `docs/copy-deck.md` — use it, don't rewrite it.
Architecture rationale: `docs/decisions/`.

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
  `primary/primary-foreground`, `accent/accent-foreground`. A surface class
  always travels with its foreground — `bg-card text-card-foreground`, never
  `bg-card text-foreground`. This is what makes a new theme a value swap.
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
  Page-level content as literal text is fine.

### Accessibility — non-negotiable

- Semantic HTML. No click handlers on non-interactive elements.
- Everything keyboard-operable, with a visible `:focus-visible` style.
- WCAG AA contrast in every theme and both modes.
- Touch targets ≥ 44px — use `min-h-tap` / `min-w-tap`.
- Honor `prefers-reduced-motion` for every animation and transition.
- `eslint-plugin-jsx-a11y` (strict) runs on lint; do not disable rules to pass.

### Content

- Case studies live as MDX in `src/content/work/*.mdx` with frontmatter:
  `title, role, year, platforms, summary, weight`.
- Adding a case study should mean adding a file, not editing components.
- The content layer must accept structured data, not just prose.

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

`lib/flags.ts` decides. Production serves the landing page only; preview and
development serve everything. Routes that aren't published call `notFound()`.

## Voice

Plain and specific. Active voice, sentence case. Say what a thing does rather
than selling it. No filler adjectives. If a sentence could appear on any
designer's portfolio, cut or rewrite it.

Fine to use: double diamond, atomic design, generative and evaluative research,
design tokens, component library. Avoid `cva`, `semver`, and other library- or
spec-level terms in user-facing copy — say "style variants," "versioned
releases."

Metrics in copy are approved and defensible. Do not invent or extrapolate.

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
- Use product screenshots from behind Vimocity's paywall. The public Storybook
  at vimui.vimocity.com is the interactive proof; link and embed from it.
