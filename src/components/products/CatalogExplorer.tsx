"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Category, Product, SortKey } from "@/types/product";
import { SORT_OPTIONS } from "@/types/product";
import { applyCatalogQuery } from "@/lib/products";
import { productsContent } from "@/config/content";
import { cn } from "@/lib/utils";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Catalog explorer — search, category filter, sort, count and incremental
 * loading, all client-side over the locally bundled catalog.
 *
 * Notes on the design:
 *   - Filtering runs through `applyCatalogQuery`, the same function the server
 *     uses, so results are identical in both places.
 *   - The URL is kept in sync (?category=, ?q=, ?sort=) with `router.replace`
 *     and `scroll: false`, so a filtered view can be shared or bookmarked
 *     without yanking the viewport around.
 *   - `useSearchParams` is deliberately NOT used, so this component does not
 *     force a Suspense boundary or opt the page out of static rendering.
 */

const PAGE_SIZE = 12;

interface CatalogExplorerProps {
  products: Product[];
  categories: Category[];
  totalCount: number;
  initialSearch?: string;
  initialCategory?: string;
  initialSort?: SortKey;
}

export function CatalogExplorer({
  products,
  categories,
  totalCount,
  initialSearch = "",
  initialCategory = "",
  initialSort = "name-asc",
}: CatalogExplorerProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>(initialSort);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const isFirstRender = useRef(true);

  const results = useMemo(
    () => applyCatalogQuery(products, { search, category, sort }),
    [products, search, category, sort],
  );

  // Keep the address bar shareable. Biased to replace() so the back button is
  // not polluted with one entry per keystroke.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search.trim()) params.set("q", search.trim());
    if (sort !== "name-asc") params.set("sort", sort);
    const query = params.toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  }, [category, search, sort, router]);

  const resetVisible = useCallback(() => setVisible(PAGE_SIZE), []);
  useEffect(resetVisible, [search, category, sort, resetVisible]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("name-asc");
  };

  const shown = results.slice(0, visible);
  const hasFilters = Boolean(search.trim() || category || sort !== "name-asc");
  const emptyCatalog = totalCount === 0;

  const resultsLabel = `${results.length} ${
    results.length === 1 ? productsContent.resultSingular : productsContent.resultPlural
  }`;

  return (
    <div>
      {/* Controls */}
      <div className="border-y border-sand bg-white">
        <div className="lw-container py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            {/* Search */}
            <form
              role="search"
              className="w-full lg:max-w-md"
              onSubmit={(event) => event.preventDefault()}
            >
              <label
                htmlFor="catalog-search"
                className="block text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/60"
              >
                {productsContent.searchLabel}
              </label>
              <div className="relative mt-2">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40"
                  strokeWidth={1.75}
                />
                <input
                  id="catalog-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={productsContent.searchPlaceholder}
                  autoComplete="off"
                  className="w-full rounded-control border border-sand bg-ivory py-3 pl-10 pr-10 text-body-sm text-espresso placeholder:text-charcoal/40 focus:border-cognac focus:outline-none focus-visible:outline-none"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-control text-charcoal/45 transition-colors hover:text-cognac"
                  >
                    <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                ) : null}
              </div>
            </form>

            {/* Category + sort */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div>
                <label
                  htmlFor="catalog-category"
                  className="block text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/60"
                >
                  {productsContent.categoryLabel}
                </label>
                <select
                  id="catalog-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full min-w-[12rem] rounded-control border border-sand bg-ivory px-3 py-3 text-body-sm text-espresso focus:border-cognac focus:outline-none sm:w-auto"
                >
                  <option value="">{productsContent.allCategories}</option>
                  {categories.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="catalog-sort"
                  className="block text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/60"
                >
                  {productsContent.sortLabel}
                </label>
                <select
                  id="catalog-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="mt-2 w-full min-w-[12rem] rounded-control border border-sand bg-ivory px-3 py-3 text-body-sm text-espresso focus:border-cognac focus:outline-none sm:w-auto"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Result count + clear */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand/70 pt-4">
            <p aria-live="polite" className="text-body-sm text-charcoal/70">
              {productsContent.showingLabel}{" "}
              <span className="font-semibold text-espresso">{shown.length}</span> of{" "}
              <span className="font-semibold text-espresso">{results.length}</span>{" "}
              {resultsLabel.replace(/^\d+\s/, "")}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/60 underline-offset-4 transition-colors hover:text-cognac hover:underline"
              >
                {productsContent.clearFilters}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="lw-container py-14">
        {emptyCatalog ? (
          <EmptyState
            title={productsContent.emptyCatalogTitle}
            description={productsContent.emptyCatalogDescription}
          />
        ) : results.length === 0 ? (
          <EmptyState
            title={productsContent.emptyTitle}
            description={productsContent.emptyDescription}
            action={
              <Button variant="outline" size="md" onClick={clearFilters}>
                {productsContent.clearFilters}
              </Button>
            }
          />
        ) : (
          <>
            <ProductGrid products={shown} priorityCount={4} />

            {visible < results.length ? (
              <div className="mt-14 flex flex-col items-center gap-4">
                <p className={cn("text-body-sm text-charcoal/60")}>
                  {shown.length} / {results.length}
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisible((value) => value + PAGE_SIZE)}
                >
                  {productsContent.loadMore}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
