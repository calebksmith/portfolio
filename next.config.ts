import type { NextConfig } from "next";

import { DEFAULT_LOCALE, LOCALES } from "./lib/i18n/config";

/**
 * Paths the default-locale rewrite must leave alone: other locales' prefixes
 * (and the default's own, so `/en/...` still resolves), the English-only
 * letters system, the API, and Next's internals. Static files and metadata
 * routes with an extension never reach an `afterFiles` rewrite.
 */
const UNLOCALIZED = [...LOCALES, "admin", "letter", "api", "_next"];
const unlocalized = UNLOCALIZED.map((segment) => `${segment}(?:/|$)`).join("|");

const nextConfig: NextConfig = {
  /**
   * English at the bare paths it has always had.
   *
   * Every public route lives under `app/[lang]`, so `/work/login` is served by
   * `/en/work/login`. A rewrite rather than a redirect: the address bar keeps
   * the URL people already have, and no link already in the wild breaks.
   * `afterFiles`, so it runs after static routes (`/admin`) and files are
   * matched but before dynamic routes would take `/work` as a locale.
   *
   * Config rather than a `proxy.ts`: this is a fixed mapping known at build
   * time, and needs no code running on each request. See ADR 0006.
   */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: `/${DEFAULT_LOCALE}` },
        {
          source: `/:path((?!${unlocalized}).+)`,
          destination: `/${DEFAULT_LOCALE}/:path`,
        },
      ],
      fallback: [],
    };
  },

  async redirects() {
    return [
      {
        // /themes was folded into the style guide, which documents the same
        // tokens plus type and components. Permanent, so anything that linked
        // to the old URL follows once and updates.
        source: "/themes",
        destination: "/style-guide",
        permanent: true,
      },
      {
        // The page is called Experience now. The URL was in the wild — it is on
        // the deployed site and may be in someone's tab — so it redirects
        // rather than 404ing.
        source: "/resume",
        destination: "/experience",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
