import { describe, expect, it } from "vitest";

import { parseFrontmatter, required, toCaseStudy } from "./frontmatter";

/**
 * A hand-written parser, tested.
 *
 * The decision not to take a YAML dependency is defensible — nothing in a case
 * study header needs anchors or block scalars — but it is only defensible if
 * the parser that replaced it is exercised. Most of these tests are about
 * failure: a content parser that quietly produces the wrong shape is worse than
 * one that throws, because the wrong shape reaches a page.
 */

const VALID = `---
title: One login for three platforms
role: Product design, cross-platform
year: 2025
stack: [Figma, WebView, SSO, MFA]
summary: Support tickets dropped 80%.
weight: medium
---

## Problem

Body text.
`;

describe("parseFrontmatter", () => {
  it("reads scalars, and does not stop at a colon inside the value", () => {
    const { data } = parseFrontmatter(VALID, "login.mdx");
    expect(data.title).toBe("One login for three platforms");
    // "Product design, cross-platform" has a comma; "2025" is not a number.
    expect(data.role).toBe("Product design, cross-platform");
    expect(data.year).toBe("2025");
  });

  it("reads bracketed lists into arrays", () => {
    const { data } = parseFrontmatter(VALID, "login.mdx");
    expect(data.stack).toEqual(["Figma", "WebView", "SSO", "MFA"]);
  });

  it("keeps a percent sign and other punctuation in the summary", () => {
    const { data } = parseFrontmatter(VALID, "login.mdx");
    expect(data.summary).toBe("Support tickets dropped 80%.");
  });

  it("returns the body without the frontmatter block", () => {
    const { body } = parseFrontmatter(VALID, "login.mdx");
    expect(body.startsWith("## Problem")).toBe(true);
    expect(body).not.toContain("weight:");
  });

  it("strips quotes from scalars and from list items", () => {
    const { data } = parseFrontmatter(
      `---\ntitle: "Quoted"\nstack: ['A', "B"]\n---\nbody\n`,
      "t.mdx",
    );
    expect(data.title).toBe("Quoted");
    expect(data.stack).toEqual(["A", "B"]);
  });

  it("handles CRLF, so a file edited on Windows still parses", () => {
    const { data } = parseFrontmatter(
      "---\r\ntitle: Windows\r\n---\r\nbody\r\n",
      "t.mdx",
    );
    expect(data.title).toBe("Windows");
  });

  it("skips comments and blank lines", () => {
    const { data } = parseFrontmatter(
      `---\n# a comment\n\ntitle: Kept\n---\nbody\n`,
      "t.mdx",
    );
    expect(data.title).toBe("Kept");
    expect(data["# a comment"]).toBeUndefined();
  });

  it("names the file when there is no frontmatter block", () => {
    expect(() => parseFrontmatter("no frontmatter here", "broken.mdx")).toThrow(
      /broken\.mdx/,
    );
  });

  it("names the file and the line when a line has no colon", () => {
    expect(() =>
      parseFrontmatter(`---\ntitle: Fine\nnonsense\n---\nbody\n`, "bad.mdx"),
    ).toThrow(/bad\.mdx[\s\S]*nonsense/);
  });
});

describe("required", () => {
  it("returns the value when it is a non-empty string", () => {
    expect(required({ title: "Yes" }, "title", "f.mdx")).toBe("Yes");
  });

  it("throws, naming the file and the key, when it is missing or empty", () => {
    expect(() => required({}, "title", "f.mdx")).toThrow(/f\.mdx.*"title"/);
    expect(() => required({ title: "" }, "title", "f.mdx")).toThrow(/f\.mdx/);
  });

  it("throws when the key holds a list where a scalar belongs", () => {
    expect(() => required({ title: ["a"] }, "title", "f.mdx")).toThrow();
  });
});

describe("toCaseStudy", () => {
  const data = {
    title: "T",
    role: "R",
    year: "2025",
    summary: "S",
    weight: "medium",
    stack: ["A"],
  };

  it("derives the slug from the filename", () => {
    expect(toCaseStudy("platform-rebuild.mdx", data, "body").slug).toBe(
      "platform-rebuild",
    );
  });

  it("rejects a weight outside the three the grid can lay out", () => {
    expect(() =>
      toCaseStudy("f.mdx", { ...data, weight: "huge" }, "body"),
    ).toThrow(/weight must be one of[\s\S]*huge/);
  });

  it("defaults a missing stack to empty rather than throwing", () => {
    // Badges are optional; a case study without them should still build.
    const { stack } = toCaseStudy("f.mdx", { ...data, stack: undefined! }, "b");
    expect(stack).toEqual([]);
  });
});
