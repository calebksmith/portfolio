import { createHash } from "node:crypto";

/**
 * What the visitor log keeps about a request, worked out from its headers.
 *
 * The IP is read, hashed and dropped. The hash is salted with a secret and the
 * day, so the same person counts once a day and today's hash can't be matched
 * to yesterday's. Location comes from the headers Vercel's edge adds; nothing
 * here looks the address up. See docs/decisions/0008-visitor-analytics.md.
 */

export type Visitor = {
  visitorHash: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
};

type HeaderSource = { get(name: string): string | null };

export function visitorFromHeaders(
  headers: HeaderSource,
  salt: string,
  now = new Date(),
): Visitor {
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip");
  const day = now.toISOString().slice(0, 10);
  const agent = headers.get("user-agent") ?? "";

  return {
    visitorHash: ip
      ? createHash("sha256")
          .update(`${salt}:${day}:${ip}:${agent}`)
          .digest("base64url")
      : null,
    country: header(headers, "x-vercel-ip-country"),
    region: header(headers, "x-vercel-ip-country-region"),
    city: header(headers, "x-vercel-ip-city"),
  };
}

/** Vercel URL-encodes the city ("S%C3%A3o%20Paulo"). */
function header(headers: HeaderSource, name: string): string | null {
  const value = headers.get(name);
  if (!value) return null;
  try {
    return decodeURIComponent(value).slice(0, 80);
  } catch {
    return null;
  }
}

/**
 * Crawlers, link unfurlers and headless browsers. The beacon is sent by page
 * script, which most of these never run; this catches the ones that do.
 */
const BOT =
  /bot|crawl|spider|slurp|preview|fetch|headless|lighthouse|pagespeed|facebookexternalhit|embedly|whatsapp|monitor/i;

export function isBot(userAgent: string | null): boolean {
  return !userAgent || BOT.test(userAgent);
}

/** A path worth recording: one of ours, without query or fragment. */
export function cleanPath(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const path = value.split(/[?#]/)[0];
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.length > 200) return null;
  return path;
}

/** Another site's host from a referrer, or null for our own and for none. */
export function referrerHost(value: unknown, ownHost: string): string | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const host = new URL(value).host;
    return host && host !== ownHost ? host.slice(0, 100) : null;
  } catch {
    return null;
  }
}
