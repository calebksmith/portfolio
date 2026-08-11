import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";

import { ThemeScript } from "@/components/theme-script";
import { site } from "@/lib/site";

import "./globals.css";

/**
 * Archivo is the display face — headings and the name only.
 * It is a variable font, so no `weight` is needed.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

/**
 * IBM Plex Mono carries everything else: body copy, labels, tables, UI.
 * Not a variable font, so the weights in use must be declared explicitly.
 */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Title and description are assembled once here from lib/site.ts. The
 * description borrows the Focus row so search results carry a little more than
 * the single line the page itself shows.
 */
const pageTitle = `${site.name} — ${site.role}`;
const pageDescription = `${site.lede} ${site.spec[0].value}.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pageTitle,
    template: `%s — ${site.name}`,
  },
  description: pageDescription,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: pageTitle,
    description: pageDescription,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

/**
 * The root layout owns <html> and <body> and nothing else. Route groups
 * ((site), (admin)) supply their own chrome in nested layouts, so that the
 * admin area can look nothing like the public site without duplicating the
 * document shell.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* First child of <body> so it executes before any content paints. */}
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
