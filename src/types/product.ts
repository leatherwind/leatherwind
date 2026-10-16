/**
 * Domain types for the Leather Wind product catalogue.
 *
 * The shape is intentionally explicit so that `src/data/products.ts` can be
 * maintained by hand (or regenerated from the catalog) without touching any
 * component. Optional fields are omitted from the interface rather than filled
 * with invented values.
 */

export interface ProductSpecification {
  /** Specification label, e.g. "Dimensions", "Hardware", "Lining". */
  label: string;
  /** Specification value, transcribed from the catalog. */
  value: string;
}

export interface ProductVariation {
  /** What kind of variation this is, e.g. "Colour", "Size". */
  label: string;
  /** The documented options for that variation. */
  options: string[];
}

export interface Product {
  /** Stable, unique identifier. Used as a React key and for internal lookups. */
  id: string;
  /** URL segment: /products/[slug]. Lowercase, hyphenated. */
  slug: string;
  /** Exact product name as printed in the catalog. */
  name: string;
  /** Model number / SKU / article code, when the catalog provides one. */
  sku?: string;
  /** Category slug. Must exist in the category list. */
  category: string;
  /** Short one-line summary used on cards. Omit if the catalog gives none. */
  summary?: string;
  /** Full product description, transcribed from the catalog. */
  description?: string;
  /** Material information, when documented. */
  materials?: string[];
  /** Feature bullets as printed in the catalog. */
  features?: string[];
  /** Structured technical specifications. */
  specifications?: ProductSpecification[];
  /** Documented sizes, colours and other variations. */
  variations?: ProductVariation[];
  /** Primary photograph, relative to /public. */
  image: string;
  /** Descriptive alt text for the primary photograph. */
  imageAlt?: string;
  /** Additional photographs for the detail-page gallery. */
  gallery?: { src: string; alt: string }[];
  /** Surface on the homepage featured selection. */
  featured?: boolean;
  /** Manual display order within its category (ascending). */
  order?: number;
}

export interface Category {
  /** URL-safe identifier; referenced by `Product.category`. */
  slug: string;
  /** Display name. */
  name: string;
  /** One-sentence description of the category, factual and restrained. */
  description?: string;
  /** Representative photograph for the category tile. */
  image?: string;
  imageAlt?: string;
  /** Manual display order (ascending). */
  order?: number;
}

export type SortKey = "name-asc" | "name-desc" | "featured";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-asc", label: "Product name (A–Z)" },
  { value: "name-desc", label: "Product name (Z–A)" },
  { value: "featured", label: "Featured first" },
];
