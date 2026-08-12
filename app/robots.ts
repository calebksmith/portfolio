import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

/**
 * Crawl the portfolio, never the private halves.
 *
 * `/letter/` carries per-recipient cover letters reachable by capability URL;
 * `/admin` and `/api` have no business in an index. Those routes also set
 * `robots: noindex` in their own metadata — this is the belt to that's braces,
 * since a disallow here stops a crawler before it ever fetches the page and
 * sees the meta tag.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/letter/", "/admin", "/sign-in", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
