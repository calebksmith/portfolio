/**
 * WCAG contrast math.
 *
 * Shared by the themes page (which measures the live DOM) and
 * scripts/check-contrast.mjs (which reads globals.css at build time). Same
 * formula in both places, so the page and the gate can never disagree about
 * what a ratio is.
 */

/** The pairs that mean something. A ratio is only meaningful in combination. */
export const CONTRAST_PAIRS = [
  { surface: "background", foreground: "foreground", label: "Background / text" },
  { surface: "card", foreground: "card-foreground", label: "Card / text" },
  { surface: "muted", foreground: "muted-foreground", label: "Muted / text" },
  {
    surface: "primary",
    foreground: "primary-foreground",
    label: "Primary / text",
  },
  { surface: "accent", foreground: "accent-foreground", label: "Accent / text" },
  {
    surface: "background",
    foreground: "muted-foreground",
    label: "Background / secondary text",
  },
  {
    surface: "background",
    foreground: "input",
    label: "Background / control edge",
    nonText: true,
  },
  {
    surface: "background",
    foreground: "ring",
    label: "Background / focus ring",
    nonText: true,
  },
] as const;

function channel(value: number) {
  const v = value / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
}

/**
 * Parse a resolved CSS color. `getComputedStyle` returns `rgb(...)` or
 * `oklch(...)` depending on the browser and how the value was authored, so both
 * are handled; anything else returns null rather than a wrong number.
 */
export function parseColor(input: string): [number, number, number] | null {
  const text = input.trim();

  const rgb = /^rgba?\(([^)]+)\)$/i.exec(text);
  if (rgb) {
    const parts = rgb[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return [parts[0], parts[1], parts[2]];
    }
    return null;
  }

  const hex = /^#([0-9a-f]{6})$/i.exec(text);
  if (hex) {
    const h = hex[1];
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }

  return null;
}

export function luminance([r, g, b]: [number, number, number]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number | null {
  const first = parseColor(a);
  const second = parseColor(b);
  if (!first || !second) return null;

  const [hi, lo] = [luminance(first), luminance(second)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** AA is 4.5:1 for body text, 3:1 for large text and non-text. AAA is 7:1. */
export function grade(ratio: number, nonText = false) {
  const aaFloor = nonText ? 3 : 4.5;
  return {
    aa: ratio >= aaFloor,
    aaa: nonText ? ratio >= 4.5 : ratio >= 7,
    aaFloor,
  };
}
