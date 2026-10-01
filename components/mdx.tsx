import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentType } from "react";

import { Figure } from "@/components/cksui";
import { DeviceHandoff } from "@/components/diagrams/device-handoff";
import { SystemReach } from "@/components/diagrams/system-reach";
import { TeamScoring } from "@/components/diagrams/team-scoring";
import { localizePath, type Locale } from "@/lib/i18n/config";

/**
 * Renders MDX: case studies and the colophon from `src/content/`, and cover
 * letters from the database. All of it is compiled here, in a Server Component, so no MDX runtime ships to the browser.
 *
 * The component map is the guardrail: prose written in the admin panel cannot
 * introduce colors, spacing, or type of its own, because every element it can
 * produce is mapped to a token-styled component below. Content decides
 * structure; this file decides appearance.
 */
const components = {
  // Headings and links destructure `children` rather than spreading it, so the
  // content is statically visible to jsx-a11y as well as to a reader.
  h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
    <h2
      className="mt-12 font-display text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentProps<"h3">) => (
    <h3
      className="mt-8 font-display text-lg font-semibold tracking-tight text-foreground"
      {...props}
    >
      {children}
    </h3>
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p
      className="mt-4 max-w-measure-wide text-pretty text-muted-foreground"
      {...props}
    />
  ),
  // The measure lives here rather than on a container around the article: there
  // is no content container on this site, so anything made of sentences carries
  // its own line length. 62ch is --ck-measure.
  ul: (props: React.ComponentProps<"ul">) => (
    <ul
      className="mt-4 max-w-measure-wide list-disc space-y-2 pl-5 text-muted-foreground"
      {...props}
    />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol
      className="mt-4 max-w-measure-wide list-decimal space-y-2 pl-5 text-muted-foreground"
      {...props}
    />
  ),
  // Raster images, for the few things a diagram cannot show — a Storybook grid,
  // a real terminal run. Width and height are required by the same rule the
  // Figure component enforces: an image with no dimensions is a layout shift
  // waiting for a slow connection.
  img: (props: React.ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      loading="lazy"
      decoding="async"
      className="h-auto w-full rounded-lg border border-border"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-6 max-w-measure-wide border-l-2 border-primary pl-4 text-muted-foreground italic"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded-sm bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground"
      {...props}
    />
  ),
  // A code block reuses the inline `code` element, so its chip is cleared here
  // rather than drawing a box inside the box.
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mt-6 overflow-x-auto rounded-md border border-border bg-card p-4 text-xs [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="mt-10 border-border" {...props} />
  ),
};

/**
 * Components a case study may use directly. Diagrams are named here rather than
 * imported per file because MDX has no imports — the map is the whole surface.
 */
const available = {
  ...components,
  Figure,
  DeviceHandoff,
  SystemReach,
  TeamScoring,
};

/**
 * Internal links are written locale-free in the MDX — `/work/login` — and
 * prefixed here for the language being read, so a translated case study does
 * not have to remember which language it is in to link correctly.
 */
function linkFor(locale: Locale) {
  return function MdxLink({
    children,
    href = "",
    ...props
  }: React.ComponentProps<"a">) {
    return (
      <a
        className="text-primary underline underline-offset-4 hover:opacity-80"
        href={localizePath(locale, href)}
        {...props}
      >
        {children}
      </a>
    );
  };
}

export function Mdx({
  source,
  locale,
  extra,
  trusted = false,
}: {
  source: string;
  locale: Locale;
  /** Page-specific components on top of the shared map, e.g. the colophon's. */
  extra?: Record<string, ComponentType<never>>;
  /**
   * Content committed to this repository — case studies, the colophon — may
   * pass objects and arrays as props (`items={[…]}`). Content from the
   * database may not: JavaScript expressions stay blocked by default, so a
   * stored cover letter cannot execute anything. Dangerous globals stay
   * blocked either way.
   */
  trusted?: boolean;
}) {
  return (
    <MDXRemote
      source={source}
      components={{ ...available, a: linkFor(locale), ...extra }}
      options={trusted ? { blockJS: false } : undefined}
    />
  );
}
