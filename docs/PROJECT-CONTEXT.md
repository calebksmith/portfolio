# calebksmith.com — Project Context

Handoff document. Read this first — it carries the decisions made before the build started.

---

## 1. What this is

Personal portfolio for **Caleb Smith**, product designer and design engineer in Seattle. It supports an active job search for design engineer, design systems lead, and senior/staff product designer roles.

**The site is a work sample, not just a container for work samples.** Every decision should survive the question: *would an engineer interviewing me respect this?*

---

## 2. Positioning

The one-line version:

> Product designer who works in code.

The differentiator, in the order it should be argued:

1. **Design systems** — built VimUI at Vimocity and leads its growth: 51 components across web, iOS, Android, and Windows desktop, living in a shared codebase with Storybook, plus the written standards and release process behind it.
2. **AI guardrails** — wrote the component standards, turned them into automated checks that run before every merge, and loaded the same standards into the team's AI coding tools. *One standard, enforced three ways: written for people, checked by automation, loaded for AI.* This is the strongest and least common thing about him.
3. **Production frontend** — designs and builds directly in the product codebase in TypeScript/React/Next.js. Reviews and approves frontend pull requests.
4. **Product definition** — runs discovery: customer interviews, product briefs, prototype-led iteration. Not just execution.
5. **Behavior-change design** — workplace health product where success means people come back.

Nine years in design, five writing production frontend.

---

## 3. Stack and infrastructure

- **Next.js** (App Router) + **TypeScript** + **Tailwind**
- Repo on **GitHub**, deployed on **Vercel** from `main`
- Domain `calebksmith.com` registered at GoDaddy, DNS pointed at Vercel — already live
- Coming-soon page is already shipped

---

## 4. Homepage: bento grid

The homepage is a bento-box index. Cards link out to full detail pages.

**Hierarchy matters more than the grid.** Do not make cards uniform. Weighted spans, largest first:

| Card | Weight | Links to |
|---|---|---|
| About / résumé | Large | `/resume` |
| VimUI design system | Large | `/work/vimui` |
| AI guardrails | Large | `/work/guardrails` |
| Platform rebuild | Medium | `/work/platform-rebuild` |
| Cross-platform login | Medium | `/work/login` |
| Challenges (behavior change) | Medium | `/work/challenges` |
| Theme / token controls | Small, interactive | — |
| Playlist embed | Small | Vimocity public playlist |
| Colophon | Small | `/colophon` |

Two cards should be **live rather than descriptive**:
- The **theme controls** card (see below)
- The **playlist** card — embed the Vimocity playlist widget if it can be embedded cross-origin; otherwise link to a public playlist

Bento is a common portfolio pattern right now. The weighting, the live cards, and the theme system are what keep it from reading as templated.

---

## 5. Theme system

This is a feature, not decoration — it demonstrates token architecture and accessibility, which are two central claims on the résumé.

**Requirements:**
- **Two or three selectable primary colors** — not a full palette picker, just enough to show the token layer works
- **A high-contrast option** for accessibility
- **Light / dark mode**, defaulting to system preference
- Preference persists across navigation *within the session* (note: no `localStorage` in this codebase — use cookies or a server-set preference if persistence across visits is wanted)

**Implementation shape:**
- All color, type-size, and spacing values resolve to `--ck-*` custom properties
- Themes are alternate value sets for the same token names, applied via a `data-theme` attribute on `<html>`
- Light/dark handled the same way, with `prefers-color-scheme` as the default
- Every theme, including high contrast, must pass WCAG AA in both modes

**Token structure — follow the shadcn semantic pairing pattern.** Colors are not a flat palette of named hues. Every surface token has a paired foreground token, so contrast is guaranteed by the pairing rather than by remembering which text color goes where:

```
--ck-background      / --ck-foreground
--ck-card            / --ck-card-foreground
--ck-muted           / --ck-muted-foreground
--ck-primary         / --ck-primary-foreground
--ck-accent          / --ck-accent-foreground
--ck-border  --ck-input  --ck-ring
```

Themes then only need to redefine those pairs. A component that uses `bg-card text-card-foreground` is correct in every theme automatically, which is the whole point — and it means the high-contrast theme is a value swap, not a rewrite.

**Build the high-contrast theme early**, alongside the token layer and before the case study pages. It is the hardest constraint, so designing to it first means everything after inherits correct surface/foreground pairing rather than being audited for it later.

---

## 5b. Distinctive features

Three features that demonstrate the résumé claims rather than asserting them. These are what keep the site from reading as another bento portfolio. Build them in this order.

### Theme colors page with live contrast readout
A page (also surfaced as the small interactive bento card) that displays the currently selected theme's colors and their measured contrast ratios, updating live as the theme or mode changes.

- Read resolved values with `getComputedStyle` on `<html>` — never hardcode them, or the page duplicates the token layer instead of reporting on it
- Compute WCAG ratios directly (sRGB → relative luminance → ratio); roughly fifteen lines, no dependency needed
- **Display pairs, not swatches** — `background/foreground`, `card/card-foreground`, `muted/muted-foreground`, `accent/accent-foreground`, and the focus ring against its surface. A ratio only means something in combination.
- Pass/fail badges for AA (4.5:1 body, 3:1 large text) and AAA (7:1)
- Consequence to accept: this publishes failures as readily as passes. Every theme must genuinely pass, and high contrast should clear AAA.

