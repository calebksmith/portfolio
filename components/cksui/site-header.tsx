"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "./lib/cn";
import { ThemeSwitcher } from "./theme-switcher";

/**
 * The site header: a path on the left, instruments on the right.
 *
 * The two zones are deliberately different kinds of control and get different
 * visual grammar, so the bar reads as two things rather than a row of buttons:
 *
 *   path         wayfinding — where am I, how do I get back. Plain text links,
 *                in the site's spec-row idiom (mono, uppercase, tracked).
 *   instruments  things that change how the page renders or behaves.
 *                Bordered controls, visually separate.
 *
 * The WORK crumb is a menu rather than a link. That is not decoration: there is
 * no /work index route, and a menu there gives lateral movement between case
 * studies without going home first — which is the real need a command palette
 * would have served, minus the discoverability problem of a keyboard shortcut
 * nobody knows to press.
 *
 * Menus use the native Popover API, same as the appearance panel: Escape,
 * click-outside, and top-layer stacking come from the platform.
 */

export type WorkItem = { slug: string; title: string };

/** Labels for top-level segments. Anything absent falls back to the segment. */
const SEGMENT_LABELS: Record<string, string> = {
  work: "Work",
  themes: "Themes",
  colophon: "Colophon",
  resume: "Résumé",
  "sign-in": "Sign in",
};

type Crumb =
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; label: string }
  | { kind: "current"; label: string };

function buildCrumbs(pathname: string, work: WorkItem[]): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  // No trail on the index: you are already home, and the page states the name
  // at full size directly below. A crumb there is redundancy, not orientation.
  if (segments.length === 0) return [];

  const crumbs: Crumb[] = [
    { kind: "link", label: "Caleb Smith", href: "/" },
  ];

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;

    // /work has no index route, so the crumb opens the case study menu instead
    // of linking somewhere that would 404.
    if (segment === "work" && !isLast) {
      crumbs.push({ kind: "menu", label: "Work" });
      return;
    }

    // Case study titles are written as "Subject, elaboration" — the leading
    // clause is the crumb, so the path stays a path instead of a sentence. The
    // Work menu still lists titles in full.
    const title = work.find((item) => item.slug === segment)?.title;
    const label =
      SEGMENT_LABELS[segment] ??
      title?.split(",")[0] ??
      segment.replace(/-/g, " ");

    crumbs.push(
      isLast
        ? { kind: "current", label }
        : {
            kind: "link",
            label,
            href: `/${segments.slice(0, index + 1).join("/")}`,
          },
    );
  });

  return crumbs;
}

const CRUMB =
  "inline-flex min-h-tap items-center text-xs uppercase tracking-[0.14em] whitespace-nowrap";

export function SiteHeader({ work }: { work: WorkItem[] }) {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname ?? "/", work);

  return (
    <header
      data-slot="site-header"
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 sm:px-10">
        {/* Path — wayfinding. Plain text; scrolls rather than wrapping.
            On the index there is no trail, so a spacer holds the instruments
            to the right instead. */}
        {crumbs.length === 0 ? <div className="flex-1" /> : null}

        <nav
          aria-label="Breadcrumb"
          className={cn("min-w-0 flex-1 overflow-x-auto", crumbs.length === 0 && "hidden")}
        >
          <ol className="flex items-center gap-2">
            {crumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-muted-foreground">
                    /
                  </span>
                ) : null}

                {crumb.kind === "link" ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      CRUMB,
                      "text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : crumb.kind === "menu" ? (
                  <WorkMenu work={work} />
                ) : (
                  <span className={cn(CRUMB, "text-foreground")} aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Instruments — bordered controls, visually distinct from the path.
            The inspector overlay toggle joins this cluster at build step 9. */}
        <div className="flex shrink-0 items-center gap-2">
          <AppearanceMenu />
        </div>
      </div>
    </header>
  );
}

function WorkMenu({ work }: { work: WorkItem[] }) {
  return (
    <>
      <button
        type="button"
        popoverTarget="ck-work-menu"
        data-slot="work-menu-trigger"
        className={cn(
          CRUMB,
          "gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        )}
      >
        Work
        <Chevron />
      </button>

      <div
        id="ck-work-menu"
        popover="auto"
        data-slot="work-menu-panel"
        aria-label="Case studies"
        className="w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-input bg-card p-2 text-card-foreground shadow-lg"
      >
        <ul>
          {work.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/work/${item.slug}`}
                className="flex min-h-tap items-center rounded-md px-3 text-sm text-pretty hover:bg-muted hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function AppearanceMenu() {
  return (
    <>
      <button
        type="button"
        popoverTarget="ck-settings"
        data-slot="settings-trigger"
        className="inline-flex min-h-tap items-center justify-center gap-2 rounded-md border border-input bg-background px-2.5 text-foreground transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-3"
      >
        <SlidersIcon />
        <span className="sr-only text-xs uppercase tracking-[0.14em] sm:not-sr-only">
          Appearance
        </span>
      </button>

      <div
        id="ck-settings"
        popover="auto"
        data-slot="settings-panel"
        aria-label="Appearance settings"
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-input bg-card p-5 text-card-foreground shadow-lg"
      >
        <h2 className="mb-4 font-display text-sm font-semibold tracking-[-0.01em]">
          Appearance
        </h2>

        <ThemeSwitcher />

        <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          <Link
            href="/themes"
            className="underline decoration-input underline-offset-4 hover:text-foreground hover:decoration-primary"
          >
            Measured contrast for every pair →
          </Link>
        </p>
      </div>
    </>
  );
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M2 4.5h5M11 4.5h3M2 11.5h3M9 11.5h5" />
      <circle cx="9" cy="4.5" r="1.75" />
      <circle cx="7" cy="11.5" r="1.75" />
    </svg>
  );
}
