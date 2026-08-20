# Caleb Smith — Copy Deck
Site identity · Homepage · Experience · Case studies

Voice: plain, specific, active. Say what a thing does. No filler.

**Jargon that's fine to use:** double diamond, atomic design, generative and evaluative research, design tokens, component library.
**Avoid:** cva, semver, and similar library- or spec-level terms — use plain descriptions ("versioned releases," "style variants") instead.

---
---

# 1 · SITE IDENTITY

Lives in `lib/site.ts` and is read by the header, the hero, metadata, and the
footer. The coming-soon page these were written for has been deleted; the copy
outlived it.

**Name:** Caleb Smith
**Role line:** Design engineer

**Lede:**
> I design products and write the frontend code they're built from.

**Spec rows:**
| Label | Value |
|---|---|
| Focus | Design systems, product design, frontend |
| Stack | TypeScript, React, Next.js, Tailwind |
| Platforms | Web, iOS, Android, Desktop |
| Based | Seattle, Washington |

**Links:** LinkedIn · VimUI — design system

---
---

# 2 · HOMEPAGE

## Hero prompt

The hero states, then asks. The lede types itself, a question follows it, three
options appear, and the chosen answer is written back at an even pace — no
emphasis and no pauses inside a sentence.

**Opening statement** *(the lede from §2 — the eyebrow and the h1 above it
already carry the role and the name, so it does not repeat them):*
> I design products and write the frontend code they're built from.

**Question:**
> What else would you like to know?

The question addresses the visitor; the options are written in Caleb's voice, as
things he could tell you about himself. Keep that split — the options are what
gets answered, so they read in the voice of the answer.

All three open with "What", which is what makes them read as one set. "How do I
work?" was the third one and was replaced: it splits between "what is my method"
and "how do I function", and the answer only covers the first.

**Options and answers.**

The closing line names who else is in it. A list of everything one person covers
reads as a lone operator without it, which is the wrong impression to leave with
a hiring manager and not what actually happens. "Deciding what gets built" sits
in that clause rather than among the steps, because it is the one thing here
Caleb does not do alone.

"**Other** product managers" — he is one, per the TL;DR. Keep the word; without
it the sentence reads as a designer consulting a different department.

Two labels that were tried and dropped: "the front half of the double diamond"
(wrong — building in code belongs to the second diamond, so it contradicted the
last item in its own list) and "most of the product development cycle" (a
category the reader has to decode before reaching the content). Name the steps
and the endpoints; the shape is obvious from the list.

The 80% figure means one thing everywhere it appears: the hit rate — how often a
prototype reaches production. It is not a claim about how far the build is
taken. Keep it that way; the same number standing for two things across one
candidate's materials is what an interviewer picks at.

| Asked | Written back | Link under it |
|---|---|---|
| What have I built recently? | VimUI — Vimocity's design system. 50+ web components, fully tokenized with Tailwind CSS and documented in Storybook. | Case study — VimUI, a design system in code |
| What makes me different? | I'm a designer who rarely opens Figma. I design with prototypes that use real components, so engineering gets working frontend code to use rather than a design spec to rebuild. Currently, about 80% of what I prototype ships. | Case study — Design rules that enforce themselves |
| What's my process? | I take a feature from idea to working code: research, strategy, testing with customers, then building the frontend. I work closely with other product managers, backend developers, and leadership to decide what's worth building. | *(none)* |

Links name their destination rather than saying "read more" — a page's own
title is the only label that tells you where you are going before you click. An
answer with no page that follows from it gets no link at all, rather than being
pointed at the nearest one; a link that does not follow costs more than no link,
because it teaches the reader these are decorative.

Without JavaScript all three pairs render as a plain list instead.

## Scroll prompt

> Check out some of my work

## TL;DR about me

> I'm a design engineer and product manager at Vimocity, a workplace health and
> safety platform based in Seattle. My work is multifaceted, but mostly I lead design there. 
> I built our design system — VimUI — and I maintain the standards and automated checks 
> that keep our design and code in sync.
>
> Nine years in design, five writing production frontend.

