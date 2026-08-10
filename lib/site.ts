/**
 * Single source of truth for the site's identity.
 *
 * Anything that appears in more than one place — the name in the header and in
 * the OG title, the URL in metadata and in a shared CV link — lives here rather
 * than being retyped. Components import from this file; they never hard-code
 * these strings.
 */

export const site = {
  name: "Caleb Smith",
  title: "Design Engineer",

  /** One line. The landing page says this and nothing more. */
  positioning: "I'm a product designer who works in code.",

  /**
   * TODO(caleb): set to the production origin before the first deploy. Used for
   * absolute URLs in metadata, OG images, and shareable CV links.
   */
  url: "https://calebksmith.com",

  /**
   * The spec table. Ordered; rendered as written. This carries the detail so
   * the prose above it doesn't have to.
   */
  spec: [
    { label: "Focus", value: "Design systems, agentic development, guardrails" },
    { label: "Stack", value: "TypeScript, React, Next.js, Postgres, Tailwind" },
    { label: "Platforms", value: "Web, iOS (React Native)" },
    // TODO(caleb): set your actual location.
    { label: "Location", value: "United States" },
  ],
} as const;

/**
 * Status of the portfolio itself, rendered next to the pulsing dot.
 * Flip to "live" when the real pages replace the landing page.
 */
export const portfolioStatus = {
  state: "building",
  label: "Portfolio in development",
} as const;
