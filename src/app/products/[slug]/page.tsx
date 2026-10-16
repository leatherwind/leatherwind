import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllProducts, getCategoryName, getProductBySlug } from "@/lib/products";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery, type GalleryImage } from "@/components/products/ProductGallery";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import {
  FeatureList,
  MaterialsList,
  SpecificationList,
  VariationList,
} from "@/components/products/SpecificationList";
import { RelatedProducts } from "@/components/products/RelatedProducts";
import { cn } from "@/lib/utils";
import { getCatalogImages } from "@/lib/catalog-images";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every product page at build time. */
export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Product Not Found",
      path: `/products/${slug}`,
      noIndex: true,
    });
  }

  const categoryName = getCategoryName(product.category);
  const description =
    product.summary ??
    product.description ??
    `${product.name} — ${categoryName} by ${siteConfig.name}.`;

  return buildMetadata({
    title: product.name,
    description,
    path: `/products/${product.slug}`,
    image: product.image || undefined,
    imageAlt: product.imageAlt ?? `${product.name} — ${categoryName}`,
    type: "article",
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const categoryName = getCategoryName(product.category);

  // Photographs cropped from the catalog pages by `npm run catalog:images`. The
  // cropper names every file after the product slug, so the gallery is derived
  // from the directory and always matches what was cropped. If the cropper has
  // not been run, fall back to the single declared image.
  const discovered = getCatalogImages(product.slug);
  const gallerySources =
    discovered.length > 0 ? discovered : product.image ? [product.image] : [];

  const primaryImage = gallerySources[0] ?? product.image;

  const images: GalleryImage[] = [
    ...gallerySources.map((src, index) => ({
      src,
      alt:
        index === 0
          ? product.imageAlt ?? `${product.name} — ${categoryName}`
          : `${product.name} — ${categoryName} (view ${index + 1})`,
    })),
    ...(product.gallery ?? []),
  ];

  const hasDetails =
    Boolean(product.description) ||
    Boolean(product.materials?.length) ||
    Boolean(product.features?.length) ||
    Boolean(product.variations?.length) ||
    Boolean(product.specifications?.length);

  const jsonLd = productJsonLd({
    name: product.name,
    description: product.description ?? product.summary,
    sku: product.sku,
    image: primaryImage || undefined,
    category: categoryName,
    url: new URL(`/products/${product.slug}`, siteConfig.url).toString(),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb bar */}
      <div className="border-b border-sand bg-ivory">
        <div className="lw-container py-5">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: categoryName, href: `/products?category=${product.category}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* Product */}
      <section className="bg-ivory">
        <div className="lw-container py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery images={images} productName={product.name} />
            </div>

            {/* Summary */}
            <div className="lg:col-span-5">
              <Link
                href={`/products?category=${product.category}`}
                className="text-caption font-semibold uppercase tracking-[0.18em] text-cognac transition-colors hover:text-espresso"
              >
                {categoryName}
              </Link>

              <h1 className="mt-4 text-display-md">{product.name}</h1>

              {product.sku ? (
                <p className="mt-4 text-caption uppercase tracking-[0.14em] text-charcoal/50">
                  Product Code: <span className="text-espresso">{product.sku}</span>
                </p>
              ) : null}

              {product.summary ? (
                <p className="mt-6 text-body-lg text-charcoal/75">{product.summary}</p>
              ) : null}

              <div className="mt-8 border-t border-sand pt-8">
                <WhatsAppButton
                  product={product}
                  size="lg"
                  className="w-full justify-center"
                />
                <p className="mt-4 text-caption text-charcoal/55">
                  Opens WhatsApp with your message prepared — you send it yourself.
                </p>
              </div>

              {product.materials && product.materials.length > 0 ? (
                <div className="mt-10">
                  <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                    Material
                  </h2>
                  <div className="mt-4">
                    <MaterialsList materials={product.materials} />
                  </div>
                </div>
              ) : null}

              {product.variations && product.variations.length > 0 ? (
                <div className="mt-10">
                  <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                    Available Options
                  </h2>
                  <div className="mt-4">
                    <VariationList variations={product.variations} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Description & specification */}
      {hasDetails ? (
        <section className="border-t border-sand bg-white">
          <div className="lw-container py-section">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              {product.description ? (
                <div className="lg:col-span-5">
                  <h2 className="text-display-sm">Description</h2>
                  <div className="lw-copy mt-6 max-w-prose text-body text-charcoal/75">
                    {product.description
                      .split("\n")
                      .filter((line) => line.trim().length > 0)
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                  </div>
                </div>
              ) : null}

              <div
                className={cn(
                  product.description ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-8",
                )}
              >
                {product.features && product.features.length > 0 ? (
                  <div>
                    <h2 className="text-display-sm">Key Features</h2>
                    <div className="mt-6">
                      <FeatureList features={product.features} />
                    </div>
                  </div>
                ) : null}

                {product.specifications && product.specifications.length > 0 ? (
                  <div
                    className={
                      product.features && product.features.length > 0
                        ? "mt-12"
                        : undefined
                    }
                  >
                    <h2 className="text-display-sm">Specification</h2>
                    <div className="mt-6">
                      <SpecificationList specifications={product.specifications} />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Back to catalog */}
      <div className="border-t border-sand bg-white">
        <div className="lw-container py-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/70 transition-colors hover:text-cognac"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            Back to all products
          </Link>
        </div>
      </div>

      <RelatedProducts product={product} />
    </>
  );
}
