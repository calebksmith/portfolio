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
    // The VimUI component count appears in several places — the hero, a bento
    // card, the résumé, and the case study. It once drifted into "51" and
    // "50+" at the same time, which is the kind of thing an interviewer
    // notices and every other number on the page then pays for.
    pattern: /\b\d{2} components\b/g,
    message: 'the component count is written "50+ components"',
  },
];

/**
 * The words a reader sees, held to CLAUDE.md's "One name per thing" and its
 * house style. Scoped to the copy itself — the dictionary, the résumé, and the
 * MDX — because code comments are written for whoever maintains the code, and
 * a spelling rule that fired on them would be noise. Comment lines and code
 * fences are skipped.
 */
const COPY_ROOTS = ["lib/i18n/messages", "lib/content/resume", "src/content"];

const COPY_RULES = [
  {
    id: "web-portal",
    // Vimocity's own word for its web app, so it isn't confused with the
    // mobile app. "Web app", "web application", and "portal" had all crept in.
    pattern: /\bweb app(lication)?s?\b/gi,
    message: 'Vimocity\'s web app is the "web portal"',
  },
  {
    id: "crew-leader",
    pattern: /\bforem[ae]n\b/gi,
    message: 'write "crew leader"',
  },
  {
    id: "versioned-releases",
    pattern: /\bsemver\b|\bsemantic versioning\b/gi,
    message: 'write "versioned releases"',
  },
  {
    id: "mfa",
    pattern: /\bMFA\b/g,
    message: 'spell out "multi-factor authentication"',
  },
  {
    id: "american-spelling",
    // Explicit stems rather than every "-ise", which would catch "promise",
    // "exercise", and "otherwise".
    pattern:
      /\b(colour|honour|favour|behaviour|artefact|centre|catalogue|(?:personal|anonym|optim|organ|recogn|priorit|minim|maxim|normal|summar|custom|visual|standard|real|util|apolog|emphas|categor|special|modern|stabil|memor|critic)is(?:e|ed|es|ing|ation|ations))\w*/gi,
    message: "American spelling",
  },
  {
    id: "curly-apostrophe",
    pattern: /(?<=[A-Za-z])'(?=[A-Za-z])/g,
    message: "use a curly apostrophe (’)",
  },
  {
    id: "stock-phrasing",
    // Words that say nothing specific, so readers skim past them. Each one
    // has a plainer word or a concrete detail behind it.
    pattern:
      /\b(delv\w*|leverag\w*|seamless\w*|robust|streamlin\w*|empower\w*|foster\w*|tapestry|realm|crucial|pivotal|intricate|holistic|synerg\w*|cutting-edge|game-?changer\w*|unlock\w*|harness\w*|showcas\w*|testament|underscor\w*|meticulous\w*|nuanced|paramount|transformative|vibrant|bespoke|utiliz\w*|facilitat\w*|moreover|furthermore|additionally|notably|ultimately|effortless\w*|impactful|actionable|worth noting|in today’s)\b/gi,
    message: "stock phrasing; say the specific thing",
  },
  {
    id: "not-just",
    pattern: /\bnot (just|only|merely)\b/gi,
    message: '"not just X, but Y" is a formula; state Y',
  },
];

/**
 * Em dashes, counted per string in the dictionary and the résumé and per
 * paragraph in MDX. One is punctuation; two in the same breath is a habit
 * readers notice. A period, a colon, or parentheses usually does the job.
 */
function* emDashRuns(path, text) {
  const tooMany = (s) => (s.match(/—/g) ?? []).length > 1;

  if (path.endsWith(".ts")) {
    const lines = text.split("\n");
    for (const [index, line] of lines.entries()) {
      if (/^\s*(\/\/|\/?\*)/.test(line)) continue;
      for (const match of line.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
        if (tooMany(match[1])) yield { line: index + 1, text: match[1] };
      }
    }
    return;
  }

  // MDX: each frontmatter field on its own, prose paragraphs (blockquotes
  // included), and each quoted attribute inside a JSX block.
  const lines = text.split("\n");
  let fenced = false;
  let start = 0;
  let paragraph = [];
  const flush = () => {
    const prose = paragraph.join(" ");
    if (tooMany(prose)) return { line: start, text: prose };
  };

  // Frontmatter fields are separate values, not one paragraph.
  let from = 0;
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((line, i) => i > 0 && line.trim() === "---");
    for (let i = 1; i < end; i += 1) {
      if (tooMany(lines[i])) yield { line: i + 1, text: lines[i] };
    }
    from = end + 1;
  }

  for (const [offset, raw] of lines.slice(from).entries()) {
    const index = from + offset;
    if (raw.trim().startsWith("```")) fenced = !fenced;
    if (fenced) continue;

    // A blockquote is prose: read it without its marker. A bare `>` is the
    // blank line between two quoted paragraphs.
    const line = raw.replace(/^\s*>\s?/, "");

    if (/^\s*(<|\/>|[a-zA-Z]+=)/.test(line)) {
      for (const match of line.matchAll(/"((?:[^"\\]|\\.)*)"/g)) {
        if (tooMany(match[1])) yield { line: index + 1, text: match[1] };
      }
      continue;
    }

    if (line.trim() === "") {
      const run = flush();
      if (run) yield run;
      paragraph = [];
      continue;
    }
    if (paragraph.length === 0) start = index + 1;
    paragraph.push(line);
  }
  const run = flush();
  if (run) yield run;
}

