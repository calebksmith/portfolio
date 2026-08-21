/**
 * Site identity.
 *
 * Copy here is the approved text from the copy deck. Do not rewrite it to fit
 * a layout — change the layout. Anything appearing in more than one place (the
 * name in the header and in the OG title) lives here rather than being retyped.
 */

export const site = {
  name: "Caleb Smith",
  role: "Design engineer",
  lede: "I design products and write the frontend code they're built from.",
  url: "https://calebksmith.com",

  /** Rendered in order, as written. */
  spec: [
    { label: "Focus", value: "Design systems, product design, frontend" },
    { label: "Stack", value: "TypeScript, React, Next.js, Tailwind" },
    { label: "Platforms", value: "Web, iOS, Android, Desktop" },
    { label: "Based", value: "Seattle, Washington" },
  ],

  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/calebksmith" },
    {
      label: "VimUI — design system",
      href: "https://vimui.vimocity.com/main/",
    },
  ],
} as const;
