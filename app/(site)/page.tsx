import { showFullSite } from "@/lib/flags";

import { Bento } from "./_components/bento";
import { ComingSoon } from "./_components/coming-soon";

/**
 * The index.
 *
 * Production still serves the coming-soon page; preview and development serve
 * the bento index. One route, because the URL is the same either way — the
 * question is only what is published. See lib/flags.ts.
 */
export default async function IndexPage() {
  return showFullSite() ? <Bento /> : <ComingSoon />;
}
