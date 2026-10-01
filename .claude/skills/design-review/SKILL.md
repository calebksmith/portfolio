---
name: design-review
description: Readiness check for a change to this site before it ships — runs the automated gates, then walks the parts no linter can judge (the right token, breakpoints, secondary states, motion, keyboard, copy and voice). Use when asked to "review this change", "run design review", "is this ready to merge", or before opening a pull request.
---

# Design review

The lint gate and the checks in CI hold the mechanical rules. This review covers
what they cannot see, and certifies a change is ready to merge. CLAUDE.md is the
standard; if this file and CLAUDE.md disagree, CLAUDE.md wins — fix this file.

You point at what to change and where. You do not edit the author's files
unless they ask you to.

## 1. Scope and sync

- Review surface: `git diff origin/main...HEAD`.
- If the branch is behind `main` (`git rev-list --left-right --count origin/main...HEAD`,
  left number above 0), say so before reviewing — a stale branch gives a
  misleading result.

## 2. Run the gates

Run each and report pass or fail. A failure here is a failure at merge.

```
npm run check:format
npm run check:contrast
npm run check:copy
npm run typecheck
npm run lint
npm test
npm run build
```

## 3. Review what the gates cannot

Mark each pass, fail, or not applicable, with one plain sentence.

**Tokens and components**

- The token is the _right_ one, not only _a_ token — the lint rule proves no raw
  value was used, not that the choice was correct.
- An existing cksUI component was used before a new one was written. A new
  component goes in `components/cksui/`, not in a page.

**Layout**

- The change holds at phone width (375px), at each breakpoint edge
  (639/640, 1023/1024), and on a wide screen. No horizontal scroll, no overlap,
  no clipped text.
- Long content holds: a long title, a long word, a missing image.

**States**

- Loading, empty, and error states exist wherever the content can be absent or
  slow. A case study that does not exist is a 404, not a blank page.
- Hover, focus-visible, active, and disabled are defined for every control.

**Themes and motion**

- Checked in all three themes, light and dark, with the theme flipped from the
  Appearance menu — not only in the theme it was built in.
- Every animation and transition is off under `prefers-reduced-motion`, and
  nothing is hidden behind an animation that will not run.

**Keyboard and assistive technology**

- Every interactive element is reachable and operable by keyboard, in a
  sensible order, with a visible focus ring.
- Touch targets are at least 44px (`min-h-tap` / `min-w-tap`).
- Text that changes on its own is announced (`aria-live`) once, not letter by
  letter.

**Copy**

- Interface copy is in `lib/i18n/messages/`; long-form copy is MDX in
  `src/content/`. Nothing user-facing is written into a component.
- Voice: plain, specific, active, sentence case. Library-level terms only in
  case study badges. "Frontend" is one word.
- Metrics are approved figures, written as percentages, ratios, or multiples —
  never raw employer counts. Caveats stay attached to their numbers.

**Public repository**

- Nothing from an employer or client is in the diff: no internal documents,
  ticket keys, workspace links, or data exports. `check:copy` catches the
  fingerprints; this is the human check for the rest.

## 4. Verdict

Summarise in a short table (area, status, note), then give the verdict:

- **READY** — every item passes or is not applicable.
- **NOT READY** — list what to fix, in the order to fix it.

Offer to re-check each item after the author fixes it.
