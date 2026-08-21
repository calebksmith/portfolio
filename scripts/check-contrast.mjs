#!/usr/bin/env node
/**
 * Verifies every surface/foreground token pair, in every theme and mode.
 *
 * Reads the values out of app/globals.css rather than holding its own copy —
 * otherwise this becomes a second source of truth that can silently disagree
 * with the stylesheet it claims to check.
 *
 * Run: npm run check:contrast
 *
 * AA: 4.5:1 body text, 3:1 large text and non-text. AAA: 7:1.
 * The high-contrast theme is held to AAA on every text pair.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(join(root, "app/globals.css"), "utf8");

/**
 * Only the screen token layer is checked.
 *
 * The `@media print` block redefines the same `:root[...]` selectors to force a
 * light palette on paper. Without this cut, a selector lookup could match the
 * print declarations instead of the real ones and report contrast for a palette
 * nobody sees on screen — silently, and always passing, since print is black on
 * white. Print output is not gated here; it is black on white by construction.
 */
const printIndex = source.indexOf("@media print");
const css = printIndex === -1 ? source : source.slice(0, printIndex);

/* --- WCAG math ------------------------------------------------------------ */

const channel = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* --- Extract token blocks from the stylesheet ----------------------------- */

/** Returns the `--ck-*: #hex;` declarations of the block opened by `selector`. */
function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1)
    throw new Error(`Selector not found in globals.css: ${selector}`);
  const open = css.indexOf("{", start);
  const end = css.indexOf("}", open);
  const body = css.slice(open + 1, end);

  const tokens = {};
  for (const [, name, value] of body.matchAll(
    /--ck-([a-z-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g,
  )) {
    tokens[name] = value;
  }
  return tokens;
}

// Each theme/mode pair maps to the selector that defines it. The dark variants
// are declared twice in the stylesheet (media query + explicit [data-mode]);
// checking the explicit one is sufficient because they must be identical —
// and the check below proves they are.
const themes = {
  "default · light": block(":root {"),
  "default · dark": block(':root[data-mode="dark"] {'),
  "ember · light": block(':root[data-theme="ember"] {'),
  "ember · dark": block(':root[data-theme="ember"][data-mode="dark"] {'),
  "contrast · light": block(':root[data-theme="contrast"] {'),
  "contrast · dark": block(':root[data-theme="contrast"][data-mode="dark"] {'),
};

/* --- What gets checked ---------------------------------------------------- */

/**
 * `border` is deliberately not gated. WCAG 1.4.11 governs the boundary of a UI
 * component and graphics needed to understand content — not a decorative
 * hairline between rows. `input` is the control boundary and is gated at 3:1.
 * That distinction is the entire reason they are separate tokens.
 */
const PAIRS = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["muted", "muted-foreground"],
  ["primary", "primary-foreground"],
  ["accent", "accent-foreground"],
  // Hover surfaces are held to the same standard as the surfaces they replace.
  // A button that becomes unreadable for as long as the pointer is on it is
  // unreadable exactly when someone is trying to read it.
  ["primary-hover", "primary-foreground"],
  ["accent-hover", "accent-foreground"],
  // Verdict surfaces on the colophon. Gated like any other pair — a green that
  // reads as "good" is worth nothing if the text on it cannot be read, and the
  // Chosen/Rejected labels stay precisely because colour is never the only
  // signal.
  // The mark's own pair. A logo is exempt from WCAG, but a mark whose letters
  // stop reading on its own tile is a broken mark regardless of what the spec
  // requires — and this is the one asset that appears on every page.
  ["mark-ground", "mark-ink"],
  ["positive", "positive-foreground"],
  ["destructive", "destructive-foreground"],
  ["background", "muted-foreground"],
  ["background", "input"],
  ["background", "ring"],
  ["background", "border"],

  // The style guide's source panel highlights JSX on the card surface using
  // tokens that already exist, rather than introducing a syntax palette. These
  // are those combinations, gated here so the highlighter cannot quietly stop
  // being legible when a theme value changes.
  ["card", "primary"],
  ["card", "accent-foreground"],
  ["card", "muted-foreground"],
];

const NON_TEXT = new Set(["input", "ring"]);
const DECORATIVE = new Set(["border"]);

/* --- Run ------------------------------------------------------------------ */

let failures = 0;

// The two declarations of each dark theme must agree, or the toggle and the
// system preference would render differently.
for (const [name, selectors] of [
  [
    "default · dark",
    [':root:not([data-mode="light"]) {', ':root[data-mode="dark"] {'],
  ],
  [
    "ember · dark",
    [
      ':root[data-theme="ember"]:not([data-mode="light"]) {',
      ':root[data-theme="ember"][data-mode="dark"] {',
    ],
  ],
  [
    "contrast · dark",
    [
      ':root[data-theme="contrast"]:not([data-mode="light"]) {',
      ':root[data-theme="contrast"][data-mode="dark"] {',
    ],
  ],
]) {
  const [a, b] = selectors.map(block);
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (a[key] !== b[key]) {
      console.error(
        `MISMATCH ${name}: --ck-${key} is ${a[key]} in the media query but ${b[key]} under [data-mode="dark"]`,
      );
      failures++;
    }
  }
}

for (const [name, tokens] of Object.entries(themes)) {
  const isHighContrast = name.startsWith("contrast");
  console.log(`\n${name}`);

  for (const [surface, fg] of PAIRS) {
    const r = ratio(tokens[surface], tokens[fg]);
    const label = `${surface}/${fg}`.padEnd(32);
    const value = r.toFixed(2).padStart(6);

    if (DECORATIVE.has(fg)) {
      console.log(`  ${label} ${value}   —     decorative`);
      continue;
    }

    const floor = NON_TEXT.has(fg) ? 3 : 4.5;
    const required = isHighContrast && !NON_TEXT.has(fg) ? 7 : floor;
    const pass = r >= required;
    if (!pass) failures++;

    const verdict = !pass
      ? `FAIL (needs ${required}:1)`
      : r >= 7
        ? "AAA"
        : "AA";
    console.log(
      `  ${label} ${value}   ${NON_TEXT.has(fg) ? "3:1 " : "AA  "}  ${verdict}`,
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} failure(s).`);
  process.exit(1);
}
console.log("\nAll pairs pass.");