### Design-system inspector overlay
A toggle that annotates the live page: hovering any element reveals which component it is, which tokens it resolves to, and which rule governs it. Inspect-element for design decisions.

- Reuse the `data-slot` attribute convention from the VimUI guidelines — same attribute, same meaning, so the portfolio and the production system share a vocabulary
- Toggle sets a flag; pointer or focus lands on nearest `[data-slot]`; a floating panel reports component name and resolved tokens
- **Must be keyboard operable.** An inspector that only responds to a mouse, on an accessibility-forward site, undercuts the point it exists to make.

### Public starter repo *(separate repo, not this one)*
A minimal open-source template giving any project the same enforcement pattern: token structure, lint rules, an AI context file, a docs template, and a pre-merge checklist.

**Write this from scratch.** The VimUI guidelines, lint rules, and `CLAUDE.md` are work product created for Vimocity — do not copy or closely derive from company files. Author an independent, generic version of the same idea. It makes a better template anyway, since a starter shouldn't carry one company's conventions. Worth a quick conversation with leadership before publishing.

Value: it's a portfolio piece, a GitHub artifact for roles that accept "portfolio or repo," and the only item here that can generate inbound interest on its own.

---

## 6. Content architecture

```
/                       Bento index
/resume                 Résumé (HTML + PDF download)
/work/guardrails        AI guardrails / design-to-code
/work/vimui             VimUI design system
/work/platform-rebuild  Legacy → Next.js migration
/work/login             Cross-platform auth
/work/challenges        Behavior-change design
/colophon               How this site was built
```

Case studies live as **MDX** in `src/content/work/*.mdx` with frontmatter: `title, role, year, platforms, summary, weight`. The bento index maps over them. Adding a case study should mean adding a file, not editing components.

Caleb has separate structured data tables that will populate case study and résumé sections — design the content layer to accept structured data, not just prose.

---

## 7. Voice and copy rules

Written like a product manager writing a product overview. Plain, specific, active. Say what a thing does rather than selling it. Sentence case. No filler adjectives.

**Case study format is consistent:** Problem → What I did → Outcome. Each one names a real trade-off or hard call, because that's what separates a case study from a feature description.

**Jargon that's fine:** double diamond, atomic design, generative and evaluative research, design tokens, component library.

**Avoid:** cva, semver, and similar library- or spec-level terms — use plain descriptions ("versioned releases," "style variants") instead.

Full approved copy for every page lives in the copy deck (`docs/copy-deck.md`). Use it rather than rewriting.

---

## 8. Constraints

- **No product screenshots behind the paywall.** Vimocity's product is gated. Public screenshots are fine; live product access is not. The **public VimUI Storybook at vimui.vimocity.com** is the primary interactive proof — lean on it, link it, embed from it.
- **No `localStorage` or `sessionStorage`.**
- **No UI component library.** The point of this site is that he builds the UI.
- Metrics that appear in copy are approved and defensible. Do not invent or extrapolate new ones.

---

## 9. Quality floor

These are non-negotiable, because accessibility and systems discipline are headline claims on the résumé. An inaccessible portfolio from someone claiming WCAG AA expertise is the worst possible own-goal.

- Semantic HTML; no click handlers on non-interactive elements
- Fully keyboard operable, with visible `:focus-visible` styles
- WCAG AA contrast in every theme and both modes
- Touch targets ≥ 44px
- `prefers-reduced-motion` respected on every animation
- `eslint-plugin-jsx-a11y` runs on lint; don't disable rules to pass
- Lighthouse accessibility and performance ≥ 95 before launch

Rules for the codebase itself are in `CLAUDE.md` at the repo root.

---

## 10. Build order

1. Bento index with real copy, placeholder cards
2. Token layer + theme system, **high contrast built first** *(do early — it shapes everything after)*
3. Theme colors page with live contrast readout
4. Guardrails case study
5. VimUI case study
6. Résumé page + PDF
7. Remaining case studies
8. Colophon
9. Inspector overlay
10. Playlist and live cards
11. Starter repo *(separate repo, any time after step 5)*

**Applications can start after step 5.** Two strong case studies beat six mediocre ones. Don't let the site become the reason he hasn't applied.

---

## 11. Parked

**Scoped AI chat** — an assistant on the site that answers questions about Caleb's background, grounded strictly in a corpus of his résumé and case studies. Feasible and cheap (roughly $12 per thousand conversations on Haiku with prompt caching). Requires: server-side API route, per-IP rate limiting, strict grounding with explicit "I don't know" behavior, and adversarial testing before launch. Build after the case studies ship, and treat it as its own case study.

---

## 12. Open items

- Contact method — email deliberately omitted for now; decide between LinkedIn-only or a contact form
- GitHub URL for the résumé and footer once the repo is public
- Whether the repo is public (recommended: yes — several target roles accept a repo in place of a portfolio)

---

## Notes on deviations

Recorded here so the difference between this document and the codebase is deliberate rather than drift. Full reasoning in `docs/decisions/`.

- **A component library exists: cksUI** (`components/cksui/`). §8 forbids introducing a UI component library, meaning an installed dependency that ships someone else's UI. cksUI is copied-in source built on shadcn's patterns and restyled onto the `--ck-*` pairs — the same relationship VimUI has to its primitives. See ADR 0001.
- **Theme controls are a site-wide settings menu**, not a bento card as §4 describes. They belong somewhere reachable from every page rather than only the index.
- **`src/content/work/`** holds the case studies as §6 specifies, even though the app router lives at `app/` rather than `src/app/`.
