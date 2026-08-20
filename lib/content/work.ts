import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The case study content layer.
 *
 * Case studies are MDX files in src/content/work/. Adding one means adding a
 * file — nothing here or in the bento index needs editing. See
 * docs/decisions/0004-content.md.
 *
 * Files are read at module scope rather than during render. They do not depend
 * on the request and never change between requests, so this resolves during
 * prerendering and the content is baked into the static HTML. Reading inside a
 * component would make it uncached async work that Next would want wrapped in
 * Suspense for no benefit.
 */

const WORK_DIR = join(process.cwd(), "src/content/work");

/** Weight drives the bento grid's span. Largest first. */
export type Weight = "large" | "medium" | "small";

export type CaseStudy = {
  slug: string;
  title: string;
  role: string;
  year: string;
  /** What it was built with. Badges name a stack, not a device list. */
  stack: string[];
  summary: string;
  weight: Weight;
  /** The MDX body, compiled at render time by components/mdx.tsx. */
  body: string;
};

/**
 * Minimal frontmatter parser.
 *
 * Handles exactly what this project's frontmatter uses: `key: value` and
 * `key: [a, b, c]`, with optional quotes. A YAML dependency would buy support
 * for anchors, block scalars, and nested maps — none of which belong in a case
 * study header. If the frontmatter ever needs more than this, that is a signal
 * the metadata is growing into something that should be structured data.
 */
function parseFrontmatter(source: string, file: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) {
    throw new Error(`${file}: missing frontmatter block`);
  }

  const [, head, body] = match;
  const data: Record<string, string | string[]> = {};

  for (const line of head.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      throw new Error(`${file}: cannot parse frontmatter line: ${line}`);
    }

    const key = line.slice(0, separator).trim();
    const raw = line.slice(separator + 1).trim();

    if (raw.startsWith("[") && raw.endsWith("]")) {
      data[key] = raw
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = raw.replace(/^["']|["']$/g, "");
    }
  }

  return { data, body: body.trim() };
}

const WEIGHTS: Weight[] = ["large", "medium", "small"];

function required(
  data: Record<string, string | string[]>,
  key: string,
  file: string,
): string {
  const value = data[key];
  if (typeof value !== "string" || !value) {
    throw new Error(`${file}: frontmatter is missing "${key}"`);
  }
  return value;
}

function load(): CaseStudy[] {
  const files = readdirSync(WORK_DIR).filter((name) => name.endsWith(".mdx"));

  const studies = files.map((file) => {
    const source = readFileSync(join(WORK_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(source, file);

    const weight = required(data, "weight", file);
    if (!WEIGHTS.includes(weight as Weight)) {
      throw new Error(
        `${file}: weight must be one of ${WEIGHTS.join(", ")} — got "${weight}"`,
      );
    }

    const stack = data.stack;

    return {
      slug: file.replace(/\.mdx$/, ""),
      title: required(data, "title", file),
      role: required(data, "role", file),
      year: required(data, "year", file),
      stack: Array.isArray(stack) ? stack : [],
      summary: required(data, "summary", file),
      weight: weight as Weight,
      body,
    } satisfies CaseStudy;
  });

  // Largest first, then alphabetically so the order is stable across machines —
  // readdir order is not guaranteed.
  return studies.sort(
    (a, b) =>
      WEIGHTS.indexOf(a.weight) - WEIGHTS.indexOf(b.weight) ||
      a.title.localeCompare(b.title),
  );
}

/** Read once at module scope; the files cannot change between requests. */
export const caseStudies: CaseStudy[] = load();

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
