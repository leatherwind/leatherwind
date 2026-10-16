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
  // The brand section prefers the company-profile photograph from the catalog,
  // then the cover, then any product photograph. Until `npm run catalog:images`
  // has been run, the frame shows its espresso panel instead.
  const catalogue = getFeaturedProducts(Math.max(getProductCount(), 1));
  const fallbackImage = catalogue.find((product) => Boolean(product.image))?.image;

  const coverPhotos = getCatalogImages("catalog-cover");
  const profilePhotos = getCatalogImages("catalog-profile");

  const brandImage =
    profilePhotos[0] ?? coverPhotos[0] ?? coverPhotos[1] ?? fallbackImage;

  return (
    <>
      <Hero />

      <FeaturedProducts />

      <CategoryShowcase />

      <BrandStatement
        image={brandImage}
        imageAlt={"Leather Wind workshop — leather being cut and worked by hand"}
      />

      <InquiryCta />
    </>
  );
}
