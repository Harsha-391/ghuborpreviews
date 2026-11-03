"use client";

import { useState } from "react";
import Image, { type ImageProps, type StaticImageData } from "next/image";
import { DEFAULT_IMAGE_CONFIGS, useImageConfig } from "./ImageConfigContext";

type CmsImageProps = Omit<ImageProps, "src" | "fill"> & {
  /** ImageConfigContext slot id (e.g. "hero", "struggle", "product-<id>"). */
  slot: string;
  /** What to paint first. Server-rendered, so it is never delayed by the CMS. */
  fallback: string | StaticImageData;
};

/**
 * Admin-configurable image that never hard-swaps.
 *
 * The fallback is always rendered. If the CMS config later resolves the slot to
 * a different URL, that image is stacked on top and faded in once it has loaded.
 * The painted image is never re-keyed, so there is no flash and no extra layout work.
 * Always renders with `fill`, so the parent needs `position: relative` and a size.
 */
export default function CmsImage({ slot, fallback, alt, className = "", ...rest }: CmsImageProps) {
  const { getImageUrl } = useImageConfig();
  const fallbackUrl = typeof fallback === "string" ? fallback : fallback.src;
  const defaultUrl = DEFAULT_IMAGE_CONFIGS[slot]?.lightUrl ?? fallbackUrl;
  const resolved = getImageUrl(slot, defaultUrl);
  const override = resolved && resolved !== defaultUrl ? resolved : null;
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  return (
    <>
      <Image src={fallback} alt={alt} fill className={className} {...rest} />
      {override && (
        <Image
          {...rest}
          src={override}
          alt=""
          aria-hidden
          fill
          priority={false}
          fetchPriority="auto"
          placeholder="empty"
          onLoad={() => setLoadedSrc(override)}
          className={`${className} transition-opacity duration-500 ${loadedSrc === override ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </>
  );
}
