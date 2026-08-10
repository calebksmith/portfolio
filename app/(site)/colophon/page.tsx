import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { showFullSite } from "@/lib/flags";
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
      <h2 className="mb-5 font-display text-xl font-semibold tracking-[-0.02em] text-balance text-ink">
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
    <article className="mt-7 border-t border-rule pt-6 first:mt-0">
      <h3 className="mb-2.5 font-display text-base font-semibold tracking-[-0.01em] text-balance text-ink">
        {title}
      </h3>
      {children}
    </article>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3.5 max-w-[62ch] text-pretty text-ink-muted">{children}</p>;
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="my-4 border-l-2 border-accent pl-3.5 text-pretty text-ink">
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
    <div className="my-4 grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-2">
      <div className="bg-paper-raised p-3.5">
        <span className="mb-1.5 block text-[0.625rem] uppercase tracking-[0.16em] text-status-live">
          Chosen
        </span>
        <span className="mb-0.5 block font-medium text-ink">{chosen.what}</span>
        <p className="text-xs text-ink-muted">{chosen.why}</p>
      </div>
      <div className="bg-paper-raised p-3.5">
        <span className="mb-1.5 block text-[0.625rem] uppercase tracking-[0.16em] text-danger">
          Rejected
        </span>
        <span className="mb-0.5 block font-medium text-ink">{rejected.what}</span>
        <p className="text-xs text-ink-muted">{rejected.why}</p>
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
        "rounded-sm border p-2.5 text-xs leading-snug text-ink",
        wide ? "col-span-full" : "",
        keystone ? "border-accent bg-accent-soft" : "border-rule-strong bg-paper",
      ].join(" ")}
    >
      {label}
      {sub ? (
        <span className="mt-0.5 block text-[0.6875rem] text-ink-faint">{sub}</span>
      ) : null}
    </div>
  );
}

function Arrow() {
  return <div className="py-1 text-center text-sm text-ink-faint">↓</div>;
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
    who: "One recruiter, by link",
    name: "Tailored CVs",
    need: "Private, unguessable, per-opening",
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
  {
    thing: "PDF export",
    why: "Should render this same view, not a second divergent one.",
  },
];

/* -------------------------------------------------------------------------- */

export default async function ColophonPage() {
  // Written, but not published yet. See lib/flags.ts.
  if (!showFullSite()) notFound();

  return (
    <main className="mx-auto w-full max-w-[66ch] px-6 pb-24">
      <header className="border-b border-rule pt-18 pb-8">
        <p className="mb-5 text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
          Colophon · {site.name}
        </p>
        <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance text-ink">
          How this site is built, and why
        </h1>
        <p className="mt-5 max-w-[52ch] text-pretty text-ink-muted">
          A stack list says what I installed. This says what the alternatives
          were, and what each choice cost.
        </p>
        <ul className="mt-7 flex flex-wrap gap-1.5">
          {stack.map((item) => (
            <li
              key={item}
              className="rounded-sm border border-rule px-1.5 py-0.5 text-xs text-ink-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </header>

      <Section title="Three surfaces">
        <div className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-3">
          {surfaces.map((surface) => (
            <div
              key={surface.name}
              className="flex flex-col gap-1 bg-paper-raised p-4"
            >
              <span className="text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint">
                {surface.who}
              </span>
              <span className="font-display text-sm font-semibold text-ink">
                {surface.name}
              </span>
              <span className="text-xs text-ink-muted">{surface.need}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-ink-muted">
          The third one shaped most of what follows.
        </p>
      </Section>

      <Section title="Shape">
        <div className="overflow-x-auto rounded-md border border-rule bg-paper-raised p-4">
          <div className="grid grid-cols-3 gap-1.5">
            <Node label="Visitor" />
            <Node label="Recruiter" sub="holds a link" />
            <Node label="Me" sub="admin" />
          </div>
          <Arrow />
          <div className="grid grid-cols-3 gap-1.5">
            <Node label={<code>(site)</code>} sub="static" />
            <Node label={<code>/cv/[token]</code>} sub="per request, noindex" />
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

        <Decision title="No component library on the public site">
          <Verdict
            chosen={{
              what: "Hand-rolled on tokens",
              why: "The design is deliberately not the consensus look, and there's little to build.",
            }}
            rejected={{
              what: "A library everywhere",
              why: "A component library's job is to converge on the consensus.",
            }}
          />
          <P>
            shadcn/ui is intended for the admin panel only — copied in as owned
            source, so its classes get rewritten onto the same tokens rather than
            running two design systems. Radix handles focus and ARIA, the
            expensive part.
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
            week idle, and the worst possible moment for that is a recruiter
            opening a CV link three days after I sent it. Gave up a table-editing
            UI and file storage.
          </P>
          <P>
            <strong className="font-semibold text-ink">
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

        <Decision title="A tailored CV is a view, not a document">
          <P>
            Over a job search you write many CVs that overlap heavily.
            Copy-and-edit rots: fix a typo in a job title and every copy already
            in someone&rsquo;s inbox stays wrong.
          </P>
          <P>
            So a CV stores only what&rsquo;s specific to one opening — target
            role, headline, summary. Everything else is a join: which positions,
            which bullets, which case studies, which skills. That&rsquo;s why
            bullets are one row each rather than a text blob — a design-systems
            CV takes three bullets from a job, a platform CV takes a different
            three, nothing duplicated.
          </P>
          <Pull>
            Fix a job title once, and every CV ever shared shows the correction.
          </Pull>
          <P>
            Cost: more tables, join-heavy reads. Free at this scale, and indexed.
          </P>
        </Decision>

        <Decision title="The URL is the credential">
          <P>
            No login, because asking a recruiter to register to read a CV is a
            good way to not have it read. The boundary is token entropy: 32 bytes
            from a CSPRNG, generated in the repository layer, never accepted as
            an argument.
          </P>
          <P>
            Accepted honestly: anyone with the link can read and forward it.
            It&rsquo;s a CV — a document meant for strangers — so exposure is
            bounded by what it already is. Mitigations: revoke, rotate, expire,{" "}
            <code className="rounded-sm bg-paper-sunken px-1.5 py-0.5 text-[0.9em] text-ink">
              noindex
            </code>
            , and an{" "}
            <strong className="font-semibold text-ink">identical 404</strong> for
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
              className="grid gap-0.5 border-t border-rule py-3"
            >
              <span className="font-medium text-ink">{item.thing}</span>
              <span className="text-xs text-ink-muted">{item.why}</span>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="mt-16 border-t border-rule pt-5 text-xs text-ink-faint">
        Per-decision records live in{" "}
        <code>docs/decisions/</code>. The rules the codebase is held to live in{" "}
        <code>CLAUDE.md</code> — which exists so the standard is applied by
        default rather than corrected after the fact.
      </footer>
    </main>
  );
}
