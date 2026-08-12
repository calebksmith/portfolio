import { Bento } from "./_components/bento";

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
