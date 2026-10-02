/**
 * Site identity — the parts that are the same in every language.
 *
 * The name and URL are proper nouns and addresses, not copy. The role, the
 * lede, and the spec rows are written per locale in `lib/i18n/messages/`.
 * Anything appearing in more than one place (the name in the header and in the
 * OG title) lives here rather than being retyped.
 */

export const site = {
  name: "Caleb Smith",
  url: "https://calebksmith.com",

  links: {
    linkedin: "https://www.linkedin.com/in/calebksmith",
    vimui: "https://vimui.vimocity.com/main/",
    practice: "https://www.moderntrailhead.com",
    /** The repository is public, and part of the work sample. */
    source: "https://github.com/calebksmith/portfolio",
    /** The design-system lint rules, where the style guide points. */
    rules:
      "https://github.com/calebksmith/portfolio/blob/main/eslint-rules/ck.mjs",
  },
} as const;
