"use client";

import { Button } from "./button";

/**
 * Opens the browser's print dialog, which is also its save-as-PDF.
 *
 * Deliberately not a link to a committed PDF file: that would be a second
 * artifact of the same content, and it goes stale the moment a bullet changes
 * in lib/content/resume.ts. The print stylesheet renders from the same data, so
 * it cannot disagree with the page.
 *
 * The whole control is hidden when printing — a "Print" button in a printout is
 * the kind of detail that reads as carelessness on a résumé.
 */
export function PrintButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={() => window.print()}
    >
      Print / Save as PDF
    </Button>
  );
}
