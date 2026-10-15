import { describe, expect, it } from "vitest";

import { cleanPath, isBot, referrerHost, visitorFromHeaders } from "./visitor";

const headers = (values: Record<string, string>) => new Headers(values);
const DAY = new Date("2026-10-15T12:00:00Z");

describe("visitorFromHeaders", () => {
  const request = headers({
    "x-forwarded-for": "203.0.113.7, 10.0.0.1",
    "user-agent": "Mozilla/5.0",
    "x-vercel-ip-country": "US",
    "x-vercel-ip-country-region": "WA",
    "x-vercel-ip-city": "S%C3%A3o%20Paulo",
  });

  it("keeps a location and a hash, never the address", () => {
    const visitor = visitorFromHeaders(request, "salt", DAY);
    expect(visitor).toMatchObject({
      country: "US",
      region: "WA",
      city: "São Paulo",
    });
    expect(JSON.stringify(visitor)).not.toContain("203.0.113.7");
  });

  it("gives the same visitor the same hash all day, and a new one tomorrow", () => {
    const later = new Date("2026-10-15T23:59:00Z");
    const tomorrow = new Date("2026-10-16T00:01:00Z");
    const today = visitorFromHeaders(request, "salt", DAY).visitorHash;
    expect(visitorFromHeaders(request, "salt", later).visitorHash).toBe(today);
    expect(visitorFromHeaders(request, "salt", tomorrow).visitorHash).not.toBe(
      today,
    );
  });

  it("changes every hash when the salt changes", () => {
    expect(visitorFromHeaders(request, "a", DAY).visitorHash).not.toBe(
      visitorFromHeaders(request, "b", DAY).visitorHash,
    );
  });
});

describe("isBot", () => {
  it("lets a browser through and stops crawlers and empty agents", () => {
    expect(isBot("Mozilla/5.0 (Macintosh) Safari/605.1.15")).toBe(false);
    expect(isBot("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
    expect(isBot("LinkedInBot/1.0")).toBe(true);
    expect(isBot(null)).toBe(true);
  });
});

describe("cleanPath", () => {
  it("keeps our own paths and drops the query", () => {
    expect(cleanPath("/work/login?x=1#top")).toBe("/work/login");
  });

  it("refuses anything that isn't a path on this site", () => {
    expect(cleanPath("https://example.com/")).toBeNull();
    expect(cleanPath("//example.com/")).toBeNull();
    expect(cleanPath(42)).toBeNull();
    expect(cleanPath(`/${"a".repeat(300)}`)).toBeNull();
  });
});

describe("referrerHost", () => {
  it("keeps another site's host and nothing else", () => {
    expect(
      referrerHost(
        "https://www.linkedin.com/in/someone?x=1",
        "calebksmith.com",
      ),
    ).toBe("www.linkedin.com");
    expect(
      referrerHost("https://calebksmith.com/work", "calebksmith.com"),
    ).toBeNull();
    expect(referrerHost("", "calebksmith.com")).toBeNull();
  });
});
