/**
 * Upload the gated screenshots to the private Blob store.
 *
 *   npm run media:upload
 *
 * Every webp under private/media/ goes up at the same path:
 * private/media/challenges/choose-team.webp becomes challenges/choose-team.webp,
 * which is what <GatedFigure src> names. Re-running replaces what's there.
 *
 * Credentials come from .env.local or .env.vercel: a BLOB_READ_WRITE_TOKEN
 * from the store's page, or the BLOB_STORE_ID and VERCEL_OIDC_TOKEN that
 * `npx vercel env pull .env.vercel` writes. The library finds whichever is
 * there.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, sep } from "node:path";

import { put } from "@vercel/blob";

import { GATED_PATH } from "../lib/access.ts";

const ROOT = join(process.cwd(), "private/media");
const oidc = process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID;
if (!process.env.BLOB_READ_WRITE_TOKEN && !oidc) {
  console.error(
    "No Blob credentials. Run `npx vercel env pull .env.vercel`, or put the store's BLOB_READ_WRITE_TOKEN in .env.local.",
  );
  process.exit(1);
}

const files = (await readdir(ROOT, { recursive: true }))
  .map((file) => file.split(sep).join("/"))
  .filter((file) => file.endsWith(".webp"));

for (const pathname of files) {
  if (!GATED_PATH.test(pathname)) {
    console.warn(`skipped ${pathname} — expected <case-study>/<name>.webp`);
    continue;
  }
  await put(pathname, await readFile(join(ROOT, pathname)), {
    access: "private",
    contentType: "image/webp",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log(`uploaded ${pathname}`);
}
