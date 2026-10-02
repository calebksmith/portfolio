import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Personal access links to the screenshots from inside Vimocity's app.
 *
 * Those screens aren't public. They sit in a private Blob store, and the site
 * serves them only to someone holding a link I've sent. A link is a signed
 * token — an id, who it's for, when it expires — so granting access needs no
 * database and no form, and there is nothing for a bot to submit.
 *
 * Revoking one link: add its id to ACCESS_REVOKED. Revoking all of them:
 * rotate ACCESS_SECRET. See docs/decisions/0007-gated-screens.md.
 *
 * No `server-only` import, because `npm run access:link` runs this file in
 * plain Node. `node:crypto` keeps it out of client bundles regardless.
 */

export type Grant = {
  v: 1;
  /** Short and random, so one link can be revoked without the others. */
  id: string;
  /** Who it was sent to, for my own records. Never shown to anyone. */
  to: string;
  /** Expiry, in seconds since the epoch. */
  exp: number;
};

const DAY = 24 * 60 * 60;

function sign(body: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(body).digest();
}

/** A new access token for one person, valid for `days`. */
export function mintToken(
  secret: string,
  to: string,
  days: number,
  now = Date.now(),
): string {
  const grant: Grant = {
    v: 1,
    id: randomBytes(6).toString("base64url"),
    to,
    exp: Math.floor(now / 1000) + Math.round(days * DAY),
  };
  const body = Buffer.from(JSON.stringify(grant)).toString("base64url");
  return `${body}.${sign(body, secret).toString("base64url")}`;
}

/**
 * The grant a token carries, or null if it was tampered with, signed with a
 * different secret, expired, revoked, or isn't a token at all. Every failure
 * looks the same to the caller, on purpose.
 */
export function verifyToken(
  token: string,
  secret: string,
  revoked: readonly string[] = [],
  now = Date.now(),
): Grant | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, signature] = parts;

  // Compared in constant time, so the response time says nothing about how
  // much of a forged signature was right.
  const expected = sign(body, secret);
  const given = Buffer.from(signature, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return null;
  }

  let grant: unknown;
  try {
    grant = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!isGrant(grant)) return null;
  if (grant.exp * 1000 <= now) return null;
  if (revoked.includes(grant.id)) return null;
  return grant;
}

function isGrant(value: unknown): value is Grant {
  if (typeof value !== "object" || value === null) return false;
  const grant = value as Record<string, unknown>;
  return (
    grant.v === 1 &&
    typeof grant.id === "string" &&
    typeof grant.to === "string" &&
    typeof grant.exp === "number"
  );
}

/**
 * A gated image's path in the store: one folder per case study, one webp.
 * Anything else is refused before the store is asked, so a request can't
 * walk out of `private/media/` in development or probe the store in
 * production.
 */
export const GATED_PATH = /^[a-z0-9-]+\/[a-z0-9-]+\.webp$/;
