import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  WEIGHTS,
  parseFrontmatter,
  toCaseStudy,
  type CaseStudy,
  type Weight,
} from "./frontmatter";

export type { CaseStudy, Weight };

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

function load(): CaseStudy[] {
  const files = readdirSync(WORK_DIR).filter((name) => name.endsWith(".mdx"));

  const studies = files.map((file) => {
    const source = readFileSync(join(WORK_DIR, file), "utf8");
    const { data, body } = parseFrontmatter(source, file);
    return toCaseStudy(file, data, body);
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
