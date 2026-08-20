import "server-only";

/**
 * What the site exposes.
 *
 * Two flags, because the site has two halves with different readiness:
 * the portfolio is finished and published, while the cover letter system is
 * written but has no database or OAuth app behind it.
 */

/**
 * The public portfolio: index, case studies, experience, style guide, colophon.
 *
 * Published 2026-08-12. Everything it needs is committed — content is MDX and
 * structured data, nothing reaches for a service that isn't there.
 */
export function showPortfolio(): boolean {
  return true;
}

/**
 * Sign-in, admin, and shared cover letters.
 *
 * These need `DATABASE_URL` and a GitHub OAuth app. Gating on the presence of
 * the connection string rather than on a hardcoded flag means production lights
 * them up the moment the environment is configured, with no code change and no
 * chance of publishing a sign-in page that leads nowhere.
 *
 * Development is exempt so the routes can be worked on; without a database they
 * fail with the deliberate error from lib/env.ts, which is the correct behavior
 * rather than a bug.
 */
export function showLetters(): boolean {
  return (
    Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV === "development"
  );
}
