# 0006 — Localization: copy in the repo, locale in the URL

**Status:** accepted · **Date:** 2026-10-01

## Context

The site is going to be offered in Spanish as well as English. Until now its
copy lived in three shapes: MDX case studies, typed résumé data, and string
literals inside page and component files. The last of those cannot be
translated without touching components, and several reusable components
(header, inspector, theme switcher) carried their own English, against the
rule in `CLAUDE.md` that reusable components take their strings as props.

A server-driven copy config — the approach Vimocity uses for its apps — was
considered. It earns its keep where a copy fix otherwise waits on an app-store
release, where many locales are in play, and where non-engineers edit copy.
None of those hold here: a push to `main` is a release in about a minute, there
is one author, and two languages. A remote source would also put the words
where `check:copy`, the integrity tests, and pull-request review cannot see
them, and would turn static pages into fetches.

## Decision

**Copy is committed, typed, and split by length.**

- Interface copy — labels, headings, page intros, the hero, the homepage tiles,
  diagram labels — lives in `lib/i18n/messages/<locale>.ts`. English defines the
  shape (`Messages`); every other locale is typed against it, so a missing key
  is a build error.
- Writing that runs to paragraphs is a document, and a translator should get it
  as one: case studies in `src/content/work/<locale>/`, the colophon body in
  `src/content/pages/<locale>/`.
- Structured records stay structured: `lib/content/resume/<locale>.ts`, typed as
  `Resume`.
- Strings that need inline emphasis carry `<code>`, `<strong>`, or `<em>` and
  render through `components/rich-text.tsx`, so a sentence is translated whole
  rather than in fragments around a bold word.

**The locale is a URL segment.** Every public route lives under `app/[lang]`,
whose layout is the root layout — so `<html lang>` is correct per page, which a
container-level `lang` would not be (WCAG 3.1.1). Server Components read the
locale with `next/root-params` rather than having it passed down, which is
what lets a diagram inside an MDX file draw its labels in the right language.

**English keeps its bare URLs.** An `afterFiles` rewrite in `next.config.ts`
maps `/work/login` onto `/en/work/login`, so no link already in the wild
changes. Other locales are prefixed: `/es/work/login`. Every page declares its
canonical URL and `hreflang` alternates, and the sitemap lists each language
version of each page. A rewrite in config rather than a `proxy.ts`: the mapping
is fixed at build time and needs nothing running per request. There is no
`Accept-Language` redirect — the language is chosen with a visible toggle, and
the URL someone shares is the language they meant.

**The letters system stays English** and outside `[lang]`, under its own root
layout in `app/(letters)`. A letter is written for one reader in one language.

## Consequences

- Adding a locale is: the code in `LOCALES` (`lib/i18n/config.ts`), a
  `messages/<locale>.ts`, a `resume/<locale>.ts`, and the MDX files. The type
  checker and the integrity tests list anything missing — including a case
  study whose badges, weight, or year drifted from the English one.
- The language toggle renders only when more than one locale is enabled.
- Spanish is not enabled yet. The content is being revised first, and
  translating copy that is about to change would be work done twice.
- Two root layouts means `components/document.tsx` holds the document shell
  once, and both render through it.
- `next-mdx-remote` blocks JavaScript expressions in MDX by default. Content
  committed to the repo opts out (`trusted`) so the colophon can pass arrays as
  props; cover letters from the database keep the default.
