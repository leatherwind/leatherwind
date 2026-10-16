import { ArrowRight } from "lucide-react";
import { homeContent } from "@/config/content";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Homepage hero.
 *
 * A single, centred editorial copy block on ivory: eyebrow, headline, rule,
 * description, and the two actions. Deliberately no photograph — the headline
 * gets the full width of the page to itself and the composition reads like the
 * opening spread of a catalogue, with the photography beginning further down
 * the page.
 */

export function Hero() {
  const { eyebrow, title, description, primaryCta, secondaryCta } = homeContent.hero;

  return (
    <section className="border-b border-sand bg-ivory" aria-labelledby="hero-title">
      <div className="lw-container py-20 text-center sm:py-24 lg:py-32">
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
    </section>
  );
}
