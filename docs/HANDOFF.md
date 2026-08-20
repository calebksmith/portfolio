# Handoff

State as of the last commit. Read `CLAUDE.md` first for the rules; this is just
where things stand.

## What's live

**The portfolio is published.** `calebksmith.com` serves the whole site.
`lib/flags.ts` holds two flags: `showPortfolio()` is unconditional, and
`showLetters()` gates the private half on the presence of `DATABASE_URL` — so
sign-in and admin light up when the environment is configured, and cannot be
published as doors that lead nowhere.

| Route | Status |
|---|---|
| `/` | live — bento index |
| `/work/[slug]` | live — 5 case studies, prerendered |
| `/resume` | live — with print-to-PDF |
| `/style-guide` | live — tokens, type, contrast, live components, inspector |
| `/colophon` | live — architecture writeup |
| `/themes` | 308 → `/style-guide` |
| `/robots.txt`, `/sitemap.xml` | live — private routes disallowed |
| `/sign-in`, `/admin`, `/letter/[token]` | 404 until `DATABASE_URL` is set |

Preview: `portfolio-git-develop-calebksmith1.vercel.app` (SSO-protected).

## Build order position

From `PROJECT-CONTEXT.md` §10:

- [x] 1 · Bento index with real copy
- [x] 2 · Token layer + theme system, high contrast built first
- [x] 3 · Themes page with live contrast readout
- [x] 4 · Guardrails case study
- [x] 5 · VimUI case study
- [x] 6 · Résumé page + PDF (browser print-to-PDF, not a committed file)
- [x] 7 · Remaining case studies (all five are written)
- [x] 8 · Colophon
- [x] 9 · Inspector overlay
- [ ] 10 · Playlist and live cards
- [ ] 11 · **Starter repo** (separate repo) — wanted; base it on this repo

Added beyond the original order: **`/style-guide`**, a Storybook substitute
inside the site, which absorbed the old `/themes` page.

**Applications can start now** — steps 4 and 5 are done, and every link on the
bento index resolves.

---

## Plan for what's next

Ordered by what unblocks applying for jobs, not by what is most interesting.

### 1 · ~~Publish the site~~ — done 2026-08-12

The portfolio is live at calebksmith.com. `showPortfolio()` is unconditional;
`showLetters()` still gates sign-in, admin, and letters on `DATABASE_URL`.

Still outstanding from that step, and worth doing soon:

- **Lighthouse has never actually been measured.** The floor is ≥ 95 for both
  accessibility and performance. Run it against the live site.
- **Contact method** is still open — `PROJECT-CONTEXT.md` §12. The bento links
  LinkedIn, which may be enough.
- **A keyboard pass** over the header, Work menu, appearance popover, inspector,
  and bento cards.

### 2 · ~~Inspector overlay~~ — done 2026-08-12

`components/cksui/inspector.tsx` plus `lib/inspect.ts`. Toggle lives in the
header control cluster; mode is `data-inspect` on `<html>`, deliberately not
persisted — a debugging overlay should not greet a recruiter on their next
visit.

The part worth pointing at in an interview: it resolves rendered values
*backwards* to token names, so it reports on the token layer rather than dumping
CSS, and it names anything that resolves to no token as a violation. While it is
on, every `[data-slot]` becomes a tab stop, and the previous `tabindex` is
recorded and restored on exit.

### 3 · Admin: see the data before writing it (one day)

Caleb is not ready to send cover letters, but wants to see and manage what is in
the database. That is a smaller and more useful first step than the full editor,
and it is what makes the database real rather than theoretical.

Build the read side first:

- A Neon database and a GitHub OAuth app — see `.env.example`. Two OAuth apps,
  since a GitHub OAuth App allows exactly one callback URL.
- `npm run db:migrate`.
- `/admin` already lists letters and view counts; extend it to a browsable view
  of every table — rows, columns, and the view log per letter.
- Read-only to begin with. Writing comes with the editor, and a viewer that
  cannot corrupt anything is a safe thing to have running while the schema is
  still settling.

Then, when there is actually a letter to send: create/edit screens and a share
panel with copy-link, rotate, revoke. All writes are Server Actions calling
`lib/repositories/cover-letters.ts`, and every one calls `requireAdmin()`
itself. The read path — `/letter/[token]`, the view log, revoke, rotate,
expiry — is already built and unused.

### 4 · Starter repo (step 11, separate repo)

