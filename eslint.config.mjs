import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

import ck from "./eslint-rules/ck.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  /**
   * Accessibility is a headline claim on the résumé, so it is enforced rather
   * than intended. `strict` over `recommended` — the extra rules it turns on
   * (redundant roles, no-aria-hidden-on-focusable, interactive element
   * affordances) are exactly the ones that catch a plausible-looking mistake.
   *
   * Only the rules are spread, not the whole config: eslint-config-next already
   * registers the jsx-a11y plugin, and registering it twice is a config error.
   *
   * Do not disable a rule to make this pass. Fix the markup.
   */
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    rules: jsxA11y.flatConfigs.strict.rules,
  },

  /**
   * The design-system gate — CLAUDE.md's token, pairing, and component rules,
   * checked rather than remembered. See eslint-rules/ck.mjs, and the Rules
   * section of the style guide for the same list in plain language.
   */
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    plugins: { ck },
    rules: {
      "ck/no-raw-color": "error",
      "ck/no-arbitrary-px": "error",
      "ck/paired-surface": "error",
      "no-console": "error",
    },
  },
  {
    files: ["components/cksui/**/*.tsx"],
    plugins: { ck },
    rules: { "ck/require-data-slot": "error" },
  },
  {
    // Pages read copy from the locale dictionary; library components take it
    // as props. Typographic marks and the specimen text the contrast table
    // draws are not copy.
    files: ["app/[[]lang[]]/**/*.tsx", "components/cksui/**/*.tsx"],
    plugins: { ck },
    rules: {
      "ck/no-literal-copy": ["error", { allow: ["Aa", "AA", "AAA", "CS"] }],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
