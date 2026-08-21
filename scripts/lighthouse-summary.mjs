#!/usr/bin/env node
/**
 * Turns the Lighthouse CI run into a table.
 *
 * `lhci autorun` already fails the job on a broken assertion, but a pass prints
 * nothing anyone reads. The point of measuring on every push is seeing the
 * number move, which means the number has to be somewhere you look — so this
 * writes it to the GitHub Actions job summary, and to stdout when run locally.
 *
 * Median of the runs, not the best of them. Taking the best would report a
 * score the site does not reliably achieve.
 */

import { readFileSync, readdirSync, existsSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

// lhci writes each run to .lighthouseci/ and the filesystem target copies them
// to outputDir. Which one holds the JSON depends on whether the upload step
// ran, and the upload step does not run when an assertion fails — which is
// exactly when the numbers are most worth seeing.
const DIR = [".lighthouseci/reports", ".lighthouseci"].find(
  (dir) =>
    existsSync(dir) &&
    readdirSync(dir).some((f) => f.startsWith("lhr-") && f.endsWith(".json")),
);

if (!DIR) {
  console.error("No Lighthouse reports found. Run `npm run lighthouse` first.");
  process.exit(1);
}

/** Every run, grouped by the URL it measured. */
const byUrl = new Map();

for (const file of readdirSync(DIR).filter(
  (f) => f.startsWith("lhr-") && f.endsWith(".json"),
)) {
  const report = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  if (!report.categories) continue;

  const path = new URL(report.finalDisplayedUrl ?? report.requestedUrl)
    .pathname;
  if (!byUrl.has(path)) byUrl.set(path, []);
  byUrl.get(path).push(report);
}

const median = (numbers) => {
  const sorted = [...numbers].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const rows = [...byUrl.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, reports]) => ({
    path,
    runs: reports.length,
    scores: Object.fromEntries(
      CATEGORIES.map((key) => [
        key,
        Math.round(
          median(reports.map((r) => (r.categories[key]?.score ?? 0) * 100)),
        ),
      ]),
    ),
    // The metric that moves most on this site, and the one the hero costs.
    speedIndex: median(
      reports.map((r) => r.audits["speed-index"]?.numericValue ?? 0),
    ),
  }));

/** Accessibility is the claim; anything under 100 is a failure, not a dip. */
const mark = (key, score) =>
  key === "performance"
    ? score >= 80
      ? "🟢"
      : "🟡"
    : score === 100
      ? "🟢"
      : "🔴";

const header =
  "| Page | Perf | A11y | Best practices | SEO | Speed Index |\n" +
  "| --- | ---: | ---: | ---: | ---: | ---: |";

const body = rows
  .map(
    (r) =>
      `| \`${r.path}\` | ${mark("performance", r.scores.performance)} ${r.scores.performance} ` +
      `| ${mark("a", r.scores.accessibility)} ${r.scores.accessibility} ` +
      `| ${mark("a", r.scores["best-practices"])} ${r.scores["best-practices"]} ` +
      `| ${mark("a", r.scores.seo)} ${r.scores.seo} ` +
      `| ${(r.speedIndex / 1000).toFixed(1)} s |`,
  )
  .join("\n");

const worst = Math.min(...rows.map((r) => r.scores.accessibility));
const note =
  worst === 100
    ? "Accessibility is 100 on every page measured."
    : `**Accessibility dropped to ${worst}.** That is a gate, not a dip.`;

const summary = `## Lighthouse

${header}
${body}

${note}

Median of ${rows[0]?.runs ?? 0} runs per page, on Lighthouse's default mobile
profile — a mid-range Android on throttled 4G — against a production build. Accessibility, best practices and SEO fail the job below 100;
performance is a budget at 80, because the homepage hero types its own text and
Lighthouse measures that as slow paint — a deliberate trade, not a regression.
`;

console.log(summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
