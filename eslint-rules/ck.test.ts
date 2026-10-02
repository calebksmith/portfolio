import { RuleTester } from "eslint";
import { describe, it } from "vitest";

import ck from "./ck.mjs";

/**
 * Each rule, shown failing on the thing it exists to stop and passing on the
 * thing the site actually does. A lint rule nobody has watched fail is a lint
 * rule that might not run.
 */

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

const rule = (name: keyof typeof ck.rules) => ck.rules[name];

tester.run("no-raw-color", rule("no-raw-color"), {
  valid: [
    `<div className="bg-card text-card-foreground" />`,
    `cn("border-input hover:bg-muted")`,
  ],
  invalid: [
    { code: `<div className="bg-red-500" />`, errors: 1 },
    { code: `<p className="text-white" />`, errors: 1 },
    { code: `<div className="hover:bg-[#ff0000]" />`, errors: 1 },
    { code: `cva("text-[rgb(0,0,0)]")`, errors: 1 },
  ],
});

tester.run("no-arbitrary-px", rule("no-arbitrary-px"), {
  valid: [
    `<div className="max-w-[58ch] tracking-[-0.03em] rounded-sm" />`,
    `<div className="text-[clamp(2rem,6vw,3rem)]" />`,
  ],
  invalid: [
    { code: `<div className="w-[388px]" />`, errors: 1 },
    { code: `<div className="mt-[13px] rounded-[1px]" />`, errors: 2 },
  ],
});

tester.run("paired-surface", rule("paired-surface"), {
  valid: [
    // Its own foreground.
    `<div className="bg-primary text-primary-foreground" />`,
    // An equivalent measured foreground — no surface-specific token needed.
    `<li className="bg-muted text-foreground" />`,
    // Inheriting the page foreground, where that pair is measured.
    `<section className="rounded-lg bg-card p-5" />`,
    // A surface with no text: decorative, hidden from assistive technology.
    `<span aria-hidden="true"><span className="bg-primary" /></span>`,
    // Variants are states of a surface already paired elsewhere.
    `<a className="hover:bg-muted" />`,
  ],
  invalid: [
    // Inherits foreground, and primary/foreground is never measured.
    { code: `<div className="bg-primary p-2" />`, errors: 1 },
    // Draws text in a combination the contrast gate never checks.
    {
      code: `<div className="bg-accent text-muted-foreground" />`,
      errors: 1,
    },
  ],
});

tester.run("require-data-slot", rule("require-data-slot"), {
  valid: [
    `export function Badge() { return <span data-slot="badge" />; }`,
    // Renders another component, which carries its own slot.
    `export function PrintButton() { return <Button />; }`,
    // Not exported: an internal piece of a component.
    `function Chevron() { return <svg />; }`,
  ],
  invalid: [
    {
      code: `export function Badge() { return <span className="x" />; }`,
      errors: 1,
    },
  ],
});

tester.run("no-literal-copy", rule("no-literal-copy"), {
  valid: [
    `<p>{t.title}</p>`,
    `<span aria-hidden="true">·</span>`,
    `<code>data-slot="badge"</code>`,
    `<dt>--ck-{name}</dt>`,
    { code: `<span>Aa</span>`, options: [{ allow: ["Aa"] }] },
  ],
  invalid: [
    { code: `<h1>That page doesn't exist</h1>`, errors: 1 },
    { code: `<nav aria-label="Breadcrumb" />`, errors: 1 },
  ],
});
