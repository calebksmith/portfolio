import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { cn } from "./cn";

/**
 * `cn` decides which of two conflicting utilities survives, and it decides by
 * name. A wrong guess doesn't throw or look broken in review — it deletes a
 * class. `text-label` read as a colour took the tone off every eyebrow on the
 * site.
 *
 * So the names come from `globals.css`, not from a list kept here: a token
 * added to the theme is tested the day it is added.
 */

const css = readFileSync(
  new URL("../../../app/globals.css", import.meta.url),
  "utf8",
);
const start = css.indexOf("@theme");
const theme = css.slice(start, css.indexOf("}", start));

/** Token names in one theme namespace: `--text-label` → `label`. */
function tokens(namespace: string) {
  const pattern = new RegExp(`--${namespace}-([a-z0-9-]+):`, "g");
  return [...theme.matchAll(pattern)].map((match) => match[1]);
}

/** Properties with a 44px touch-target utility: `@utility min-h-tap` → `min-h`. */
const tapUtilities = [...css.matchAll(/@utility ([a-z-]+)-tap\b/g)].map(
  (match) => match[1],
);

describe("cn", () => {
  it("finds the theme's tokens", () => {
    // If parsing silently finds nothing, every test below passes vacuously.
    expect(tokens("text")).toContain("label");
    expect(tapUtilities).toContain("min-h");
  });

  it.each(tokens("text"))("keeps a colour beside text-%s", (name) => {
    expect(cn("text-muted-foreground", `text-${name}`)).toBe(
      `text-muted-foreground text-${name}`,
    );
    expect(cn(`text-${name}`, "text-primary")).toBe(
      `text-${name} text-primary`,
    );
  });

  it.each(tokens("text"))("lets text-%s replace a type size", (name) => {
    expect(cn("text-sm", `text-${name}`)).toBe(`text-${name}`);
  });

  it.each(tokens("tracking"))("lets tracking-%s replace tracking", (name) => {
    expect(cn("tracking-tight", `tracking-${name}`)).toBe(`tracking-${name}`);
  });

  it.each(tokens("shadow"))("lets shadow-%s replace a shadow", (name) => {
    expect(cn("shadow-sm", `shadow-${name}`)).toBe(`shadow-${name}`);
  });

  it.each(tokens("container"))("lets max-w-%s replace a width", (name) => {
    expect(cn("max-w-prose", `max-w-${name}`)).toBe(`max-w-${name}`);
  });

  it.each(tapUtilities)("lets %s-tap replace a size", (property) => {
    expect(cn(`${property}-8`, `${property}-tap`)).toBe(`${property}-tap`);
  });
});
