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
| Tailored CVs | One recruiter, by link | Private, unguessable, per-opening |

The third one shaped most of what follows.

## Shape

```
Visitor          Recruiter (link)      Me (admin)
   │                   │                   │
(site)            /cv/[token]           (admin)
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

**No component library on the public site.** The design is deliberately not the
consensus look, and a component library's job is to converge on it. shadcn/ui is
intended for the admin panel only — copied in as owned source, so its classes
get rewritten onto the same tokens rather than running two design systems.

**Neon over Supabase.** Supabase's real advantage is Auth + row-level security,
unused here since auth is Auth.js. And free-tier Supabase pauses after ~a week
idle — the worst possible failure for a recruiter opening a CV link three days
late. Gave up: a table-editing UI and file storage.

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

**A tailored CV is a view, not a document.** Over a job search you write many
CVs that overlap heavily. Copy-and-edit rots: fix a typo in a job title and
every copy already in someone's inbox stays wrong.

So a CV stores only what's specific to one opening — target role, headline,
summary. Everything else is a join: which positions appear and in what order,
which bullets, which case studies, which skills. That's why achievement bullets
are one row each rather than a text blob — a design-systems CV takes three
bullets from a job, a platform CV takes a different three, with nothing
duplicated.

> Fix a job title once, and every CV ever shared shows the correction.

Cost: more tables, join-heavy reads. Free at this scale, and indexed.

**The URL is the credential.** No login, because asking a recruiter to register
to read a CV is a good way to not have it read. The boundary is token entropy:
32 bytes from a CSPRNG, generated in the repository layer, never accepted as an
argument.

Accepted honestly: anyone with the link can read and forward it. It's a CV — a
document meant for strangers — so exposure is bounded by what it already is.
Mitigations: revoke, rotate, expire, `noindex`, and an **identical 404** for
revoked, expired, draft, and nonexistent alike, so a recipient can't learn a
link was turned off or that a company was ever sent one.

**View logging, minimal on purpose.** "Did they open it" is useful, but the
visitor is a counterparty in a hiring process who consented to nothing. No
cookies, no fingerprinting, no third-party analytics. IP stored only as a salted
hash; rotating the salt severs the link to everything logged. Hashing an IP
isn't strong anonymisation — which is why the salt is secret. The write happens
after the response is sent and swallows its errors.

## Deliberately not built

Stated explicitly, because unfinished and overlooked look identical from
outside.

- **Admin editing screens** — schema, repositories, and the gate exist; each
  screen is a form wired to a server action.
- **Public case study routes** — read layer exists. The site is still a landing
  page on purpose.
- **Cache Components** — off until DB-backed routes exist and can be verified
  against it. The code is already written in the shape it wants.
- **PDF export** — should render this same view, not a second divergent one.

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
