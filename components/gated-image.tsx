"use client";

import { useSyncExternalStore } from "react";

import { ACCESS_ATTRIBUTE } from "@/lib/access-cookies";

/** Access only changes by opening a link, which loads a new page. */
const subscribe = () => () => {};
const granted = () =>
  document.documentElement.getAttribute(ACCESS_ATTRIBUTE) === "granted";
const onServer = () => false;

/**
 * A refused image means the link expired or was revoked. Dropping the mark on
 * <html> swaps every gated figure on the page back to its note, rather than
 * leaving empty frames — and the image route has already cleared the
 * cookies, so the next page starts out public.
 */
function fallBack() {
  document.documentElement.removeAttribute(ACCESS_ATTRIBUTE);
}

/**
 * The image half of a gated figure. It renders only in a browser the theme
 * script has marked as granted, so nobody else's browser ever requests the
 * file. The server render is empty: the page stays static, and the frame
 * around this has already reserved the space.
 */
export function GatedImage({
  src,
  alt,
  width,
  height,
  fit = "contain",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** `cover` fills a device screen from the top, as the screen would. */
  fit?: "contain" | "cover";
}) {
  const show = useSyncExternalStore(subscribe, granted, onServer);
  if (!show) return null;

  return (
    // A private route behind a cookie: the image optimizer fetches without
    // the visitor's cookies, so it could never load these.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="gated-image"
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      onError={fallBack}
      className={
        fit === "cover"
          ? "h-full w-full object-cover object-top"
          : "h-full w-full object-contain"
      }
    />
  );
}
