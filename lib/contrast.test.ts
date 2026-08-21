import { describe, expect, it } from "vitest";

import { contrastRatio, grade, luminance, parseColor } from "./contrast";

/**
 * The colour maths behind every accessibility claim on this site.
 *
 * Worth testing precisely because it is invisible: a wrong ratio does not throw
 * or render oddly, it silently reports that an unreadable pair is fine. The
 * expected values below are the WCAG definitions, not this implementation's
 * output — checking a function against itself proves nothing.
 */

describe("parseColor", () => {
  it("reads the rgb() that getComputedStyle actually returns", () => {
    expect(parseColor("rgb(74, 44, 224)")).toEqual([74, 44, 224]);
  });

  it("reads rgba(), including the slash syntax", () => {
    expect(parseColor("rgba(74, 44, 224, 0.5)")).toEqual([74, 44, 224]);
    expect(parseColor("rgb(74 44 224 / 50%)")).toEqual([74, 44, 224]);
  });

  it("reads six-digit hex, either case", () => {
    expect(parseColor("#4a2ce0")).toEqual([74, 44, 224]);
    expect(parseColor("#4A2CE0")).toEqual([74, 44, 224]);
  });

  it("returns null rather than a wrong number for anything else", () => {
    // The failure mode that matters. oklch() is what some browsers hand back,
    // and guessing at it would produce a plausible ratio for the wrong colour.
    expect(parseColor("oklch(0.5 0.2 270)")).toBeNull();
    expect(parseColor("#abc")).toBeNull();
    expect(parseColor("rebeccapurple")).toBeNull();
    expect(parseColor("")).toBeNull();
  });
});

describe("luminance", () => {
  it("puts black at 0 and white at 1", () => {
    expect(luminance([0, 0, 0])).toBe(0);
    expect(luminance([255, 255, 255])).toBeCloseTo(1, 10);
  });

  it("weights green above red above blue, per WCAG", () => {
    const [r, g, b] = [
      luminance([255, 0, 0]),
      luminance([0, 255, 0]),
      luminance([0, 0, 255]),
    ];
    expect(g).toBeGreaterThan(r);
    expect(r).toBeGreaterThan(b);
  });
});

describe("contrastRatio", () => {
  it("gives black on white the maximum 21:1", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("gives a colour against itself 1:1", () => {
    expect(contrastRatio("#4a2ce0", "#4a2ce0")).toBeCloseTo(1, 10);
  });

  it("does not care which argument is the lighter one", () => {
    const a = contrastRatio("#14161b", "#eef0f2");
    const b = contrastRatio("#eef0f2", "#14161b");
    expect(a).toBeCloseTo(b as number, 10);
  });

  it("returns null when either colour is unparseable", () => {
    expect(contrastRatio("oklch(0.5 0.2 270)", "#ffffff")).toBeNull();
  });

  it("agrees with the site's own shipped pairs", () => {
    // The default light theme's body pair, and the mark. If either of these
    // moves, something in globals.css moved with it.
    expect(contrastRatio("#14161b", "#eef0f2")).toBeGreaterThan(4.5);
    expect(contrastRatio("#a78bfa", "#14161b")).toBeGreaterThan(4.5);
    // The light theme's primary on the mark's ink ground — the pairing that
    // was measured, found at 2.35:1, and deliberately never used.
    expect(contrastRatio("#4a2ce0", "#14161b")).toBeLessThan(3);
  });
});

describe("grade", () => {
  it("holds body text to 4.5 and non-text to 3", () => {
    expect(grade(4.5).aa).toBe(true);
    expect(grade(4.49).aa).toBe(false);
    expect(grade(3, true).aa).toBe(true);
    expect(grade(2.99, true).aa).toBe(false);
  });

  it("holds AAA at 7 for text", () => {
    expect(grade(7).aaa).toBe(true);
    expect(grade(6.99).aaa).toBe(false);
  });

  it("reports the floor it applied, so a caller cannot assume the wrong one", () => {
    expect(grade(5).aaFloor).toBe(4.5);
    expect(grade(5, true).aaFloor).toBe(3);
  });
});
