/**
 * Locales, and how a locale maps onto a URL.
 *
 * Client-safe on purpose: the header needs these to build the language toggle,
 * and nothing here touches the filesystem or the request.
 *
 * English is served at the bare paths it has always had — `/work/login`, not
 * `/en/work/login` — so no link already in the wild breaks. A rewrite in
 * next.config.ts maps those onto the `[lang]` segment internally. Spanish lives
 * under its own prefix, `/es`. See docs/decisions/0006-localization.md.
 */

/**
 * Enabled locales. Spanish is planned and the structure is ready for it, but
 * it stays off until the content it would translate has settled — adding it is
 * `"es"` here, `lib/i18n/messages/es.ts`, and `src/content/<kind>/es/`.
 */
export const LOCALES = ["en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Each language named in itself. A toggle that offers "Spanish" to someone who
 * reads only Spanish has asked them to already understand English.
 */
export const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  es: "Español",
};

/**
 * A site path, as it should appear in a link for this locale.
 *
 * Takes a locale-free path (`/work/login`, `/`, `/style-guide#contrast`) and
 * adds the prefix when one is needed. External URLs and in-page anchors pass
 * through untouched, so callers do not have to check first.
 */
export function localizePath(locale: Locale, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (locale === DEFAULT_LOCALE) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Splits a pathname into its locale and the path underneath it.
 *
 * Accepts `/en/...` as well as bare paths, because the internal (rewritten)
 * path and the address-bar path can both reach client code depending on how
 * the page was entered.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const [, first, ...rest] = pathname.split("/");
  if (first && isLocale(first)) {
    return { locale: first, path: `/${rest.join("/")}` };
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}
