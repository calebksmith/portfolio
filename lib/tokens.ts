import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { env } from "@/lib/env";

/**
 * Capability tokens for shared CV links.
 *
 * A shared CV has no login. The URL *is* the credential, which makes the
 * token's entropy the entire security boundary — so it is generated here, from
 * a CSPRNG, and never derived from anything guessable like a company name or a
 * row id.
 */

/** 32 bytes of CSPRNG output, base64url-encoded to 43 URL-safe characters. */
export function generateShareToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Constant-time comparison, for any code path that compares a supplied token
 * against a stored one rather than looking it up by index.
 *
 * A plain `===` leaks the length of the matching prefix through timing. That is
 * a marginal risk here, but constant-time comparison costs nothing.
 */
export function tokensMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Salted hash of a visitor's IP, for collapsing repeat views in the CV access
 * log without ever storing the address itself.
 *
 * Not anonymisation in a strong sense — the IP space is small enough to brute
 * force a hash — which is exactly why the salt is a secret. Rotating
 * VISITOR_HASH_SALT severs the link to all previously logged views.
 */
export function hashVisitor(ip: string): string {
  return createHash("sha256")
    .update(`${env.visitorHashSalt}:${ip}`)
    .digest("base64url");
}
