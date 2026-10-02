import { NextResponse, type NextRequest } from "next/server";

import { verifyToken } from "@/lib/access";
import { ACCESS_COOKIE, ACCESS_FLAG_COOKIE } from "@/lib/access-cookies";
import { env } from "@/lib/env";

/**
 * Opening a personal access link.
 *
 * A valid token becomes two cookies — the token itself, httpOnly, and a
 * readable flag that only tells the page which version of a gated figure to
 * show — and the visitor lands on the work. An invalid or expired link lands
 * in the same place with nothing set: no error page confirming that the link
 * format exists, and nothing a guess can learn from.
 */
export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/access/[token]">,
) {
  const { token } = await ctx.params;
  const response = NextResponse.redirect(new URL("/#work", request.url), 303);

  // It sets a credential, so it is never cached; and the token is in this
  // URL, so it never travels on in a Referer.
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex");

  let grant = null;
  try {
    grant = verifyToken(token, env.accessSecret, env.accessRevoked);
  } catch {
    // No secret configured: no link can be valid.
  }
  if (!grant) return response;

  const cookie = {
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(grant.exp * 1000),
  };
  response.cookies.set(ACCESS_COOKIE, token, { ...cookie, httpOnly: true });
  response.cookies.set(ACCESS_FLAG_COOKIE, "1", cookie);
  return response;
}
