import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { getCategoryName } from "@/lib/products";
import { truncate } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Catalog product card.
 *
 * Interaction model — this matters, so it is spelled out:
 *   - The whole card is a single stretched link to the product page. The link
 *     lives on the product-name heading and covers the card via an ::after
 *     overlay, so there is no nested <a> and the click target is generous.
 *   - The WhatsApp action is a SIBLING link, lifted above the overlay with
 *     `relative z-10`. Clicking it opens WhatsApp; clicking anywhere else opens
 *     the product. The two actions can never fire each other accidentally.
 *
 * Nothing is shown that the catalog does not document: no price, no rating, no
 * stock badge, no discount.
 */

interface ProductCardProps {
  product: Product;
  /** Above-the-fold cards should preload their image. */
  priority?: boolean;
  sizes?: string;
}

export function ProductCard({ product, priority = false, sizes }: ProductCardProps) {
  const href = `/products/${product.slug}`;
  const categoryName = getCategoryName(product.category);

  return (
    <article className="group relative flex flex-col border border-sand/80 bg-white transition-colors duration-500 ease-editorial hover:border-espresso/25">
      <div className="relative overflow-hidden">
        <ProductImage
          src={product.image || undefined}
          alt={product.imageAlt ?? `${product.name} — ${categoryName}`}
          priority={priority}
          sizes={sizes}
          aspect="aspect-[4/5]"
          fallbackLabel={product.name}
          imageClassName="transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.035]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-cognac">
          {categoryName}
        </p>

        <h3 className="mt-3 font-serif text-xl leading-snug text-espresso">
          <Link
            href={href}
            className="transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:text-cognac"
          >
            {product.name}
          </Link>
        </h3>

        {product.sku ? (
          <p className="mt-2 text-caption uppercase tracking-[0.12em] text-charcoal/50">
            {product.sku}
          </p>
        ) : null}

        {product.summary ? (
          <p className="mt-3 text-body-sm text-charcoal/70">
            {truncate(product.summary, 118)}
          </p>
        ) : null}

        {/* Action row.
            "View Details" sits under the card-wide overlay link, so it opens the
            product page. Only the WhatsApp action is lifted above the overlay
            (relative z-10) so it can never be swallowed by the details link. */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
          <span className="inline-flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.14em] text-espresso transition-colors duration-300 group-hover:text-cognac">
            View Details
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.75}
            />
          </span>

          <WhatsAppButton
            product={product}
            size="sm"
            variant="outline"
            label="Inquire"
            hideIcon
            className="relative z-10"
          />
        </div>
      </div>
    </article>
  );
}
