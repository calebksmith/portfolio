import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { get } from "@vercel/blob";
import type { NextRequest } from "next/server";

import { GATED_PATH, verifyToken } from "@/lib/access";
import { ACCESS_COOKIE } from "@/lib/access-cookies";
import { env } from "@/lib/env";

/**
 * A gated screenshot, for someone holding a valid access token.
 *
 * Production reads the private Blob store. Development reads the same paths
 * from the gitignored `private/media/`, so the gate can be exercised without
 * the store. Either way the token is checked before anything is read, and a
 * refusal looks exactly like a missing file: nothing here confirms what
 * exists.
 */
export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/media/[...path]">,
) {
  const pathname = (await ctx.params).path.join("/");
  if (!GATED_PATH.test(pathname) || !hasAccess(request)) return missing();

  const image = await read(pathname);
  if (!image) return missing();

  return new Response(image.body, {
    headers: {
      "Content-Type": image.contentType,
      // The viewer's browser may keep it for an hour. A shared cache — the
      // CDN included — may not keep it at all.
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex",
    },
  });
}

function hasAccess(request: NextRequest): boolean {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return false;
  try {
    return verifyToken(token, env.accessSecret, env.accessRevoked) !== null;
  } catch {
    return false;
  }
}

async function read(
  pathname: string,
): Promise<{ body: BodyInit; contentType: string } | null> {
  if (process.env.NODE_ENV === "development") {
    try {
      const file = await readFile(
        join(process.cwd(), "private/media", pathname),
      );
      return { body: new Uint8Array(file), contentType: "image/webp" };
    } catch {
      return null;
    }
  }

  try {
    const result = await get(pathname, {
      access: "private",
      token: env.blobToken,
    });
    if (result?.statusCode !== 200) return null;
    return { body: result.stream, contentType: result.blob.contentType };
  } catch {
    return null;
  }
}

function missing(): Response {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "private, no-store" },
  });
}
