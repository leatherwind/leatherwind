import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/config/content";
import { getCategoryCount, getPopulatedCategories } from "@/lib/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Category showcase. Derived entirely from catalog data — a category is only
 * shown when it contains at least one product, and every tile links to the
 * filtered catalog view for that category.
 */
export function CategoryShowcase() {
  const categories = getPopulatedCategories();
  const { eyebrow, title, description, cta, emptyTitle, emptyDescription } =
    homeContent.categories;

  // Wide first tile on desktop keeps the composition asymmetric.
  const featuredSpan = "lg:col-span-2";

  return (
    <section className="border-y border-sand bg-white" aria-labelledby="categories-title">
      <div className="lw-container py-section">
        <SectionHeading
          eyebrow={eyebrow}
          title={<span id="categories-title">{title}</span>}
          description={description}
          action={
            categories.length > 0 ? (
              <LinkButton href="/categories" variant="outline" size="md">
                {cta}
              </LinkButton>
            ) : null
          }
        />

        <div className="mt-14">
          {categories.length > 0 ? (
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {categories.map((category, index) => {
                const count = getCategoryCount(category.slug);
                return (
                  <li
                    key={category.slug}
                    className={index === 0 && categories.length > 2 ? featuredSpan : undefined}
                  >
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="group flex h-full flex-col border border-sand/80 bg-ivory transition-colors duration-500 ease-editorial hover:border-espresso/25"
                    >
                      <ProductImage
                        src={category.image}
                        alt={category.imageAlt ?? `${category.name} — Leather Wind`}
                        aspect={index === 0 && categories.length > 2 ? "aspect-[16/10]" : "aspect-[4/3]"}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 92vw"
                        fallbackLabel={category.name}
                        imageClassName="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.035]"
                      />

                      <div className="flex flex-1 items-end justify-between gap-4 p-6">
                        <div>
                          <h3 className="font-serif text-xl text-espresso transition-colors duration-300 group-hover:text-cognac">
                            {category.name}
                          </h3>
                          {category.description ? (
                            <p className="mt-2 max-w-sm text-body-sm text-charcoal/70">
                              {category.description}
                            </p>
                          ) : null}
                          <p className="mt-3 text-caption uppercase tracking-[0.14em] text-charcoal/45">
                            {count} {count === 1 ? "product" : "products"}
                          </p>
                        </div>

                        <ArrowRight
                          aria-hidden="true"
                          className="h-5 w-5 shrink-0 text-charcoal/40 transition-all duration-300 ease-editorial group-hover:translate-x-1 group-hover:text-cognac"
                          strokeWidth={1.5}
                        />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          )}
        </div>
      </div>
    </section>
  );
}
