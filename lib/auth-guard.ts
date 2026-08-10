import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth";

/**
 * The Data Access Layer for authorization.
 *
 * Next.js is explicit that Proxy (what earlier versions called Middleware) is
 * for optimistic checks only, and that the real boundary belongs as close to
 * the data as possible. So there is no proxy.ts guarding /admin: every admin
 * route and every mutating Server Action calls `requireAdmin()` itself.
 *
 * That is more typing than a single matcher, and it is deliberate. A route that
 * forgets to call it fails closed only if the guard is somewhere it cannot be
 * skipped — so it lives here, and admin pages are reviewed for calling it.
 */

/**
 * Memoised for the duration of one render pass, so a layout and three nested
 * components asking "who is this?" cost one session lookup, not four.
 */
export const getSession = cache(async () => auth());

/**
 * Require an authenticated admin, or redirect to sign-in.
 *
 * Note that reaching here at all already implies the GitHub login passed the
 * allowlist in lib/auth.ts — an unauthorized account never receives a session.
 * This is the second gate, not the only one.
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session.user;
}
