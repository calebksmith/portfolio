import "server-only";

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

import {
  AREAS,
  parseFrontmatter,
  toCaseStudy,
  type CaseStudy,
} from "./frontmatter";

export type { CaseStudy };

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
 * Ecosystem order: by area (the people each study serves, then the layers they
 * all share), then each study's `order` within its area, then the English title
 * as a tiebreak. Computed once from the default locale and applied to every locale,
 * so a translation can never reshuffle the homepage, the Work menu, or the
 * "more of my work" row.
 */
function order(studies: CaseStudy[]): CaseStudy[] {
  return [...studies].sort(
    (a, b) =>
      AREAS.indexOf(a.area) - AREAS.indexOf(b.area) ||
      a.order - b.order ||
      a.title.localeCompare(b.title),
  );
}

function index(): Record<Locale, CaseStudy[]> {
  const slugOrder = order(load(DEFAULT_LOCALE)).map((study) => study.slug);

  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      load(locale).sort(
        (a, b) => slugOrder.indexOf(a.slug) - slugOrder.indexOf(b.slug),
      ),
    ]),
  ) as Record<Locale, CaseStudy[]>;
}

/** Read once at module scope; in a build, the files cannot change. */
const byLocale = index();

/**
 * In development the files do change — they are being edited — and the
 * module-scope read would keep serving the old copy until a restart. So
 * development reads them per call. A build still reads once.
 */
function studies(locale: Locale): CaseStudy[] {
  return (process.env.NODE_ENV === "development" ? index() : byLocale)[locale];
}

export function getCaseStudies(locale: Locale): CaseStudy[] {
  return studies(locale);
}

export function getCaseStudy(
  locale: Locale,
  slug: string,
): CaseStudy | undefined {
  return studies(locale).find((study) => study.slug === slug);
}