**Caleb wants this, and it should be based on this portfolio rather than on
VimUI.** That is both the safer and the better call: `PROJECT-CONTEXT.md` §5b is
explicit that the VimUI guidelines are Vimocity work product, and this
repository already contains a complete, generic instance of the same pattern
that is his to publish.

What extracts cleanly, all of it already written here:

- The paired-token layer in `app/globals.css`, with themes as value swaps
- `scripts/check-contrast.mjs` — a gate that reads the stylesheet rather than
  keeping its own copy of the values
- `eslint-plugin-jsx-a11y` at strict, wired without re-registering the plugin
- `CLAUDE.md` as the AI context file, which is the piece that makes it a
  *guardrails* starter rather than a component starter
- The `data-slot` convention plus the inspector that reads it
- `/style-guide` as a Storybook substitute that cannot drift from the code

The argument the template makes: one standard, written for people, checked by
automation, and loaded for AI. Same claim as the guardrails case study, in a
form someone can clone.

### 5 · Deferred, with reasons

- **Cache Components** — turn on once the letter routes see real traffic, so
  there is something to verify against.
- **Playlist card** — needs a URL, and needs checking whether the widget embeds
  cross-origin.
- **Scoped AI chat** (§11) — after case studies ship, and treat it as its own
  case study.

---

## Open items needing Caleb


2. **The admin / OAuth / cover-letter system is parked**, not cut. It does not
   appear in `PROJECT-CONTEXT.md`'s content architecture. The code is in the
   repo, 404'd in production, and untouched. Decide whether it stays.
3. **Contact method** — still open per `PROJECT-CONTEXT.md` §12.

### Resolved

- **Cover letters, not tailored CVs.** The original requirement was misread and
  had become a schema. Six tables were deleted; see ADR 0005.
- **The Appearance popover works.** Confirmed in a browser.
- **Navigation exists.** A sticky path header carries wayfinding on the left and
  instruments on the right — `components/cksui/site-header.tsx`.
- **Years of production frontend: five.**
- **`docs/PROJECT-CONTEXT.md` and `docs/copy-deck.md` are in the repo.**
  PROJECT-CONTEXT carries a "Notes on deviations" section recording where the
  codebase intentionally differs from it.

## Verifying

```bash
npm run check:contrast   # every token pair, all themes and modes
npm run typecheck
npm run lint             # jsx-a11y strict; do not disable rules to pass
npm run build
```

## Gotchas that cost time

- **`node`/`npm` are not on the default PATH.** They live in
  `~/.nvm/versions/node/v22.23.2/bin`. Without prefixing PATH, commands exit 127.
- **A macOS major upgrade removes the Command Line Tools**, which breaks `git`,
  `python3`, and `clang` with an identical `xcrun` error. Homebrew cannot fix it
  — it needs CLT and git itself. `softwareupdate --list` then
  `sudo softwareupdate -i "<Label>"`, using the exact `Label:` value, which
  carries a duplicated version suffix like `26.6-26.6`.
- **The dev server serves stale CSS after a `globals.css` change.** A
  `min-h-tap` bug looked identical before and after the fix in dev. Verify CSS
  changes against `npm run build` output in `.next/static`, not the dev server.
- **Route types (`PageProps<>`, `LayoutProps<>`) are generated by a build.**
  After adding or moving a route, `tsc --noEmit` fails until `npm run build`
  regenerates `.next/types`. Not a real type error.
- **Tailwind v4's spacing scale is a single multiplier**, not a named map. A
  `--spacing-foo` theme key silently generates no utility. Use `@utility`.
- **`eslint-config-next` already registers the jsx-a11y plugin.** Spreading the
  whole `jsx-a11y` flat config re-registers it and errors; spread only `.rules`.

## Where things are

```
app/(site)/              public routes: index, work, resume, style-guide,
                         colophon, sign-in
app/(admin)/             parked — needs a database and an OAuth app
app/letter/[token]/      parked — shared cover letters
components/cksui/        the component library — read its README before adding
lib/content/work.ts      MDX loader + frontmatter parser
lib/content/resume.ts    the résumé, as structured data
lib/flags.ts             what is published
lib/theme.ts             theme/mode options and cookie names
lib/contrast.ts          WCAG math, shared with scripts/check-contrast.mjs
scripts/                 the contrast gate
src/content/work/        the five case studies
docs/decisions/          ADRs; 0001, 0004, and 0005 have each been superseded
```
