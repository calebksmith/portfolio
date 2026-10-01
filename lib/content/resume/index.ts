/**
 * The résumé, as structured data.
 *
 * Deliberately not prose or MDX: these are records with a shape — roles have
 * periods, bullets belong to sections, work items have outcomes. Keeping the
 * shape means the same data renders as a page and as a print stylesheet without
 * two copies drifting apart.
 *
 * One file per locale (`en.ts`, …), each typed as `Resume` so a translation
 * cannot drop a field. Each file is the source of truth for its language. Do
 * not rewrite copy to fit a layout — change the layout. Metrics are approved
 * and defensible; do not invent or extrapolate new ones.
 */

import type { Locale } from "@/lib/i18n/config";

import { en } from "./en";

export type ResumeSection = {
  heading: string;
  bullets: string[];
};

export type Role = {
  title: string;
  period: string;
};

export type Position = {
  org: string;
  /** The org's own site, when there is one worth visiting. */
  href?: string;
  location: string;
  period: string;
  note?: string;
  roles?: Role[];
  sections?: ResumeSection[];
  bullets?: string[];
};

export type Resume = {
  name: string;
  title: string;
  location: string;
  contact: { label: string; href: string }[];
  summary: string;
  skills: { label: string; value: string }[];
  experience: Position[];
  /** Ships alongside the Vimocity entry; kept separate so it can be reordered. */
  selectedWork: { title: string; detail: string; slug?: string }[];
  education: { school: string; detail: string }[];
};

const resumes: Record<Locale, Resume> = { en };

export function getResume(locale: Locale): Resume {
  return resumes[locale];
}
