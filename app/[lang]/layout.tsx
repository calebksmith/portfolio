import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Inspector,
  SiteFooter,
  SiteHeader,
  SkipLink,
} from "@/components/cksui";
import { Document } from "@/components/document";
import { getCaseStudies } from "@/lib/content/work";
import { LOCALES, isLocale } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";
import { site } from "@/lib/site";

import { SmoothAnchors } from "./_components/smooth-anchors";

/** The footer's two links: contact, and the public source. Tap-sized. */
const FOOTER_LINK =
  "inline-flex min-h-tap items-center rounded-sm underline decoration-input underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Every enabled locale is prerendered; anything else is not a page. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

/**
 * Title and description are assembled from the locale's dictionary. The
 * description borrows the Focus row so search results carry a little more than
 * the single line the page itself shows.
 */
export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = messages[lang].site;

  const title = `${site.name} — ${t.role}`;
  const description = `${t.lede} ${t.spec[0].value}.`;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s — ${site.name}` },
    description,
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: site.url,
      locale: lang,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/**
 * Root layout for the public site, and its chrome.
 *
 * It sits under `[lang]` so `<html lang>` is right for every page — a
 * container-level `lang` would leave the document claiming English while it
 * reads in Spanish, which fails WCAG 3.1.1. The letters system has its own
 * root layout in `app/(letters)`.
 *
 * Case study titles are read here, on the server, and handed to the header as
 * plain data. The header is a client component (it needs the current pathname),
 * and the content layer touches the filesystem — so the boundary sits here.
 */
export default async function SiteLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = messages[lang];

  const work = getCaseStudies(lang).map(({ slug, name, descriptor }) => ({
    slug,
    name,
    descriptor,
  }));

  return (
    <Document lang={lang}>
      {/* A row at every size: the inspector is a sibling column, so opening it
          narrows the site rather than covering it, and everything — including
          the header and its own toggle — stays reachable. */}
      <div className="flex min-h-full flex-1 flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          {/* First in the tab order, before the header it exists to skip. */}
          <SmoothAnchors />
          <SkipLink>{t.chrome.skipLink}</SkipLink>
          <SiteHeader
            locale={lang}
            work={work}
            labels={t.header}
            themeLabels={t.themeSwitcher}
          />
          {children}
          {/* No year: a notice needs a holder, not a date, and a date is a
              thing to remember to change. */}
          <SiteFooter>
            © {site.name} · {t.chrome.footer} ·{" "}
            <a href={site.links.linkedin} className={FOOTER_LINK}>
              {t.chrome.contact}
            </a>{" "}
            ·{" "}
            <a href={site.links.source} className={FOOTER_LINK}>
              {t.chrome.source}
            </a>
          </SiteFooter>
        </div>

        <Inspector labels={t.inspector} />
      </div>
    </Document>
  );
}
