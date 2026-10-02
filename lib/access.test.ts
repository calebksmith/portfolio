import { describe, expect, it } from "vitest";

import { GATED_PATH, mintToken, verifyToken } from "./access";

/**
 * The access links are the only thing between the gated screenshots and the
 * open web, so every way a token can be wrong is tested as a way it fails —
 * and fails the same way, with null.
 */

const SECRET = "test-secret";
const NOW = Date.UTC(2026, 9, 2);

describe("verifyToken", () => {
  it("accepts a token it minted, and returns who it was for", () => {
    const token = mintToken(SECRET, "Jane Doe, Acme", 30, NOW);
    const grant = verifyToken(token, SECRET, [], NOW);
    expect(grant?.to).toBe("Jane Doe, Acme");
    expect(grant?.exp).toBe(NOW / 1000 + 30 * 24 * 60 * 60);
  });

  it("refuses a token signed with a different secret", () => {
    const token = mintToken("another-secret", "Jane", 30, NOW);
    expect(verifyToken(token, SECRET, [], NOW)).toBeNull();
  });

  it("refuses a token whose grant was edited", () => {
    // Extending your own expiry or renaming yourself breaks the signature.
    const [body, signature] = mintToken(SECRET, "Jane", 30, NOW).split(".");
    const grant = JSON.parse(Buffer.from(body, "base64url").toString());
    const forged = Buffer.from(
      JSON.stringify({ ...grant, exp: grant.exp + 365 * 24 * 60 * 60 }),
    ).toString("base64url");
    expect(verifyToken(`${forged}.${signature}`, SECRET, [], NOW)).toBeNull();
  });

  it("refuses a token whose signature was edited", () => {
    const token = mintToken(SECRET, "Jane", 30, NOW);
    const flipped = token.slice(0, -1) + (token.endsWith("A") ? "B" : "A");
    expect(verifyToken(flipped, SECRET, [], NOW)).toBeNull();
  });

  it("refuses a token once it has expired", () => {
    const token = mintToken(SECRET, "Jane", 1, NOW);
    const later = NOW + 2 * 24 * 60 * 60 * 1000;
    expect(verifyToken(token, SECRET, [], later)).toBeNull();
  });

  it("refuses a revoked token, and only that one", () => {
    const kept = mintToken(SECRET, "Jane", 30, NOW);
    const cut = mintToken(SECRET, "Sam", 30, NOW);
    const cutId = verifyToken(cut, SECRET, [], NOW)!.id;
    expect(verifyToken(cut, SECRET, [cutId], NOW)).toBeNull();
    expect(verifyToken(kept, SECRET, [cutId], NOW)).not.toBeNull();
  });

  it.each(["", "abc", "a.b.c", "!!.!!", "e30.e30"])(
    "refuses %j, which isn't a token",
    (token) => {
      expect(verifyToken(token, SECRET, [], NOW)).toBeNull();
    },
  );
});

describe("GATED_PATH", () => {
  it("accepts a case study folder and a webp", () => {
    expect(GATED_PATH.test("challenges/choose-team.webp")).toBe(true);
  });

  it.each([
    "../secrets.webp",
    "challenges/../../etc.webp",
    "a/b/c.webp",
    "challenges/Choose-Team.webp",
    "challenges/choose-team.png",
    "/challenges/choose-team.webp",
  ])("refuses %j", (path) => {
    expect(GATED_PATH.test(path)).toBe(false);
  });
});
