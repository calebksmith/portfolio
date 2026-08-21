"use client";

import { useEffect, useState } from "react";

import { Eyebrow } from "@/components/cksui";

/**
 * Reports the resolved value of each token in the live theme.
 *
 * Read off <html> with getComputedStyle rather than imported from a palette
 * module — the same rule the contrast table follows. A style guide that keeps
 * its own copy of the values is documentation that can lie.
 */

const PAIRS: { surface: string; foreground: string; label: string }[] = [
  { surface: "background", foreground: "foreground", label: "Page" },
  { surface: "card", foreground: "card-foreground", label: "Card" },
  { surface: "muted", foreground: "muted-foreground", label: "Muted" },
  { surface: "primary", foreground: "primary-foreground", label: "Primary" },
  { surface: "accent", foreground: "accent-foreground", label: "Accent" },
];

const SINGLES = [
  { token: "border", label: "Border", note: "Decorative hairline" },
  { token: "input", label: "Input", note: "Control boundary · 3:1" },
  { token: "ring", label: "Ring", note: "Focus indicator · 3:1" },
];

function useTokens(names: string[]) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    function read() {
      const styles = getComputedStyle(document.documentElement);
      setValues(
        Object.fromEntries(
          names.map((name) => [
            name,
            styles.getPropertyValue(`--ck-${name}`).trim(),
          ]),
        ),
      );
    }

    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", read);

    return () => {
      observer.disconnect();
      query.removeEventListener("change", read);
    };
    // `names` is a module-level constant list; re-running on identity would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return values;
}

export function TokenTable() {
  const names = [
    ...PAIRS.flatMap((pair) => [pair.surface, pair.foreground]),
    ...SINGLES.map((single) => single.token),
  ];
  const values = useTokens(names);

  return (
    <div className="mt-6 space-y-8">
      <div>
        <Eyebrow asChild>
          <h3>Surface and foreground pairs</h3>
        </Eyebrow>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {PAIRS.map((pair) => (
            <li
              key={pair.label}
              className="overflow-hidden rounded-md border border-border"
            >
              <div
                className="flex items-center justify-between px-4 py-5"
                style={{
                  background: values[pair.surface],
                  color: values[pair.foreground],
                }}
              >
                <span className="font-display text-base font-semibold">
                  {pair.label}
                </span>
                <span className="text-xs">Aa</span>
              </div>
              <dl className="grid grid-cols-2 divide-x divide-border border-t border-border bg-card text-xs">
                <div className="p-3">
                  <dt className="text-muted-foreground">--ck-{pair.surface}</dt>
                  <dd className="mt-1 tabular-nums text-card-foreground">
                    {values[pair.surface] || "—"}
                  </dd>
                </div>
                <div className="p-3">
                  <dt className="text-muted-foreground">
                    --ck-{pair.foreground}
                  </dt>
                  <dd className="mt-1 tabular-nums text-card-foreground">
                    {values[pair.foreground] || "—"}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Eyebrow asChild>
          <h3>Structure</h3>
        </Eyebrow>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {SINGLES.map((single) => (
            <li
              key={single.token}
              className="rounded-md border border-border bg-card p-4"
            >
              <div
                className="h-8 rounded-sm border"
                style={{ borderColor: values[single.token] }}
              />
              <p className="mt-3 text-sm text-card-foreground">
                {single.label}
              </p>
              <p className="text-xs text-muted-foreground">
                --ck-{single.token}
              </p>
              <p className="mt-1 text-xs tabular-nums text-muted-foreground">
                {values[single.token] || "—"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {single.note}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
