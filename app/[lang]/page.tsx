import type { Metadata } from "next";

import { isLocale } from "@/lib/i18n/config";
import { alternates } from "@/lib/i18n/metadata";

import { Bento } from "./_components/bento";

/**
 * Every page states its own canonical and hreflang links rather than
 * inheriting them from the layout, where they would quietly claim every page
 * without its own was the homepage.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  return isLocale(lang) ? { alternates: alternates(lang, "/") } : {};
}

/**
 * The index.
 *
 * The bento index everywhere — the coming-soon page was retired when the site
 * was published on 2026-08-12. `_components/coming-soon.tsx` is kept as the
 * fallback if the site ever needs to go quiet again, and because the landing
 * page is what shipped first.
 */
export default async function IndexPage() {
  return <Bento />;
}
