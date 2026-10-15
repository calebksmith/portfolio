import { after, NextResponse, type NextRequest } from "next/server";

import { readToken } from "@/lib/access";
import { ACCESS_COOKIE, ACCESS_FLAG_COOKIE } from "@/lib/access-cookies";
import { env } from "@/lib/env";
import { recordAccessLinkOpen } from "@/lib/repositories/analytics";
import { isBot, visitorFromHeaders } from "@/lib/visitor";

/**
 * Opening a personal access link.
 *
 * A valid token becomes two cookies — the token itself, httpOnly, and a
 * readable flag that only tells the page which version of a gated figure to
 * show — and the visitor lands on the homepage, at the top. An invalid or
 * expired link lands in the same place with nothing set: no error page
 * confirming that the link format exists, and nothing a guess can learn from.
 *
 * No `#work` fragment. It opened the page scrolled past the hero to the first
 * case study, so the first thing a reader saw was the middle of the page.
 * Someone opening a link they were sent starts where every other visitor does.
 */
export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/access/[token]">,
) {
  const { token } = await ctx.params;
  const response = NextResponse.redirect(new URL("/", request.url), 303);

  // It sets a credential, so it is never cached; and the token is in this
  // URL, so it never travels on in a Referer.
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("X-Robots-Tag", "noindex");

  let read = null;
  try {
    read = readToken(token, env.accessSecret, env.accessRevoked);
  } catch {
    // No secret configured: no link can be valid.
  }
  if (!read) return response;

  // Counted after the redirect is sent, including opens of a link that has
  // run out. Link previews in chat apps and mail scanners fetch it too; they
  // aren't someone opening it, so they aren't counted. See ADR 0008.
  const salt = process.env.VISITOR_HASH_SALT;
  if (salt && !isBot(request.headers.get("user-agent"))) {
    const visitor = visitorFromHeaders(request.headers, salt);
    const { grant, state } = read;
    after(() =>
      recordAccessLinkOpen({ ...visitor, linkId: grant.id, outcome: state }),
    );
  }

  if (read.state !== "active") return response;
  const { grant } = read;

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
