import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { getFeaturedProducts, getProductCount } from "@/lib/products";
import { getCatalogImages } from "@/lib/catalog-images";
import { Hero } from "@/components/home/Hero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BrandStatement } from "@/components/home/BrandStatement";
import { InquiryCta } from "@/components/home/InquiryCta";

export const metadata: Metadata = buildMetadata({
  title: siteConfig.name,
  description: siteConfig.shortDescription,
  path: "/",
});

export default function HomePage() {
  // Prefer the craft photographs from the catalog cover for the hero, falling
  // back to the first available product photograph. If nothing has been
  // extracted yet, Hero renders its espresso panel composition instead.
  const catalogue = getFeaturedProducts(Math.max(getProductCount(), 1));
  const heroProduct = catalogue.find((product) => Boolean(product.image));

  const coverPhotos = getCatalogImages("catalog-cover");
  const profilePhotos = getCatalogImages("catalog-profile");

  const heroImage = coverPhotos[0] ?? profilePhotos[0] ?? heroProduct?.image;
  const heroIsBrandPhoto = heroImage === coverPhotos[0] || heroImage === profilePhotos[0];

  const brandImage =
    profilePhotos[1] ?? profilePhotos[0] ?? coverPhotos[1] ?? heroProduct?.image;

  return (
    <>
      <Hero
        image={heroImage}
        imageAlt={
          heroIsBrandPhoto
            ? "Leather Wind craftsmanship — working leather by hand"
            : heroProduct?.imageAlt ?? heroProduct?.name
        }
        caption={heroIsBrandPhoto ? undefined : heroProduct?.name}
        captionHref={
          heroIsBrandPhoto || !heroProduct ? undefined : `/products/${heroProduct.slug}`
        }
      />

      <FeaturedProducts />

      <CategoryShowcase />

      <BrandStatement
        image={brandImage}
        imageAlt={
          brandImage === heroProduct?.image
            ? heroProduct?.imageAlt ?? heroProduct?.name
            : "Leather Wind workshop — leather being cut and worked by hand"
        }
      />

      <InquiryCta />
    </>
  );
}
