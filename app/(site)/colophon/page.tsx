import type { Metadata } from "next";

import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How this site is built",
  description:
    "The architecture behind this site — the alternatives that lost, and what each choice cost.",
};

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
  return <p className="mb-3.5 max-w-[62ch] text-pretty text-muted-foreground">{children}</p>;
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-4 border-l-2 border-primary pl-3.5 text-pretty text-foreground">
      {children}
    </blockquote>
  );
}

/** The Chosen/Rejected pairing — most of these decisions had a real loser. */
function Verdict({
  chosen,
  rejected,
}: {
  chosen: { what: string; why: string };
  rejected: { what: string; why: string };
}) {
  return (
    <div className="my-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      <div className="bg-card p-3.5">
        <span className="mb-1.5 block text-[0.625rem] uppercase tracking-[0.16em] text-foreground">
          Chosen
        </span>
        <span className="mb-0.5 block font-medium text-foreground">{chosen.what}</span>
        <p className="text-xs text-muted-foreground">{chosen.why}</p>
      </div>
      <div className="bg-card p-3.5">
        <span className="mb-1.5 block text-[0.625rem] uppercase tracking-[0.16em] text-foreground">
          Rejected
        </span>
        <span className="mb-0.5 block font-medium text-foreground">{rejected.what}</span>
        <p className="text-xs text-muted-foreground">{rejected.why}</p>
      </div>
    </div>
  );
}

function Node({
  label,
  sub,
  keystone = false,
  wide = false,
}: {
  label: React.ReactNode;
  sub?: string;
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
      {label}
      {sub ? (
        <span className="mt-0.5 block text-[0.6875rem] text-muted-foreground">{sub}</span>
      ) : null}
    </div>
  );
}

function Arrow() {
  return <div className="py-1 text-center text-sm text-muted-foreground">↓</div>;
}

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
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

const surfaces = [
  {
    who: "Anyone",
    name: "Public portfolio",
    need: "Fast, static, indexable",
  },
  { who: "Me", name: "Admin", need: "Authenticated, write-heavy" },
  {
    who: "One hiring manager, by link",
    name: "Cover letters",
    need: "Private, unguessable, one per opening",
  },
];

const pending = [
  {
    thing: "Admin editing screens",
    why: "Schema, repositories, and the gate exist. Each screen is a form wired to a server action.",
  },
  {
    thing: "Public case study routes",
    why: "Read layer exists. The site is still a landing page on purpose.",
  },
  {
    thing: "Cache Components",
    why: "Off until DB-backed routes exist and can be verified against it. The code is already written in the shape it wants.",
  },
];

/* -------------------------------------------------------------------------- */

