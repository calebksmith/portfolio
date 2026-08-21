"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { INSPECT_ATTRIBUTE } from "@/lib/theme";

import { ControlBar, ControlButton, ControlToggle } from "./control-bar";
import { Monogram } from "./monogram";
import { cn } from "./lib/cn";
import { useHtmlAttribute } from "./lib/use-html-attribute";
import { usePopoverOpen } from "./lib/use-popover-open";
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
  "style-guide": "Style guide",
  colophon: "Colophon",
  experience: "Experience",
  "sign-in": "Sign in",
};

type Crumb =
  | { kind: "mark"; label: string; href: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "menu"; label: string }
  | { kind: "current"; label: string };

function buildCrumbs(pathname: string, work: WorkItem[]): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);

  // The index gets a monogram rather than a trail. There is nowhere to go back
  // to, and the page states the name at full size directly below — but the
  // corner was empty, and an empty corner opposite a cluster of instruments
  // reads as a bar that failed to load rather than as restraint.
  if (segments.length === 0) {
    return [{ kind: "mark", label: "CS", href: "/" }];
  }

  // The mark stands in for the name on inner pages too — one root for the trail,
  // the same object in every header, and it buys back the horizontal space that
  // "CALEB SMITH" was taking from the path on a phone.
  const crumbs: Crumb[] = [{ kind: "mark", label: "CS", href: "/" }];

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
  "inline-flex min-h-tap items-center text-label uppercase tracking-label whitespace-nowrap";

export function SiteHeader({ work }: { work: WorkItem[] }) {
  const pathname = usePathname();
  const crumbs = buildCrumbs(pathname ?? "/", work);

  // Which case study is open, if any — so the Work menu can mark it.
  const currentSlug = pathname?.match(/^\/work\/([^/]+)/)?.[1] ?? null;

  return (
    <header
      data-slot="site-header"
      className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm"
    >
      {/* Height is pinned to --ck-header-height so anything docking beneath the
          header stays flush with it. The row is tap-sized either way; making it
          explicit is what lets other components read the value. */}
      <div className="flex h-tap w-full items-center gap-4 px-6 sm:px-10">
        {/* Path — wayfinding. Plain text; scrolls rather than wrapping. */}
        <nav aria-label="Breadcrumb" className="min-w-0 flex-1 overflow-x-auto">
          <ol className="flex items-center gap-2">
            {crumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-muted-foreground">
                    /
                  </span>
                ) : null}

                {crumb.kind === "mark" ? (
                  <Link
                    href={crumb.href}
                    aria-label="Caleb Smith — home"
                    aria-current={pathname === "/" ? "page" : undefined}
                    className="inline-flex min-h-tap items-center rounded-sm transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <Monogram />
                  </Link>
                ) : crumb.kind === "link" ? (
                  <Link
                    href={crumb.href}
                    className={cn(
                      CRUMB,
                      "text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
                    )}
                  >
                    {crumb.label}
                  </Link>
                ) : crumb.kind === "menu" ? (
                  <WorkMenu work={work} currentSlug={currentSlug} />
                ) : (
                  <span className={cn(CRUMB, "text-foreground")} aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Instruments — one bounded control surface, visually distinct from
            the path.

            Inspect sits last, hard against the right edge, because that is
            where its panel docks. The toggle ends up directly above the thing
            it opens, and the pair reads as one object rather than as a button
            that happens to have a side effect somewhere else on the page. */}
        <ControlBar className="shrink-0">
          <AppearanceMenu />
          <InspectToggle />
        </ControlBar>
      </div>
    </header>
  );
}

function WorkMenu({
  work,
  currentSlug,
}: {
  work: WorkItem[];
  currentSlug: string | null;
}) {
  const open = usePopoverOpen("ck-work-menu");

  return (
    <>
      <button
        type="button"
        popoverTarget="ck-work-menu"
        data-slot="work-menu-trigger"
        data-state={open ? "open" : "closed"}
        // Open state on the trigger, not only on the chevron. A rotating arrow
        // is a detail you notice after you already know what happened; the
        // crumb going solid is what tells you which control the panel came from.
        className={cn(
          CRUMB,
          "gap-1 rounded-sm px-1.5 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          open
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        Work
        <Chevron open={open} />
      </button>

      <div
        id="ck-work-menu"
        popover="auto"
        data-slot="work-menu-panel"
        aria-label="Case studies"
        className="w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-input bg-card p-2 text-card-foreground shadow-lg"
      >
        {/* An arrow on every row, not only the hovered one. Five wrapped titles
            with nothing between them read as a paragraph; a repeated glyph at a
            fixed right edge is what makes them a list of destinations. It is
            aria-hidden — the link already announces itself as a link.

            The page you are on takes the same "current" treatment the rest of
            the site uses, and loses its arrow: an arrow means "go here", and
            you are already here. It keeps a dot in the arrow's place so the
            right edge stays a column rather than developing a gap. */}
        <ul>
          {work.map((item) => {
            const current = item.slug === currentSlug;

            return (
              <li key={item.slug}>
                <Link
                  href={`/work/${item.slug}`}
                  aria-current={current ? "page" : undefined}
                  className={cn(
                    "group flex min-h-tap items-center justify-between gap-3 rounded-md px-3 text-sm text-pretty transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    current
                      ? "bg-muted font-medium text-foreground"
                      : "hover:bg-muted hover:text-muted-foreground",
                  )}
                >
                  {item.title}
                  {current ? <CurrentDot /> : <ArrowRight />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

/**
 * Turns the inspector on and off.
 *
 * The mode lives on <html> rather than in React state, same as theme — the
 * overlay is a sibling, not a child, and the attribute is what both read.
 */
function InspectToggle() {
  const active = useHtmlAttribute<"on" | "off">(INSPECT_ATTRIBUTE, "off") === "on";

  return (
    <ControlToggle
      icon={<CrosshairIcon />}
      label="Inspect"
      pressed={active}
      onClick={() => {
        const root = document.documentElement;
        if (active) root.removeAttribute(INSPECT_ATTRIBUTE);
        else root.setAttribute(INSPECT_ATTRIBUTE, "on");
      }}
    />
  );
}

function AppearanceMenu() {
  const open = usePopoverOpen("ck-settings");

  return (
    <>
      <ControlButton
        popoverTarget="ck-settings"
        icon={<SlidersIcon />}
        label="Appearance"
        active={open}
      />

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

        {/* Names where it goes. The old text — "Measured contrast for every
            pair" — was a claim about the site, and a claim is not a
            destination: nothing in it said a page was on the other side. */}
        <p className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          <Link
            href="/style-guide#contrast"
            className="underline decoration-input underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary"
          >
            Style guide: tokens, type, and contrast →
          </Link>
        </p>
      </div>
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className={cn("size-3 transition-transform", open && "rotate-180")}
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

/**
 * Sits where the arrow would be on the page you are already on. Decorative —
 * `aria-current="page"` is what actually announces it.
 */
function CurrentDot() {
  return (
    <span
      aria-hidden="true"
      className="size-1.5 shrink-0 rounded-full bg-primary"
    />
  );
}

/** Marks each menu row as a destination. Decorative — the link says the rest. */
function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function CrosshairIcon() {
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
      <circle cx="8" cy="8" r="4.25" />
      <path d="M8 .75v2.5M8 12.75v2.5M.75 8h2.5M12.75 8h2.5" />
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
