# 0003 — Auth.js with GitHub OAuth and database sessions

**Status:** accepted · **Date:** 2026-08-10

## Context

The admin area has exactly one legitimate user. A single hashed password in an
environment variable and a signed cookie would be perfectly adequate security
for that, in about eighty lines and with no dependencies.

It was rejected anyway, and the reason is worth stating plainly rather than
dressed up as a technical necessity: **this site is also a learning vehicle and
a work sample.** OAuth 2.0 / OIDC is how essentially all modern web
authentication works, and every enterprise SSO product — Okta, Auth0, Entra,
WorkOS — is the same authorization-code flow with a different issuer. Password
plus cookie teaches hashing and CSRF and stops there.

## Decision

**Auth.js v5 (`next-auth@beta`) with the GitHub provider.**

Auth.js over a hosted vendor such as Clerk, specifically *because* Clerk's value
proposition is hiding the mechanics behind a drop-in component. Here the
mechanics are the point.

**Database sessions, not JWTs.** This is the deliberate choice in this ADR:

- Every leg of the authorization-code flow leaves an inspectable row. After
  signing in, `SELECT * FROM account` shows the access token GitHub returned in
  exchange for the one-time authorization code.
- Revocation is real. Deleting the session row ends the session immediately,
  whereas a signed JWT stays valid until it expires no matter what is deleted
  server-side.
- The cost is a database read per authenticated request, which is irrelevant at
  one user.

**Authentication is separated from authorization.** GitHub will prove the
identity of any of its users; it has no opinion on who may edit this portfolio.
The `signIn` callback checks the GitHub login against `ADMIN_GITHUB_LOGINS`, so
an unauthorized account never receives a session or even an account row.

**No `proxy.ts`.** Next 16 renamed Middleware to Proxy, and its own
documentation is explicit that Proxy suits optimistic checks and that real
authorization belongs as close to the data as possible. `requireAdmin()` in
`lib/auth-guard.ts` is that boundary, memoised per render with React `cache`,
and every admin route calls it. This is more typing than one matcher, which is
the trade being made knowingly.

## Consequences

- Signing in requires a GitHub account, which is not a constraint for the only
  intended user.
- `next-auth@5` is a beta. It has been the de facto App Router standard for a
  long time and v4 does not support the App Router well, but it is a beta
  dependency and should be tracked.
- A future second admin is an allowlist entry, not a schema change.
