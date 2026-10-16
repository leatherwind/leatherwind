import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/config/content";
import { EditorialImage } from "@/components/ui/ProductImage";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Homepage hero.
 *
 * Composition: a centred editorial copy block on ivory, followed by a wide,
 * full-bleed photographic band. There is no side-by-side split — the headline
 * gets the full width of the page to itself, and the photograph is presented as
 * one cinematic plate beneath it, the way a catalogue opener would be set.
 *
 * The featured-product caption sits in a quiet magazine-style line under the
 * photograph rather than over it, so it stays legible whatever the image.
 *
 * When no catalog photograph is available yet, EditorialImage renders a deep
 * espresso panel, so the composition holds together without a stock photo.
 */

interface HeroProps {
  image?: string;
  imageAlt?: string;
  /** Small caption under the photograph, e.g. the featured product name. */
  caption?: string;
  /** Where the caption links to, when it refers to a real product. */
  captionHref?: string;
}

export function Hero({ image, imageAlt, caption, captionHref }: HeroProps) {
  const { eyebrow, title, description, primaryCta, secondaryCta } = homeContent.hero;

  return (
    <section className="border-b border-sand bg-ivory" aria-labelledby="hero-title">
      {/* Centred copy */}
      <div className="lw-container pb-12 pt-16 text-center sm:pt-20 lg:pb-16 lg:pt-24">
        <div className="flex items-center justify-center gap-4">
          <span className="hidden h-px w-10 bg-sand sm:block" aria-hidden="true" />
          <p className="lw-eyebrow">{eyebrow}</p>
          <span className="hidden h-px w-10 bg-sand sm:block" aria-hidden="true" />
        </div>

        <h1
          id="hero-title"
          className="mx-auto mt-6 max-w-4xl text-display-lg text-espresso sm:text-display-xl"
        >
          {title}
        </h1>

        <div className="mx-auto mt-8 h-px w-16 bg-cognac" aria-hidden="true" />

        <p className="mx-auto mt-8 max-w-xl text-body-lg text-charcoal/75">{description}</p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <LinkButton
            href="/products"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            {primaryCta}
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
          </LinkButton>

          <WhatsAppButton
            variant="outline"
            size="lg"
            label={secondaryCta}
            className="w-full justify-center sm:w-auto"
          />
        </div>
      </div>

      {/* Wide photographic band — full-bleed, presented as a single plate. */}
      <div className="relative">
        <EditorialImage
          src={image}
          alt={imageAlt ?? "Leather Wind collection"}
          aspect="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] lg:max-h-[38rem]"
          sizes="100vw"
          priority
        />
      </div>

      {/* Magazine-style caption line, shown only when it refers to a product. */}
      {caption ? (
        <div className="lw-container flex flex-wrap items-baseline gap-x-4 gap-y-1 py-5">
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-charcoal/45">
            Featured
          </span>
          {captionHref ? (
            <Link
              href={captionHref}
              className="group inline-flex items-center gap-2 font-serif text-lg text-espresso transition-colors duration-300 hover:text-cognac"
            >
              {caption}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          ) : (
            <span className="font-serif text-lg text-espresso">{caption}</span>
          )}
        </div>
      ) : null}
    </section>
  );
}
