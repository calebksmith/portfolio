import "server-only";

/**
 * What the site exposes, per environment.
 *
 * Production is currently the landing page and nothing else. The colophon,
 * sign-in, admin, and shared-CV routes all exist and all work — they are simply
 * not published yet, because the database and OAuth app they depend on aren't
 * set up.
 *
 * The environment decides, so there is nothing to configure and nothing to
 * remember to switch back:
 *
 *   development  -> everything (NODE_ENV)
 *   preview      -> everything (VERCEL_ENV, set automatically on branch deploys)
 *   production   -> landing page only
 *
 * SITE_STAGE=full is the manual override, for showing a production build the
 * full site before it is genuinely published.
 */
export function showFullSite(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview" ||
    process.env.SITE_STAGE === "full"
  );
}
