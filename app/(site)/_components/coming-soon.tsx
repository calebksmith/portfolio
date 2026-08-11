import { SpecList, SpecRow, StatusDot } from "@/components/cksui";
import { site } from "@/lib/site";

/**
 * The published landing page.
 *
 * This is what production serves. The bento index replaces it when the case
 * studies are ready to publish — see lib/flags.ts.
 *
 * No application JavaScript ships for it. The staggered entrance is CSS only
 * (`.ck-enter` + `--ck-enter-index`), so it costs nothing at runtime and
 * disappears under prefers-reduced-motion without taking the content with it.
 */
export function ComingSoon() {
  return (
    <main className="flex flex-1 items-center px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto w-full max-w-2xl">
        <h1
          className="ck-enter font-display text-[clamp(2.5rem,9vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-balance text-foreground"
          style={{ "--ck-enter-index": 0 } as React.CSSProperties}
        >
          {site.name}
        </h1>

        <p
          className="ck-enter mt-4 text-xs uppercase tracking-[0.16em] text-primary"
          style={{ "--ck-enter-index": 1 } as React.CSSProperties}
        >
          {site.role}
        </p>

        <p
          className="ck-enter mt-8 max-w-[46ch] text-lg text-pretty text-muted-foreground"
          style={{ "--ck-enter-index": 2 } as React.CSSProperties}
        >
          {site.lede}
        </p>

        <SpecList
          className="ck-enter mt-14"
          style={{ "--ck-enter-index": 3 } as React.CSSProperties}
        >
          {site.spec.map((row) => (
            <SpecRow key={row.label} label={row.label}>
              {row.value}
            </SpecRow>
          ))}
          <SpecRow label="Status">
            <StatusDot />
            {site.status}
          </SpecRow>
        </SpecList>

        <nav
          className="ck-enter mt-10 flex flex-wrap gap-x-6 gap-y-2"
          style={{ "--ck-enter-index": 4 } as React.CSSProperties}
          aria-label="Elsewhere"
        >
          {site.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-tap items-center text-sm text-foreground underline decoration-input underline-offset-4 transition-colors hover:decoration-primary hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
