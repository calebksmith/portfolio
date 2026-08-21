import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/cksui";
import { signIn } from "@/lib/auth";
import { showLetters } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

/**
 * Sign-in.
 *
 * There is exactly one button, because there is exactly one way in. The form
 * posts to a Server Action rather than calling `signIn` from a click handler,
 * which means it works before hydration and without JavaScript at all — the
 * redirect to GitHub is a plain HTTP response.
 */
export default async function SignInPage() {
  // No published admin yet, so no published door to it. See lib/flags.ts.
  if (!showLetters()) notFound();

  return (
    <main id="main" tabIndex={-1} className="flex flex-1 items-center px-6 py-20">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="mt-3 text-muted-foreground">
          This area is restricted to the site owner.
        </p>

        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <Button type="submit" className="w-full">
            Continue with GitHub
          </Button>
        </form>
      </div>
    </main>
  );
}
