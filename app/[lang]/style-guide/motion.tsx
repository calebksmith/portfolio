"use client";

import { useEffect, useState } from "react";

import { Eyebrow } from "@/components/cksui";
import { usePrefersReducedMotion } from "@/components/cksui/lib/use-reduced-motion";
import { format } from "@/components/rich-text";
import type { Messages } from "@/lib/i18n/messages";

/**
 * The motion scale, read from the running page.
 *
 * Same rule the token and contrast tables follow: the values below are pulled
 * off `<html>` with `getComputedStyle` rather than typed in here. A style guide
 * that keeps its own copy of the numbers is a style guide that can be wrong.
 *
 * There is no synthetic demo of the durations. A bar travelling a track at
 * 120ms tells you almost nothing — the number is too small to read as movement
 * out of context, and the context is what gives it meaning. The component
 * playground below is the real specimen: hover a button and you are watching
 * `fast`, open a card and you are watching `base`. Motion is a property of the
 * components, so the components are where it should be judged.
 *
 * The reduced-motion panel reports what this browser is actually asking for
 * rather than describing what it would do.
 */

/** Names and uses are copy, keyed by step in `labels.durations`. */
const DURATIONS = [
  { key: "fast", token: "--ck-duration-fast" },
  { key: "base", token: "--ck-duration-base" },
  { key: "slow", token: "--ck-duration-slow" },
] as const;

function useTokens(names: readonly string[]) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    function read() {
      const styles = getComputedStyle(document.documentElement);
      setValues(
        Object.fromEntries(
          names.map((name) => [name, styles.getPropertyValue(name).trim()]),
        ),
      );
    }

    read();

    // The motion tokens are theme-independent, but a stylesheet swap in dev
    // still moves them, and re-reading costs nothing.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    return () => observer.disconnect();
    // `names` is a module-level constant; re-running on identity would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return values;
}

/** `cubic-bezier(a, b, c, d)` → the four control values, or null. */
function parseEase(value: string) {
  const match = /cubic-bezier\(([^)]+)\)/.exec(value);
  if (!match) return null;
  const parts = match[1].split(",").map((n) => Number(n.trim()));
  return parts.length === 4 && parts.every(Number.isFinite) ? parts : null;
}

export function Motion({
  labels,
}: {
  labels: Messages["styleGuide"]["motionPanel"];
}) {
  const reduced = usePrefersReducedMotion();
  const tokens = useTokens([...DURATIONS.map((d) => d.token), "--ck-ease"]);

  const ease = tokens["--ck-ease"] ?? "";
  const curve = parseEase(ease);

  return (
    <div className="mt-6 space-y-6">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="border-b border-border p-5">
          <Eyebrow>{labels.scale}</Eyebrow>
        </div>

        <ul className="divide-y divide-border">
          {DURATIONS.map((step) => (
            <li
              key={step.token}
              className="grid gap-1 p-5 sm:grid-cols-[7rem_6rem_1fr] sm:gap-4"
            >
              <p className="font-medium text-card-foreground">
                {labels.durations[step.key].name}
              </p>
              <p className="text-card-foreground tabular-nums">
                {tokens[step.token] || "—"}
              </p>
              <div className="min-w-0">
                <code className="text-label-sm text-muted-foreground">
                  {step.token}
                </code>
                <p className="mt-1 text-sm text-pretty text-muted-foreground">
                  {labels.durations[step.key].use}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <Eyebrow>{labels.easing}</Eyebrow>
          <p className="mt-3 font-mono text-sm break-all text-card-foreground">
            {ease || "—"}
          </p>

          {curve ? (
            <svg
              viewBox="0 0 120 120"
              className="mt-4 h-40 w-full"
              role="img"
              aria-label={format(labels.easingLabel, { ease })}
            >
              {/* Linear, for comparison. */}
              <path
                d="M 0 120 L 120 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 4"
                className="text-border"
              />
              <path
                d={`M 0 120 C ${curve[0] * 120} ${120 - curve[1] * 120} ${curve[2] * 120} ${120 - curve[3] * 120} 120 0`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="text-primary"
              />
            </svg>
          ) : null}

          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {labels.easingNote}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <Eyebrow>{labels.reduced}</Eyebrow>

          <p
            className={`mt-3 inline-flex items-center rounded-sm px-2 py-1 text-sm ${
              reduced
                ? "bg-positive text-positive-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {reduced ? labels.reducedOn : labels.reducedOff}
          </p>

          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {labels.reducedBody}
          </p>
          <p className="mt-3 text-sm text-pretty text-muted-foreground">
            {labels.reducedHero}
          </p>
        </div>
      </div>
    </div>
  );
}
