import { DEFAULT_LOCALE, LOCALES, localizePath, type Locale } from "./config";

/**
 * Canonical and hreflang links for one page.
 *
 * Every page states its own canonical URL — the bare path for English, the
 * prefixed one otherwise — so the internal `/en/...` path that the rewrite
 * produces is never what a search engine indexes. `languages` lists every
 * enabled locale's version, plus `x-default` pointing at English.
 */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localizePath(locale, path),
    languages: {
      ...Object.fromEntries(
        LOCALES.map((code) => [code, localizePath(code, path)]),
      ),
      "x-default": localizePath(DEFAULT_LOCALE, path),
    },
  };
}
