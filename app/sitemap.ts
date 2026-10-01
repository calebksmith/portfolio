import type { MetadataRoute } from "next";

import { getCaseStudies } from "@/lib/content/work";
import { DEFAULT_LOCALE, LOCALES, localizePath } from "@/lib/i18n/config";
import { site } from "@/lib/site";

/**
 * Every public page, generated from the same content the site renders.
 *
 * Case studies come from the MDX directory rather than a hand-kept list, so
 * adding a file adds a sitemap entry. A hand-kept list is a second source of
 * truth that goes stale silently, which is the failure mode sitemaps are
 * notorious for.
 *
 * Private routes are absent by construction: they are not in this list and are
 * disallowed in robots.ts.
 *
 * One entry per page per locale, each listing every language version of
 * itself, so search engines pair translations rather than treating them as
 * duplicates.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: "/experience", priority: 0.9 },
    { path: "/style-guide", priority: 0.6 },
    { path: "/colophon", priority: 0.6 },
    ...getCaseStudies(DEFAULT_LOCALE).map((study) => ({
      path: `/work/${study.slug}`,
      priority: 0.8,
    })),
  ];

  const url = (path: string) =>
    path === "/" ? site.url : `${site.url}${path}`;

  return LOCALES.flatMap((locale) =>
    pages.map((page) => ({
      url: url(localizePath(locale, page.path)),
      changeFrequency: "monthly" as const,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((code) => [code, url(localizePath(code, page.path))]),
        ),
      },
    })),
  );
}
