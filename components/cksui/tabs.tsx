"use client";

import { useId, useRef, useState, type ReactNode } from "react";

import { cn } from "./lib/cn";

/**
 * Tabs, drawn as a segmented control: one of several views of the same thing.
 *
 * The WAI-ARIA tabs pattern, written out rather than installed — it is small,
 * and the behavior is the part worth getting exactly right:
 *
 *   - Left and Right move between tabs and select as they go; Home and End
 *     jump to the ends. Only the selected tab is in the tab order, so Tab
 *     moves past the control and into the view.
 *   - Every view is in the page. The inactive ones carry `hidden`, so there is
 *     no layout shift when one is shown, and without JavaScript the noscript
 *     rule below shows them all stacked and hides the control that can't work.
 *
 * `header` sits beside the control — the title of whatever the tabs switch —
 * so the control reads as "view this as", in context, rather than as a word
 * floating above content it hasn't introduced.
 *
 * Labels and content arrive as props; the library ships no copy.
 */
export function Tabs({
  label,
  items,
  defaultValue,
  header,
  className,
}: {
  /** Names the set of tabs for assistive technology. */
  label: string;
  items: {
    value: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
  }[];
  defaultValue?: string;
  /** What the tabs are views of: shown beside the control. */
  header?: ReactNode;
  className?: string;
}) {
  const id = useId();
  const [selected, setSelected] = useState(defaultValue ?? items[0]?.value);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(index: number) {
    const item = items[(index + items.length) % items.length];
    setSelected(item.value);
    tabs.current[(index + items.length) % items.length]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      select(moves[event.key]);
    }
  }

  return (
    <div data-slot="tabs" className={className}>
      <noscript>
        <style>
          {
            "[data-slot=tabs] [role=tablist]{display:none}[data-slot=tabs] [role=tabpanel][hidden]{display:block!important}"
          }
        </style>
      </noscript>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        {header ? <div className="min-w-0">{header}</div> : null}
        <div
          role="tablist"
          aria-label={label}
          className="inline-flex shrink-0 gap-1 self-start rounded-md border border-input p-1 lg:self-end"
        >
          {items.map((item, index) => {
            const isSelected = item.value === selected;
            return (
              <button
                key={item.value}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${item.value}`}
                aria-selected={isSelected}
                aria-controls={`${id}-panel-${item.value}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected(item.value)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  "inline-flex min-h-tap items-center gap-2 rounded-sm px-4 text-sm transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  isSelected
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-foreground hover:bg-muted hover:text-muted-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${item.value}`}
          aria-labelledby={`${id}-tab-${item.value}`}
          hidden={item.value !== selected}
          className="mt-8"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
