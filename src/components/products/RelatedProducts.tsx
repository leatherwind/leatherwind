import type { Product } from "@/types/product";
import { getRelatedProducts } from "@/lib/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { LinkButton } from "@/components/ui/Button";

/**
 * A short "more from this category" rail. Kept small on purpose — the detail
 * page should end on the product, not on a wall of recommendations.
 *
 * Every related card reuses ProductCard, so it links to its own detail page and
 * builds its own product-specific WhatsApp message.
 */
export function RelatedProducts({ product }: { product: Product }) {
  const related = getRelatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section className="border-t border-sand bg-white" aria-labelledby="related-title">
      <div className="lw-container py-section">
        <SectionHeading
          eyebrow="More to Explore"
          title={<span id="related-title">Related Products</span>}
          action={
            <LinkButton href="/products" variant="outline" size="md">
              View All Products
            </LinkButton>
          }
        />

        <div className="mt-12">
          <ProductGrid products={related} columns="compact" />
        </div>
      </div>
    </section>
  );
}
