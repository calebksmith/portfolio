import type { MetadataRoute } from "next";

import { caseStudies } from "@/lib/content/work";
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
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/resume", priority: 0.9 },
    { path: "/style-guide", priority: 0.6 },
    { path: "/colophon", priority: 0.6 },
  ];

  return [
    ...pages.map((page) => ({
      url: `${site.url}${page.path}`,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...caseStudies.map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
