/**
 * Case study frontmatter: the types, the parser, and the validation.
 *
 * Split from `work.ts` so it can be tested. Everything here is pure — it takes
 * a string and returns data or throws — while `work.ts` keeps the parts that
 * touch the filesystem and are therefore server-only. A hand-written parser
 * that nothing can exercise is a hand-written parser nobody should trust.
 */

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
export function parseFrontmatter(source: string, file: string) {
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

export const WEIGHTS: Weight[] = ["large", "medium", "small"];

export function required(
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

/**
 * Turn one parsed file into a case study, or throw saying which file and why.
 *
 * Every failure names the file. A parser that reports "invalid frontmatter"
 * across a directory of five is a parser you debug by bisecting.
 */
export function toCaseStudy(
  file: string,
  data: Record<string, string | string[]>,
  body: string,
): CaseStudy {
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
}
