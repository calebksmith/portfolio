import { SettingsMenu } from "@/components/cksui";

/**
 * Chrome for the public site.
 *
 * The appearance settings live here rather than in the root layout, so the
 * admin area and the recruiter-facing CV pages don't inherit them — a shared CV
 * should be the document and nothing else.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      {children}
      <SettingsMenu />
    </div>
  );
}