**CTA:** My experience →

Not "the long version" and not "full résumé": naming a page's length is a
reason not to open it, and "résumé" is not the word this site uses.

## Section headings

Hierarchy is carried by the cards: case studies are filled surfaces with an
accent "Case study" label and a read affordance; pointers have no fill, a muted
eyebrow, and no CTA. That difference survives the collapse to one column on a
phone, which a heading does not.

## Footer, every page

> © Caleb Smith · Designed and built by me

---
---

# 3 · EXPERIENCE

The page is labelled **Experience** everywhere it is named — nav, page title,
and every link to it. `/resume` redirects to `/experience` permanently. The
underlying data module is still `lib/content/resume.ts`, because that is what
the records are; only the site's label for the page changed.

## CALEB SMITH
**Design Engineer**
Seattle, WA · linkedin.com/in/calebksmith

### SUMMARY

Product designer who works in code. In my current role at Vimocity, I lead design and define what gets built — customer research, product briefs, prototypes — and build the frontend in React and TypeScript. I built VimUI, the design system that keeps our platform visually aligned, and the automated checks that keep design and code in sync.

### SKILLS

**Design systems** — component libraries, design tokens, documentation and standards, versioned releases, multi-platform systems
**Frontend** — TypeScript, React, Next.js, Tailwind, React Native, Storybook, Git
**AI tooling** — automated design rules, AI coding guardrails, design-to-code workflows
**Product** — product definition and briefs, customer research, prototyping, 0–1 features, roadmap input
**Platforms** — mobile-first web, iOS, Android, Windows desktop
**Accessibility** — WCAG AA, keyboard operability, light and dark modes

### EXPERIENCE

**Vimocity** — Seattle, WA · May 2021 – Present
*Workplace health platform · ~50,000 users across 30+ organizations*
Design Engineer, Product Design Manager · Sep 2024 – Present
Product Designer · May 2022 – Aug 2024
Multimedia Designer · May 2021 – Apr 2022

**Design system**
- Built VimUI and lead its growth: 50+ web components on shared tokens, documented in Storybook. Color and type tokens carry across our iOS, Android, and Windows desktop apps.
- Raised reusable component use from about 10% to 80–90% of frontend code, and design token use from 0% to 99%.
- Wrote the standards that govern the system — structure, tokens, typing, accessibility, documentation, and versioning — and maintain them as the reference the whole team builds against.
- Run the system as a versioned package: semantic versioning, a changelog entry per change, and beta releases sent to the apps that consume it before anything breaking ships.

**Automation and AI tooling**
- Built automated checks that run before every merge, at two levels: rules governing how components are built in the design system, and rules governing how pages are built in the product — token use, accessibility, loading states, and responsive breakpoints.
- Loaded the same rules into our AI coding tools, so generated code follows the standards by default instead of being corrected afterward.
- Result: design is no longer a bottleneck. Anyone on our seven-person team can build prototypes that are nearly production-ready.

**Product**
- Define what gets built: synthesize customer feedback, write product briefs, and set direction with the leadership team.
- Prototype in real components rather than mockups, so we test near-final work and iterate faster. About 80% of the frontend code I build in prototype reaches production.
- Interview customers and non-customers to check that features hold up beyond our existing base.
- Represent design and customer needs in company leadership meetings, reporting to the President/COO.

**Design and delivery**
- Design and build features directly in the product codebase; review and approve frontend pull requests across the team.
- Rebuilt the entire web application from a legacy codebase onto Next.js, TypeScript, and Tailwind, page by page, against the component library.
- Set a distinct approach per platform: mobile-first web, React Native for iOS and Android, and a Windows app designed around native notifications.

