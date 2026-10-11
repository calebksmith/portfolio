import type { Resume } from ".";

/** The résumé in English. Shape and rules: see ./index.ts. */
export const en: Resume = {
  name: "Caleb Smith",
  title: "Design Engineer",
  location: "Seattle, WA",

  contact: [
    { label: "calebksmith.com", href: "https://calebksmith.com" },
    {
      label: "linkedin.com/in/calebksmith",
      href: "https://www.linkedin.com/in/calebksmith",
    },
    {
      label: "github.com/calebksmith/portfolio",
      href: "https://github.com/calebksmith/portfolio",
    },
  ],

  summary:
    "I lead product design at Vimocity, a workplace health and safety platform for utility companies, working cross-functionally to build features our customers love. My background spans video production, motion graphics, and UX/UI design, and I build what I design, from first prototype to the shipped product.",

  skills: [
    {
      label: "Design",
      items: [
        "Product design",
        "UX/UI",
        "Design systems",
        "Prototyping",
        "User research",
        "Accessibility",
      ],
    },
    {
      label: "Product",
      items: ["0→1 features", "Product briefs", "Roadmapping"],
    },
    {
      label: "Frontend",
      items: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind",
        "React Native",
        "Storybook",
      ],
    },
    {
      label: "Tools and AI",
      items: ["Figma", "Claude Code", "AI coding guardrails", "Design to code"],
    },
    {
      label: "Video and motion",
      items: ["Video production", "Motion graphics", "Photography"],
    },
    {
      label: "Platforms",
      items: ["Web", "iOS", "Android", "Windows"],
    },
  ],

  experience: [
    {
      org: "Vimocity",
      location: "Seattle, WA",
      period: "May 2021 – Present",
      note: "Workplace health and safety platform for utility companies · ~50,000 users across 75+ organizations",
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
            "Built VimUI and lead its growth: 50+ web components on shared tokens, documented in Storybook, with color and type tokens shared across iOS, Android, and Windows.",
            "Raised reusable component use from about 10% to 80–90% of frontend code, and design token use from 0% to 99%.",
            "Wrote and maintain the system’s standards, from tokens to accessibility, and ship it as versioned releases, with a beta before anything breaking.",
          ],
        },
        {
          heading: "Automation and AI tooling",
          bullets: [
            "Built automated checks that run before every merge, on the design system’s components and the product’s pages: tokens, accessibility, loading states, and breakpoints.",
            "Loaded the same rules into our AI coding tools, so generated code follows the standards from the start.",
            "Result: design is no longer a bottleneck, and the whole team can build production-quality interfaces.",
          ],
        },
        {
          heading: "Product",
          bullets: [
            "Define what gets built with the leadership team, reporting to the President/COO, from customer feedback to product briefs.",
            "Interview customers and non-customers to check that features hold up beyond our existing base.",
            "Prototype in real components, so we test near-final work. About 80% of the frontend code I prototype reaches production.",
          ],
        },
        {
          heading: "Design and delivery",
          bullets: [
            "Design and build features in the product codebase, and review frontend pull requests across the team.",
            "Rebuilt the web portal from a legacy codebase onto Next.js, TypeScript, and Tailwind, page by page, on VimUI.",
            "Set the approach per platform: mobile-first web, React Native for iOS and Android, and V-minder, a Windows app built around notifications.",
          ],
        },
        {
          heading: "Video and motion",
          bullets: [
            "Started as the multimedia designer, producing, editing, and adding motion graphics to Vimocity’s videos.",
          ],
        },
      ],
    },
    {
      org: "Modern Trailhead",
      href: "https://www.moderntrailhead.com",
      location: "Seattle, WA",
      period: "Dec 2016 – Present",
      note: "Owner · design and digital consulting (concurrent)",
      bullets: [
        "Design and build client websites end to end, from strategy to launch.",
        "Produce video and photo for brands including Brooks Running, Shake Shack, Seabourn Cruise Lines, Chateau Ste. Michelle, and Car Toys.",
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
  ],

  /** Ships alongside the Vimocity entry; kept separate so it can be reordered. */
  selectedWork: [
    {
      title: "Login and account creation",
      detail:
        "One sign-in for web, mobile, and desktop, with multi-factor authentication. Login and account-access support tickets fell 80%.",
      slug: "login",
    },
    {
      title: "Content discovery",
      detail:
        "New browse, video, and playlist pages. Content relevance improved 35%.",
    },
    {
      title: "Safety campaigns",
      detail:
        "Targeted content that safety leaders send across their organization. Content access improved 5x.",
    },
    {
      title: "Movement challenges",
      detail:
        "Leaderboard and individual target challenges across mobile, web, and desktop. Daily 5 completions rose 65% among participants.",
      slug: "challenges",
    },
    {
      title: "V-minder",
      detail:
        "A Windows app with movement breaks on a schedule people set themselves, and the highest engagement of any Vimocity product.",
      slug: "v-minder",
    },
    {
      title: "Playlists",
      detail:
        "Shareable, embeddable video collections, also used by sales to pitch prospects. Saves grew more than 4x from launch to peak.",
      slug: "playlists",
    },
  ],

  education: [
    {
      school: "University of Washington",
      detail: "BA, International Development; Minor, Spanish",
    },
  ],
};
