import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Eyebrow } from "@/components/cksui";
import { Mdx } from "@/components/mdx";
import { getPageSource } from "@/lib/content/pages";
import { isLocale } from "@/lib/i18n/config";
import { alternates } from "@/lib/i18n/metadata";
import { messages } from "@/lib/i18n/messages";
import { getMessages } from "@/lib/i18n/server";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/colophon">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = messages[lang].colophon;

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: alternates(lang, "/colophon"),
  };
}

/**
 * The colophon. The header is dictionary copy; the body — every decision and
 * its reasoning — is `src/content/pages/<locale>/colophon.mdx`, written with
 * the primitives below.
 */

/* -------------------------------------------------------------------------- */
/* Local primitives                                                            */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pt-13">
      <h2 className="mb-5 font-display text-xl font-semibold tracking-[-0.02em] text-balance text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Decision({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mt-7 border-t border-border pt-6 first:mt-0">
      <h3 className="mb-2.5 font-display text-base font-semibold tracking-[-0.01em] text-balance text-foreground">
        {title}
      </h3>
      {children}
    </article>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3.5 max-w-measure-wide text-pretty text-muted-foreground">
      {children}
    </p>
  );
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-4 border-l-2 border-primary pl-3.5 text-pretty text-foreground">
      {children}
    </blockquote>
  );
}

/**
 * The Chosen/Rejected pairing — most of these decisions had a real loser.
 *
 * The two sides now take the positive and destructive surfaces, so the verdict
 * is legible before the words are. The labels stay: colour is never the only
 * signal, and about one man in twelve would otherwise be reading two identical
 * grey boxes.
 */
async function Verdict({
  chosen,
  rejected,
}: {
  chosen: { what: string; why: string };
  rejected: { what: string; why: string };
}) {
  const t = (await getMessages()).colophon;

  return (
    <div className="my-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      <div className="bg-positive p-3.5 text-positive-foreground">
        <Eyebrow asChild size="sm" tone="inherit" className="mb-1.5 block">
          <span>{t.chosen}</span>
        </Eyebrow>
        <span className="mb-0.5 block font-medium">{chosen.what}</span>
        <p className="text-xs opacity-90">{chosen.why}</p>
      </div>
      <div className="bg-destructive p-3.5 text-destructive-foreground">
        <Eyebrow asChild size="sm" tone="inherit" className="mb-1.5 block">
          <span>{t.rejected}</span>
        </Eyebrow>
        <span className="mb-0.5 block font-medium">{rejected.what}</span>
        <p className="text-xs opacity-90">{rejected.why}</p>
      </div>
    </div>
  );
}

function Node({
  label,
  sub,
  code = false,
  keystone = false,
  wide = false,
}: {
  label: string;
  sub?: string;
  /**
   * The label is a path or route group. Rendered here rather than written as
   * `<code>` in the MDX, where the shared map would give it the inline-code
   * chip — inside a diagram node it should read as plain monospace.
   */
  code?: boolean;
  keystone?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-sm border p-2.5 text-xs leading-snug",
        wide ? "col-span-full" : "",
        // Pairs travel together: an accent surface takes accent-foreground.
        keystone
          ? "border-primary bg-accent text-accent-foreground"
          : "border-input bg-background text-foreground",
      ].join(" ")}
    >
      {code ? <code>{label}</code> : label}
      {sub ? (
        <span className="mt-0.5 block text-label-sm text-muted-foreground">
          {sub}
        </span>
      ) : null}
    </div>
  );
}

function Arrow() {
  return (
    <div className="py-1 text-center text-sm text-muted-foreground">↓</div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-measure-wide text-pretty text-muted-foreground">
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

function Surfaces({
  items,
}: {
  items: {
    who: string;
    name: string;
    need: string;
    status: string;
    live: boolean;
  }[];
}) {
  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
      {items.map((surface) => (
        <div key={surface.name} className="flex flex-col gap-1 bg-card p-4">
          <Eyebrow asChild size="sm">
            <span>{surface.who}</span>
          </Eyebrow>
          <span className="font-display text-sm font-semibold text-foreground">
            {surface.name}
          </span>
          <span className="text-xs text-muted-foreground">{surface.need}</span>
          <Eyebrow
            size="sm"
            tone={surface.live ? "primary" : "muted"}
            className="mt-1"
          >
            {surface.status}
          </Eyebrow>
        </div>
      ))}
    </div>
  );
}

function Shape({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border bg-card p-4">
      {children}
    </div>
  );
}

function NodeRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-1.5">{children}</div>;
}

function Pending({ items }: { items: { thing: string; why: string }[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.thing}
          className="grid gap-0.5 border-t border-border py-3"
        >
          <span className="font-medium text-foreground">{item.thing}</span>
          <span className="text-xs text-muted-foreground">{item.why}</span>
        </li>
      ))}
    </ul>
  );
}

function Footer({ children }: { children: React.ReactNode }) {
  return (
    <footer className="mt-16 border-t border-border pt-5 text-xs text-muted-foreground">
      {children}
    </footer>
  );
}

/**
 * What the colophon's MDX can use. Markdown paragraphs take the colophon's
 * own paragraph style rather than the case study one, and bold text is
 * foreground, as it was when this page was JSX.
 */
const colophonComponents = {
  p: P,
  strong: Strong,
  Section,
  Decision,
  Pull,
  Verdict,
  Node,
  NodeRow,
  Arrow,
  Shape,
  Surfaces,
  Pending,
  Note,
  Footer,
};

/* -------------------------------------------------------------------------- */

const stack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind v4",
  "Drizzle",
  "Neon Postgres",
  "Auth.js",
  "Vercel",
];

export default async function ColophonPage({
  params,
}: PageProps<"/[lang]/colophon">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = messages[lang].colophon;

  return (
    <main
      id="main"
      tabIndex={-1}
      className="mx-auto w-full max-w-page px-6 py-14 sm:px-10"
    >
      <header className="border-b border-border pb-8">
        <Eyebrow className="mb-5">
          {t.eyebrow} · {site.name}
        </Eyebrow>
        <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
          {t.title}
        </h1>
        <p className="mt-5 max-w-measure-wide text-pretty text-muted-foreground">
          {t.intro}
        </p>
        <ul className="mt-7 flex flex-wrap gap-1.5">
          {stack.map((item) => (
            <li
              key={item}
              className="rounded-sm border border-border px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </header>

      <Mdx
        source={getPageSource(lang, "colophon")}
        locale={lang}
        extra={colophonComponents}
        trusted
      />
    </main>
  );
}
