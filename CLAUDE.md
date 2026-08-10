@AGENTS.md

# calebksmith.com — working rules

This file encodes how this site is built. It exists so the standard is applied
by default rather than corrected after the fact. If a rule here conflicts with a
habit from another codebase, this file wins.

Architecture rationale lives in `docs/decisions/`. Read the relevant ADR before
changing anything it covers.

## The non-negotiables

1. **Every color, radius, and duration resolves to a `--ck-*` token.** No hex
   values, no `rgb()`, no arbitrary `text-[#333]` in a component. Add the token
   to `app/globals.css`, expose it in the `@theme inline` block, use the utility.
2. **Focus is always visible.** Never `outline: none` without an equally visible
   replacement. The global `:focus-visible` rule is the floor, not the ceiling.
3. **Motion is decorative and always optional.** Content must be fully legible
   with animations disabled. Anything animated goes through `.ck-enter` or
   `.ck-pulse`, both of which no-op under `prefers-reduced-motion`.
4. **Dark mode is not an afterthought.** A token defined only inside a media
   query is a bug. Define the light value on bare `:root`, then override it in
   both the `prefers-color-scheme: dark` block and the `[data-theme="dark"]`
   block.
5. **No database query outside `lib/repositories/`.** Pages and Server Actions
   call repository functions. This is what keeps the vendor swappable and the
   published/draft filter in one place.
6. **Authorization happens next to the data, not in a proxy.** Every admin route
   and every mutating Server Action calls `requireAdmin()` itself.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict.
- Tailwind v4 — CSS-first config via `@theme inline`. There is no
  `tailwind.config.js` and there should not be one.
- Drizzle ORM against Neon Postgres. Migrations are committed SQL.
- Auth.js v5 (`next-auth@beta`), GitHub OAuth, database sessions.
- No component library on the public site. See `docs/decisions/0001`.

## Next.js 16 specifics

This version differs from older App Router code in ways that matter:

- `params` and `searchParams` are **Promises**. Await them.
- Use the generated `PageProps<"/route">` and `LayoutProps<"/route">` global
  types rather than hand-writing prop types.
- **Middleware is called Proxy** and lives in `proxy.ts`. There is currently no
  `proxy.ts` in this project, deliberately — see rule 6.
- Cache Components (`use cache`, `cacheLife`, `cacheTag`) is **not** enabled.
  Turning it on is a considered future step, not an oversight; see
  `docs/decisions/0001`.
- Consult `node_modules/next/dist/docs/` before writing framework code. It is
  the version actually installed.

## Conventions

- Route groups carry chrome: `(site)` is public, `(admin)` is authenticated.
  `/cv/[token]` sits outside both because it is neither.
- Server Components by default. Add `"use client"` only when an interaction
  genuinely requires it, and push it to the leaf.
- Repository functions that can return unpublished content are named
  `...ForAdmin`, so an unauthorized call site is visible in review.
- Read environment variables through `lib/env.ts`, never `process.env` directly.
- Content prose cannot style itself. MDX from the database renders through the
  component map in `components/mdx.tsx`; add an element there rather than
  allowing raw HTML through.

## Before saying a change works

Run all three. A passing build alone is not verification.

```
npm run typecheck
npm run lint
npm run build
```

Routes touching the database need `DATABASE_URL`; without it they fail with a
deliberate, descriptive error from `lib/env.ts`. That is correct behavior, not
a bug to work around.