export default async function ColophonPage() {
  return (
    <main className="mx-auto w-full max-w-[66ch] px-6 pb-24">
      <header className="border-b border-border pt-18 pb-8">
        <p className="mb-5 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
          Colophon · {site.name}
        </p>
        <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-foreground">
          How this site is built, and why
        </h1>
        <p className="mt-5 max-w-[52ch] text-pretty text-muted-foreground">
          A stack list says what I installed. This says what the alternatives
          were, and what each choice cost.
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

      <Section title="Three surfaces">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {surfaces.map((surface) => (
            <div
              key={surface.name}
              className="flex flex-col gap-1 bg-card p-4"
            >
              <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
                {surface.who}
              </span>
              <span className="font-display text-sm font-semibold text-foreground">
                {surface.name}
              </span>
              <span className="text-xs text-muted-foreground">{surface.need}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-muted-foreground">
          The third one shaped most of what follows.
        </p>
      </Section>

      <Section title="Shape">
        <div className="overflow-x-auto rounded-md border border-border bg-card p-4">
          <div className="grid grid-cols-3 gap-1.5">
            <Node label="Visitor" />
            <Node label="Hiring manager" sub="holds a link" />
            <Node label="Me" sub="admin" />
          </div>
          <Arrow />
          <div className="grid grid-cols-3 gap-1.5">
            <Node label={<code>(site)</code>} sub="static" />
            <Node label={<code>/letter/[token]</code>} sub="per request, noindex" />
            <Node label={<code>(admin)</code>} sub="gated per route" />
          </div>
          <Arrow />
          <div className="grid grid-cols-3 gap-1.5">
            <Node
              wide
              keystone
              label={<code>lib/repositories/</code>}
              sub="every query lives here — nothing above writes SQL, nothing below knows what a route is"
            />
          </div>
          <Arrow />
          <div className="grid grid-cols-3 gap-1.5">
            <Node label="Neon Postgres" sub="over HTTP" />
            <Node label="GitHub OAuth" sub="identity only" />
            <Node label="Vercel" sub="hosting" />
          </div>
        </div>
      </Section>

      <Section title="Decisions">
        <Decision title="Server Components by default">
          <P>
            Nearly every page is a read of content the visitor didn&rsquo;t
            personalise. The landing and sign-in pages ship zero application
            JavaScript. Client components go at the leaf, when an interaction
            needs one.
          </P>
        </Decision>

        <Decision title="Tailwind v4, configured in CSS">
          <P>
            Tokens and the utility namespace sit in one file, twelve lines
            apart, so they can&rsquo;t drift. Dark mode is defined per token, not
            retrofitted. Focus rings always visible; animations no-op under
            reduced motion. This page uses the same tokens.
          </P>
          <Pull>
            Every color, radius, and duration resolves to a token. A hex value in
            a component is a reviewable error.
          </Pull>
        </Decision>

        <Decision title="A component library I own, not one I installed">
          <Verdict
            chosen={{
              what: "cksUI, in this repo",
              why: "Built on shadcn's patterns — Radix for behavior, source copied in — with every value rewritten onto these tokens.",
            }}
            rejected={{
              what: "An installed UI library",
              why: "It would ship someone else's UI and run a second design system alongside this one.",
            }}
          />
          <P>
            shadcn/ui isn&rsquo;t a library you install; it&rsquo;s source you
            copy in and own. That&rsquo;s what makes it compatible with the
            constraint that I build the UI here. Radix stays a dependency, and a
            justified one — it handles focus management, keyboard interaction,
            and ARIA, where a subtle mistake is invisible until it reaches
            someone using a screen reader.
          </P>
          <P>
            cksUI stands in the same relation to this site that VimUI does to the
            product I work on, which makes the portfolio an example of the thing
            it claims rather than a description of it.
          </P>
        </Decision>

        <Decision title="Neon over Supabase">
          <Verdict
            chosen={{
              what: "Neon + Drizzle",
              why: "Scales to zero, resumes instantly. Speaks Postgres over HTTP, so there's no connection pool to exhaust.",
            }}
            rejected={{
              what: "Supabase",
              why: "Its edge is Auth + row-level security — unused here, since auth is Auth.js. Complexity stays, payoff doesn't.",
            }}
          />
          <P>
            The decider was practical: free-tier Supabase pauses after about a
            week idle, and the worst possible moment for that is a hiring manager
            opening a letter three days after I sent it. Gave up a table-editing
            UI and file storage.
          </P>
          <P>
            <strong className="font-semibold text-foreground">
              Drizzle over Prisma
            </strong>{" "}
            — lighter runtime, no codegen in the deploy path, migrations as plain
            SQL you can review in a PR. Postgres doesn&rsquo;t index foreign keys
            automatically, so the first migration adds them explicitly. One file
            knows the database is Neon; switching is that file plus a driver
            swap.
          </P>
        </Decision>

        <Decision title="OAuth, where a password would have done">
          <P>
            For one user, a hashed password in an env var would be adequate
            security in eighty lines. I chose OAuth because OIDC is how modern
            auth actually works and every enterprise SSO product is the same flow
            with a different issuer — I wanted to build it, not read about it.
          </P>
          <Verdict
            chosen={{
              what: "Auth.js + database sessions",
              why: "Every leg of the code exchange leaves an inspectable row. Deleting a session row ends it immediately.",
            }}
            rejected={{
              what: "Clerk, and JWT sessions",
              why: "Clerk's value proposition is hiding the mechanics. A signed JWT stays valid until it expires.",
            }}
          />
          <Pull>
            Authentication is not authorization. GitHub will prove the identity
            of any of its users; it has no opinion on who may edit my portfolio.
          </Pull>
          <P>
            So a sign-in callback checks the login against an allowlist. No
            proxy-level guard: Next&rsquo;s docs say that layer suits optimistic
            checks and real authorization belongs next to the data, so every
            admin route calls the guard itself.
          </P>
        </Decision>

        <Decision title="Deleting six tables when the requirement changed">
          <P>
            The database was built for &ldquo;tailored CVs&rdquo; — a CV
            assembled per opening from reusable parts. That was a misreading of
            the requirement, and it survived long enough to become a schema:
            positions, achievement bullets, skills, tags, and case studies, all
            joined per opening with overrides.
          </P>
          <P>
            The actual need was cover letters. A CV is a document assembled from
            parts; a letter is prose addressed to one reader. There is nothing to
            select and reorder.
          </P>
          <Verdict
            chosen={{
              what: "Delete the six tables",
              why: "Case studies are files and the résumé is structured data, so none of them had a reader left.",
            }}
            rejected={{
              what: "Keep them for later",
              why: "Unused schema is a claim about the future that has to be maintained and explained.",
            }}
          />
          <Pull>
            The most useful thing I did to this database was take most of it out.
          </Pull>
          <P>
            What remains is auth and cover letters. That is a much better match
            for the actual problem than what it replaced — and the migration had
            never been applied anywhere, so it was regenerated rather than
            migrated.
          </P>
        </Decision>

        <Decision title="The URL is the credential">
          <P>
            No login, because asking a hiring manager to register to read a cover
            letter is a good way to not have it read. The boundary is token
            entropy: 32 bytes from a CSPRNG, generated in the repository layer,
            never accepted as an argument.
          </P>
          <P>
            Accepted honestly: anyone with the link can read and forward it.
            It&rsquo;s a letter written to be handed to someone I have never met,
            so exposure is bounded by what it already is. It is also HTML only —
            a downloadable copy would be a second artifact of the same content,
            stale the moment a sentence changes. Mitigations: revoke, rotate,
            expire,{" "}
            <code className="rounded-sm bg-muted px-1.5 py-0.5 text-[0.9em] text-foreground">
              noindex
            </code>
            , and an{" "}
            <strong className="font-semibold text-foreground">identical 404</strong> for
            revoked, expired, draft, and nonexistent alike, so a recipient
            can&rsquo;t learn a link was turned off — or that a company was ever
            sent one.
          </P>
        </Decision>

        <Decision title="View logging, minimal on purpose">
          <P>
            &ldquo;Did they open it&rdquo; is useful, but the visitor is a
            counterparty in a hiring process who consented to nothing. No
            cookies, no fingerprinting, no third-party analytics. IP stored only
            as a salted hash; rotating the salt severs the link to everything
            logged — which is why the salt is secret, since hashing an IP
            isn&rsquo;t strong anonymisation. The write happens after the
            response is sent and swallows its errors.
          </P>
        </Decision>
      </Section>

      <Section title="Deliberately not built">
        <P>
          Stated explicitly, because unfinished and overlooked look identical
          from outside.
        </P>
        <ul>
          {pending.map((item) => (
            <li
              key={item.thing}
              className="grid gap-0.5 border-t border-border py-3"
            >
              <span className="font-medium text-foreground">{item.thing}</span>
              <span className="text-xs text-muted-foreground">{item.why}</span>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="mt-16 border-t border-border pt-5 text-xs text-muted-foreground">
        Per-decision records live in{" "}
        <code>docs/decisions/</code>. The rules the codebase is held to live in{" "}
        <code>CLAUDE.md</code> — which exists so the standard is applied by
        default rather than corrected after the fact.
      </footer>
    </main>
  );
}
