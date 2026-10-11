/**
 * Every UI string on the public site, in English.
 *
 * This file is the source of truth for interface copy: labels, headings, page
 * intros, the hero, the homepage tiles. Long-form writing — case studies and
 * the colophon — is MDX under `src/content/`, one file per locale.
 *
 * Its shape is the contract for every other locale. A translation is typed as
 * `Messages`, so a missing or misnamed key is a build error rather than a blank
 * on the page.
 *
 * Strings marked "rich" may contain `<code>`, `<strong>`, and `<em>`, rendered
 * by `components/rich-text.tsx`. Nothing else is interpreted.
 */

export const en = {
  site: {
    role: "Design engineer",
    lede: "I design products and write the frontend code they’re built from.",
    /** Rendered in order, as written. */
    spec: [
      { label: "Focus", value: "Design systems, product design, frontend" },
      { label: "Stack", value: "TypeScript, React, Next.js, Tailwind" },
      { label: "Platforms", value: "Web, iOS, Android, Desktop" },
      { label: "Based", value: "Seattle, Washington" },
    ],
    linkLabels: {
      linkedin: "LinkedIn",
      vimui: "VimUI — design system",
    },
  },

  chrome: {
    skipLink: "Skip to content",
    footer: "Designed and built by me",
    /**
     * The one contact method, on every page. LinkedIn only: no email address
     * on the site, and no contact form to maintain. See issue #1.
     */
    contact: "LinkedIn",
    /** The public repository this site is built from. */
    source: "Source",
    opensInNewTab: "(opens in a new tab)",
  },

  header: {
    breadcrumb: "Breadcrumb",
    home: "CS — Caleb Smith, home",
    /** Labels for top-level segments. Anything absent falls back to the segment. */
    segments: {
      work: "Work",
      "style-guide": "Style guide",
      colophon: "Colophon",
      experience: "Experience",
      "sign-in": "Sign in",
    } as Record<string, string>,
    work: "Work",
    workMenu: "Case studies",
    controls: "Site controls",
    appearance: "Appearance",
    appearanceSettings: "Appearance settings",
    styleGuideLink: "Style guide: tokens, type, and contrast →",
    inspect: "Inspect",
    /** The language toggle. Its own label is written in the target language. */
    language: "Language",
  },

  themeSwitcher: {
    theme: "Theme",
    mode: "Mode",
    themes: { default: "Default", ember: "Ember", contrast: "High contrast" },
    modes: { system: "System", light: "Light", dark: "Dark" },
  },

  inspector: {
    title: "Inspector",
    description: "What each element is, and which tokens it resolves to.",
    component: "Component",
    element: "Element",
    inside: "inside",
    tokens: "Tokens",
    noToken: "no token",
    type: "Type",
    family: "Family",
    size: "Size",
    weight: "Weight",
    leading: "Leading",
    rule: "Rule",
    empty: "Hover or tab to any element to inspect it.",
    exit: "Esc to exit",
    faces: { display: "Archivo — display", body: "IBM Plex Mono — body" },
    properties: {
      "background-color": "Surface",
      color: "Text",
      "border-top-color": "Border",
      "outline-color": "Ring",
    } as Record<string, string>,
    /**
     * What governs each component. Only slots with a rule worth stating are
     * listed; the rest report their tokens and nothing invented.
     */
    rules: {
      button:
        "Every variant pairs a surface with its foreground. Minimum target 44px, enforced in the component.",
      badge:
        "Pairs only — a badge never sets a foreground its surface doesn’t own.",
      card: "Carries text-card-foreground with its background, so nested content inherits a legible color.",
      "card-title": "Display face, balanced wrapping, no color of its own.",
      "card-description": "muted-foreground on the card surface.",
      "spec-list":
        "A <dl>, not a table — term and description, not tabular data.",
      "spec-row": "Label in muted-foreground, value in foreground.",
      "status-dot":
        "Decorative: aria-hidden, visible at rest, no-op under reduced motion. The label carries the meaning.",
      "control-bar":
        "Ghost by design — no border against the header’s own rule. Grouped by proximity and announced once.",
      "control-button":
        "Instrument, not navigation. Inset focus ring so it never spills past the header.",
      "control-toggle":
        "aria-pressed, because it turns a page mode on rather than submitting a value.",
      "site-header":
        "Two zones: the path is plain text, the instruments are controls.",
      "theme-switcher":
        "Radio inputs, so arrow-key navigation and correct announcements come from the platform.",
      "case-study-card":
        "Filled surface plus an accent label — the label survives the single-column collapse a border would not.",
      "pointer-card": "Unfilled, so navigation never reads as work.",
      tabs: "Segmented tabs: arrow keys move between views, and every view stays in the page, hidden rather than removed, so it still works without JavaScript.",
      "bento-tile":
        "Span follows content weight; hierarchy also carried by type scale.",
    } as Record<string, string>,
  },

  home: {
    hero: {
      question: "What else would you like to know?",
      /**
       * The chips are first person, in Caleb's voice — the question above them
       * addresses the visitor, but these are things he can tell you about
       * himself. Link titles must match the case study's own title; the
       * integrity test checks it.
       */
      prompts: [
        {
          id: "built",
          question: "What have I built lately?",
          answer:
            "VimUI, Vimocity’s design system: 50+ web components on shared tokens, documented where anyone can try them.",
          link: {
            href: "/work/vimui",
            kind: "Case study",
            title: "VimUI: Vimocity’s design system, built in code",
          },
        },
        {
          id: "different",
          question: "Why a design engineer?",
          // The middle sentence says what someone else ends up with, not what the
          // work feels like. "There's nothing to interpret" described a quality of the
          // artefact and left the reader to work out why that was worth anything;
          // "engineering gets working code to wire up instead of a design to rebuild"
          // names the job that stops happening. Concrete, and checkable by anyone who
          // has done the rebuilding.
          //
          // The 80% is the share of the frontend code he prototypes that reaches
          // production, in the same words as the résumé. One number, one meaning:
          // see CLAUDE.md.
          answer:
            "I spent years in Figma and rarely open it now. I design in real components, so engineering gets working code rather than a spec to rebuild. About 80% of the frontend code I prototype reaches production.",
          link: {
            href: "/work/guardrails",
            kind: "Case study",
            title:
              "Design guardrails: Keeping AI-written code on the design system",
          },
        },
        {
          id: "how",
          question: "How do I work?",
          // Answers the question asked, in order, with the endpoints named. Earlier
          // drafts opened on a category ("most of the product development cycle",
          // "the front half of the double diamond") and made the reader decode the
          // label before reaching the content. "From idea to working code" is the
          // same claim as a thing you can picture.
          //
          // The closing line names who else is in it. A list of everything one person
          // covers reads as a lone operator without it, which is the wrong impression
          // to leave with a hiring manager and not what actually happens.
          //
          // "Deciding what gets built" moved out of the list and into that sentence.
          // It was sitting among the steps he executes, but it is the one thing here
          // he does not do alone — putting it in the collaboration clause is both
          // more accurate and stops "what gets built" and "worth building" from
          // saying the same thing twice.
          //
          answer:
            "I take features 0→1: research, strategy, testing with customers, then the frontend in working code. I decide what’s worth building with product managers, engineers, and leadership.",
          link: null,
          // No link. Challenges is a case study about designing for repeat behavior,
          // which is not what this answer is about, and no other page argues this
          // particular point yet.
        },
        {
          id: "overengineered",
          question: "Anything overengineered here?",
          // The one question that isn't about the job — and the answer is
          // literally true. The hero types itself, reserves its height so the
          // page never jumps, announces the finished sentence once to screen
          // readers, and has a no-JavaScript fallback. Humor that is also a
          // receipt for the craft.
          answer:
            "This, probably. The answer types itself, holds the page still while it does, reads to screen readers as one sentence, and works with JavaScript off. I regret nothing.",
          link: {
            href: "/colophon",
            kind: "Colophon",
            title: "How this site is built, and why",
          },
        },
      ] as {
        id: string;
        question: string;
        answer: string;
        link: { href: string; kind: string; title: string } | null;
      }[],
    },
    scrollCue: "See my work",
    /** The work section: what Vimocity is, then the case studies as cards. */
    work: {
      heading: "Vimocity",
      /** What Vimocity is, and what the product team is working toward. */
      intro:
        "We are a workplace health and safety platform built for utility companies. I lead product design on the features and tools that safety leaders use to keep their crews safe.",
    },
    pointers: {
      vimui: {
        eyebrow: "Storybook",
        title: "VimUI, live",
        description:
          "Vimocity’s public design system: 50+ components on shared tokens.",
      },
      practice: {
        eyebrow: "Studio",
        title: "Modern Trailhead",
        description:
          "My studio since 2016: websites, video, and photo for brands like Brooks Running and Shake Shack.",
      },
      colophon: {
        eyebrow: "About this site",
        title: "Colophon",
        description:
          "The stack, the alternatives that lost, and what each choice cost.",
      },
      source: {
        eyebrow: "About this site",
        title: "Source code",
        description: "The components, tokens, and checks behind this site.",
      },
      styleGuide: {
        eyebrow: "About this site",
        title: "Style guide",
        description:
          "Every token and component, measured live in your current theme.",
      },
      linkedin: {
        eyebrow: "Profile",
        title: "LinkedIn",
        description: "My background and roles, in full.",
      },
    },
    tldr: {
      heading: "TL;DR about me",
      // Vimocity comes first: VimUI is a system built *there*, not a product of
      // his own, and naming the employer is what makes that legible. What
      // Vimocity is was said once already, in the work section's intro.
      paragraphs: [
        "I’m a design engineer and product design manager at Vimocity. My biggest project is VimUI, the design system I built, with the standards and automated checks that keep our design and code in sync.",
        "Nine years in design, five writing production frontend.",
      ],
      cta: "My experience →",
    },
  },

  /** Labels drawn inside the case study diagrams in components/diagrams/. */
  diagrams: {
    deviceHandoff: {
      label:
        "A magic link opens on the phone that received the email, leaving the shared terminal signed out. A six-digit code can be read on the phone and typed on the terminal.",
      phone: "Phone",
      emailArrives: "email arrives here",
      terminal: "Shared terminal",
      signingIn: "signing in here",
      linkOpens: "Magic link opens on the phone.",
      staysSignedOut: "The terminal stays signed out.",
      code: "Six-digit code: read here, typed there",
    },
    systemReach: {
      label:
        "Tokens reach all four platforms, but only the web portal reads them directly; iOS, Android, and Windows get them copied by hand. The VimUI component library reaches the web portal alone, and the other three carry their own components. Login and account creation are the exception: they run in a webview, so real VimUI components render on all four platforms.",
      title: "WHAT REACHES WHICH PLATFORM",
      columns: {
        web: "Web portal",
        ios: "iOS",
        android: "Android",
        windows: "Windows",
      },
      separateCodebases: "React Native and Electron — separate codebases",
      oneCodebase: "one codebase",
      sourceOfTruth: "source of truth",
      copiedByHand: "copied by hand",
      vimui: "VimUI",
      itsOwn: "its own",
      tokens: { name: "Tokens", note: "color, type, spacing" },
      components: { name: "Components", note: "50+, React and Radix" },
      login: { name: "Login & account", note: "runs in a webview" },
    },
    loginEverywhere: {
      label:
        "The same Vimocity login screen in three places: the web portal in a browser, the iOS and Android apps through a webview, and V-minder, the Windows app.",
      url: "portal.vimocity.com",
      appTitle: "V-minder",
      web: "Web portal",
      mobile: "iOS and Android apps",
      mobileNote: "through a webview",
      desktop: "V-minder, the Windows app",
    },
    enforcement: {
      label:
        "One design standard, checked at three points in a change. While the code is written, the coding agent starts from the repository rules. Mid-build, anyone can run the design-audit skill, which says what to fix. Before merge, lint rules run on every push: errors block the merge, and warnings flag a deliberate exception for review.",
      title: "WHERE THE STANDARD IS CHECKED",
      change: "A change, from prompt to merge",
      /** Each `note` is drawn as lines, about 26 characters each at most. */
      stages: [
        {
          when: "While writing",
          what: "Agent rules",
          note: ["Rules the coding agent", "reads before it writes"],
        },
        {
          when: "Mid-build",
          what: "Design-audit skill",
          note: ["A checklist anyone runs", "that says what to fix"],
        },
        {
          when: "Before merge",
          what: "Lint gate",
          note: ["Every push, any author"],
        },
      ],
      error: "Error: blocks merge",
      warning: "Warning: flags for review",
    },
    challengeRun: {
      label:
        "One challenge, start to finish. The admin sets it up and publishes it, and the invitation goes out. While it runs, reminder emails go out on their own and raffle entries build up per participant. When it ends, the admin draws the raffle winner and marks it complete, and a results email names the winner.",
      title: "ONE CHALLENGE, START TO FINISH",
      admin: "Admin does",
      automatic: "Happens on its own",
      phases: { setup: "Setup", run: "Challenge runs", end: "Ends" },
      setup: "Set up and publish",
      draw: "Draw the raffle winner",
      complete: "Mark complete",
      invitation: "Invitation",
      reminders: "Reminders",
      results: "Results, with winner",
      entries: "Raffle entries, per participant",
    },
    pageByPage: {
      label:
        "The web portal rebuild, one page at a time. Claude Code reads a legacy page’s logic, API calls, and data. The page is rebuilt from VimUI against the same APIs, checked by the guardrails, then reviewed and hardened by engineering before it goes live. Then the next page.",
      title: "EVERY PAGE, ONE AT A TIME",
      from: "Legacy web portal",
      to: "One codebase",
      next: "next page",
      /** Each `note` is drawn as lines, about 18 characters each at most. */
      steps: [
        { what: "Read", note: ["Claude Code maps", "logic, APIs, data"] },
        { what: "Rebuild", note: ["From VimUI,", "same APIs"] },
        { what: "Check", note: ["Guardrails,", "automatically"] },
        { what: "Review", note: ["Engineering", "hardens it"] },
      ],
    },
    workday: {
      label:
        "An example workday with V-minder, weekdays from 9 AM to 5 PM with a move every hour: eight scheduled moves, standing and seated in turn. The 11 AM move is snoozed for 15 minutes, and one extra standing move is played off schedule in the afternoon.",
      title: "AN EXAMPLE WORKDAY",
      setting: "Weekdays, 9 AM to 5 PM, a move every hour",
      hours: ["9 AM", "11 AM", "1 PM", "3 PM", "5 PM"],
      snoozed: "Snoozed 15 min",
      offSchedule: "Played off schedule",
      standing: "Standing move",
      seated: "Seated move",
      total: "8 moves a day, set by the user",
    },
    teamScoring: {
      label:
        "On an example day, a crew of five with all five completing scores 100. A team of fifty with forty-five completing scores 90. A crew of four, below a minimum of five, scores at most 80.",
      title: "EXAMPLE DAY OF A LEADERBOARD CHALLENGE",
      crew5: "Crew of 5",
      completed5: "5 of 5 completed",
      team50: "Team of 50",
      completed45: "45 of 50",
      crew4: "Crew of 4",
      minimum: "minimum is 5",
      placeShort: "4 of 4, but a place short",
      pts: "pts",
      max: "max",
    },
  },

  /**
   * Over a locked screenshot from inside Vimocity's app, for visitors without
   * an access link. It should read as something worth asking for.
   */
  gated: {
    title: "This design is restricted",
    note: "Available to hiring teams on request.",
    ask: "Request access on LinkedIn",
  },

  caseStudy: {
    moreWork: "More of my work",
    loading: "Loading case study",
    /** The why, in product terms: one line each, from the frontmatter. */
    userValue: "User value",
    businessValue: "Business value",
    stack: "Stack",
    connects: "Related case studies",
    keyResult: "Key result",
    /**
     * Who each case study serves, from its `area` frontmatter: shown as a
     * small label on its card, so the cards read as groups without headings.
     */
    areas: {
      workers: "Workers",
      "desk-workers": "Desk-based workers",
      "safety-leaders": "Safety leaders",
      admins: "Admins",
      identity: "Identity",
      platform: "Platform",
    } as Record<string, string>,
  },

  experience: {
    title: "Experience",
    print: "Print / Save as PDF",
    sections: {
      summary: "Summary",
      skills: "Skills",
      experience: "Experience",
      selectedWork: "Selected work",
      education: "Education",
    },
  },

  notFound: {
    eyebrow: "404",
    title: "That page doesn’t exist",
    body: "The link may be out of date, or I may have moved something. Neither is your fault.",
    home: "Back to the homepage →",
    work: "Or see my work",
  },

  signIn: {
    title: "Sign in",
    body: "This part of the site is just for me.",
    github: "Continue with GitHub",
  },

  colophon: {
    metaTitle: "How this site is built",
    metaDescription:
      "The architecture behind this site — the alternatives that lost, and what each choice cost.",
    eyebrow: "Colophon",
    title: "How this site is built, and why",
    intro:
      "A stack list says what I installed. This says what the alternatives were, and what each choice cost.",
    chosen: "Chosen",
    rejected: "Rejected",
  },

  styleGuide: {
    title: "Style guide",
    metaDescription:
      "The tokens, type, and components this site is built from — measured live, in whichever theme you are viewing.",
    intro:
      "Every color on this site comes from a token, and every token pair is measured. Switch themes or modes and the numbers below update — including the ones that would fail. Components are rendered from the same library the site is built from, so nothing here is a screenshot.",
    nav: "Style guide sections",
    sections: {
      theme: "Theme",
      color: "Color",
      contrast: "Contrast",
      typography: "Typography",
      motion: "Motion",
      components: "Component playground",
      rules: "Rules",
    },
    /** rich */
    theme:
      "Three themes across light and dark, applied with <code>data-theme</code> and <code>data-mode</code> on <code>&lt;html&gt;</code>. Each is the same token names with different values, which is what makes the high-contrast theme a value swap rather than a rewrite. The preference is a cookie, read by a script before first paint — no browser storage, no flash.",
    /** rich */
    color:
      "Colors are not a flat palette. Every surface has a paired foreground, so a component written as <code>bg-card text-card-foreground</code> is legible in every theme without anyone remembering which color goes where. Values below are read from the running page.",
    contrast:
      "Contrast is measured between a surface and the text or icon drawn on it, not between individual colors. WCAG AA requires 4.5:1 for body text and 3:1 for large text. AAA requires 7:1. The high-contrast theme is built to clear AAA on every pair.",
    /** rich */
    contrastNote:
      "The same math runs at build time in <code>npm run check:contrast</code>, reading <code>globals.css</code> directly, so this page and the gate cannot disagree. Note that <code>--ck-border</code> is not held to 3:1: WCAG 1.4.11 governs control boundaries, not decorative hairlines, which is why <code>--ck-input</code> exists separately.",
    typography:
      "Archivo carries display type — headings and the name. IBM Plex Mono carries everything else: body copy, labels, tables, UI. The inversion of the usual serif-on-cream portfolio is deliberate.",
    typeSamples: {
      display: {
        label: "Display · Archivo 600",
        sample: "Design systems and the standards behind them",
      },
      heading: {
        label: "Heading · Archivo 600",
        sample: "VimUI: Vimocity’s design system, built in code",
      },
      body: {
        label: "Body · IBM Plex Mono 400",
        sample:
          "I design products and write the frontend code they’re built from.",
      },
      label: {
        label: "Label · IBM Plex Mono 400, uppercase, 0.14em",
        sample: "Selected work",
      },
    },
    /** rich */
    motion:
      "Three durations and one easing curve, read from the running page. Motion is set once for the whole system, so it stays consistent, and honoring <code>prefers-reduced-motion</code> is a single rule instead of a promise repeated in every component.",
    /** rich */
    components:
      "cksUI — this site’s component library. Built on shadcn/ui’s patterns as source copied in and owned, not as an installed dependency, with every value rewritten onto the tokens above. Every component declares a <code>data-slot</code>, the same convention VimUI uses.",
    inspectorEyebrow: "Try the inspector",
    /** rich */
    inspectorBody:
      "Hit <strong>Inspect</strong> in the header and point at anything on this page — or tab through it, which works the same way. It reports the component, the tokens its rendered values resolve back to, and the rule behind them.",
    /** rich */
    inspectorNote:
      "Values are read with <code>getComputedStyle</code> and resolved <em>backwards</em> to token names, so it reports on the token layer rather than dumping CSS. Anything resolving to no token is a violation of the rule in <code>CLAUDE.md</code>, and the panel says so rather than hiding it.",
    /** rich */
    playgroundNote:
      "The source panel is not a code sample kept beside a demo. Each specimen is one tree, projected twice — once through <code>createElement</code> into the components on the left, once through a printer into the JSX on the right. There is no way to write code here that renders something else, which is the same reason the contrast table reads <code>globals.css</code> instead of keeping its own palette.",

    /** rich */
    rulesIntro:
      "The standard everything above is held to. Each rule is written down for people in <code>CLAUDE.md</code>, loaded into the coding agent from the same file, and checked by a machine before anything merges — so it holds whether a person or an agent wrote the change.",
    /**
     * One row per rule: what it says, why it exists, and what enforces it.
     * `check` is a command or rule name, shown as code.
     */
    rules: [
      {
        title: "Colors come from tokens",
        why: "No hex, rgb, or palette colors in markup. A raw value is the one place a theme cannot reach.",
        check: "ck/no-raw-color",
      },
      {
        title: "Sizes come from the scale",
        why: "No pixel values written into a class. A one-off number is how two components end up a pixel apart.",
        check: "ck/no-arbitrary-px",
      },
      {
        title: "Every surface is drawn with a measured text color",
        why: "Any foreground will do, as long as the pair is one the contrast check measures. New tokens are not invented just to make a pair.",
        check: "ck/paired-surface",
      },
      {
        title: "Every pair clears WCAG AA",
        why: "AAA in the high-contrast theme. Measured in all three themes and both modes, from the same file the site is styled with.",
        check: "npm run check:contrast",
      },
      {
        title: "Components say what they are",
        why: "Every library component sets data-slot, so the inspector can name it and a reviewer can find it.",
        check: "ck/require-data-slot",
      },
      {
        title: "Words live in the dictionary, not the markup",
        why: "Pages read copy from the locale file; library components take it as props. That is what makes a translation a new file rather than a rewrite.",
        check: "ck/no-literal-copy",
      },
      {
        title: "Markup is accessible",
        why: "Semantic elements, keyboard-operable controls, real labels. The strict rule set, with no rules switched off to pass.",
        check: "jsx-a11y/strict",
      },
      {
        title: "One spelling, one number, nothing internal",
        why: "House spellings and repeated figures stay consistent, stock phrasing is flagged, and nothing private reaches this public repository: no ticket keys, workspace links, or email addresses.",
        check: "npm run check:copy",
      },
      {
        title: "Every page scores 100",
        why: "Accessibility, best practices, and SEO on Lighthouse’s mobile profile, on every pull request.",
        check: "npm run lighthouse",
      },
    ],
    rulesReview:
      "What a machine cannot judge is a checklist the design-review skill walks through before a change ships: whether a token is the right one, whether a layout holds at a breakpoint, and whether the empty and error states exist.",
    rulesSource: "Read the rules and the lint plugin on GitHub →",

    tokenTable: {
      pairs: "Surface and foreground pairs",
      structure: "Structure",
      labels: {
        background: "Page",
        card: "Card",
        muted: "Muted",
        primary: "Primary",
        accent: "Accent",
        border: "Border",
        input: "Input",
        ring: "Ring",
      } as Record<string, string>,
      notes: {
        border: "Decorative hairline",
        input: "Control boundary · 3:1",
        ring: "Focus indicator · 3:1",
      } as Record<string, string>,
    },

    contrastTable: {
      measuring: "Measuring the current theme…",
      caption:
        "Contrast ratio of each token pair in the current theme, with WCAG AA and AAA results",
      /** Keyed `surface/foreground`, matching lib/contrast.ts. */
      pairs: {
        "background/foreground": "Background / text",
        "card/card-foreground": "Card / text",
        "muted/muted-foreground": "Muted / text",
        "primary/primary-foreground": "Primary / text",
        "accent/accent-foreground": "Accent / text",
        "background/muted-foreground": "Background / secondary text",
        "background/input": "Background / control edge",
        "background/ring": "Background / focus ring",
      } as Record<string, string>,
      pair: "Pair",
      ratio: "Ratio",
      pass: "Pass",
      /** `{floor}` is replaced with the required ratio. */
      fail: "Fail · needs {floor}:1",
    },

    motionPanel: {
      durations: {
        fast: {
          name: "Fast",
          use: "Hover and focus. Anything answering a pointer that is still moving.",
        },
        base: {
          name: "Base",
          use: "State changes you look at: a card’s glow, a skeleton handing off.",
        },
        slow: {
          name: "Slow",
          use: "Entrances, where content travels furthest.",
        },
      },
      scale: "Duration scale",
      easing: "Easing",
      /** `{ease}` is replaced with the curve. */
      easingLabel: "The easing curve, {ease}, plotted against a straight line",
      easingNote:
        "Steep early, settling late: things move off quickly and arrive gently, so the interface answers at once without lurching. The dashed line is linear, for comparison.",
      reduced: "Reduced motion",
      reducedOn: "On — this browser is asking for less motion",
      reducedOff: "Off — this browser accepts motion",
      reducedBody:
        "When this is on, every animation on this site jumps to its finished state: the underline is drawn, the card is visible, and the skeleton hands off without sliding. Content never depends on an animation to become readable.",
      reducedHero:
        "The typewriter in the hero matters most. Under reduced motion it never starts, because a timer firing forty times a second is still motion, even when nothing appears to move.",
    },

    playground: {
      component: "Component",
      rendered: "Rendered",
      renderedLabel: "Rendered component",
      source: "Source",
      nothingToConfigure: "Nothing to configure — see the note below.",
    },
  },
};

export type Messages = typeof en;
