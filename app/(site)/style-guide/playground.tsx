"use client";

import { useEffect, useState } from "react";

import { Badge, Eyebrow } from "@/components/cksui";
import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";

import {
  recipes,
  renderNode,
  tokenize,
  type Control,
  type Recipe,
  type Token,
} from "./_recipes";

/**
 * The component playground.
 *
 * Pick a component, pick its options, and the JSX writes itself out beside the
 * thing it builds. The code is not a sample kept next to a demo — it is the same
 * tree the demo is rendered from, printed. See `_recipes.tsx`.
 *
 * Two deliberate restraints:
 *
 * Nothing animates on load. The playground sits well down a long page, and code
 * typing itself in an empty box the visitor never asked for is decoration. It
 * types when *you* change something, which also means the server renders the
 * default selection complete — so this page still works with no JavaScript at
 * all, just without the writing.
 *
 * Choices are radio groups, not buttons. They are one-of-a-set, which is what a
 * radio group is, and it arrives with arrow-key navigation and a single tab stop
 * already built. A row of buttons would be reimplementing that by hand and
 * getting it slightly wrong.
 */

/** Two characters a frame — fast enough to stay responsive, slow enough to read. */
const CHARS_PER_TICK = 2;
const TICK_MS = 16;

const defaultsFor = (recipe: Recipe) =>
  Object.fromEntries(
    recipe.controls.map((control) => [control.name, control.values[0]]),
  );