**Selected work**
- **Login and account creation** — replaced three platform-specific flows with one web-based flow, added multi-factor authentication. Cut login and account-access support tickets by 80%.
- **Content discovery** — new browse page plus video and playlist detail pages. Improved content relevance by 35%.
- **Safety campaigns** — tools for safety leads to send targeted content across their organization. Improved content access 5x.
- **Challenges** — personal, team, and leaderboard challenges across mobile, web, and desktop.
- **Desktop movement app** — Windows app delivering personalized movement reminders on a schedule people set themselves.
- **Playlists** — custom content collections, shareable and embeddable in company intranets. Also used by sales to build industry-specific collections for prospects.

**Modern Trailhead** — Seattle, WA · Dec 2016 – Present
*Design Engineer & Digital Consultant | Owner (concurrent)*
- Design and build websites end to end — strategy, interface design, frontend implementation.
- Produce video, photos, and motion graphics used in the website I build and other platforms.
- Clients include Brooks Running, Shake Shack, Seabourn Cruise Lines, Chateau Ste. Michelle, Car Toys.

**Clean Energy Transition Institute** — Seattle, WA · Dec 2017 – Aug 2021
*Digital Communications Manager (contract)*
- Led digital communications, web presence, and data storytelling for a clean energy research nonprofit.

### EDUCATION
University of Washington — BA, International Development; Minor, Spanish

---
---

# 4 · CASE STUDIES

Each section below **mirrors the live page exactly**. Edit here and the edits get
applied to `src/content/work/*.mdx`; the pages are what ship, this is where they
are written.

Cross-references use the case study's title and a link, never a section number —
these are separate pages, and a reader on one of them cannot see a numbering
scheme that only exists in this document.

## Badges

Badges name tools and platforms, never concepts, and must be true of Caleb's own
work — a framework badge on a case study where engineers wrote the code reads as
a claim to have written it. Figma appears on the three he designed and handed
off; its absence on the other three is the chronology showing through.

| Case study | Badges |
|---|---|
| Design rules that enforce themselves | Claude Code Skills · ESLint · Design tokens |
| VimUI, a design system in code | Storybook · Tailwind CSS · shadcn/ui · Radix |
| Rebuilding the Vimocity web app | Web app · Next.js · Tailwind CSS · VimUI |
| One login for three platforms | Figma · WebView · SSO · MFA |
| Challenges, getting utility workers moving | Web app · Mobile · Figma |
| Challenge admin, tools so customers don't need us | Web app · Figma |

---

## 4.1 — Design rules that enforce themselves

*Design systems, AI tooling · 2025–2026*
*Badges: Claude Code Skills · ESLint · Design tokens · Weight: large*
*Page: `/work/guardrails` · Source: `src/content/work/guardrails.mdx`*

### Summary
*Shown on the card, under the page title, and in search results.*

One standard, enforced three ways — loaded into the agent, checkable on demand, and gated before merge. Built twice, for the product and for the component library.

### Page copy

## Problem

The product team needed features fast, and nearly everyone was leaning into the
vibe-coding wave. Most of what got built was internal tooling; some of it was
customer-facing. The features worked, and they shared nothing: different
repositories, different component libraries, patterns invented on the spot. None
of it could be integrated into the broader platform.

Even where a feature did use our design system, it used it wrong —
components applied incorrectly, raw colors in the code, typography off the
scale. The only thing catching any of it was me, reviewing everything. That made
design the bottleneck.

## What I did

Wrote the standard down and then made it hold, three ways, because a rule
enforced one way is a rule with a gap in it.

- **Loaded it into the agent.** Repository-level rules in the Claude Code file,
  so anyone working in the web app gets them by default — not just which
  components and tokens to use, but how a page is structured, how it connects to
  APIs, and what it has to do for accessibility. New pages come out in the right
  shape because the shape is what the agent was told.
- **Made it checkable on demand.** A design audit skill anyone can run while
  building or after finishing. It walks the requirements as a checklist and
  tells you what to fix, so you do not have to have memorised the standard to
  meet it.
