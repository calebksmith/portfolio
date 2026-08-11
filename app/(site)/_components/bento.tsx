import Link from "next/link";

import { Badge, ThemeSwitcher, cn } from "@/components/cksui";
import { caseStudies } from "@/lib/content/work";
import { site } from "@/lib/site";

/**
 * The bento index.
 *
 * Cards are deliberately not uniform — span follows the weight in each case
 * study's frontmatter, so the grid encodes what matters most rather than
 * decorating a list. Adding a case study is adding an MDX file; nothing here
 * changes.
 *
 * Two cards are live rather than descriptive: the theme controls, and the
 * playlist embed.
 */

/** Column spans at the lg breakpoint, out of 6. */
const SPAN: Record<string, string> = {
  large: "lg:col-span-3",
  medium: "lg:col-span-2",
  small: "lg:col-span-2",
};

function Tile({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { className?: string }) {
  return (
    <div
      data-slot="bento-tile"
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-5 text-card-foreground sm:col-span-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * A tile whose whole area is clickable.
 *
 * The link wraps the heading rather than the card, with a stretched
 * pseudo-element covering the tile. That keeps one link per card in the
 * accessibility tree with the heading as its name — rather than a div with a
 * click handler, or a link whose accessible name is the entire card's text.
 */
function LinkTile({
  href,
  eyebrow,
  title,
  children,
  className,
  external = false,
}: {
  href: string;
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const LinkComponent = external ? "a" : Link;

  return (
    <Tile
      className={cn(
        "group relative transition-colors hover:border-input focus-within:border-input",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}

      <h2 className="font-display text-lg font-semibold tracking-[-0.01em] text-balance">
        <LinkComponent
          href={href}
          {...(external
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
          className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none group-focus-within:underline group-hover:underline underline-offset-4 decoration-primary"
        >
          {title}
        </LinkComponent>
      </h2>

      {children}
    </Tile>
  );
}

export function Bento() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
      <h1 className="sr-only">
        {site.name} — {site.role}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {/* About / résumé — the largest card, first. */}
        <LinkTile
          href="/resume"
          eyebrow={site.role}
          title={site.name}
          className="lg:col-span-4"
        >
          <p className="max-w-[52ch] text-pretty text-muted-foreground">
            {site.lede}
          </p>
          <p className="mt-auto pt-2 text-xs text-muted-foreground">
            Résumé and full background →
          </p>
        </LinkTile>

        {/* Theme controls — live, not descriptive. */}
        <Tile className="lg:col-span-2">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Theme
          </p>
          <ThemeSwitcher />
          <p className="mt-auto pt-2 text-xs text-muted-foreground">
            <Link
              href="/themes"
              className="underline decoration-input underline-offset-4 hover:decoration-primary"
            >
              Measured contrast for every pair →
            </Link>
          </p>
        </Tile>

        {caseStudies.map((study) => (
          <LinkTile
            key={study.slug}
            href={`/work/${study.slug}`}
            eyebrow={`${study.role} · ${study.year}`}
            title={study.title}
            className={SPAN[study.weight]}
          >
            <p className="text-pretty text-muted-foreground">{study.summary}</p>
            {study.platforms.length > 0 ? (
              <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {study.platforms.map((platform) => (
                  <li key={platform}>
                    <Badge>{platform}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
          </LinkTile>
        ))}

        {/* Playlist — live if the widget embeds cross-origin, link if not. */}
        {site.playlistUrl ? (
          <LinkTile
            href={site.playlistUrl}
            external
            eyebrow="Vimocity"
            title="A playlist I built"
            className="lg:col-span-2"
          >
            <p className="text-pretty text-muted-foreground">
              Custom content collections, shareable across an organization and
              embeddable in company intranets.
            </p>
          </LinkTile>
        ) : null}

        <LinkTile
          href="/colophon"
          eyebrow="Colophon"
          title="How this site is built"
          className="lg:col-span-2"
        >
          <p className="text-pretty text-muted-foreground">
            The stack, the alternatives that lost, and what each choice cost.
          </p>
        </LinkTile>

        <LinkTile
          href={site.links[1].href}
          external
          eyebrow="Storybook"
          title="VimUI, live"
          className="lg:col-span-2"
        >
          <p className="text-pretty text-muted-foreground">
            The public component library — 51 components across four platforms.
          </p>
        </LinkTile>
      </div>
    </main>
  );
}
