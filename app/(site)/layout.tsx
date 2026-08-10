/**
 * Chrome for the public site.
 *
 * Deliberately bare while the landing page is the only route. Header and
 * footer land here — not in the root layout — so the admin area and the
 * recruiter-facing CV pages can present completely different chrome.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