- **Gated it before merge.** ESLint rules that run on push. Some are hard
  failures, some are recommendations — deliberately loosened where a guideline
  might be broken on purpose. This is also the part that covers code nobody
  generated: hand-written code gets the same treatment.

Then built the same three for the [VimUI repository](/work/vimui). Components have different
rules from pages — structure, typing, documentation, versioning — but the same
gap exists, so the same agent rules, review skill and lint gate run there. New
and updated components arrive in the right shape, which is cheaper than
reworking them later and safer than finding out in production.

## What the rules actually check

- Components and tokens are used, and used correctly.
- Repository structure and page layout follow the standard.
- Breakpoints match the style guidelines, so pages agree with each other.
- Loading states use skeletons rather than each page inventing one.
- Every page works at every breakpoint, not only the one it was built at.
- Pages are wired to the server-driven config, so copy changes ship without a
  release.
- Existing components are used before new ones are written — and when a local
  component gets reused, it is flagged as a candidate for the library rather
  than quietly becoming a second system.

## Outcome

Reviewing a feature used to be four steps and two people:

1. A designer designs it in Figma.
2. An engineer interprets the spec into code.
3. The designer reviews the frontend against the design.
4. The designer or PM checks whether the frontend rules were followed at all.

Steps three and four exist because of step two — the handoff is what introduces
the drift, and the review is how you find it afterwards. Now the person
designing and the person writing the frontend are the same, and the rules are
checked by the system rather than by someone remembering to look.

- Review shrank, and stopped depending on me being available.
- Anyone on the team can build a page that meets the standard, which is what
  made [rebuilding the web app](/work/platform-rebuild) possible at the speed it
  happened.
- The standard survives contact with an agent, because it was written for one.

## Why it matters

Most teams are adding AI to their workflow without deciding what "correct" means
first. Writing the standard is the hard part. Enforcing it — in the agent, on
demand, and at the gate — is what makes it scale.

### Editorial notes — not page copy

> **Scope.** Both repositories belong in this one case study — the claim is that the *pattern* generalises, and splitting it would halve one argument rather than make two.

> **Server-driven config: mention, do not explain.** It is a page-architecture decision the rules enforce, not a design guardrail.


---

## 4.2 — VimUI, a design system in code

*Design systems · 2022–present*
*Badges: Storybook · Tailwind CSS · shadcn/ui · Radix · Weight: large*
*Page: `/work/vimui` · Source: `src/content/work/vimui.mdx`*

### Summary
*Shown on the card, under the page title, and in search results.*

Vimocity's design system — 50+ web components on shared tokens, documented in Storybook, which replaced the Figma file as the source of truth.

### Page copy

## Problem

Vimocity ships a web app, iOS and Android apps, and a Windows desktop app. We
had brand colors, fonts, and a style guide, but over time each drifted into its
own patterns.

VimUI started in Figma, and for a while that worked: colors, typography, and
component usage guidelines all lived in one file. The cost showed up in
maintenance. Every change had to be made twice — once in the Figma file, then
again in the component code — and the second half meant pulling a developer off
their work to read the file, translate it, and cut a release. Designers had one
source of truth and engineers had another, and the gap between them was
measured in developer time.

## What I did

- Built 50+ components organized as atoms, molecules, and organisms, on
  shadcn/ui's patterns and Radix primitives — some staying close to the
  original, some rewritten entirely for what we needed.
- Established tokens for color, type, spacing, and sizing, and removed
  hardcoded values from the frontend.
- Made accessibility a property of the system rather than a per-feature task:
  keyboard support, contrast in light and dark modes, minimum touch targets, and
  reduced-motion support built into the components themselves.
- Set up versioned releases so consuming apps can test changes before they land.
- Retired the Figma file. Once we started prototyping in real components rather
  than mocking them up, the design file was a second copy of something that
  already existed — so Storybook became the source of truth for what a component
  is, how it is used, and what it does.

