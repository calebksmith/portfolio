/**
 * Manage the personal access links to the gated screenshots.
 *
 *   npm run access:link -- "Jane Doe, Acme" [days]   a new link (30 days default)
 *   npm run access:list                               everyone with a link
 *   npm run access:revoke -- <id>                     cut one link off
 *
 * Links are signed with ACCESS_SECRET from .env.local, which must match the
 * value in Vercel. Who has a link is recorded in private/access-links.json:
 * gitignored, on this machine only. The server keeps no list — a link carries
 * its own expiry, and the only thing the server is told is ACCESS_REVOKED.
 * The links themselves aren't stored; send a new one rather than resending.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import { mintToken, verifyToken } from "../lib/access.ts";
import { site } from "../lib/site.ts";

const REGISTRY = join(process.cwd(), "private/access-links.json");
// Override to mint links for a local or preview server.
const BASE = process.env.ACCESS_LINK_BASE ?? site.url;

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function load() {
  try {
    return JSON.parse(await readFile(REGISTRY, "utf8"));
  } catch {
    return [];
  }
}

async function save(links) {
  await mkdir(dirname(REGISTRY), { recursive: true });
  await writeFile(REGISTRY, `${JSON.stringify(links, null, 2)}\n`);
}

const day = (iso) => iso.slice(0, 10);

function status(link, now = new Date().toISOString()) {
  if (link.revoked) return "revoked";
  return link.expires <= now ? "expired" : "active";
}

const [command, ...args] = process.argv.slice(2);

if (command === "link") {
  const secret =
    process.env.ACCESS_SECRET ??
    fail(
      "ACCESS_SECRET isn't set. Add it to .env.local — the same value as in Vercel.",
    );
  const [to, daysArg = "30"] = args;
  if (!to) fail('Who is it for?  npm run access:link -- "Jane Doe, Acme" 30');
  const days = Number(daysArg);
  if (!(days > 0)) fail("Days must be a positive number.");

  const token = mintToken(secret, to, days);
  const { id, exp } = verifyToken(token, secret);
  const link = {
    id,
    to,
    created: new Date().toISOString(),
    expires: new Date(exp * 1000).toISOString(),
    revoked: false,
  };
  await save([...(await load()), link]);

  console.log(`\n  ${BASE}/access/${token}\n`);
  console.log(`  For ${to} · id ${id} · works until ${day(link.expires)}\n`);
} else if (command === "list") {
  const links = await load();
  if (links.length === 0) {
    console.log("No access links yet.");
  } else {
    for (const link of links) {
      console.log(
        `${status(link).padEnd(8)} ${link.id}  until ${day(link.expires)}  ${link.to}`,
      );
    }
  }
} else if (command === "revoke") {
  const [id] = args;
  const links = await load();
  const link = links.find((entry) => entry.id === id);
  if (!link) fail(`No link with id ${id}. See npm run access:list.`);
  link.revoked = true;
  await save(links);

  // Only links that would otherwise still work need listing; an expired one
  // is already dead, so the variable stays short.
  const revoked = links
    .filter((entry) => status(entry) === "revoked")
    .filter((entry) => entry.expires > new Date().toISOString())
    .map((entry) => entry.id);
  console.log(`\nRevoked ${link.id} (${link.to}). In Vercel, set:\n`);
  console.log(`  ACCESS_REVOKED=${revoked.join(",")}\n`);
  console.log(
    "then redeploy. To cut off every link at once, rotate ACCESS_SECRET.\n",
  );
} else {
  fail(
    "Usage:\n" +
      '  npm run access:link -- "Jane Doe, Acme" [days]\n' +
      "  npm run access:list\n" +
      "  npm run access:revoke -- <id>",
  );
}
