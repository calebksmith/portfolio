/**
 * Every surface/foreground pair the site uses, and therefore every pair that is
 * measured.
 *
 * Shared by two gates: `check-contrast.mjs` measures each pair in every theme
 * and mode, and the `ck/paired-surface` lint rule accepts a surface only when
 * it is drawn with one of these foregrounds. A combination that is not listed
 * here is neither measured nor allowed — adding it here is how it becomes
 * both.
 */

/**
 * `border` is deliberately not gated. WCAG 1.4.11 governs the boundary of a UI
 * component and graphics needed to understand content — not a decorative
 * hairline between rows. `input` is the control boundary and is gated at 3:1.
 * That distinction is the entire reason they are separate tokens.
 */
export const PAIRS = [
  ["background", "foreground"],
  ["card", "card-foreground"],
  ["muted", "muted-foreground"],
  ["primary", "primary-foreground"],
  ["accent", "accent-foreground"],
  // Hover surfaces are held to the same standard as the surfaces they replace.
  // A button that becomes unreadable for as long as the pointer is on it is
  // unreadable exactly when someone is trying to read it.
  ["primary-hover", "primary-foreground"],
  ["accent-hover", "accent-foreground"],
  // Verdict surfaces on the colophon. Gated like any other pair — a green that
  // reads as "good" is worth nothing if the text on it cannot be read, and the
  // Chosen/Rejected labels stay precisely because colour is never the only
  // signal.
  // The mark's own pair. A logo is exempt from WCAG, but a mark whose letters
  // stop reading on its own tile is a broken mark regardless of what the spec
  // requires — and this is the one asset that appears on every page.
  ["mark-ground", "mark-ink"],
  ["positive", "positive-foreground"],
  ["destructive", "destructive-foreground"],
  ["background", "muted-foreground"],
  ["background", "input"],
  ["background", "ring"],
  ["background", "border"],

  // The style guide's source panel highlights JSX on the card surface using
  // tokens that already exist, rather than introducing a syntax palette. These
  // are those combinations, gated here so the highlighter cannot quietly stop
  // being legible when a theme value changes.
  ["card", "primary"],
  ["card", "accent-foreground"],
  ["card", "muted-foreground"],

  // Containers that set the card surface and let their text inherit the page
  // foreground rather than naming card-foreground. The two hold the same value
  // in every theme today; measuring the pair keeps that true rather than
  // assumed, without a token that exists only to be paired.
  ["card", "foreground"],

  // The current item in a list of links — the section index, the header's
  // menus — and inline code. Muted fill, full-strength text: the emphasis is
  // the point, so it is measured rather than swapped for the muted foreground.
  ["muted", "foreground"],

  // Diagrams sit on the figure's card surface and draw their verdicts in the
  // verdict foregrounds directly — the code that reaches the other device, the
  // link that doesn't. Text, so it is held to AA like any other text.
  ["card", "positive-foreground"],
  ["card", "destructive-foreground"],
];
