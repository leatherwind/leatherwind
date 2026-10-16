import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Central metadata builder.
 *
 * Every page derives its <title>, description, canonical URL and Open Graph
 * tags from here so that URLs stay consistent with the configured domain.
 */

interface BuildMetadataOptions {
  title: string;
  description?: string;
  /** Path beginning with "/", used for the canonical URL. */
  path?: string;
  /**
   * Public-relative path to a social card image. When omitted, the generated
   * brand card from app/opengraph-image.tsx is used automatically.
   */
  image?: string;
  imageAlt?: string;
  /** Set for pages that should not appear in search results. */
  noIndex?: boolean;
  type?: "website" | "article";
}

export function buildMetadata({
  title,
  description = siteConfig.shortDescription,
  path = "/",
  image,
  imageAlt = `${siteConfig.name} — leather goods`,
  noIndex = false,
  type = "website",
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const fullTitle =
    title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;

  // Only declare an explicit image when we actually have one; otherwise the
  // file-based opengraph-image convention supplies the default brand card.
  const images = image ? [{ url: image, alt: imageAlt }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

/**
 * Product structured data. Deliberately limited to facts we actually hold:
 * no price, no rating, no availability, no reviews.
 */
export function productJsonLd(input: {
  name: string;
  description?: string;
  sku?: string;
  image?: string;
  category?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    ...(input.sku ? { sku: input.sku, mpn: input.sku } : {}),
    ...(input.image ? { image: [new URL(input.image, siteConfig.url).toString()] } : {}),
    ...(input.category ? { category: input.category } : {}),
    brand: { "@type": "Brand", name: siteConfig.name },
    url: input.url,
  };
}

/** Minimal organisation data — name and URL only, nothing invented. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}
