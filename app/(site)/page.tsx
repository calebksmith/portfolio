import { StatusDot } from "@/components/status-dot";
import { portfolioStatus, site } from "@/lib/site";

/**
 * Landing page.
 *
 * A fully static server component — no client JS ships for this route. The
 * staggered entrance is CSS only (`.ck-enter` + `--ck-enter-index`), which
 * means it costs nothing at runtime and disappears entirely under
 * prefers-reduced-motion without the content disappearing with it.
 */
export default function LandingPage() {
  return (
    <main className="flex flex-1 items-center px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1
          className="ck-enter font-display text-[clamp(2.5rem,9vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
          style={{ "--ck-enter-index": 0 } as React.CSSProperties}
        >
          {site.name}
        </h1>

        <p
          className="ck-enter mt-4 text-xs uppercase tracking-[0.16em] text-accent"
          style={{ "--ck-enter-index": 1 } as React.CSSProperties}
        >
          {site.title}
        </p>

        <p
          className="ck-enter mt-8 max-w-[46ch] text-pretty text-lg text-ink-muted"
          style={{ "--ck-enter-index": 2 } as React.CSSProperties}
        >
          {site.positioning}
        </p>

        <dl
          className="ck-enter mt-14 border-t border-rule"
          style={{ "--ck-enter-index": 3 } as React.CSSProperties}
        >
          {site.spec.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-1 border-b border-rule py-3 sm:grid-cols-[8rem_1fr] sm:gap-6"
            >
              <dt className="text-xs uppercase tracking-[0.14em] text-ink-faint">
                {row.label}
              </dt>
              <dd className="text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p
          className="ck-enter mt-10 flex items-center gap-2.5 text-xs uppercase tracking-[0.14em] text-ink-muted"
          style={{ "--ck-enter-index": 4 } as React.CSSProperties}
        >
          <StatusDot state={portfolioStatus.state} />
          {portfolioStatus.label}
        </p>
      </div>
    </main>
  );
}
