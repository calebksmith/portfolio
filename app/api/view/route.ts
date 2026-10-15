import { after, type NextRequest } from "next/server";

import { verifyToken } from "@/lib/access";
import { ACCESS_COOKIE } from "@/lib/access-cookies";
import { env } from "@/lib/env";
import { recordPageView } from "@/lib/repositories/analytics";
import { site } from "@/lib/site";
import {
  cleanPath,
  isBot,
  referrerHost,
  visitorFromHeaders,
} from "@/lib/visitor";

/**
 * The page view beacon. Every page sends one as it's shown, from
 * `PageViewBeacon`; nothing else calls this.
 *
 * The answer is always an empty 204, sent before anything is written, so a
 * visitor's page never waits on the log and a caller learns nothing from it.
 * The access cookie, when the visitor has one, ties the view to the link they
 * were sent. See docs/decisions/0008-visitor-analytics.md.
 */
export async function POST(request: NextRequest) {
  const salt = process.env.VISITOR_HASH_SALT;
  if (!salt || isBot(request.headers.get("user-agent"))) return done();

  let body: { path?: unknown; referrer?: unknown };
  try {
    body = JSON.parse(await request.text());
  } catch {
    return done();
  }
  const path = cleanPath(body.path);
  if (!path) return done();

  const visitor = visitorFromHeaders(request.headers, salt);
  const referrer = referrerHost(body.referrer, new URL(site.url).host);
  const accessLinkId = linkId(request);
  after(() => recordPageView({ ...visitor, path, referrer, accessLinkId }));

  return done();
}

function linkId(request: NextRequest): string | null {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  try {
    return verifyToken(token, env.accessSecret, env.accessRevoked)?.id ?? null;
  } catch {
    return null;
  }
}

function done() {
  return new Response(null, {
    status: 204,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
