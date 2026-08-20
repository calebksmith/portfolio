import type { Metadata } from "next";
import Link from "next/link";

import { Eyebrow, PrintButton } from "@/components/cksui";
import { resume } from "@/lib/content/resume";

export const metadata: Metadata = {
  title: "Experience",
  description: resume.summary,
};

/**
 * The experience page — a résumé by structure, not by name.
 *
 * "Résumé" is a document you are handed; this is a page you read, and the site
 * says so. The data module underneath is still `resume.ts` because that is what
 * the records are, and renaming a private module to match a label would be
 * churn.
 *
 * Rendered from structured data (lib/content/resume.ts), not prose, so the same
 * records drive this page and the print stylesheet without two copies drifting.
 *
 * "PDF download" is the browser's own print-to-PDF rather than a generated
 * file. A print stylesheet is a single source of truth that cannot go stale;
 * a committed PDF is a second artifact that silently rots the moment a bullet
 * changes here. See the @media print block in globals.css.
 */
export default async function ExperiencePage() {
  return (
    <main className="w-full px-6 py-14 sm:px-10 print:px-0 print:py-0">
      <header className="border-b border-border pb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-foreground">
              {resume.name}
            </h1>
            <Eyebrow tone="primary" className="mt-2">{resume.title}</Eyebrow>
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
              <Eyebrow asChild>
                <dt>{skill.label}</dt>
              </Eyebrow>
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
              <Eyebrow>{position.period}</Eyebrow>
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
                <Eyebrow asChild>
                  <h4>{section.heading}</h4>
                </Eyebrow>
                <ul className="mt-2 max-w-measure list-disc space-y-1.5 pl-5 text-pretty text-muted-foreground">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}

            {position.bullets ? (
              <ul className="mt-3 max-w-measure list-disc space-y-1.5 pl-5 text-pretty text-muted-foreground">
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
      <Eyebrow asChild tone="strong" className="mb-4 border-b border-input pb-1">
        <h2>{title}</h2>
      </Eyebrow>
      {children}
    </section>
  );
}