/**
 * Nothing internal ships.
 *
 * This repository is public, and it is written by someone whose day job has
 * its own tracker, its own docs, and its own data. These patterns catch the
 * fingerprints of that material arriving by copy and paste — a ticket key, a
 * link into a private workspace, a personal address — before it is pushed.
 *
 * Deliberately generic. Listing an employer's actual repository or product
 * names here would publish the very thing it exists to keep out.
 */
const INTERNAL_RULES = [
  {
    id: "ticket-key",
    // A project key, a dash, a number. Ticket keys are the most common thing
    // to paste by accident, and they point into a system a reader cannot open.
    pattern: /\b[A-Z][A-Z\d]{1,9}-\d{1,6}\b/g,
    message: "looks like a ticket key from a private tracker",
  },
  {
    id: "private-workspace",
    pattern: /\b[\w-]+\.(atlassian\.net|slack\.com|notion\.so|linear\.app)\b/gi,
    message: "links into a private workspace",
  },
  {
    id: "email-address",
    // A personal address in a public file. The GitHub no-reply form is the
    // one that belongs in commit metadata; a `user:pass@host` URL is not an
    // email and is skipped by the lookbehind.
    pattern:
      /(?<![:/\w])[\w.%+-]+@(?!users\.noreply\.github\.com)[\w-]+\.[\w.-]*[a-z]{2,}\b/gi,
    message: "is an email address in a public file",
  },
];

/** Everything that is published with the repository, not only the site. */
const PUBLIC_ROOTS = [
  ...ROOTS,
  ".claude",
  ".github",
  "scripts",
  "eslint-rules",
];
const PUBLIC_FILES = ["CLAUDE.md", "AGENTS.md", "README.md", "package.json"];
const PUBLIC_EXTENSIONS = [...EXTENSIONS, ".mjs", ".json", ".yml", ".yaml"];

function* walk(dir, extensions = EXTENSIONS) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path, extensions);
    else if (extensions.some((ext) => entry.endsWith(ext))) yield path;
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

for (const root_ of COPY_ROOTS) {
  const base = join(root, root_);
  try {
    statSync(base);
  } catch {
    continue;
  }

  for (const path of walk(base)) {
    if (path.endsWith(".test.ts")) continue;
    const file = relative(root, path);
    const text = readFileSync(path, "utf8");
    let fenced = false;

    for (const run of emDashRuns(path, text)) {
      failures += 1;
      console.log(
        `  ${file}:${run.line}  more than one em dash — "${run.text.slice(0, 60)}…"`,
      );
    }

    text.split("\n").forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("```")) fenced = !fenced;
      if (fenced) return;
      // Comments only exist in the .ts files. In MDX a line starting with `*`
      // is bold text, and it's copy like any other.
      if (path.endsWith(".ts") && /^(\/\/|\/?\*)/.test(trimmed)) return;

      // Code isn't prose: inline code spans and rich-text <code> are left out.
      const prose = line
        .replace(/`[^`]*`/g, "")
        .replace(/<code>.*?<\/code>/g, "");

      for (const rule of COPY_RULES) {
        for (const match of prose.matchAll(rule.pattern)) {
          failures += 1;
          console.log(
            `  ${file}:${index + 1}  ${rule.message} — found "${match[0]}"`,
          );
        }
      }
    });
  }
}

function* publicFiles() {
  for (const root_ of PUBLIC_ROOTS) {
    const base = join(root, root_);
    try {
      statSync(base);
    } catch {
      continue;
    }
    yield* walk(base, PUBLIC_EXTENSIONS);
  }
  for (const file of PUBLIC_FILES) yield join(root, file);
}

for (const path of new Set(publicFiles())) {
  const file = relative(root, path);
  const lines = readFileSync(path, "utf8").split("\n");

  lines.forEach((line, index) => {
    for (const rule of INTERNAL_RULES) {
      for (const match of line.matchAll(rule.pattern)) {
        failures += 1;
        console.log(`  ${file}:${index + 1}  "${match[0]}" ${rule.message}`);
      }
    }
  });
}

if (failures > 0) {
  console.log(`\n${failures} copy issue${failures === 1 ? "" : "s"}.`);
  process.exit(1);
}

console.log("Copy conventions hold, and nothing internal is in the repo.");
