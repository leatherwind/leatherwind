"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Product image gallery.
 *
 * Behaviour:
 *   - A main image on a neutral panel, shown with `object-contain` so the
 *     photograph's original proportions are never distorted or cropped.
 *   - Clickable thumbnails switch the main image.
 *   - The main image opens a full-screen viewer with previous/next controls.
 *   - Fully keyboard operable: ← / → move between images, Escape closes the
 *     viewer, and focus moves into — and back out of — the dialog.
 *   - When a product has only one photograph, the thumbnail rail and the
 *     expand affordance are hidden rather than shown as dead controls.
 */

export interface GalleryImage {
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: GalleryImage[];
  productName: string;
}

/**
 * next/image with an honest failure state.
 *
 * The catalog photographs are produced by `npm run catalog:images`. If that has
 * not been run yet, the frame shows a neutral brand surface rather than a broken
 * image icon. `compact` drops the label for the small thumbnail rail.
 */
function GalleryFrame({
  src,
  alt,
  sizes,
  className,
  priority = false,
  compact = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="lw-image-placeholder absolute inset-0 h-full w-full px-2 text-center">
        {compact ? null : (
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.18em]">
            Photograph to be supplied
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const count = images.length;
  const current = images[index];

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  // Global keyboard handling while the viewer is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") goTo(index + 1);
      if (event.key === "ArrowLeft") goTo(index - 1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, index, goTo]);

  const closeViewer = () => {
    setOpen(false);
    // Return focus to the element that opened the viewer.
    triggerRef.current?.focus();
  };

  // No photograph supplied yet — hold the layout with a neutral panel.
  if (!current) {
    return (
      <div className="lw-image-placeholder aspect-[4/5] w-full border border-sand">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.18em]">
          {productName}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative border border-sand bg-white">
        <div className="relative aspect-[4/5] w-full sm:aspect-[5/6]">
          <GalleryFrame
            src={current.src}
            alt={current.alt}
            priority
            sizes="(min-width: 1024px) 55vw, 92vw"
            className="object-contain p-4 sm:p-6"
          />
        </div>

        {count > 1 ? (
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open enlarged image"
            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-control border border-sand bg-ivory/90 text-espresso backdrop-blur transition-colors hover:border-espresso hover:text-cognac"
          >
            <Expand aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
          </button>
        ) : null}
      </div>

      {/* Thumbnails */}
      {count > 1 ? (
        <ul role="list" className="lw-no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {images.map((image, itemIndex) => {
            const selected = itemIndex === index;
            return (
              <li key={`${image.src}-${itemIndex}`} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(itemIndex)}
                  aria-label={`View image ${itemIndex + 1} of ${count}`}
                  aria-current={selected}
                  className={cn(
                    "relative h-20 w-16 overflow-hidden border bg-white transition-colors duration-300 ease-editorial sm:h-24 sm:w-20",
                    selected
                      ? "border-cognac"
                      : "border-sand hover:border-espresso/40",
                  )}
                >
                  <GalleryFrame
                    src={image.src}
                    alt=""
                    compact
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-caption uppercase tracking-[0.14em] text-charcoal/45">
          1 photograph
        </p>
      )}

      {/* Enlarged viewer */}
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} — enlarged image ${index + 1} of ${count}`}
          className="fixed inset-0 z-[80] flex flex-col bg-espresso/95 p-4 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <p className="text-caption uppercase tracking-[0.16em] text-ivory/70">
              {index + 1} / {count}
            </p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeViewer}
              aria-label="Close enlarged image"
              className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-white/25 text-ivory transition-colors hover:border-cognac hover:text-cognac"
            >
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative mt-4 flex-1">
            <GalleryFrame
              src={current.src}
              alt={current.alt}
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {count > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                aria-label="Previous image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-white/25 text-ivory transition-colors hover:border-cognac hover:text-cognac"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                aria-label="Next image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-control border border-white/25 text-ivory transition-colors hover:border-cognac hover:text-cognac"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
