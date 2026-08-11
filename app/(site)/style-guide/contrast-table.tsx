"use client";

import { useEffect, useState } from "react";

import { Badge } from "@/components/cksui";
import { CONTRAST_PAIRS, contrastRatio, grade } from "@/lib/contrast";

type Row = {
  label: string;
  surface: string;
  foreground: string;
  surfaceValue: string;
  foregroundValue: string;
  ratio: number | null;
  nonText: boolean;
};

/**
 * Measures the live theme and reports it.
 *
 * The values are read off <html> with getComputedStyle rather than imported
 * from a palette module. That distinction is the whole point: this table
 * reports on the token layer instead of being a second copy of it, so it cannot
 * claim a theme passes while the stylesheet says otherwise.
 *
 * The consequence, accepted deliberately: it publishes failures as readily as
 * passes.
 */
export function ContrastTable() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    function measure() {
      const styles = getComputedStyle(document.documentElement);
      const read = (token: string) =>
        styles.getPropertyValue(`--ck-${token}`).trim();

      setRows(
        CONTRAST_PAIRS.map((pair) => {
          const surfaceValue = read(pair.surface);
          const foregroundValue = read(pair.foreground);
          return {
            label: pair.label,
            surface: pair.surface,
            foreground: pair.foreground,
            surfaceValue,
            foregroundValue,
            ratio: contrastRatio(surfaceValue, foregroundValue),
            nonText: "nonText" in pair ? Boolean(pair.nonText) : false,
          };
        }),
      );
    }

    measure();

    // Re-measure when the theme or mode attribute changes...
    const observer = new MutationObserver(measure);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    // ...and when the system preference flips while "System" is selected,
    // which changes no attribute and would otherwise go unnoticed.
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", measure);

    return () => {
      observer.disconnect();
      query.removeEventListener("change", measure);
    };
  }, []);

  if (rows.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Measuring the current theme…
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Contrast ratio of each token pair in the current theme, with WCAG AA
          and AAA results
        </caption>
        <thead>
          <tr className="border-b border-input text-left">
            <th scope="col" className="py-2 pr-4 font-medium">
              Pair
            </th>
            <th
              scope="col"
              className="py-2 pr-4 text-right font-medium tabular-nums"
            >
              Ratio
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              AA
            </th>
            <th scope="col" className="py-2 font-medium">
              AAA
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const result = row.ratio ? grade(row.ratio, row.nonText) : null;
            return (
              <tr key={row.label} className="border-b border-border">
                <th scope="row" className="py-3 pr-4 font-normal">
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-border text-[0.625rem]"
                      style={{
                        background: row.surfaceValue,
                        color: row.foregroundValue,
                      }}
                    >
                      Aa
                    </span>
                    <span>
                      {row.label}
                      <span className="block text-xs text-muted-foreground">
                        {row.surface} / {row.foreground}
                      </span>
                    </span>
                  </span>
                </th>
                <td className="py-3 pr-4 text-right tabular-nums">
                  {row.ratio ? `${row.ratio.toFixed(2)}:1` : "—"}
                </td>
                <td className="py-3 pr-4">
                  {result ? (
                    <Badge variant={result.aa ? "soft" : "solid"}>
                      {result.aa ? "Pass" : `Fail · needs ${result.aaFloor}:1`}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="py-3">
                  {result ? (
                    <Badge variant={result.aaa ? "soft" : "outline"}>
                      {result.aaa ? "Pass" : "—"}
                    </Badge>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