## Outcome

- Reusable component use went from about 10% to 80–90% of frontend code.
- Token use went from 0% to 99%. The remaining 1% is deliberate overrides.
- Changes are made once, in code, and released. There is no second artifact to
  update and no translation step between the two.
- Building a new page became assembly rather than construction.

## What it does and doesn't cover

The component library is the web app's. React Native and Electron need entirely
different components, and that library does not exist yet — the mobile and
desktop apps carry their own equivalents.

What all four platforms share is the tokens. Color and type come from the same
source everywhere, so the visual language is consistent even where the
components are not.

The exception is login and account creation, which run in a webview on desktop
and mobile — so those screens are running actual VimUI components on every
platform. That was a
[side effect of building login as one flow](/work/login), not a plan.

**See it:** the component library is public at
[vimui.vimocity.com](https://vimui.vimocity.com/main/).

### Editorial notes — not page copy

> **Platform coverage.** Components are the web app's. React Native and Electron carry their own equivalents. Tokens are shared across all four. The exception is [One login for three platforms](/work/login), which runs in a webview — so those screens are real VimUI everywhere. Do not write "50+ components across four platforms"; it was on ten pages and wrong on all of them.


---

## 4.3 — Rebuilding the Vimocity web app

*Frontend, platform migration · 2026*
*Badges: Web app · Next.js · Tailwind CSS · VimUI · Weight: medium*
*Page: `/work/platform-rebuild` · Source: `src/content/work/platform-rebuild.mdx`*

### Summary
*Shown on the card, under the page title, and in search results.*

Migrated every page of the Vimocity portal into our new monorepo — rebuilt on VimUI against the live APIs, using Claude Code to read the legacy logic page by page.

### Page copy

## Problem

New features were being built in a new monorepo. The web portal was not — it
sat on the old structure, and everything we wanted to improve there was blocked
behind a migration nobody had time to do. We were running two frontends that
looked and behaved like two different products.

That gap was not going to close on its own. Rebuilding meant every page:
the content library, challenges, movement routines, video collections,
user-created playlists, site settings, and user settings.

## What I did

- Loaded both repositories into Claude Code and had it read the old platform
  page by page — the logic, the API calls, and the database links each page
  actually depended on. Working out what a legacy page really does is most of
  the work in a migration, and it is exactly what an agent is good at.
- Rebuilt each page in the monorepo from [VimUI](/work/vimui) components and
  tokens, wired to the same APIs and database. Functional equivalence first:
  same behavior, same data, new foundation.
- Held the whole rebuild to the standards from my
  [guardrails work](/work/guardrails) — token use, component structure, and
  accessibility rules, checked automatically. The rules I had written for people
  turned out to be what made an agent's output reviewable.
- Redesigned the content library on the way through, into a searchable explore
  page. Migration was the opportunity to fix discovery rather than port a
  problem forward.
- Modernized the homepage and settings pages, which had accumulated patterns
  that no longer matched how anyone expects a web app to behave.
- Handed each rebuilt section to engineering to review and harden — an agent
  misreads things, and the review is what catches it.

## Outcome

- Every page of the portal is live on one codebase, consistent with the new
  features it used to sit beside.
- About 80% of the frontend code I built survived review into production.
  Backend calls and database queries were improved in the same pass — the
  migration was a chance to clean up old code, not just move it.
- The portal works on mobile web. VimUI components carry the responsive and
  accessibility work with them, and the old platform had neither.
- Changes no longer need me. A product manager or engineer can now change a
  page using VimUI and the design rules, without a designer or a frontend
  developer in the loop — which is the point of writing the rules down.
- Every value on every page resolves to a token, so a change to the system is a
  change to the product rather than a ticket to make it one.

### Editorial notes — not page copy

> **The 80%** is the same figure as the hero and the experience page: about 80% of the frontend code built in a prototype reaches production. One number, one meaning.

> **Claude Code leads deliberately** — it pairs with [Design rules that enforce themselves](/work/guardrails). The engineering-review bullet is what keeps it honest rather than "AI did the work."


---

## 4.4 — One login for three platforms

*Product design, cross-platform · 2025*
*Badges: Figma · WebView · SSO · MFA · Weight: medium*
*Page: `/work/login` · Source: `src/content/work/login.mdx`*

### Summary
*Shown on the card, under the page title, and in search results.*

Login and account-access support tickets dropped 80% — one flow replacing three, built so forgetting your password isn't a reset and forgetting your email isn't a dead end.

### Page copy

## Problem

Vimocity runs on web, mobile, and desktop, and each had its own login and
account creation flow. Three codebases meant three sets of bugs and three things
to update — and login was our most common support issue.

The tickets were specific. People could not remember their password, or could
not remember which email address their account was under. Neither is a security
problem; both were being treated like one.

Account creation had a different problem. Every customer organization gets in a
different way — single sign-on, an allowlist of company email addresses, or a
company-specific registration code — and no user knows which of those is theirs.
They knew the name of the company they worked for and nothing else about how
their account was supposed to exist.

## What I did

- Designed a single web-based login and account creation flow, surfaced inside
  the mobile and desktop apps through a webview, so all three platforms use the
  same one without duplicating it.
- Specified it as its own service rather than a feature of the web app, so
  mobile and desktop consume the same one instead of each carrying a copy. That
  consolidated three codebases into one.
- Kept the email. "Remember me" stores it, so the most common failure — not
  knowing which address the account is under — stops happening on the second
  visit.
- Stopped forcing password resets. If you cannot remember your password you get
  a code by email and you are in. Changing a password you have forgotten is a
  chore invented by the login screen, not a security requirement.
- Replaced "which registration type is yours?" with "who do you work for?" —
  the user picks their company from a list, and the flow they get is whatever
  their organization uses.
- Made that list safe to have. Nothing appears until three characters are typed,
  and the list is seeded with decoy names, so it cannot be used to enumerate who
  our customers are.
- Required email verification on account creation, by code.

Registrations came from the other half of this: an admin can see everyone in
their organization and send invitations to the people who have not signed up. I
designed that frontend too — it is the reason accounts get created rather than
merely being creatable.

## Outcome

- **Login and account-access support tickets dropped 80%.**
- Three flows became one to maintain, in one codebase, on one service.
- Consistent sign-in across every platform.
- Security improved — verification, MFA — without adding steps to the common
  path.

> **Why a code, not a magic link:** we designed the link first. It assumes the
> device reading the email is the device signing in, and for our users it often
> isn't — email on a phone, Vimocity on a work machine or a shared terminal. A
> six-digit code travels between devices. A link does not.

> **Trade-off worth naming:** a webview is not a native experience. We accepted
> slightly less native polish in exchange for one flow instead of three — the
> right call for a small team, and worth revisiting at a larger one.

Biometric sign-in was designed and prototyped, then cut to get the rest of the
flow out sooner. It was the right call on the schedule we had, and it is the
first thing I would put back.

> **Who did what:** I led the UX research, customer interviews, and UI.
> Engineering wrote the flows, the service, and the consolidation; product
> management and leadership shaped the verification requirements.

### Editorial notes — not page copy

> **The 80% is login and account *access*, not account creation.** The deck and the résumé both said "account creation support tickets" and that was wrong. Do not narrow it back.

> **User management** is mentioned, not detailed. It could be its own case study later.


---

## 4.5 — Challenges, getting utility workers moving

*Product design, behavior change · 2023–2024*
*Badges: Web app · Mobile · Figma · Weight: medium*
*Page: `/work/challenges` · Source: `src/content/work/challenges.mdx`*

### Summary
*Shown on the card, under the page title, and in search results.*

Daily 5 completions rose 65% — movement challenges built so a five-person crew can beat a fifty-person one, and so nobody has to be ranked to take part.

### Page copy

## Problem

The cornerstone of Vimocity is the Daily 5: a short full-body routine
targeting the areas that get hurt when you use your body for a living. Done
daily, it measurably reduces musculoskeletal injuries — sprains and strains, the
things that take a utility worker off the job.

Daily is the hard part. A routine that works only if you do it every day is a
routine that fails on the days nobody feels like it. We needed something that
made a Daily 5 worth doing on a Tuesday in February, without turning a health
benefit into surveillance or a leaderboard nobody asked to be on.

## What I did

- Tied challenges to the thing that already worked. Completing a Daily 5
  earns credit toward whatever challenge you are in — the challenge does not add
  a task, it gives the existing one a reason.
- Designed three types, so stakeholders had options to choose which is best
  for their team:
  **personal targets** (you against your own count, earning raffle entries),
  **team targets** (the same, pooled across a team), and
  **leaderboards** (teams ranked against each other).
- For the Leaderboard challenge, worked out the team-size problem. A large team
  wins any contest scored on totals,
  which makes joining a small crew pointless. Teams are scored on the share of
  what they could have completed — members times days — so a five-person crew
  and a fifty-person one are measured on the same scale.
- Set join windows, so a challenge is a fixed period with a start and an end
  rather than an open-ended obligation. They run from a week to over a month.
- Designed for web and mobile as two specs rather than one stretched across
  both. On our desktop app there is no challenge screen at all — but complete
  four moves in a day and that counts toward your Daily 5, and toward any
  challenge you have joined.
- Tested with customers and non-customers, checking that the mechanics motivated
  rather than pressured.

## Outcome

- **Daily 5 completions rose 65%** among people in a challenge.
- **25% more people registered** for Vimocity in order to take part in one.
- Movement became a shared activity rather than an individual task, without
  making participation conditional on being ranked.
- The feature works across every platform from one set of rules.

> **Who did what:** I led design and UI. The frontend and backend logic were
> written by our engineers, and the challenge mechanics were shaped collectively
> with our entire team.

> **Design note:** the hardest decision was making competition optional.
> Leaderboards motivate some people and alienate others, especially in a health and
> safety context tied to work — and the people most likely to be alienated are the ones
> the Daily 5 helps most. Personal targets let someone take part, earn the
> same raffle entries, and never appear in a ranking.

Organizations run these themselves rather than asking us to set one up. That
took its own tool — see
[the challenge admin tool](/work/challenge-admin).

### Editorial notes — not page copy

> **Verbs.** Caleb led design and UI; engineers wrote the code. Use *designed*, *specified*, *worked out* — never *built* or *automated* — here or on [Challenge admin, tools so customers don't need us](/work/challenge-admin).


---

## 4.6 — Challenge admin, tools so customers don't need us

*Product design, internal tools · 2023–2024*
*Badges: Web app · Figma · Weight: medium*
*Page: `/work/challenge-admin` · Source: `src/content/work/challenge-admin.mdx`*

### Summary
*Shown on the card, under the page title, and in search results.*

A self-serve tool for building challenges, picking raffle winners, and sending the whole email sequence — so running one stops being a support request.

### Page copy

## Problem

[Challenges](/work/challenges) worked. Running one did not.

Every challenge a customer wanted meant a request to us: someone to configure
it, someone to write the invitation, someone to remember the reminders, and
someone at the end to work out who had won. A feature that needs its vendor
present every time it runs is a feature that runs rarely — and the value of a
challenge is in repetition, which is exactly what a support queue prevents.

## What I did

- Designed a creation flow the customer's own stakeholders and leaders can use:
  challenge type, dates, prizes, and the rules specific to that type — maximum
  team size for a leaderboard, and so on.
- Designed the raffle selector. Personal and team target challenges accumulate
  entries per participant across the run; at the end an admin draws from them
  and gets a winner, rather than exporting a spreadsheet and trusting it.
- Specified the email sequence to run off the challenge itself, so nobody has
  to remember to send anything. Creating a challenge sends the invitation with
  its details; reminders go out during the run; a result email closes it, naming
  the winning team or the raffle winner.
- Kept it to the web deliberately. This is a task someone does sitting down,
  once, with real attention — a phone-sized version of it would have been effort
  spent making a rare task portable.

## Outcome

- Organizations create and run their own challenges without us in the loop.
- The communication around a challenge happens whether or not anyone remembers
  it, which is what keeps a month-long challenge alive in week three.
- Prize selection is a button rather than a spreadsheet and a promise.

> **Who did what:** I led design and UI. Engineering built the tool and the
> automated sends; product management and leadership shaped what an admin needed
> to be able to configure.

> **Why this is its own case study:** the participant experience and the admin
> experience are two different products with two different users, and designing
> the second is what made the first repeatable. Most of the value in
> [Challenges](/work/challenges) — the 65% lift in Daily 5 completions — only
> materialises if a challenge happens more than once.

### Editorial notes — not page copy

> **Why it is separate from [Challenges, getting utility workers moving](/work/challenges).** Participant and admin are two products with two users, and the second is what makes the first repeatable.

---

## 4.7 — Supporting work *(short entries)*

**Safety campaigns** — Tools for safety leads to send targeted content across their organization, with topic-based recommendations. Improved content access 5x.

**Playlists** — Custom content collections people can build, share across their organization, and embed in company intranets. Sales uses them to assemble industry-specific collections for prospects.

**Desktop movement app** — A Windows app that delivers personalized movement reminders on a schedule people set. Designed around native notifications, and connected to daily targets and challenges.

**Content discovery** — A new browse page plus video and playlist detail pages showing full content information. Improved content relevance by 35%.

---
---

# 5 · FEATURE PAGES

## 5.1 — Theme and color page

**Heading:** Themes and contrast

**Intro:**
> Every color on this site comes from a token, and every token pair is measured. Switch themes or modes and the numbers below update — including the ones that would fail.

**Section label:** Current theme
**Section label:** Contrast pairs

**Column headers:** Pair · Ratio · AA · AAA

**Explainer (small type, below the table):**
> Contrast is measured between a surface and the text or icon drawn on it, not between individual colors. Pairing them in the token layer means a component is legible in every theme without anyone remembering which color goes where.
>
> WCAG AA requires 4.5:1 for body text and 3:1 for large text. AAA requires 7:1.

**High contrast theme description:**
> Built to clear AAA on every pair, for anyone who needs more separation than the default themes provide.

---

## 5.2 — Inspector overlay

**Toggle label:** Inspect
**Toggle description (tooltip or caption):**
> Highlight components and see the tokens behind them.

**Panel labels:** Component · Tokens · Rule

**Empty state:**
> Hover or tab to any element to inspect it.

**Intro line, if the overlay gets its own explanation:**
> This is the same thing I do at work, pointed at my own site: every component declares what it is, and every value it uses can be traced back to a token and the rule that governs it.

---

## 5.3 — Colophon

> This site is built with Next.js, TypeScript, and Tailwind, and deployed on Vercel.
>
> Every color, type size, and spacing value comes from a defined token — no one-off values. Colors are paired as surface and foreground, so contrast holds in every theme. The same kind of automated checks I use at work run here before anything merges, and the rules are loaded into the AI tools I built it with.
>
> The inspector overlay shows how it fits together. The themes page shows whether it holds up.
>
> Source is on GitHub.

---

## 5.4 — Starter repo

**Card copy:**
> Design system guardrails, as a template
>
> A minimal setup that gives any project the same enforcement: token structure, automated rules, an AI context file, and a pre-merge checklist. Clone it and your standards start holding on day one.

---
---

# 6 · OPEN ITEMS

- Contact method for the experience page — currently omitted per your call. Consider a LinkedIn link alone, or a contact form.
- GitHub URL once the portfolio repo is public.
