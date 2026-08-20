import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth-guard";
import { signOut } from "@/lib/auth";
import { showLetters } from "@/lib/flags";

/**
 * Admin chrome, and the gate.
 *
 * `requireAdmin()` runs before anything renders, so an unauthenticated visitor
 * is redirected rather than shown a shell that later fills with a permission
 * error. Nested admin pages call the guard again — this layout is convenience,
 * not the security boundary. See lib/auth-guard.ts.
 */
export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  // Not published yet — 404 rather than redirect, so production reveals nothing
  // about an admin area existing at all.
  if (!showLetters()) notFound();

  const user = await requireAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/admin"
            className="font-display text-sm font-semibold tracking-tight text-foreground"
          >
            Admin
          </Link>

          {/* Cover letters are the only thing the database holds that anyone
              edits. Case studies are MDX files and the experience page is structured
              data in lib/content/ — both are edited in the repo, not here. */}
          <nav className="flex items-center gap-5 text-label uppercase tracking-label text-muted-foreground">
            <Link className="hover:text-foreground" href="/admin/letters">
              Cover letters
            </Link>
          </nav>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="text-label uppercase tracking-label text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign out {user.name ? `(${user.name})` : ""}
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </div>
  );
}
