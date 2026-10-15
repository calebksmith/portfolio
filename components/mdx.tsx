import { MDXRemote } from "next-mdx-remote/rsc";
import {
  Children,
  isValidElement,
  type ComponentProps,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn, Eyebrow, Figure, Stat, StatGroup, Tabs } from "@/components/cksui";
import { GatedFigure } from "@/components/gated-figure";
import { ScreenFigureClient } from "@/components/screen-figure";
import { ChallengeRun } from "@/components/diagrams/challenge-run";
import { DeviceHandoff } from "@/components/diagrams/device-handoff";
import { Enforcement } from "@/components/diagrams/enforcement";
import { LoginEverywhere } from "@/components/diagrams/login-everywhere";
import { PageByPage } from "@/components/diagrams/page-by-page";
import { SystemReach } from "@/components/tables/system-reach";
import { TeamScoring } from "@/components/diagrams/team-scoring";
import { WorkdaySchedule } from "@/components/diagrams/workday-schedule";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/server";

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

type SegmentProps = { value: string; label: string; children: ReactNode };

/**
 * One view inside `<Segments>`. It carries a label and its content; Segments
 * reads both and draws the control, so this never renders on its own.
 */
function Segment({ children }: SegmentProps) {
  return <>{children}</>;
}

/**
 * A segmented control written in MDX: one subject, one view per kind of it.
 *
 *   <Segments title="Challenge types">
 *     <Segment value="leaderboard" label="Leaderboard"> markdown </Segment>
 *     <Segment value="target" label="Target"> markdown </Segment>
 *   </Segments>
 *
 * Each Segment is ordinary markdown, so the copy stays in the case study.
 * cksUI's Tabs owns the behavior: the keyboard, the roles, and the no-script
 * fallback that shows every view stacked. Held to the prose measure, so the
 * control sits over the column it switches rather than at the page's edge.
 */
function Segments({ title, children }: { title: string; children: ReactNode }) {
  const items = Children.toArray(children)
    .filter(
      (child): child is ReactElement<SegmentProps> =>
        isValidElement(child) && child.type === Segment,
    )
    .map(({ props }) => ({
      value: props.value,
      label: props.label,
      content: props.children,
    }));

  // One view isn't a choice. Fewer than two means the MDX lost a <Segment> —
  // swallowed into a neighbour or never opened — and the page would quietly
  // drop a view instead of failing the build.
  if (items.length < 2) {
    throw new Error(
      `<Segments title="${title}"> needs at least two <Segment>s; found ${items.length}.`,
    );
  }

  return (
    <Tabs
      label={title}
      items={items}
      className="mt-10 max-w-measure-wide"
      header={
        <Eyebrow asChild>
          <h3>{title}</h3>
        </Eyebrow>
      }
    />
  );
}

/**
 * A case study's outcome tiles, across the content width: the grid fits as
 * many as there are and wraps only when the screen runs out. The spacing and
 * width are set here rather than in the library component, which leaves
 * layout to its caller.
 */
function Stats({
  width = "breakout",
  children,
}: {
  width?: "inline" | "breakout";
  children: ReactNode;
}) {
  return (
    <StatGroup
      className={cn(
        "mt-6",
        width === "breakout" ? "max-w-none" : "max-w-measure-wide",
      )}
    >
      {children}
    </StatGroup>
  );
}

/**
 * A public screenshot in the product's light and dark modes, with a switch.
 * The switch's words come from the dictionary, so the MDX names only the
 * images.
 */
async function ScreenFigure(
  props: Omit<ComponentProps<typeof ScreenFigureClient>, "labels">,
) {
  const labels = (await getMessages()).screenModes;
  return <ScreenFigureClient {...props} labels={labels} />;
}

/**
 * Figures in a case study span the content width by default, so a screenshot
 * gets the room its detail needs while the prose beside it holds to the
 * measure. A diagram still hugs its own width inside the frame.
 */
function CaseFigure(props: ComponentProps<typeof Figure>) {
  return <Figure width="breakout" {...props} />;
}

function CaseGatedFigure(props: ComponentProps<typeof GatedFigure>) {
  return <GatedFigure frame="breakout" {...props} />;
}

/**
 * Components a case study may use directly. Diagrams are named here rather than
 * imported per file because MDX has no imports — the map is the whole surface.
 */
const available = {
  ...components,
  Figure: CaseFigure,
  GatedFigure: CaseGatedFigure,
  ScreenFigure,
  Segments,
  Segment,
  Stats,
  Stat,
  ChallengeRun,
  DeviceHandoff,
  Enforcement,
  LoginEverywhere,
  PageByPage,
  SystemReach,
  TeamScoring,
  WorkdaySchedule,
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
