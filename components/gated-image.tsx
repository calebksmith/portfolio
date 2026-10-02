"use client";

import { useSyncExternalStore } from "react";

import { ACCESS_ATTRIBUTE } from "@/lib/access-cookies";

/** Access only changes by opening a link, which loads a new page. */
const subscribe = () => () => {};
const granted = () =>
  document.documentElement.getAttribute(ACCESS_ATTRIBUTE) === "granted";
const onServer = () => false;

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
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
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
      className="h-full w-full object-contain"
    />
  );
}
