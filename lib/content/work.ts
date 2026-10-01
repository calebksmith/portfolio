import "server-only";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

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
 * Case studies are MDX files in `src/content/work/<locale>/`, one file per
 * study per language, sharing a filename — the filename is the slug, so the
 * same study has the same URL path in every locale. Adding one means adding a
 * file; nothing here or in the bento index needs editing. See
 * docs/decisions/0004-content.md and 0006-localization.md.
 *
 * Files are read at module scope rather than during render. They do not depend
 * on the request and never change between requests, so this resolves during
 * prerendering and the content is baked into the static HTML.
 */

const WORK_DIR = join(process.cwd(), "src/content/work");

function load(locale: Locale): CaseStudy[] {
  const dir = join(WORK_DIR, locale);
  if (!existsSync(dir)) return [];

  return readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((file) => {
      const source = readFileSync(join(dir, file), "utf8");
      const { data, body } = parseFrontmatter(source, `${locale}/${file}`);
      return toCaseStudy(file, data, body);
    });
}

/**
 * Largest first, then alphabetically by the English title, so the order is
 * stable across machines (readdir order is not guaranteed) and identical in
 * every locale — sorting each locale by its own titles would reshuffle the
 * grid whenever a translation starts with a different letter.
 */
function order(studies: CaseStudy[]): CaseStudy[] {
  return [...studies].sort(
    (a, b) =>
      WEIGHTS.indexOf(a.weight) - WEIGHTS.indexOf(b.weight) ||
      a.title.localeCompare(b.title),
  );
}

/** Read once at module scope; the files cannot change between requests. */
const slugOrder = order(load(DEFAULT_LOCALE)).map((study) => study.slug);

const byLocale = Object.fromEntries(
  LOCALES.map((locale) => [
    locale,
    load(locale).sort(
      (a, b) => slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug),
    ),
  ]),
) as Record<Locale, CaseStudy[]>;

export function getCaseStudies(locale: Locale): CaseStudy[] {
  return byLocale[locale];
}

export function getCaseStudy(
  locale: Locale,
  slug: string,
): CaseStudy | undefined {
  return byLocale[locale].find((study) => study.slug === slug);
}
