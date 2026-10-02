import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Locale } from "@/lib/i18n/config";

/**
 * Long-form page bodies, one MDX file per page per locale, in
 * `src/content/pages/<locale>/<page>.mdx`.
 *
 * The same split as case studies: interface copy is dictionary entries in
 * `lib/i18n/messages/`; writing that runs to paragraphs is a document, and a
 * translator should get it as one.
 */
export function getPageSource(locale: Locale, page: "colophon"): string {
  return readFileSync(
    join(process.cwd(), "src/content/pages", locale, `${page}.mdx`),
    "utf8",
  );
}
