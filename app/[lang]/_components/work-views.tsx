import { Tabs } from "@/components/cksui";
import { getCaseStudies } from "@/lib/content/work";
import { getLocale, getMessages } from "@/lib/i18n/server";

import { CaseStudyCard } from "./case-study-card";
import { EcosystemDiagram } from "./ecosystem-diagram";
import { Reveal } from "./reveal";

/**
 * The work at Vimocity, two ways.
 *
 * The section opens by saying what Vimocity is and what the team is working
 * toward, so the reader has context before anything else. The view switch sits
 * beside that title, as a "view as" control: the product map — where each case
 * study sits, names only — or every case study as a card. The map leads,
 * because context first is what makes eight titles a body of work rather than a
 * list.
 */
export async function WorkViews() {
  const locale = await getLocale();
  const t = (await getMessages()).home.work;
  const studies = getCaseStudies(locale);

  return (
    <Tabs
      label={t.views}
      defaultValue="map"
      header={
        <>
          <h3 className="font-display text-3xl font-semibold tracking-[-0.02em] text-foreground">
            {t.heading}
          </h3>
          <p className="mt-3 max-w-measure-wide text-pretty text-muted-foreground">
            {t.intro}
          </p>
        </>
      }
      items={[
        {
          value: "map",
          label: t.tabs.map,
          icon: <MapIcon />,
          content: <EcosystemDiagram />,
        },
        {
          value: "list",
          label: t.tabs.list,
          icon: <ListIcon />,
          content: (
            /* Two across at most: the descriptor is a full phrase in a wide
               monospace face, and four across cut it to a few words a line. */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {studies.map((study, index) => (
                <Reveal key={study.slug} index={index}>
                  <CaseStudyCard {...study} as="h4" />
                </Reveal>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}

/** Columns over a shared base: the shape of the product map. Decorative. */
function MapIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <rect x="1.75" y="1.75" width="3.5" height="7.5" rx="0.75" />
      <rect x="6.25" y="1.75" width="3.5" height="7.5" rx="0.75" />
      <rect x="10.75" y="1.75" width="3.5" height="7.5" rx="0.75" />
      <rect x="1.75" y="11.25" width="12.5" height="3" rx="0.75" />
    </svg>
  );
}

/** A two-up grid of cards: the shape of the case study list. Decorative. */
function ListIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <rect x="1.75" y="1.75" width="5.5" height="5.5" rx="0.75" />
      <rect x="8.75" y="1.75" width="5.5" height="5.5" rx="0.75" />
      <rect x="1.75" y="8.75" width="5.5" height="5.5" rx="0.75" />
      <rect x="8.75" y="8.75" width="5.5" height="5.5" rx="0.75" />
    </svg>
  );
}
