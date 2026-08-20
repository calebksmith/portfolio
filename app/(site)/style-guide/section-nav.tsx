"use client";

import { useEffect, useState } from "react";

/**
 * The style guide's section index, with the section you are reading marked.
 *
 * An index of five in-page links that all look identical no matter where you
 * are is a table of contents, not a position indicator — it tells you what
 * exists and nothing about where you got to. On a page this long that is the
 * half worth having.
 *
 * One observer over all five sections, with a band about a quarter of the way
 * down the viewport: whichever section is crossing that band is the one being
 * read. Watching for "topmost visible" instead breaks at the bottom of the
 * page, where the last short section can never reach the top.
 *
 * Without JavaScript the links still work and simply never highlight — the
 * marking is an improvement on a nav that already functions.
 */
export function SectionNav({
  sections,
}: {
  sections: readonly { id: string; label: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // The callback only reports what changed, so the visible set is
        // rebuilt from the elements themselves rather than from the entries.
        // Reading the DOM here is cheap and always right; tracking a mirror of
        // it in state is neither.
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
            return;
          }
        }
      },
      // A band from 25% to 45% down the viewport. Tall enough that scrolling
      // fast cannot step over it, short enough that only one section is in it.
      { rootMargin: "-25% 0px -55% 0px" },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="Style guide sections"
      className="mb-8 lg:sticky lg:top-20 lg:mb-0 lg:self-start"
    >
      <ul className="flex flex-wrap gap-x-1 gap-y-1 lg:flex-col">
        {sections.map((section) => {
          const current = active === section.id;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                // "location", not "page" — this marks a position within the
                // document, which is exactly the case the value exists for.
                aria-current={current ? "location" : undefined}
                className={`inline-flex min-h-tap items-center rounded-sm px-2 text-label uppercase tracking-label underline-offset-4 transition-colors ${
                  current
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
