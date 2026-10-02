/**
 * Case study frontmatter: the types, the parser, and the validation.
 *
 * Split from `work.ts` so it can be tested. Everything here is pure — it takes
 * a string and returns data or throws — while `work.ts` keeps the parts that
 * touch the filesystem and are therefore server-only. A hand-written parser
 * that nothing can exercise is a hand-written parser nobody should trust.
 */

/**
 * Where a case study sits in the Vimocity ecosystem: the people it serves, or
 * the layers everyone shares. Different people use Vimocity for different jobs,
 * so the first three are personas; identity and platform run underneath all of
 * them. In display order.
 */
export const AREAS = [
  "workers",
  "safety-leaders",
  "admins",
  "identity",
  "platform",
] as const;
export type Area = (typeof AREAS)[number];

export type CaseStudy = {
  slug: string;
  /** `Name: What it is` — the feature first, then a plain description. */
  title: string;
  /** The part before the colon: breadcrumbs, links between studies, the map. */
  name: string;
  /** The part after it: shown under the name wherever the title is. */
  descriptor: string;
  role: string;
  year: string;
  /** What it was built with. Badges name a stack, not a device list. */
  stack: string[];
  summary: string;
  /**
   * Why it mattered, in product terms — user value and business value, one
   * line each: what it changed for the people using Vimocity, and what it
   * changed for the business. Required; a case study that can't say both isn't
   * finished.
   */
  user: string;
  business: string;
  /** Slugs of the case studies this one feeds or depends on. */
  connects: string[];
  /** Where it sits in the ecosystem, and its place within that area. */
  area: Area;
  order: number;
  /**
   * The headline result as a chip on the card — "−80% login support
   * tickets". Short enough to scan; the full figure and its caveat are on the
   * page. Optional: not every case study has a number to show.
   */
  impact?: string;
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
  const stack = data.stack;
  const connects = data.connects;

  const area = required(data, "area", file);
  if (!AREAS.includes(area as Area)) {
    throw new Error(
      `${file}: area must be one of ${AREAS.join(", ")} — got "${area}"`,
    );
  }
  const order = Number(data.order ?? Number.MAX_SAFE_INTEGER);
  const impact = data.impact;

  // Titles inform rather than tease: a reader should know what the feature is
  // before clicking. So every title is `Name: What it is`, and a title that
  // isn't fails the build rather than reaching a card. The second part is shown
  // on its own line under the name, so it starts with a capital like any line.
  const title = required(data, "title", file);
  const separator = title.indexOf(": ");
  if (separator < 1 || separator === title.length - 2) {
    throw new Error(
      `${file}: title must name the feature first, as "Name: What it is" — got "${title}"`,
    );
  }
  const descriptor = title.slice(separator + 2);
  if (/^\p{Ll}/u.test(descriptor)) {
    throw new Error(
      `${file}: "${descriptor}" starts its own line under the name, so it starts with a capital`,
    );
  }

  return {
    slug: file.replace(/\.mdx$/, ""),
    title,
    name: title.slice(0, separator),
    descriptor,
    role: required(data, "role", file),
    year: required(data, "year", file),
    stack: Array.isArray(stack) ? stack : [],
    summary: required(data, "summary", file),
    user: required(data, "user", file),
    business: required(data, "business", file),
    connects: Array.isArray(connects) ? connects : [],
    area: area as Area,
    impact: typeof impact === "string" && impact ? impact : undefined,
    order: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER,
    body,
  } satisfies CaseStudy;
}
