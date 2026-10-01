import { ViewTransition } from "react";

import { Skeleton } from "@/components/cksui";
import { getMessages } from "@/lib/i18n/server";

/**
 * What a case study looks like before it arrives.
 *
 * These pages are prerendered, so on a fast connection this is never seen. On a
 * slow one it is the whole experience for a second or two, which is exactly the
 * case that usually goes untested — and the reason this exists is that a page
 * which is instant for me is not instant for someone on a train.
 *
 * The shape matches the real header block: eyebrow, two lines of title, two of
 * summary, a row of badges, then body. Matching the shape is what stops the
 * layout jumping when the content lands, and is the difference between a
 * skeleton and a spinner wearing a costume.
 *
 * `exit="reveal-out"` pairs with the page's `enter="reveal-in"`, so the
 * placeholder hands off downward rather than blinking out. `default="none"`
 * keeps it out of unrelated transitions.
 */
export default async function Loading() {
  const t = await getMessages();

  return (
    <ViewTransition exit="reveal-out" default="none">
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-page px-6 py-14 sm:px-10"
      >
        {/* Announced once, rather than each block claiming to be busy. */}
        <p role="status" className="sr-only">
          {t.caseStudy.loading}
        </p>

        <div className="border-b border-border pb-8">
          <Skeleton className="h-3 w-48" />
          <Skeleton className="mt-5 h-10 w-full max-w-[38rem]" />
          <Skeleton className="mt-2 h-10 w-full max-w-[26rem]" />
          <Skeleton className="mt-6 h-5 w-full max-w-measure-wide" />
          <Skeleton className="mt-2 h-5 w-full max-w-[34rem]" />

          <div className="mt-6 flex flex-wrap gap-1.5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-full max-w-measure-wide" />
          <Skeleton className="h-4 w-full max-w-measure-wide" />
          <Skeleton className="h-4 w-full max-w-[32rem]" />
        </div>
      </main>
    </ViewTransition>
  );
}
