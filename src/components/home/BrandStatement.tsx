import { homeContent } from "@/config/content";
import { EditorialImage } from "@/components/ui/ProductImage";
import { Rule } from "@/components/ui/Badge";

/**
 * Brand presentation.
 *
 * Editorial, balanced layout: a tall photograph beside a measured column of
 * copy and three quiet points. Copy is positioning, not biography — see
 * src/config/content.ts.
 */
export function BrandStatement({
  image,
  imageAlt,
}: {
  image?: string;
  imageAlt?: string;
}) {
  const { eyebrow, title, paragraphs, points } = homeContent.brand;

  return (
    <section className="lw-container py-section" aria-labelledby="brand-title">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <EditorialImage
            src={image}
            alt={imageAlt ?? "Leather Wind leather goods"}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 40vw, 92vw"
          />
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="lw-eyebrow">{eyebrow}</p>
          <h2 id="brand-title" className="mt-4 text-display-md">
            {title}
          </h2>

          <div className="lw-copy mt-6 max-w-xl text-body text-charcoal/75">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <Rule className="mt-10" />

          <dl className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {points.map((point) => (
              <div key={point.title}>
                <dt className="font-serif text-lg text-espresso">{point.title}</dt>
                <dd className="mt-3 text-body-sm text-charcoal/70">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
