# Handoff

State as of the last commit. Read `CLAUDE.md` first for the rules; this is just
where things stand.

## What's live

`calebksmith.com` serves the coming-soon page and nothing else. Everything else
404s in production and works in preview and development — `lib/flags.ts` decides,
keyed off `VERCEL_ENV`, so there is nothing to configure or switch back.

| Route | Production | Preview / dev |
|---|---|---|
| `/` | coming-soon | bento index |
| `/work/[slug]` | 404 | 5 case studies, prerendered |
| `/resume` | 404 | résumé, with print-to-PDF |
| `/style-guide` | 404 | tokens, type, contrast, live components |
| `/themes` | 308 | permanent redirect to `/style-guide` |
| `/colophon` | 404 | architecture writeup |
| `/sign-in`, `/admin`, `/letter/[token]` | 404 | need a database and OAuth app |

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
- [ ] 9 · **Inspector overlay** ← next
- [ ] 10 · Playlist and live cards
- [ ] 11 · Starter repo (separate repo)

Added beyond the original order: **`/style-guide`**, a Storybook substitute
inside the site, which absorbed the old `/themes` page.

**Applications can start now** — steps 4 and 5 are done, and every link on the
bento index resolves.

---

## Plan for what's next

Ordered by what unblocks applying for jobs, not by what is most interesting.

### 1 · Publish the site (half a day) — **highest value, not in the build order**

Everything is written and gated. Production still serves only the landing page.
Flipping it is a one-line change to `lib/flags.ts`, but do these first:

- Set `site.playlistUrl` or accept that the card stays hidden.
- Decide the contact method — `PROJECT-CONTEXT.md` §12 leaves it open between
  LinkedIn-only and a form. The bento currently links LinkedIn.
- Run Lighthouse on a preview deploy; the quality floor is ≥ 95 for both
  accessibility and performance and has never actually been measured.
- Keyboard pass over the header, the Work menu, the appearance popover, and the
  bento cards.

Nothing about the site gets better while it is unpublished.

### 2 · Inspector overlay (step 9, one to two days)

The toggle, its slot in the header, and the `data-slot` convention every
component already declares are done. What is missing:

- A client component that toggles a page mode and stores it in the same
  cookie-plus-`data-` attribute pattern the theme uses.
- A walker that finds the nearest `[data-slot]` from pointer or focus.
- A panel reporting component name, resolved tokens (via `getComputedStyle`, the
  same rule the style guide follows), and the governing rule.
- **Keyboard operability is the hard requirement.** An inspector that only
  answers a mouse, on an accessibility-forward site, undercuts its own argument.

This is the strongest remaining portfolio piece: it demonstrates the guardrails
claim rather than asserting it.

### 3 · Cover letter admin (one to two days)

Only worth doing once you actually want to send one. Needs, in order:

- A Neon database and a GitHub OAuth app — see `.env.example`. Two OAuth apps,
  since a GitHub OAuth App allows exactly one callback URL.
- `npm run db:migrate`.
- Three screens at `/admin/letters`: list, create/edit, and a share panel with
  copy-link, rotate, revoke, and the view log.
- All writes are Server Actions calling `lib/repositories/cover-letters.ts`, and
  every one calls `requireAdmin()` itself.

The read path — `/letter/[token]`, the view log, revoke, rotate, expiry — is
already built and unused.

### 4 · Starter repo (step 11, separate repo)

Write from scratch. `PROJECT-CONTEXT.md` §5b is explicit that the VimUI
guidelines and lint rules are Vimocity work product and must not be copied or
closely derived. Worth a conversation with leadership before publishing.

### 5 · Deferred, with reasons

- **Cache Components** — turn on once the letter routes see real traffic, so
  there is something to verify against.
- **Playlist card** — needs a URL, and needs checking whether the widget embeds
  cross-origin.
- **Scoped AI chat** (§11) — after case studies ship, and treat it as its own
  case study.

---

## Open items needing Caleb

1. **`site.playlistUrl` is empty** in `lib/site.ts`. The bento card is skipped
   entirely while it is, rather than shipping a dead link.
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
