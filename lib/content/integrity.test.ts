import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";

import { parseFrontmatter, toCaseStudy, type CaseStudy } from "./frontmatter";

/**
 * The content itself, checked.
 *
 * These are not unit tests — they read the real `src/content/work/<locale>/*.mdx`
 * and the real dictionaries. That is the point. The failure this catches is drift: a case
 * study gets renamed or its slug changes, and a link somewhere else keeps
 * pointing at the old one. Nothing else in the pipeline notices, because a
 * `<Link href>` to a dead route is valid TypeScript, passes lint, and builds.
 * It 404s for a reader.
 *
 * It has already been a live risk here: two case studies are named by title in
 * the homepage hero, and the résumé data references slugs by hand. With more
 * than one locale, each of those exists once per language.
 */

const WORK_DIR = join(process.cwd(), "src/content/work");

/** Every case study, per enabled locale, parsed exactly as the site parses it. */
const byLocale = Object.fromEntries(
  LOCALES.map((locale) => {
    const dir = join(WORK_DIR, locale);
    const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    return [
      locale,
      files.map((file) => {
        const { data, body } = parseFrontmatter(
          readFileSync(join(dir, file), "utf8"),
          `${locale}/${file}`,
        );
        return toCaseStudy(file, data, body);
      }),
    ];
  }),
) as Record<Locale, CaseStudy[]>;

const files = readdirSync(join(WORK_DIR, DEFAULT_LOCALE)).filter((f) =>
  f.endsWith(".mdx"),
);
const studies = byLocale[DEFAULT_LOCALE];
const slugs = new Set(studies.map((s) => s.slug));

/** Every `/work/<slug>` reference in a file, wherever it appears. */
function workLinks(source: string): string[] {
  return [...source.matchAll(/\/work\/([a-z0-9-]+)/g)].map((m) => m[1]);
}

/** Every file in a directory, recursively — dictionaries and résumé data. */
function sourcesIn(dir: string): string[] {
  return readdirSync(join(process.cwd(), dir), { recursive: true })
    .map(String)
    .filter((f) => /\.(ts|tsx)$/.test(f) && !f.endsWith(".test.ts"))
    .map((f) => join(dir, f));
}

describe("case study files", () => {
  it("finds some", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s parses and validates", (file) => {
    const { data, body } = parseFrontmatter(
      readFileSync(join(WORK_DIR, DEFAULT_LOCALE, file), "utf8"),
      file,
    );
    expect(() => toCaseStudy(file, data, body)).not.toThrow();
  });

  it("has a unique slug per study", () => {
    expect(slugs.size).toBe(studies.length);
  });

  it.each(
    LOCALES.flatMap((l) => byLocale[l].map((s) => [l, s.slug, s] as const)),
  )(
    "%s/%s has a summary short enough to sit on a card",
    (_locale, _slug, study) => {
      expect(study.summary.length).toBeGreaterThan(20);
      // Long enough to say something, short enough not to overrun the tile.
      expect(study.summary.length).toBeLessThan(240);
    },
  );

  it.each(studies.map((s) => [s.slug, s] as const))(
    "%s has a body with a Problem section",
    (_slug, study) => {
      expect(study.body).toMatch(/^## Problem$/m);
    },
  );
});

describe("every locale has every case study", () => {
  // A translation is the same study in another language: same slug, same
  // badges, same place in the ecosystem. Titles and prose are the only things
  // allowed to differ, so a missing file or a drifted badge fails here rather
  // than as a 404 or a grid that reshuffles when you switch language.
  const others: Locale[] = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

  if (others.length === 0) {
    it("has only the default locale enabled, so there is nothing to compare", () => {
      expect(LOCALES).toEqual([DEFAULT_LOCALE]);
    });
    return;
  }

  it.each(others)("%s matches the default locale", (locale) => {
    const translated = byLocale[locale];
    expect(translated.map((s) => s.slug).sort()).toEqual([...slugs].sort());

    for (const study of studies) {
      const other = translated.find((s) => s.slug === study.slug)!;
      expect(other.area, `${locale}/${study.slug} area`).toBe(study.area);
      expect(other.order, `${locale}/${study.slug} order`).toBe(study.order);
      expect(other.stack, `${locale}/${study.slug} stack`).toEqual(study.stack);
      expect(other.year, `${locale}/${study.slug} year`).toBe(study.year);
    }
  });
});

describe("internal links resolve", () => {
  it.each(studies.map((s) => [s.slug, s] as const))(
    "%s links only to case studies that exist",
    (slug, study) => {
      for (const target of workLinks(study.body)) {
        expect(
          slugs.has(target),
          `${slug}.mdx links to /work/${target}, which does not exist`,
        ).toBe(true);
      }
    },
  );

  it.each(studies.map((s) => [s.slug, s] as const))(
    "%s connects only to case studies that exist",
    (slug, study) => {
      for (const target of study.connects) {
        expect(slugs.has(target), `${slug} connects to "${target}"`).toBe(true);
        expect(target, `${slug} connects to itself`).not.toBe(slug);
      }
    },
  );

  it.each(studies.map((s) => [s.slug, s] as const))(
    "%s does not link to itself",
    (slug, study) => {
      expect(workLinks(study.body)).not.toContain(slug);
    },
  );

  it("every /work/ link in the copy points at a real case study", () => {
    // The class of bug this exists for: the hero names case studies by title
    // and slug, the résumé links them by slug, and nothing else would notice
    // if one were renamed.
    const sources = [
      ...sourcesIn("lib/i18n/messages"),
      ...sourcesIn("lib/content/resume"),
    ];
    expect(sources.length).toBeGreaterThan(0);

    for (const path of sources) {
      const source = readFileSync(join(process.cwd(), path), "utf8");
      for (const target of workLinks(source)) {
        expect(
          slugs.has(target),
          `${path} links to /work/${target}, which does not exist`,
        ).toBe(true);
      }
    }
  });

  it.each(LOCALES)(
    "the %s hero's case study titles still match the case studies",
    (locale) => {
      // A slug can survive a retitle. This catches the other half — in each
      // language, against that language's own titles.
      // Only case study links carry a case study title; a link to another
      // page (the colophon) is checked by the /work/ link test above.
      const links = messages[locale].home.hero.prompts
        .map((prompt) => prompt.link)
        .filter(
          (link): link is NonNullable<typeof link> =>
            link !== null && link.href.startsWith("/work/"),
        );
      expect(links.length).toBeGreaterThan(0);

      for (const link of links) {
        const slug = link.href.replace("/work/", "");
        const study = byLocale[locale].find((s) => s.slug === slug);
        expect(study, `hero links to ${link.href}`).toBeDefined();
        expect(
          link.title,
          `hero calls ${link.href} "${link.title}" but it is titled "${study!.title}"`,
        ).toBe(study!.title);
      }
    },
  );
});
