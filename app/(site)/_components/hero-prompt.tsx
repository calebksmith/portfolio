"use client";

import Link from "next/link";
import { useState } from "react";

import { Eyebrow } from "@/components/cksui";
import { site } from "@/lib/site";

import { useHeroReveal } from "./hero-reveal";
import { REVEAL_TRANSITION, revealState } from "./reveal";
import { Caret, TypedLine, useTypedText } from "./typed-line";

/**
 * The hero: a question, three things you can ask, and an answer written back.
 *
 * It replaces the tagline that used to type itself here. The tagline said three
 * things in a fixed order and hoped one of them was the thing you came for.
 * This asks instead, which is both a better use of the first screen and a
 * demonstration of the argument the site is making — the same voice that wrote
 * the copy will write you an answer.
 *
 * Nothing here is load-bearing for the content. Every answer is a shorter
 * version of a page that exists, linked underneath it, and the whole exchange is
 * duplicated in the <noscript> block for anyone without JavaScript. An
 * interaction that is the only route to something is a trap.
 */

type Prompt = {
  id: string;
  /**
   * The chip label. First person, in Caleb's voice — the question above them
   * addresses the visitor, but these are the things he can tell you about
   * himself, so they read in the voice of the answer they produce.
   */
  question: string;
  /** Written back, at an even pace — no emphasis and no pauses inside it. */
  answer: string;
  /**
   * Where the answer goes next, when there is somewhere worth going. `kind`
   * says what sort of page it is and `title` is the page's own title — between
   * them the link names its destination rather than saying "read more" and
   * making you click to find out.
   *
   * Optional, and left off deliberately rather than pointed at the nearest
   * page: a link that does not follow from the answer costs more than no link,
   * because it teaches the reader that these are decorative.
   */
  link?: { href: string; kind: string; title: string };
};

/**
 * The opening statement — what used to be the answer to "what do you actually
 * do?", now said without being asked. Nobody should have to click to find out
 * what someone does.
 *
 * It is `site.lede` rather than its own copy: the name and role are already
 * above it in the eyebrow and the h1, so restating them here was the same
 * sentence three times.
 */
const INTRO = site.lede;

const QUESTION = "What else would you like to know?";

const PROMPTS: Prompt[] = [
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
    // LinkedIn role description in the copy deck. It is a claim about judgment
    // rather than about how far he takes the build.
    answer:
      "I'm a designer who rarely opens Figma. I design with prototypes that use real components, so engineering gets working frontend code to use rather than a design spec to rebuild. Currently, about 80% of what I prototype ships.",
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
      "I take a feature from idea to working code: research, strategy, testing with customers, then building the frontend. I work closely with other product managers, backend developers, and leadership to decide what's worth building.",
    // No link. Challenges is a case study about designing for repeat behavior,
    // which is not what this answer is about, and no other page argues this
    // particular point yet.
  },
];

/** A beat of blank page with a live cursor before the first character lands. */
const OPENING_WAIT_MS = 1000;
/** And a shorter one between the statement and the question that follows it. */
const BETWEEN_LINES_MS = 500;

