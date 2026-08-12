import { MDXRemote } from "next-mdx-remote/rsc";

/**
 * Renders MDX that came out of the database.
 *
 * Cover letters are stored as MDX source and
 * compiled here, in a Server Component, so no MDX runtime ships to the browser.
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
    <p className="mt-4 max-w-[62ch] text-pretty text-muted-foreground" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted-foreground" {...props} />
  ),
  a: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a
      className="text-primary underline underline-offset-4 hover:opacity-80"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-6 border-l-2 border-primary pl-4 text-muted-foreground italic"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded-sm bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mt-6 overflow-x-auto rounded-md border border-border bg-card p-4 text-xs"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="mt-10 border-border" {...props} />
  ),
};

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
