import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Unit tests only, in Node.
 *
 * There is deliberately no jsdom and no component rendering. The components on
 * this site are already checked by things that check them better than a
 * render assertion would: `check:contrast` measures every token pair in every
 * theme, `eslint-plugin-jsx-a11y` runs strict, and Lighthouse scores
 * accessibility at 100. A test asserting that a button renders the word
 * "Submit" would add a maintenance cost and catch nothing those three miss.
 *
 * What is tested here is the logic those tools cannot see: colour math,
 * a hand-written frontmatter parser, the content's own integrity, and the
 * class merging every component's overrides depend on.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["{lib,scripts,src,eslint-rules,components}/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
