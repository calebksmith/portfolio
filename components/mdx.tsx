import { MDXRemote } from "next-mdx-remote/rsc";

/**
 * Renders MDX that came out of the database.
 *
 * Case study bodies and tailored CV summaries are stored as MDX source and
 * compiled here, in a Server Component, so no MDX runtime ships to the browser.
 *
 * The component map is the guardrail: prose written in the admin panel cannot
 * introduce colors, spacing, or type of its own, because every element it can
 * produce is mapped to a token-styled component below. Content decides
 * structure; this file decides appearance.
 */
const components = {
  h2: (props: React.ComponentProps<"h2">) => (
    <h2
      className="mt-12 font-display text-2xl font-semibold tracking-tight text-ink"
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3
      className="mt-8 font-display text-lg font-semibold tracking-tight text-ink"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mt-4 max-w-[62ch] text-pretty text-ink-muted" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-muted" {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <a
      className="text-accent underline underline-offset-4 hover:text-accent-hover"
      {...props}
    />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-6 border-l-2 border-accent pl-4 text-ink-muted italic"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded-sm bg-paper-sunken px-1.5 py-0.5 text-[0.9em] text-ink"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mt-6 overflow-x-auto rounded-md border border-rule bg-paper-raised p-4 text-xs"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="mt-10 border-rule" {...props} />
  ),
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
