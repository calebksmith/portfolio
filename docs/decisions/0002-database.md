# 0002 — Neon Postgres and Drizzle, behind a repository layer

**Status:** accepted · **Date:** 2026-08-10

## Context

The site needs durable, relational, runtime-writable data: case studies, job
history, tailored CVs, and a log of who opened which CV. Flat files were ruled
out immediately — a CV's view log is written at request time, and a tailored CV
is a many-to-many selection over canonical records, which is a relational
problem wearing no disguise.

## Decision

**Postgres, hosted on Neon, accessed with Drizzle ORM.**

Supabase was the serious alternative and was rejected on two specific grounds:

1. Supabase's largest advantage is its own Auth combined with row-level
   security, and RLS policies key off a Supabase-issued JWT. Because
   authentication here is Auth.js (see ADR 0003), all of that would go unused
   while its complexity stayed.
2. Free-tier Supabase projects pause after roughly a week of inactivity and need
   a manual restore. A portfolio's traffic is sporadic by nature, and the single
   worst moment for a paused database is a recruiter opening a tailored CV link
   three days after it was sent. Neon scales to zero and resumes on the next
   query.

Supabase keeps two genuine advantages that were given up: a real table-editing
UI, and built-in file storage. If PDF export needs storage later, Vercel Blob
covers it without adopting a second platform.

**The Neon serverless driver speaks Postgres over HTTP** rather than a TCP
socket. In a serverless function that matters: there is no connection pool to
exhaust because there are no persistent connections.

**Drizzle over Prisma** for a lighter runtime, no codegen step in the deploy
path, and migrations that are plain SQL files committed to the repository —
reviewable in a pull request, applied deterministically, never inferred at
runtime.

**Every query lives in `lib/repositories/`.** No route component builds a query.

## Consequences

- `lib/db/index.ts` is the only file that knows the database is Neon. Moving to
  Supabase, RDS, or local Postgres is that file plus a driver swap.
- The published/draft filter exists in one place and cannot be forgotten per
  page. Functions that can return drafts are named `...ForAdmin` so that an
  unauthorized call site is visible during review.
- `server-only` is imported at the top of every repository, making a client-side
  import a build error rather than a leaked connection string.
- Postgres does not index foreign keys automatically; the first migration adds
  indexes explicitly on the paths that are actually queried.
