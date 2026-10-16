import type { Metadata } from "next";
import { aboutContent } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { getAllProducts, getProductCount, getPopulatedCategories } from "@/lib/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EditorialImage } from "@/components/ui/ProductImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { LinkButton } from "@/components/ui/Button";
import { Rule } from "@/components/ui/Badge";

export const metadata: Metadata = buildMetadata({
  title: aboutContent.title,
  description: aboutContent.intro,
  path: "/about",
});

/**
 * About page.
 *
 * Editorial layout built from real catalog photography. All copy on this page
 * is transcribed from the company's own catalog (company profile, vision,
 * mission and product standards) — see src/config/content.ts. No founding
 * date, award, certification, client name or testimonial has been invented.
 */
export default function AboutPage() {
  const products = getAllProducts();
  const withImages = products.filter((product) => Boolean(product.image));
  const categories = getPopulatedCategories();

  const leadImage = withImages[0];
  const secondaryImage = withImages[1] ?? withImages[0];

  return (
    <>
      {/* Introduction */}
      <section className="border-b border-sand bg-ivory">
        <div className="lw-container pb-14 pt-10 lg:pb-20 lg:pt-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <p className="lw-eyebrow">{aboutContent.eyebrow}</p>
              <h1 className="mt-4 text-display-lg">{aboutContent.title}</h1>
              <p className="mt-8 max-w-xl text-body-lg text-charcoal/75">
                {aboutContent.intro}
              </p>
              <p className="mt-8 border-l-2 border-cognac pl-6 font-serif text-xl italic text-espresso">
                {aboutContent.highlight}
              </p>
            </div>

            <div className="lg:col-span-6">
              <EditorialImage
                src={leadImage?.image}
                alt={leadImage?.imageAlt ?? leadImage?.name ?? "Leather Wind collection"}
                aspect="aspect-[4/3]"
                sizes="(min-width: 1024px) 48vw, 92vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Editorial sections */}
      <section className="bg-white">
        <div className="lw-container py-section">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <EditorialImage
                src={secondaryImage?.image}
                alt={secondaryImage?.imageAlt ?? secondaryImage?.name ?? "Leather Wind collection"}
                aspect="aspect-[4/5]"
                sizes="(min-width: 1024px) 48vw, 92vw"
              />
            </div>

            <div className="lg:col-span-6">
              {aboutContent.sections.map((section, index) => (
                <div key={section.title} className={index > 0 ? "mt-12" : undefined}>
                  <h2 className="text-display-sm">{section.title}</h2>
                  <div className="lw-copy mt-6 max-w-prose text-body text-charcoal/75">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  {index < aboutContent.sections.length - 1 ? <Rule className="mt-12" /> : null}
                </div>
              ))}

              {/* Facts we actually hold, drawn from the catalog itself. */}
              {getProductCount() > 0 ? (
                <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-sand pt-10">
                  <div>
                    <dt className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Products in the catalog
                    </dt>
                    <dd className="mt-2 font-serif text-3xl text-espresso">
                      {getProductCount()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/55">
                      Product categories
                    </dt>
                    <dd className="mt-2 font-serif text-3xl text-espresso">
                      {categories.length}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-espresso">
        <div className="lw-container py-section">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-display-md text-ivory">{aboutContent.ctaTitle}</h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-ivory/70">
              {aboutContent.ctaDescription}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <WhatsAppButton size="lg" />
              <LinkButton href="/products" variant="light" size="lg">
                Browse the Collection
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
