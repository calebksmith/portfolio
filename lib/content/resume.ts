/**
 * The résumé, as structured data.
 *
 * Deliberately not prose or MDX: these are records with a shape — roles have
 * periods, bullets belong to sections, work items have outcomes. Keeping the
 * shape means the same data renders as a page and as a print stylesheet without
 * two copies drifting apart.
 *
 * Copy is the approved text from docs/copy-deck.md §3. Do not rewrite it to fit
 * a layout — change the layout. Metrics here are approved and defensible; do
 * not invent or extrapolate new ones.
 */

export type ResumeSection = {
  heading: string;
  bullets: string[];
};

export type Role = {
  title: string;
  period: string;
};

export type Position = {
  org: string;
  location: string;
  period: string;
  note?: string;
  roles?: Role[];
  sections?: ResumeSection[];
  bullets?: string[];
};

export const resume = {
  name: "Caleb Smith",
  title: "Design Engineer",
  location: "Seattle, WA",

  contact: [
    { label: "calebksmith.com", href: "https://calebksmith.com" },
    {
      label: "linkedin.com/in/calebksmith",
      href: "https://www.linkedin.com/in/calebksmith",
    },
  ],

  summary:
    "Product designer who works in code. I define what gets built — customer research, product briefs, prototypes — and build the frontend in React and TypeScript. I built the design system our web app runs on, and the automated checks that keep design and code in sync. Nine years in design, five writing production frontend.",

  skills: [
    {
      label: "Design systems",
      value:
        "component libraries, design tokens, documentation and standards, versioned releases, multi-platform systems",
    },
    {
      label: "Frontend",
      value:
        "TypeScript, React, Next.js, Tailwind, React Native, Storybook, Git, code review",
    },
    {
      label: "AI tooling",
      value:
        "automated design rules, AI coding guardrails, design-to-code workflows",
    },
    {
      label: "Product",
      value:
        "product definition and briefs, customer research, prototyping, 0–1 features, roadmap input",
    },
    {
      label: "Platforms",
      value: "mobile-first web, iOS, Android, Windows desktop",
    },
    {
      label: "Accessibility",
      value: "WCAG AA, keyboard operability, light and dark modes",
    },
  ],

  experience: [
    {
      org: "Vimocity",
      location: "Seattle, WA",
      period: "May 2021 – Present",
      note: "Workplace health platform · ~50,000 users across 30+ organizations",
      roles: [
        {
          title: "Design Engineer, Product Design Manager",
          period: "Sep 2024 – Present",
        },
        { title: "Product Designer", period: "May 2022 – Aug 2024" },
        { title: "Multimedia Designer", period: "May 2021 – Apr 2022" },
      ],
      sections: [
        {
          heading: "Design system",
          bullets: [
            "Built VimUI and lead its growth: 50+ web components on shared tokens, documented in Storybook. Color and type tokens carry across our iOS, Android, and Windows desktop apps.",
            "Raised reusable component use from about 10% to 80–90% of frontend code, and design token use from 0% to 99%.",
            "Wrote the standards that govern the system — structure, tokens, typing, accessibility, documentation, and versioning — and maintain them as the reference the whole team builds against.",
            "Run the system as a versioned package: semantic versioning, a changelog entry per change, and beta releases sent to the apps that consume it before anything breaking ships.",
          ],
        },
        {
          heading: "Automation and AI tooling",
          bullets: [
            "Built automated checks that run before every merge, at two levels: rules governing how components are built in the design system, and rules governing how pages are built in the product — token use, accessibility, loading states, and responsive breakpoints.",
            "Loaded the same rules into our AI coding tools, so generated code follows the standards by default instead of being corrected afterward.",
            "Result: design is no longer a bottleneck. The full seven-person team can build production-quality interfaces, and outside design help is rarely needed.",
          ],
        },
        {
          heading: "Product",
          bullets: [
            "Define what gets built: synthesize customer feedback, write product briefs, and set direction with the leadership team.",
            "Prototype in real components rather than mockups, so we test near-final work and iterate faster. About 80% of the frontend code I build in prototype reaches production.",
            "Interview customers and non-customers to check that features hold up beyond our existing base.",
            "Represent design and customer needs in company leadership meetings, reporting to the President/COO.",
          ],
        },
        {
          heading: "Design and delivery",
          bullets: [
            "Design and build features directly in the product codebase; review and approve frontend pull requests across the team.",
            "Rebuilt the entire web application from a legacy codebase onto Next.js, TypeScript, and Tailwind, page by page, against the component library.",
            "Set a distinct approach per platform: mobile-first web, React Native for iOS and Android, and a Windows app designed around native notifications.",
          ],
        },
      ],
    },
    {
      org: "Modern Trailhead",
      location: "Seattle, WA",
      period: "Dec 2016 – Present",
      note: "Design Engineer & Digital Consultant | Owner (concurrent)",
      bullets: [
        "Design and build websites end to end — strategy, interface design, frontend implementation.",
        "Clients include Brooks Running, Shake Shack, Seabourn Cruise Lines, Chateau Ste. Michelle, Car Toys.",
      ],
    },
    {
      org: "Clean Energy Transition Institute",
      location: "Seattle, WA",
      period: "Dec 2017 – Aug 2021",
      note: "Digital Communications Manager (contract)",
      bullets: [
        "Led digital communications, web presence, and data storytelling for a clean energy research nonprofit.",
      ],
    },
  ] satisfies Position[],

  /** Ships alongside the Vimocity entry; kept separate so it can be reordered. */
  selectedWork: [
    {
      title: "Login and account creation",
      detail:
        "Replaced three platform-specific flows with one web-based flow, added multi-factor authentication. Cut login and account-access support tickets by 80%.",
      slug: "login",
    },
    {
      title: "Content discovery",
      detail:
        "New browse page plus video and playlist detail pages. Improved content relevance by 35%.",
    },
    {
      title: "Safety campaigns",
      detail:
        "Tools for safety leads to send targeted content across their organization. Improved content access 5x.",
    },
    {
      title: "Challenges",
      detail:
        "Personal, team, and leaderboard challenges across mobile, web, and desktop.",
      slug: "challenges",
    },
    {
      title: "Desktop movement app",
      detail:
        "Windows app delivering personalized movement reminders on a schedule people set themselves.",
    },
    {
      title: "Playlists",
      detail:
        "Custom content collections, shareable and embeddable in company intranets. Also used by sales to build industry-specific collections for prospects.",
    },
  ],

  education: [
    {
      school: "University of Washington",
      detail: "BA, International Development; Minor, Spanish",
    },
  ],
} as const;
