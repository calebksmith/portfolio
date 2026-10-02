# 0007 — Gated screenshots, opened by personal link

**Status:** accepted · **Date:** 2026-10-02

## Context

Most of the case studies are about work inside Vimocity's app, behind its
login. Screenshots of those screens are the clearest evidence of the work, and
they aren't this site's to publish: the site and its repository are public.

Screens anyone can open without an account — the login, a shared playlist, the
public Storybook — are fine as ordinary images. The rest need a way to be seen
by the people evaluating the work, and nobody else.

## Decision

**The files never enter the repository.** Screens from inside the app live in a
private Vercel Blob store. The repository holds their paths, nothing else.
`public/media/` is an allowlist, checked in `lib/content/integrity.test.ts`, so
adding a public image is a decision someone makes on purpose.

**Access is a personal link.** A link carries an HMAC-signed token — an id,
who it's for, an expiry — so there is no database and no account. Opening it
sets two cookies: the token, httpOnly, and a readable flag that only tells the
page which version to draw.

**No form.** Requests come through LinkedIn, already the site's one contact
method. That means a real profile instead of a typed-in name, and nothing for a
bot to submit.

**The server checks every image.** `/api/media/[...path]` verifies the token
before it reads the store, and answers anything else with a 404, so a refusal
looks like a missing file. Responses are `Cache-Control: private`, so no shared
cache keeps a copy.

**Pages stay static.** A gated figure renders both versions — the image's frame
and a one-line note — and the theme script picks one from the flag before first
paint. Neither shifts the layout, and a browser without access never requests
the image.

## Consequences

- Access is managed from the terminal: `npm run access:link`, `access:list`,
  and `access:revoke`. The record of who has a link stays on my machine, in the
  gitignored `private/access-links.json`.
- Revoking one link is an environment variable (`ACCESS_REVOKED`) and a deploy.
  Rotating `ACCESS_SECRET` revokes every link at once.
- A link is a bearer credential: whoever holds it sees the screens. Links
  expire, 30 days by default, to bound that.
- Without JavaScript, even a granted visitor sees the note. Acceptable for a
  handful of readers.
- Development reads the same paths from the gitignored `private/media/`, so the
  whole flow runs locally without the store.
