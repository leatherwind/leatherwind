import type { Metadata } from "next";
import { productsContent } from "@/config/content";
import {
  getAllProducts,
  getPopulatedCategories,
  isValidCategory,
} from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogExplorer } from "@/components/products/CatalogExplorer";
import type { SortKey } from "@/types/product";
import { SORT_OPTIONS } from "@/types/product";

export const metadata: Metadata = buildMetadata({
  title: productsContent.title,
  description: productsContent.description,
  path: "/products",
});

const VALID_SORTS = SORT_OPTIONS.map((option) => option.value) as SortKey[];

function normalizeSort(value: string | undefined): SortKey {
  return VALID_SORTS.includes(value as SortKey) ? (value as SortKey) : "name-asc";
}

/**
 * Full catalog. Rendered on the server; the interactive search / filter / sort
 * layer is a client component that receives the bundled catalog as props.
 *
 * Initial state is read from the URL so ?category=… links (from the homepage,
 * the category page and the footer) land on a correctly filtered view.
 */
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] ?? "" : value ?? "";

  const rawCategory = first(params.category);
  const category = rawCategory && isValidCategory(rawCategory) ? rawCategory : "";
  const search = first(params.q);
  const sort = normalizeSort(first(params.sort) || undefined);

  const allProducts = getAllProducts();
  const categories = getPopulatedCategories();

  return (
    <>
      {/* Page header */}
      <section className="border-b border-sand bg-ivory">
        <div className="lw-container pb-12 pt-10 lg:pb-16 lg:pt-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products" }]} />
          <p className="lw-eyebrow mt-8">{productsContent.eyebrow}</p>
          <h1 className="mt-4 text-display-lg">{productsContent.title}</h1>
          <p className="mt-6 max-w-2xl text-body-lg text-charcoal/75">
            {productsContent.description}
          </p>
        </div>
      </section>

      <CatalogExplorer
        products={allProducts}
        categories={categories}
        totalCount={allProducts.length}
        initialSearch={search}
        initialCategory={category}
        initialSort={sort}
      />
    </>
  );
}
