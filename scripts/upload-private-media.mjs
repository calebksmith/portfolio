/**
 * Upload the gated screenshots to the private Blob store.
 *
 *   npm run media:upload
 *
 * Every webp under private/media/ goes up at the same path:
 * private/media/challenges/choose-team.webp becomes challenges/choose-team.webp,
 * which is what <GatedFigure src> names. Re-running replaces what's there.
 * Reads BLOB_READ_WRITE_TOKEN from .env.local.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, sep } from "node:path";

import { put } from "@vercel/blob";

import { GATED_PATH } from "../lib/access.ts";

const ROOT = join(process.cwd(), "private/media");
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error(
    "BLOB_READ_WRITE_TOKEN isn't set. Copy it from the Blob store's page in Vercel into .env.local.",
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
    token,
    contentType: "image/webp",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log(`uploaded ${pathname}`);
}
