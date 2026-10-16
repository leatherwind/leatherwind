"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Product photograph wrapper.
 *
 * Three jobs:
 *   1. Guarantee consistent framing — every catalog image is displayed at the
 *      same aspect ratio with `object-cover`, so the grid stays aligned even
 *      when the source photographs have different proportions.
 *   2. Fail honestly. If a photograph has not been supplied for a record yet —
 *      or the file is missing — render a neutral brand surface with the product
 *      name instead of a broken image or an unrelated stand-in picture.
 *   3. Recover. If an image fails to load at runtime (for example, before
 *      `npm run catalog:images` has been run) the surface falls back to the
 *      same placeholder rather than showing a broken-image icon.
 */

interface ProductImageProps {
  src?: string;
  alt: string;
  /** Tailwind aspect-ratio class, e.g. "aspect-[4/5]". */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  /** Shown on the placeholder surface when no photograph exists. */
  fallbackLabel?: string;
}

export function ProductImage({
  src,
  alt,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  priority = false,
  className,
  imageClassName,
  fallbackLabel,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-sand/60", aspect, className)}>
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div className="lw-image-placeholder absolute inset-0 h-full w-full px-4 text-center">
          <span className="max-w-[85%] text-[0.625rem] font-semibold uppercase leading-relaxed tracking-[0.18em]">
            {fallbackLabel ?? "Photograph to be supplied"}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Wide editorial image with a fixed ratio, used for hero and about sections.
 * A missing or unloaded image degrades to a deep espresso panel rather than a
 * gap or a broken-image icon.
 */
export function EditorialImage({
  src,
  alt,
  aspect = "aspect-[4/3]",
  sizes = "100vw",
  priority = false,
  className,
  imageClassName,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-espresso", aspect, className)}>
      {showImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className={cn("object-cover", imageClassName)}
        />
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_10%,rgba(166,107,69,0.22),transparent_55%),radial-gradient(100%_100%_at_100%_100%,rgba(58,41,33,0.9),transparent_60%)]"
        />
      )}
    </div>
  );
}
