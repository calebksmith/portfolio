import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintButton } from "@/components/cksui";
import { resume } from "@/lib/content/resume";
import { showFullSite } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Résumé",
  description: resume.summary,
};

/**
 * The résumé.
 *
 * Rendered from structured data (lib/content/resume.ts), not prose, so the same
 * records drive this page and the print stylesheet without two copies drifting.
 *
 * "PDF download" is the browser's own print-to-PDF rather than a generated
 * file. A print stylesheet is a single source of truth that cannot go stale;
 * a committed PDF is a second artifact that silently rots the moment a bullet
 * changes here. See the @media print block in globals.css.
 */
export default async function ResumePage() {
  if (!showFullSite()) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-14 sm:px-10 print:max-w-none print:px-0 print:py-0">
      <header className="border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(2rem,5vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
              {resume.name}
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.16em] text-primary">
              {resume.title}
            </p>
          </div>

          <PrintButton className="print:hidden" />
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{resume.location}</span>
          {resume.contact.map((item) => (
            <span key={item.href} className="flex items-center gap-3">
              <span aria-hidden="true">·</span>
              <a
                href={item.href}
                className="underline decoration-input underline-offset-4 hover:text-foreground hover:decoration-primary"
              >
                {item.label}
              </a>
            </span>
          ))}
        </p>
      </header>

      <Section title="Summary">
        <p className="max-w-[68ch] text-pretty text-muted-foreground">
          {resume.summary}
        </p>
      </Section>

      <Section title="Skills">
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr]">
          {resume.skills.map((skill) => (
            <div key={skill.label} className="contents">
              <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {skill.label}
              </dt>
              <dd className="text-pretty text-foreground">{skill.value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Experience">
        {resume.experience.map((position) => (
          <article
            key={position.org}
            className="mt-8 first:mt-0 break-inside-avoid"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground">
                {position.org}
                <span className="text-muted-foreground"> · {position.location}</span>
              </h3>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {position.period}
              </p>
            </div>

            {position.note ? (
              <p className="mt-1 text-sm text-muted-foreground italic">
                {position.note}
              </p>
            ) : null}

            {position.roles ? (
              <ul className="mt-3 space-y-1">
                {position.roles.map((role) => (
                  <li
                    key={role.title}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 border-b border-border pb-1 text-sm"
                  >
                    <span className="text-foreground">{role.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {role.period}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {position.sections?.map((section) => (
              <div key={section.heading} className="mt-5 break-inside-avoid">
                <h4 className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {section.heading}
                </h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-pretty text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}

            {position.bullets ? (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-pretty text-muted-foreground">
                {position.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </Section>

      <Section title="Selected work">
        <ul className="space-y-3">
          {resume.selectedWork.map((item) => (
            <li key={item.title} className="break-inside-avoid">
              <span className="font-medium text-foreground">
                {"slug" in item && item.slug ? (
                  <Link
                    href={`/work/${item.slug}`}
                    className="underline decoration-input underline-offset-4 hover:decoration-primary"
                  >
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </span>
              <span className="text-muted-foreground"> — {item.detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        {resume.education.map((entry) => (
          <p key={entry.school} className="text-foreground">
            {entry.school}
            <span className="text-muted-foreground"> — {entry.detail}</span>
          </p>
        ))}
      </Section>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 break-inside-avoid">
      <h2 className="mb-4 border-b border-input pb-1 text-xs uppercase tracking-[0.16em] text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}
