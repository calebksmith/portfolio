import type { Metadata } from "next";

import { Document } from "@/components/document";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: { index: false, follow: false },
};

/**
 * Root layout for the private half: the admin area and shared cover letters.
 *
 * English only, and deliberately outside `[lang]`. A letter is written for one
 * reader in one language, and the admin has one user.
 */
export default function LettersLayout({ children }: LayoutProps<"/admin">) {
  return <Document lang="en">{children}</Document>;
}