export function Playground() {
  const reduced = usePrefersReducedMotion();

  const [activeId, setActiveId] = useState(recipes[0].id);
  const [choices, setChoices] = useState<
    Record<string, Record<string, string>>
  >(() => Object.fromEntries(recipes.map((r) => [r.id, defaultsFor(r)])));

  // Until something is chosen, the code is shown finished rather than typed.
  const [touched, setTouched] = useState(false);

  const recipe = recipes.find((r) => r.id === activeId) ?? recipes[0];
  const tree = recipe.build(choices[recipe.id]);
  const tokens = tokenize(tree);
  const code = tokens.map((token) => token.text).join("");

  const choose = (control: string, value: string) => {
    setTouched(true);
    setChoices((current) => ({
      ...current,
      [recipe.id]: { ...current[recipe.id], [control]: value },
    }));
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="border-b border-border p-5">
        <RadioRow
          legend="Component"
          name="playground-component"
          values={recipes.map((r) => r.name)}
          value={recipe.name}
          onChange={(name) => {
            setTouched(true);
            setActiveId(
              recipes.find((r) => r.name === name)?.id ?? recipes[0].id,
            );
          }}
          prominent
        />
      </div>

      {/*
        The component and the code that makes it, side by side — the pairing is
        the whole argument, and reading it as one thing is easier than scrolling
        between two.

        Both sit directly under the picker, where nothing above them changes
        height, so they stay at the same point on the page for every component.
        They used to follow the description and the controls, which vary from one
        specimen to the next, and choosing a different component moved the thing
        you were looking at.

        Stacked below `lg`: at half a phone's width the source wraps into
        nonsense and the preview has no room to show a component at its real
        size. `min-h` covers the tallest specimen either way.
      */}
      <div className="grid grid-cols-1 border-b border-border lg:grid-cols-2">
        <section
          aria-label="Rendered component"
          className="flex min-h-[13rem] flex-col border-b border-border bg-background p-5 lg:border-r lg:border-b-0"
        >
          <PanelLabel>Rendered</PanelLabel>

          {/* Keyed on the code, so a changed selection replays the fade rather
              than swapping in place. The component itself is live either way. */}
          <div
            key={code}
            className="ck-enter flex flex-1 flex-wrap items-center gap-3"
          >
            {renderNode(tree)}
          </div>
        </section>

        <section aria-label="Source" className="min-w-0 p-5">
          <PanelLabel>Source</PanelLabel>

          {/* Remounting on a new code string is what resets the typing — the
              alternative is a second copy of the string held in state that has
              to be kept in step with this one. */}
          <Code
            key={code}
            tokens={tokens}
            animate={touched && !reduced}
            length={code.length}
          />
        </section>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-card-foreground">
            {recipe.name}
          </h3>
          <Badge>data-slot=&quot;{recipe.slot}&quot;</Badge>
        </div>

        <p className="mt-2 max-w-measure-wide text-pretty text-sm text-muted-foreground">
          {recipe.description}
        </p>

        {recipe.notes ? (
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {recipe.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        {recipe.controls.length > 0 ? (
          <div className="mt-5 flex flex-col gap-4">
            {recipe.controls.map((control) => (
              <ControlRow
                key={control.name}
                control={control}
                recipeId={recipe.id}
                value={choices[recipe.id][control.name]}
                onChange={(value) => choose(control.name, value)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <Eyebrow className="mb-4">{children}</Eyebrow>;
}

/* --- The typed source panel ----------------------------------------------- */

function Code({
  tokens,
  animate,
  length,
}: {
  tokens: Token[];
  animate: boolean;
  length: number;
}) {
  const [shown, setShown] = useState(animate ? 0 : length);

  useEffect(() => {
    if (shown >= length) return;

    const timer = setTimeout(
      () => setShown((current) => Math.min(current + CHARS_PER_TICK, length)),
      TICK_MS,
    );
    return () => clearTimeout(timer);
  }, [shown, length]);

  // Each token's start offset, derived rather than accumulated in a counter —
  // render must not depend on mutation part-way through. Quadratic, over a few
  // dozen tokens.
  const spans = tokens.map((token, index) => ({
    token,
    start: tokens
      .slice(0, index)
      .reduce((total, previous) => total + previous.text.length, 0),
  }));

  return (
    <pre className="overflow-x-auto text-xs leading-relaxed sm:text-sm">
      <code>
        {spans.map(({ token, start }, index) => {
          const visible = token.text.slice(0, Math.max(0, shown - start));
          if (!visible) return null;

          return (
            <span key={index} className={COLOR[token.kind]}>
              {visible}
            </span>
          );
        })}

        {shown < length ? (
          <span className="ck-caret-writing ml-[0.1em] inline-block h-[1em] w-[0.5em] rounded-[1px] bg-primary align-[-0.15em]" />
        ) : null}
      </code>
    </pre>
  );
}

/**
 * Syntax colors, from tokens that already exist.
 *
 * Every one of these clears AA against `card` in all three themes and both
 * modes, and `check:contrast` gates them — a highlighter that needed its own
 * palette would be a second color system smuggled in beside the first.
 */
const COLOR: Record<Token["kind"], string> = {
  tag: "text-primary",
  prop: "text-accent-foreground",
  value: "text-card-foreground",
  text: "text-card-foreground",
  punct: "text-muted-foreground",
};

/* --- Controls -------------------------------------------------------------- */

function ControlRow({
  control,
  recipeId,
  value,
  onChange,
}: {
  control: Control;
  recipeId: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadioRow
      legend={control.label}
      name={`${recipeId}-${control.name}`}
      values={[...control.values]}
      value={value}
      onChange={onChange}
    />
  );
}

function RadioRow({
  legend,
  name,
  values,
  value,
  onChange,
  prominent = false,
}: {
  legend: string;
  name: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
  prominent?: boolean;
}) {
  return (
    <fieldset>
      <Eyebrow asChild className="mb-2">
        <legend>{legend}</legend>
      </Eyebrow>

      <div className="flex flex-wrap gap-2">
        {values.map((option) => (
          <label
            key={option}
            className={[
              "inline-flex min-h-tap cursor-pointer items-center rounded-sm border px-3 transition-colors",
              "text-xs tracking-[0.06em]",
              prominent ? "font-medium" : "",
              "border-border text-muted-foreground",
              "hover:bg-muted hover:text-muted-foreground",
              "has-[:checked]:border-input has-[:checked]:bg-accent has-[:checked]:text-accent-foreground",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
            ].join(" ")}
          >
            {/* The real control, kept in the accessibility tree and in the tab
                order — only its default appearance is hidden. */}
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
