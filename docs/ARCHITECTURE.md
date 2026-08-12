# How this site is built, and why

A stack list says what I installed. This says what the alternatives were and
what each choice cost.

Per-decision records: [`docs/decisions/`](./decisions/). Working rules the
codebase is held to: [`CLAUDE.md`](../CLAUDE.md).

---

## Three surfaces

| Surface | Audience | Requirement |
|---|---|---|
| Public portfolio | Anyone | Fast, static, indexable |
| Admin | Me | Authenticated, write-heavy |
| Cover letters | One hiring manager, by link | Private, unguessable, one per opening |

The third one shaped most of what follows.

## Shape

```
Visitor       Hiring mgr (link)      Me (admin)
   │                   │                   │
(site)         /letter/[token]        (admin)
static           per request,          gated per route
                   noindex                 │
   │                   │            requireAdmin()
   └───────────────────┴───────────────────┘
                       ↓
              lib/repositories/
        every query lives here — nothing
        above writes SQL, nothing below
             knows what a route is
                       ↓
         Neon Postgres  ·  GitHub OAuth
```

## Decisions

**Server Components by default.** Nearly every page is a read of content the
visitor didn't personalise. The landing and sign-in pages ship zero application
JavaScript. Client components go at the leaf, when an interaction needs one.

**Tailwind v4, configured in CSS.** Tokens and the utility namespace sit in one
file, twelve lines apart, so they can't drift. Every color, radius, and duration
resolves to a token — a hex value in a component is a reviewable error. Dark
mode is defined per token, not retrofitted. Focus rings always visible.
Animations no-op under `prefers-reduced-motion`.

**A component library I own, not one I installed.** cksUI lives in this repo,
built on shadcn/ui's patterns — copied-in source, Radix for behavior — with
every visual value rewritten onto the `--ck-*` pairs. shadcn isn't a library you
install; it's source you copy in and own, which is what makes it compatible with
the constraint that I build the UI here. Radix stays a justified dependency: it
handles focus management, keyboard interaction, and ARIA, where a subtle mistake
is invisible until it reaches someone using a screen reader.

`/style-guide` documents it by importing the real components and rendering them
live, with every measured value read off the running page. A broken component
breaks visibly there, and documentation that keeps its own copy of the values is
documentation that can lie.

**Neon over Supabase.** Supabase's real advantage is Auth + row-level security,
unused here since auth is Auth.js. And free-tier Supabase pauses after ~a week
idle — the worst possible failure for a hiring manager opening a letter three
days late. Gave up: a table-editing UI and file storage.

**Drizzle over Prisma.** Lighter runtime, no codegen in the deploy path,
migrations as plain SQL committed and reviewable. Postgres doesn't index foreign
keys automatically, so the first migration adds them explicitly.

One file knows the database is Neon. Switching is that file plus a driver swap.

**OAuth, where a password would have done.** For one user, a hashed password in
an env var would be adequate security in eighty lines. I chose OAuth because
OIDC is how modern auth actually works and every enterprise SSO product is the
same flow with a different issuer — I wanted to build it, not read about it.
Auth.js over Clerk because Clerk's value proposition is hiding the mechanics.

**Database sessions over JWTs.** Every leg of the authorization-code exchange
leaves an inspectable row, and deleting a session row ends the session
immediately — a signed JWT stays valid until it expires no matter what you
delete. Costs one read per authenticated request.

> Authentication is not authorization. GitHub will prove the identity of any of
> its users; it has no opinion on who may edit my portfolio.

A sign-in callback checks the login against an allowlist, so an unauthorized
account never gets a session. No proxy-level guard: Next's docs say that layer
suits optimistic checks and real authorization belongs next to the data, so
every admin route calls the guard itself.

**Deleting six tables when the requirement changed.** The database was built for
"tailored CVs" — a CV assembled per opening from reusable parts. That was a
misreading of the requirement, and it survived long enough to become a schema:
positions, achievement bullets, skills, tags, and case studies, all joined per
opening with overrides.

The actual need was cover letters. A CV is a document assembled from parts; a
letter is prose addressed to one reader. There is nothing to select and reorder,
so all of that machinery was elaborate infrastructure around a `text` column.

So six tables were deleted rather than migrated. Case studies are files (ADR
0004) and the résumé is structured data, so none of them had a reader left.
Unused schema is a claim about the future that has to be maintained and
explained. Sixteen tables became seven.

> The most useful thing I did to this database was take most of it out.

**The URL is the credential.** No login, because asking a hiring manager to
register to read a cover letter is a good way to not have it read. The boundary
is token entropy: 32 bytes from a CSPRNG, generated in the repository layer,
never accepted as an argument.

Accepted honestly: anyone with the link can read and forward it. It's a letter
written to be handed to someone I have never met, so exposure is bounded by what
it already is. It is also HTML only — a downloadable copy would be a second
artifact of the same content, stale the moment a sentence changes. Mitigations:
revoke, rotate, expire, `noindex`, and an **identical 404** for revoked,
expired, draft, and nonexistent alike, so a recipient can't learn a link was
turned off or that a company was ever written to.

**View logging, minimal on purpose.** "Did they open it" is useful, but the
visitor is a counterparty in a hiring process who consented to nothing. No
cookies, no fingerprinting, no third-party analytics. IP stored only as a salted
hash; rotating the salt severs the link to everything logged. Hashing an IP
isn't strong anonymisation — which is why the salt is secret. The write happens
after the response is sent and swallows its errors.

## Deliberately not built

Stated explicitly, because unfinished and overlooked look identical from
outside.

- **Admin editing screens for cover letters** — schema, repositories, and the
  auth gate exist; each screen is a form wired to a server action.
- **The inspector overlay** — the toggle, its slot in the header, and the
  `data-slot` convention every component follows are all in place; what is
  missing is the overlay and the element walker.
- **Cache Components** — off until DB-backed routes exist and can be verified
  against it. The code is already written in the shape it wants.

## Running it

```bash
npm install
cp .env.example .env.local   # Neon + GitHub OAuth credentials
npm run db:migrate
npm run dev
```

Verification is three commands; a passing build alone doesn't count:

```bash
npm run typecheck && npm run lint && npm run build
```
