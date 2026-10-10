---
name: ux-writing
description: Senior UX writer's pass over this site's copy — audits or revises the homepage, case studies, résumé, colophon, and style guide against the voice in CLAUDE.md, so the site reads as one writer. Use when asked to "audit the copy", "check the voice", "clean up the writing", "run a UX writing pass", or before merging a change that adds or rewrites copy.
---

# UX writing

The standard is CLAUDE.md: **Content** (where copy lives, the case study shape)
and **Voice** (just enough, one writer in three registers, one name per thing).
If this file and CLAUDE.md disagree, CLAUDE.md wins — fix this file.

Audit first, and propose before rewriting. Copy is Caleb's voice; a change he
hasn't seen is a change he has to re-read anyway.

## 1. Scope

- A change: `git diff origin/main...HEAD` over `lib/i18n/messages/`,
  `lib/content/resume/`, `src/content/`, and `components/diagrams/` labels.
- A full audit: every one of those files, plus the style guide's component notes
  in `app/[lang]/style-guide/_recipes.tsx`.
- Check which branch holds the newest copy before auditing. Stacked branches
  are common here; auditing a stale one wastes the pass.

## 2. Run the gate

`npm run check:copy` catches the mechanical part: spelling, house terms, curly
apostrophes, internal material. Fix those first; the rest of this review is
what it cannot see.

## 3. Read as the reader

Read each page once as a hiring manager with a minute to spare, then once as an
engineer who opened the colophon on purpose. Note where either would stop.

**Just enough**

- The case study header (title, impact, user value, business value) tells the
  story on its own.
- About 300 words of prose is typical. Length is judged against the argument:
  more is fine when every sentence carries it, and a sentence that doesn't is
  a finding at any length.
- One proof per point. A sentence that supports a point already proven is cut,
  not moved lower.
- The page ends looking forward: "What I'd change", then related work.

**One writer**

- The register fits the surface: conversational on the homepage and 404,
  product team in case studies and the résumé, mechanism in the colophon and
  style guide.
- No closing maxims. "X, not Y" only in the design challenge. At most one em dash per
  paragraph. One light joke per page at most.
- "I" for Caleb's decisions, "we" for the team's. No passive voice hiding who
  did it.
- Library names and acronyms only in badges, the colophon, and the style guide.

**Specific, not stock**

Generic copy is the copy a reader skims, and none of it is fixed by a word swap.

- Stock words and "not just X, but Y" are caught by `check:copy`. Replace them
  with the specific thing, not a synonym.
- Vary the shape. Not every bullet opens with a bold sentence, not every list
  has three items, not every sentence ends on ", so …". Two consequence
  clauses and two colon reveals per case study is plenty.
- Vary the length. A short sentence after a long one reads as a person
  talking.
- Prefer specifics to summaries: a figure, a name, a Tuesday in February. A
  sentence that could close any case study is the one to cut.
- Keep Caleb's own phrasing from dictation where the meaning is clear. It is
  the least generic writing on the site.
- Don't swap one formula for another. Forced slang or a new pet phrase reads
  as generic as the habit it replaced.

**One name per thing**

- Every name matches CLAUDE.md's list: his title, Vimocity, the web portal,
  V-minder, the people, the studio, the Daily 5 verbs.
- "About 80%" is always the share of prototyped frontend code that reaches
  production. Every other figure is approved, with its caveat beside it.

**Shape** (case studies)

- Problem gives context, then the goal ("our goal was…"); one blockquoted
  design challenge states the hardest problem plainly, then how it was solved;
  three to five "What I did" bullets with explicit bold labels; outcomes as
  stat tiles with caveats beside them; one "Who did what" line; optionally
  "What I'd change", tied to a product or business goal.
- User and business value are noun phrases, not sentences or instructions.
- The key result in the frontmatter (`impact`) is the headline a skimmer
  takes away. It should match the first stat tile.

**Visuals**

- At least one every visitor sees. A gated screenshot alone doesn't count.
- Each one sits right after the sentence that sets it up, and its caption says
  what to look at. One per point.
- No Vimocity IP: public screens (login, a shared playlist, the public
  Storybook) or a diagram in `components/diagrams/`.

## 4. Report

Group findings by severity, worst first: facts that conflict, then structure,
then voice, then polish. Quote the line and give `file:line`. For each, say
what the reader loses, and propose the rewrite.

Ask Caleb only what the repo can't answer: titles, which figure means what, who
did what. Never invent a credit, a team size, a research finding, or a cause.