export function HeroPrompt({ className }: { className?: string }) {
  const { markSettled } = useHeroReveal();

  // `nonce` is what lets the same question be asked twice: it changes the key
  // on the answer, which remounts it, which starts the typing over.
  const [asked, setAsked] = useState<{ id: string; nonce: number } | null>(null);

  // Two lines in sequence: the statement, then the question. The second gates on
  // the first being finished rather than running its own timer, so the pause
  // between them cannot drift out of step with the typing speed.
  const intro = useTypedText(INTRO, { delayMs: OPENING_WAIT_MS });
  const question = useTypedText(QUESTION, {
    enabled: intro.complete,
    delayMs: BETWEEN_LINES_MS,
    onDone: markSettled,
  });

  const selected = PROMPTS.find((prompt) => prompt.id === asked?.id) ?? null;

  return (
    <div className={className}>
      {/* The real content, announced once and crawlable. Everything below is
          decorative in the sense that it is a slower way of showing this. */}
      <span className="sr-only">{INTRO}</span>

      <TypedLine
        full={INTRO}
        typed={intro.text}
        className="text-lg text-pretty text-foreground"
        caret={intro.complete ? null : <Caret writing={intro.writing} />}
      />

      <TypedLine
        full={QUESTION}
        typed={question.text}
        className="mt-9 text-lg text-pretty text-muted-foreground"
        caret={
          intro.complete && !selected ? (
            <Caret writing={question.writing} />
          ) : null
        }
      />

      {/*
        Held back until the question has finished being asked — `invisible`
        rather than faded, so none of these can be tabbed to before they mean
        anything. The same lift and fade the rest of the page uses.
      */}
      <ul
        className={`mt-5 flex flex-wrap gap-2 ${REVEAL_TRANSITION} ${revealState(
          question.complete,
        )}`}
      >
        {PROMPTS.map((prompt) => (
          <li key={prompt.id}>
            <button
              type="button"
              data-slot="hero-prompt-option"
              // aria-pressed, not a link or a radio: it turns an answer on, and
              // exactly one is on at a time. Same reasoning as ControlToggle.
              aria-pressed={asked?.id === prompt.id}
              onClick={() =>
                setAsked((current) => ({
                  id: prompt.id,
                  nonce: (current?.nonce ?? 0) + 1,
                }))
              }
              className={`inline-flex min-h-tap items-center rounded-md border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                asked?.id === prompt.id
                  ? "border-input bg-accent text-accent-foreground"
                  : "border-input text-foreground hover:bg-muted hover:text-muted-foreground"
              }`}
            >
              {prompt.question}
            </button>
          </li>
        ))}
      </ul>

      {/*
        Every answer is laid out in the same grid cell, including invisible
        copies of the ones not being shown. The cell is therefore always as tall
        as the longest answer at whatever width the window happens to be, and
        the hero's height never changes — which is what keeps the role, the
        name, and the statement above it from drifting when you pick a different
        question. The section is vertically centred, so any change in height
        below moves everything above it.

        Measured rather than guessed. A hand-picked `min-height` per breakpoint
        was the previous attempt and it was wrong at the widths between them,
        and wrong again the moment an answer changed by a sentence.
      */}
      <div className="mt-6 grid">
        {PROMPTS.map((prompt) => (
          <AnswerBody
            key={prompt.id}
            prompt={prompt}
            text={prompt.answer}
            // Not `linkShown` — `visibility: visible` on a child wins over an
            // `invisible` parent, so a shown link here would render on top of
            // the real answer. Hidden still occupies its space, which is the
            // only thing a spacer needs.
            linkShown={false}
            className="invisible col-start-1 row-start-1"
          />
        ))}

        <div className="col-start-1 row-start-1">
          {selected ? (
            <Answer key={`${selected.id}-${asked?.nonce}`} prompt={selected} />
          ) : null}
        </div>
      </div>

      {/*
        Announced as one finished sentence. A live region containing the typed
        text would be read out a character at a time, which is unusable — so the
        typed copy above is aria-hidden and this is what is actually announced.
      */}
      <p aria-live="polite" className="sr-only">
        {selected ? selected.answer : ""}
      </p>

      {/*
        Without JavaScript the question never types and the buttons do nothing,
        so the whole exchange is written out plainly instead. Same content, no
        interaction — rather than a hero that is empty.
      */}
      <noscript>
        <p className="text-lg text-pretty text-foreground">{INTRO}</p>
        <dl className="mt-6 space-y-4">
          {PROMPTS.map((prompt) => (
            <div key={prompt.id}>
              <dt className="text-sm text-muted-foreground">
                {prompt.question}
              </dt>
              <dd className="text-pretty text-foreground">
                {prompt.answer}
                {prompt.link ? (
                  <>
                    {" "}
                    <Link
                      href={prompt.link.href}
                      className="text-primary underline underline-offset-4"
                    >
                      {prompt.link.kind}: {prompt.link.title}
                    </Link>
                  </>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </noscript>
    </div>
  );
}

function Answer({ prompt }: { prompt: Prompt }) {
  const { text, complete, writing } = useTypedText(prompt.answer);

  return (
    <AnswerBody
      prompt={prompt}
      text={text}
      caret={<Caret writing={writing} />}
      linkShown={complete}
    />
  );
}

/**
 * The answer's markup, with no opinion about where the text came from.
 *
 * The visible answer passes partially-typed text; the invisible spacers behind
 * it pass the finished string. One component, so a spacer cannot come out a
 * different height from the thing it is reserving space for.
 */
function AnswerBody({
  prompt,
  text,
  caret,
  linkShown,
  className,
}: {
  prompt: Prompt;
  text: string;
  caret?: React.ReactNode;
  /** Whether the link has arrived. Hidden either way still reserves its space. */
  linkShown: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      {/* Only the typed copy is hidden from assistive technology — a live
          region reading it would announce it one character at a time. The link
          below is not typed and stays in the tree and in the tab order. */}
      <p
        aria-hidden="true"
        className="text-lg text-pretty text-muted-foreground"
      >
        {text}
        {caret}
      </p>

      {/* Arrives with the sentence it belongs to rather than sitting there
          through the typing, which would give the ending away. `invisible`
          until then, so it cannot be tabbed to early. */}
      {prompt.link ? (
        <p className={`mt-3 ${REVEAL_TRANSITION} ${revealState(linkShown)}`}>
          <Link
            href={prompt.link.href}
            className="group inline-flex flex-wrap items-baseline gap-x-2 rounded-sm text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Eyebrow asChild>
              <span>{prompt.link.kind}</span>
            </Eyebrow>
            <span className="text-primary underline decoration-primary underline-offset-4">
              {prompt.link.title} →
            </span>
          </Link>
        </p>
      ) : null}
    </div>
  );
}
