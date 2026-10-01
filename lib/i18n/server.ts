import { lang } from "next/root-params";
import { notFound } from "next/navigation";

import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { messages, type Messages } from "./messages";

/**
 * The current locale, read from the `[lang]` root segment.
 *
 * Any Server Component under `app/[lang]` can call this without the locale
 * being passed down to it — which is what lets a diagram rendered from inside
 * an MDX file know which language to draw its labels in.
 *
 * An unknown segment is a 404 rather than a fallback: `/fr/work/login` is not a
 * page on this site, and quietly serving English there would be a second URL
 * for the same content.
 *
 * Outside `app/[lang]` there is no segment at all — the English-only letters
 * system renders case study MDX, diagrams included — so an absent value is
 * English rather than an error.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (value === undefined) return DEFAULT_LOCALE;
  if (!isLocale(value)) notFound();
  return value;
}

/** Every UI string for the current locale. */
export async function getMessages(): Promise<Messages> {
  return messages[await getLocale()];
}
