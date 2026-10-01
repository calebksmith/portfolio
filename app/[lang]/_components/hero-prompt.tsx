"use client";

import Link from "next/link";
import { useState } from "react";

import { Eyebrow } from "@/components/cksui";
import { localizePath, type Locale } from "@/lib/i18n/config";
import type { Messages } from "@/lib/i18n/messages";

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

/**
 * One chip and its answer. The copy — and why each answer is worded the way it
 * is — lives in `lib/i18n/messages/`. Every answer is a shorter version of a
 * page that exists; `link` names that page by its own title, or is null where
 * no page argues the point yet. A link that does not follow from the answer
 * costs more than no link, because it teaches the reader these are decorative.
 */
type Prompt = Messages["home"]["hero"]["prompts"][number];

/** A beat of blank page with a live cursor before the first character lands. */
const OPENING_WAIT_MS = 500;

/**
 * `intro` is the opening statement — what used to be the answer to "what do you
 * actually do?", now said without being asked. It is the site lede rather than
 * its own copy: the name and role are already above it, so restating them here
 * was the same sentence three times.
 */
export function HeroPrompt({
  className,
  locale,
  intro: statement,
  copy,
}: {
  className?: string;
  locale: Locale;
  intro: string;
  copy: Messages["home"]["hero"];
}) {
  const { question, prompts } = copy;
  const { markSettled } = useHeroReveal();

  // `nonce` is what lets the same question be asked twice: it changes the key
  // on the answer, which remounts it, which starts the typing over.
  const [asked, setAsked] = useState<{ id: string; nonce: number } | null>(
    null,
  );

  // Two lines in sequence: the statement, then the question. The second gates on
  // the first being finished rather than running its own timer, so the pause
  // between them cannot drift out of step with the typing speed.
  // Only the statement types. The question and the options arrive together,
  // faded in — two things typing in sequence made the reader wait twice for one
  // idea, and the question is a prompt rather than a thought being formed.
  const intro = useTypedText(statement, {
    delayMs: OPENING_WAIT_MS,
    onDone: markSettled,
  });

  const selected = prompts.find((prompt) => prompt.id === asked?.id) ?? null;

  return (
    <div className={className}>
      {/* The real content, announced once and crawlable. Everything below is
          decorative in the sense that it is a slower way of showing this. */}
      <span className="sr-only">{statement}</span>

      <TypedLine
        full={statement}
        typed={intro.text}
        className="text-lg text-pretty text-foreground"
        caret={intro.complete ? null : <Caret writing={intro.writing} />}
      />

      <p
        aria-hidden="true"
        className={`mt-9 text-lg text-pretty text-muted-foreground ${REVEAL_TRANSITION} ${revealState(
          intro.complete,
        )}`}
      >
        {question}
        {selected ? null : <Caret writing={false} />}
      </p>

      {/*
        Held back until the question has finished being asked — `invisible`
        rather than faded, so none of these can be tabbed to before they mean
        anything. The same lift and fade the rest of the page uses.
      */}
      <ul
        className={`mt-5 flex flex-wrap gap-2 ${REVEAL_TRANSITION} ${revealState(
          intro.complete,
        )}`}
      >
        {prompts.map((prompt) => (
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
        {prompts.map((prompt) => (
          <AnswerBody
            key={prompt.id}
            prompt={prompt}
            locale={locale}
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
            <Answer
              key={`${selected.id}-${asked?.nonce}`}
              prompt={selected}
              locale={locale}
            />
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
        <p className="text-lg text-pretty text-foreground">{statement}</p>
        <dl className="mt-6 space-y-4">
          {prompts.map((prompt) => (
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
                      href={localizePath(locale, prompt.link.href)}
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

function Answer({ prompt, locale }: { prompt: Prompt; locale: Locale }) {
  const { text, complete, writing } = useTypedText(prompt.answer);

  return (
    <AnswerBody
      prompt={prompt}
      locale={locale}
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
  locale,
  text,
  caret,
  linkShown,
  className,
}: {
  prompt: Prompt;
  locale: Locale;
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
            href={localizePath(locale, prompt.link.href)}
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
