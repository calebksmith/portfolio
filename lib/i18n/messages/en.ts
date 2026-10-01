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
    lede: "I design products and write the frontend code they're built from.",
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
        "Pairs only — a badge never sets a foreground its surface doesn't own.",
      card: "Carries text-card-foreground with its background, so nested content inherits a legible color.",
      "card-title": "Display face, balanced wrapping, no color of its own.",
      "card-description": "muted-foreground on the card surface.",
      "spec-list":
        "A <dl>, not a table — term and description, not tabular data.",
      "spec-row": "Label in muted-foreground, value in foreground.",
      "status-dot":
        "Decorative: aria-hidden, visible at rest, no-op under reduced motion. The label carries the meaning.",
      "control-bar":
        "Ghost by design — no border against the header's own rule. Grouped by proximity and announced once.",
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
          question: "What have I built recently?",
          answer:
            "VimUI — Vimocity's design system. 50+ web components, fully tokenized with Tailwind CSS and documented in Storybook.",
          link: {
            href: "/work/vimui",
            kind: "Case study",
            title: "VimUI, a design system in code",
          },
        },
        {
          id: "different",
          question: "What makes me different?",
          // The middle sentence says what someone else ends up with, not what the
          // work feels like. "There's nothing to interpret" described a quality of the
          // artefact and left the reader to work out why that was worth anything;
          // "engineering gets working code to wire up instead of a design to rebuild"
          // names the job that stops happening. Concrete, and checkable by anyone who
          // has done the rebuilding.
          //
          // The 80% is the hit rate — how often a prototype ships — matching the
          // résumé and the LinkedIn role description. It is a claim about judgment
          // rather than about how far he takes the build.
          answer:
            "I spent years in Figma and rarely open it now. I design in real components, so engineering gets working code rather than a spec to rebuild. About 80% of what I prototype ships.",
          link: {
            href: "/work/guardrails",
            kind: "Case study",
            title: "Design rules that enforce themselves",
          },
        },
        {
          id: "how",
          question: "What's my process?",
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
          // "Other product managers" — he is one, per the TL;DR. One word, and it
          // stops the sentence from reading as a designer consulting a different
          // department.
          answer:
            "I take features 0→1 — idea, research, strategy, testing with customers, then building the frontend in working code. I work closely with other product managers, backend developers, and leadership to decide what's worth building.",
          link: null,
          // No link. Challenges is a case study about designing for repeat behavior,
          // which is not what this answer is about, and no other page argues this
          // particular point yet.
        },
      ] as {
        id: string;
        question: string;
        answer: string;
        link: { href: string; kind: string; title: string } | null;
      }[],
    },
    scrollCue: "Check out some of my work",
    caseStudyCard: { kind: "Case study", read: "Read case study →" },
    pointers: {
      vimui: {
        eyebrow: "Storybook",
        title: "VimUI, live",
        description:
          "Vimocity's design system, public — 50+ web components on shared tokens.",
      },
      practice: {
        eyebrow: "Practice",
        title: "Modern Trailhead",
        description:
          "The consultancy I have run alongside full-time work since 2016 — client websites, and video and photo for brands including Brooks Running and Shake Shack.",
      },
      colophon: {
        eyebrow: "About this site",
        title: "Colophon",
        description:
          "The stack, the alternatives that lost, and what each choice cost.",
      },
      styleGuide: {
        eyebrow: "About this site",
        title: "Style guide",
        description:
          "Tokens, type, and every component — measured live, in whichever theme you are viewing.",
      },
      linkedin: {
        eyebrow: "Profile",
        title: "LinkedIn",
        description: "Background, roles, and the longer version of all this.",
      },
    },
    tldr: {
      heading: "TL;DR about me",
      // Vimocity comes first: VimUI is a system built *there*, not a product of
      // his own, and naming the employer is what makes that legible.
      paragraphs: [
        "I’m a design engineer and product manager at Vimocity, a workplace health and safety platform based in Seattle. I lead design there. I built our design system — VimUI — and I maintain the standards and automated checks that keep our design and code in sync.",
        "Nine years in design, five writing production frontend.",
      ],
      cta: "My experience →",
    },
  },

  /** Labels drawn inside the case study diagrams in components/diagrams/. */
  diagrams: {
    deviceHandoff: {
      label:
        "A magic link opens on the phone that received the email, leaving the work machine signed out. A six-digit code can be carried across to it.",
      phone: "Phone",
      emailArrives: "email arrives here",
      workMachine: "Work machine",
      signingIn: "signing in here",
      linkOpens: "Magic link opens on the phone",
      staysSignedOut: "The other machine stays signed out.",
      code: "Six-digit code, read here and typed there",
    },
    systemReach: {
      label:
        "Tokens reach all four platforms, but only the web app reads them directly — iOS, Android, and Windows get them copied by hand. The VimUI component library reaches the web app alone; the other three carry their own components. Login and account creation are the exception: they run in a webview, so real VimUI components render on all four platforms.",
      title: "WHAT REACHES WHICH PLATFORM",
      columns: {
        web: "Web app",
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
    teamScoring: {
      label:
        "A crew of five with all five completing scores 100 for the day. A team of fifty with forty-five completing scores 90. A crew of four, below a minimum of five, scores at most 80.",
      title: "ONE DAY OF A LEADERBOARD CHALLENGE",
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

  caseStudy: {
    moreWork: "More of my work",
    loading: "Loading case study",
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
    work: "Or read some work",
  },

  signIn: {
    title: "Sign in",
    body: "This area is restricted to the site owner.",
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
        sample: "VimUI, a design system in code",
      },
      body: {
        label: "Body · IBM Plex Mono 400",
        sample:
          "I design products and write the frontend code they're built from.",
      },
      label: {
        label: "Label · IBM Plex Mono 400, uppercase, 0.14em",
        sample: "Selected work",
      },
    },
    /** rich */
    motion:
      "Three durations and one easing curve, read from the running page. Motion here is a property of the system rather than a decision per component — which is what makes it consistent, and what makes honouring <code>prefers-reduced-motion</code> a single rule instead of a promise repeated in forty places.",
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
        why: "House spellings and repeated figures stay consistent, and nothing private — a ticket key, a workspace link, an email — reaches this public repository.",
        check: "npm run check:copy",
      },
      {
        title: "Every page scores 100",
        why: "Accessibility, best practices, and SEO on Lighthouse's mobile profile, on every pull request.",
        check: "npm run lighthouse",
      },
    ],
    rulesReview:
      "What a machine cannot judge — whether a token is the right one, whether a layout holds at a breakpoint, whether the empty and error states exist — is a checklist the design-review skill walks through before a change ships.",
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
          use: "State changes you look at — a card's glow, a skeleton handing off.",
        },
        slow: {
          name: "Slow",
          use: "Entrances. Content arriving has further to travel and more to say.",
        },
      },
      scale: "Duration scale",
      easing: "Easing",
      /** `{ease}` is replaced with the curve. */
      easingLabel: "The easing curve, {ease}, plotted against a straight line",
      easingNote:
        "Steep early, settling late. Things leave quickly and arrive gently, which is what makes an interface feel answerable rather than sluggish. The dashed line is linear, for comparison.",
      reduced: "Reduced motion",
      reducedOn: "On — this browser is asking for less motion",
      reducedOff: "Off — this browser accepts motion",
      reducedBody:
        "Every animation on this site collapses to its finished state when this is on. Not paused, and not hidden — the underline is drawn, the card is visible, the skeleton hands off without sliding. Content never depends on an animation to become readable.",
      reducedHero:
        "The typewriter in the hero is the case that matters most: it does not style the animation away, it never starts it. A timer firing forty times a second at someone who asked for stillness is still motion, even if nothing appears to move.",
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
