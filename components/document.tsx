import { Archivo, IBM_Plex_Mono } from "next/font/google";

import { ThemeScript } from "@/components/theme-script";

import "@/app/globals.css";

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
 * The document shell: <html>, <body>, fonts, and the theme script.
 *
 * There are two root layouts — the localized public site under `app/[lang]`,
 * and the English-only letters system under `app/(letters)` — because the
 * public site's root sits below a dynamic segment so `<html lang>` can be set
 * per locale. Both render through this, so the shell exists once.
 */
export function Document({
  lang,
  children,
}: {
  lang: string;
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      className={`${archivo.variable} ${plexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* First child of <body> so it executes before any content paints. */}
        <ThemeScript />

        {/*
          Entrances are driven by JavaScript — an IntersectionObserver, and the
          hero's own finish. With no JavaScript neither ever fires, and every
          element waiting on one would stay hidden permanently. This is the
          escape hatch: no animation, but nothing missing either. An entrance
          animation must never be the reason content cannot be read.
        */}
        <noscript>
          <style>
            {
              "[data-reveal]{opacity:1!important;visibility:visible!important;transform:none!important}"
            }
          </style>
        </noscript>

        {children}
      </body>
    </html>
  );
}
