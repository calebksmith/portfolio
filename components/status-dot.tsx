import type { ComponentProps } from "react";

const stateColor = {
  live: "bg-status-live",
  building: "bg-status-building",
  idle: "bg-status-idle",
} as const;

export type StatusState = keyof typeof stateColor;

/**
 * A small pulsing dot marking a status.
 *
 * The pulse is decorative: the dot is fully visible at rest, and `.ck-pulse`
 * is a no-op under prefers-reduced-motion. The accompanying label always
 * carries the meaning, so nothing is communicated by color or motion alone.
 */
export function StatusDot({
  state,
  className = "",
  ...props
}: { state: StatusState } & ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex size-2 shrink-0 ${className}`}
      {...props}
    >
      <span
        className={`ck-pulse absolute inset-0 rounded-full ${stateColor[state]}`}
      />
      <span
        className={`absolute inset-0 rounded-full opacity-40 ${stateColor[state]}`}
      />
    </span>
  );
}
