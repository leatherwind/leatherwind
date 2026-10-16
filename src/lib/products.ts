import { products } from "@/data/products";
import { categories } from "@/data/categories";
import type { Category, Product, SortKey } from "@/types/product";
import { slugify } from "@/lib/utils";

/**
 * Read-only queries over the local catalog. Components never touch the raw
 * arrays directly, which keeps sorting and filtering rules in one place.
 */

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProductCount(): number {
  return products.length;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getCategories(): Category[] {
  return [...categories].sort(
    (a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name),
  );
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}

/** Number of products belonging to a category. */
export function getCategoryCount(slug: string): number {
  return products.filter((p) => p.category === slug).length;
}

/**
 * Categories that actually contain products, in display order. Used by the
 * category showcase and the catalog filter so we never render an empty filter.
 */
export function getPopulatedCategories(): Category[] {
  return getCategories().filter((c) => getCategoryCount(c.slug) > 0);
}

export function getFeaturedProducts(limit = 6): Product[] {
  const featured = products.filter((p) => p.featured);
  const pool = featured.length > 0 ? featured : products;
  return [...pool]
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    .slice(0, limit);
}

/** Related items: same category first, then the rest of the catalog. */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const others = products.filter(
    (p) => p.id !== product.id && p.category !== product.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export interface CatalogQuery {
  search?: string;
  category?: string;
  sort?: SortKey;
}

/** Free-text match across name, SKU and description. */
function matchesSearch(product: Product, term: string): boolean {
  const haystack = [product.name, product.sku ?? "", product.summary ?? "", product.description ?? ""]
    .join(" ")
    .toLowerCase();
  return term
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

export function sortProducts(items: Product[], sort: SortKey = "name-asc"): Product[] {
  const sorted = [...items];
  switch (sort) {
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "featured":
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          a.name.localeCompare(b.name),
      );
    case "name-asc":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
}

/**
 * The single filtering implementation used by both the server-rendered catalog
 * and the client-side explorer, so the two can never disagree.
 *
 * Order: category filter → free-text search → sort.
 */
export function applyCatalogQuery(items: Product[], query: CatalogQuery = {}): Product[] {
  const { search = "", category = "", sort = "name-asc" } = query;
  let result = [...items];

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  const term = search.trim();
  if (term) {
    result = result.filter((p) => matchesSearch(p, term));
  }

  return sortProducts(result, sort);
}

/** Applies search + category filter + sort across the whole catalog. */
export function queryProducts(query: CatalogQuery = {}): Product[] {
  return applyCatalogQuery(products, query);
}

/** True when the given slug exists — used to validate URL params. */
export function isValidCategory(slug: string): boolean {
  return categories.some((c) => c.slug === slug);
}

/** Produces a unique slug, appending a numeric suffix on collision. */
export function ensureUniqueSlug(name: string, existing: string[] = []): string {
  const base = slugify(name);
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}
