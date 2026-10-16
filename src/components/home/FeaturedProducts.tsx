import { homeContent } from "@/config/content";
import { getFeaturedProducts, getProductCount } from "@/lib/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * Homepage featured selection — a small, hand-picked group of catalog products.
 * Falls back to a restrained empty state while the catalog has no records.
 */
export function FeaturedProducts() {
  const products = getFeaturedProducts(8);
  const { eyebrow, title, description, cta, emptyTitle, emptyDescription } =
    homeContent.featured;

  return (
    <section className="lw-container py-section" aria-labelledby="featured-title">
      <SectionHeading
        eyebrow={eyebrow}
        title={<span id="featured-title">{title}</span>}
        description={description}
        action={
          getProductCount() > 0 ? (
            <LinkButton href="/products" variant="outline" size="md">
              {cta}
            </LinkButton>
          ) : null
        }
      />

      <div className="mt-14">
        {products.length > 0 ? (
          <ProductGrid products={products} priorityCount={2} columns="wide" />
        ) : (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={<WhatsAppButton size="lg" />}
          />
        )}
      </div>
    </section>
  );
}
