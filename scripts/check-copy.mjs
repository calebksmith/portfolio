#!/usr/bin/env node
/**
 * Copy conventions that a linter cannot see.
 *
 * ESLint checks the code and `check:contrast` checks the tokens; nothing was
 * checking the words. "Frontend" had drifted into three spellings across the
 * components, the résumé data, a case study's frontmatter, and the copy deck —
 * each one correct in isolation and wrong as a set.
 *
 * This is the same argument the site makes about design systems: a standard
 * that is written down but not enforced is a standard that decays. So it is
 * written down in CLAUDE.md and enforced here.
 *
 * Run: npm run check:copy
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const ROOTS = ["app", "components", "lib", "src", "docs"];
const EXTENSIONS = [".ts", ".tsx", ".mdx", ".md", ".css"];
const SKIP = new Set(["node_modules", ".next", ".git"]);

const RULES = [
  {
    id: "frontend-one-word",
    // Hyphen or space between the two halves, and any inflection after it —
    // `\bfront[- ]end\b` let "front ends" through, because the word boundary
    // fails against the plural's own "s". A spelling rule that only covers the
    // singular is a rule with a hole in it.
    pattern: /\bfront[- ]end(s|ed|ing|er)?\b/gi,
    message: '"frontend" is one word',
  },
  {
    id: "daily-5",
    // The product feature is written "Daily 5". "Daily Five" crept in across
    // two case studies and one editorial note before anyone noticed.
    pattern: /\bDaily Five\b/g,
    message: 'the routine is written "Daily 5"',
  },
  {
    id: "webview",
    // One word in prose. `WebView` stays as a badge, where it is a name.
    pattern: /\bweb view(s)?\b/gi,
    message: '"webview" is one word',
  },
  {
    id: "component-count",
    // The VimUI component count appears in eight places — the hero, a bento
    // card, the résumé, the case study, and four spots in the copy deck. They
    // drifted into "51" and "50+" at the same time, which is the kind of thing
    // an interviewer notices and every other number on the page then pays for.
    pattern: /\b\d{2} components\b/g,
    message: 'the component count is written "50+ components"',
  },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (EXTENSIONS.some((ext) => entry.endsWith(ext))) yield path;
  }
}

let failures = 0;

for (const root_ of ROOTS) {
  const base = join(root, root_);
  let exists = true;
  try {
    statSync(base);
  } catch {
    exists = false;
  }
  if (!exists) continue;

  for (const path of walk(base)) {
    const file = relative(root, path);
    const lines = readFileSync(path, "utf8").split("\n");

    lines.forEach((line, index) => {
      for (const rule of RULES) {
        // `matchAll` rather than `test`, so a global regex's lastIndex cannot
        // carry between lines and skip every other match.
        for (const match of line.matchAll(rule.pattern)) {
          failures += 1;
          console.log(
            `  ${file}:${index + 1}  ${rule.message} — found "${match[0]}"`,
          );
        }
      }
    });
  }
}

if (failures > 0) {
  console.log(`\n${failures} copy issue${failures === 1 ? "" : "s"}.`);
  process.exit(1);
}

console.log("Copy conventions hold.");
