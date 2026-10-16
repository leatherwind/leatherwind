import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoryCount, getPopulatedCategories } from "@/lib/products";
import { buildMetadata } from "@/lib/seo";
import { homeContent } from "@/config/content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductImage } from "@/components/ui/ProductImage";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = buildMetadata({
  title: "Categories",
  description:
    "Browse the Leather Wind collection by product category. Each category opens the corresponding filtered view of the catalog.",
  path: "/categories",
});

/**
 * Category index. Only categories that actually contain products are listed,
 * and each one links to the filtered catalog view.
 */
export default function CategoriesPage() {
  const categories = getPopulatedCategories();

  return (
    <>
      <section className="border-b border-sand bg-ivory">
        <div className="lw-container pb-12 pt-10 lg:pb-16 lg:pt-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
          <p className="lw-eyebrow mt-8">{homeContent.categories.eyebrow}</p>
          <h1 className="mt-4 text-display-lg">{homeContent.categories.title}</h1>
          <p className="mt-6 max-w-2xl text-body-lg text-charcoal/75">
            {homeContent.categories.description}
          </p>
        </div>
      </section>

      <section className="lw-container py-section">
        {categories.length > 0 ? (
          <ul role="list" className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = getCategoryCount(category.slug);
              return (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group flex h-full flex-col border border-sand/80 bg-white transition-colors duration-500 ease-editorial hover:border-espresso/25"
                  >
                    <ProductImage
                      src={category.image}
                      alt={category.imageAlt ?? `${category.name} — Leather Wind`}
                      aspect="aspect-[4/3]"
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                      fallbackLabel={category.name}
                      imageClassName="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.035]"
                    />
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-serif text-2xl text-espresso transition-colors duration-300 group-hover:text-cognac">
                        {category.name}
                      </h2>
                      {category.description ? (
                        <p className="mt-3 text-body-sm text-charcoal/70">
                          {category.description}
                        </p>
                      ) : null}
                      <div className="mt-6 flex items-center justify-between border-t border-sand/70 pt-4">
                        <span className="text-caption uppercase tracking-[0.14em] text-charcoal/45">
                          {count} {count === 1 ? "product" : "products"}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 text-charcoal/40 transition-all duration-300 ease-editorial group-hover:translate-x-1 group-hover:text-cognac"
                          strokeWidth={1.75}
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            title={homeContent.categories.emptyTitle}
            description={homeContent.categories.emptyDescription}
          />
        )}
      </section>
    </>
  );
}
