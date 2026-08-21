import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { parseFrontmatter, toCaseStudy } from "./frontmatter";

/**
 * The content itself, checked.
 *
 * These are not unit tests — they read the real `src/content/work/*.mdx` and the
 * real components. That is the point. The failure this catches is drift: a case
 * study gets renamed or its slug changes, and a link somewhere else keeps
 * pointing at the old one. Nothing else in the pipeline notices, because a
 * `<Link href>` to a dead route is valid TypeScript, passes lint, and builds.
 * It 404s for a reader.
 *
 * It has already been a live risk here: two case studies are named by title in
 * the homepage hero, and the résumé data references slugs by hand.
 */

const WORK_DIR = join(process.cwd(), "src/content/work");

const files = readdirSync(WORK_DIR).filter((f) => f.endsWith(".mdx"));

const studies = files.map((file) => {
  const { data, body } = parseFrontmatter(
    readFileSync(join(WORK_DIR, file), "utf8"),
    file,
  );
  return toCaseStudy(file, data, body);
});

const slugs = new Set(studies.map((s) => s.slug));

/** Every `/work/<slug>` reference in a file, wherever it appears. */
function workLinks(source: string): string[] {
  return [...source.matchAll(/\/work\/([a-z0-9-]+)/g)].map((m) => m[1]);
}

describe("case study files", () => {
  it("finds some", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s parses and validates", (file) => {
    const { data, body } = parseFrontmatter(
      readFileSync(join(WORK_DIR, file), "utf8"),
      file,
    );
    expect(() => toCaseStudy(file, data, body)).not.toThrow();
  });

  it("has a unique slug per study", () => {
    expect(slugs.size).toBe(studies.length);
  });

  it.each(studies.map((s) => [s.slug, s] as const))(
    "%s has a summary short enough to sit on a card",
    (_slug, study) => {
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
    "%s does not link to itself",
    (slug, study) => {
      expect(workLinks(study.body)).not.toContain(slug);
    },
  );

  it("every /work/ link in the app points at a real case study", () => {
    // The class of bug this exists for: the hero names two case studies by
    // title and slug, and nothing else would notice if one were renamed.
    const sources = [
      "app/(site)/_components/hero-prompt.tsx",
      "lib/content/resume.ts",
    ];

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

  it("the hero's case study titles still match the case studies", () => {
    // A slug can survive a retitle. This catches the other half.
    const hero = readFileSync(
      join(process.cwd(), "app/(site)/_components/hero-prompt.tsx"),
      "utf8",
    );

    const pairs = [
      ...hero.matchAll(
        /href:\s*"\/work\/([a-z0-9-]+)"[\s\S]{0,120}?title:\s*"([^"]+)"/g,
      ),
    ];
    expect(pairs.length).toBeGreaterThan(0);

    for (const [, slug, title] of pairs) {
      const study = studies.find((s) => s.slug === slug);
      expect(study, `hero links to /work/${slug}`).toBeDefined();
      expect(
        title,
        `hero calls /work/${slug} "${title}" but it is titled "${study!.title}"`,
      ).toBe(study!.title);
    }
  });
});
