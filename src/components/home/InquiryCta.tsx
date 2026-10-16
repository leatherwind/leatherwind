import { Mail, Phone } from "lucide-react";
import { homeContent } from "@/config/content";
import { siteConfig } from "@/config/site";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Closing enquiry call to action.
 *
 * A deep espresso band with a single, unmissable action. Secondary contact
 * routes are shown only when the company has actually supplied them.
 */
export function InquiryCta() {
  const { eyebrow, title, description, cta } = homeContent.inquiry;
  const { email, phone } = siteConfig.contact;

  return (
    <section className="bg-espresso" aria-labelledby="inquiry-title">
      <div className="lw-container py-section">
        <div className="mx-auto max-w-3xl text-center">
          <p className="lw-eyebrow text-cognac">{eyebrow}</p>
          <h2 id="inquiry-title" className="mt-5 text-display-md text-ivory">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-body-lg text-ivory/70">{description}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <WhatsAppButton size="lg" />
            <LinkButton href="/products" variant="light" size="lg">
              {cta}
            </LinkButton>
          </div>

          {email || phone ? (
            <div className="mt-10 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-8 text-body-sm text-ivory/70 sm:flex-row sm:gap-10">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-cognac"
                >
                  <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                  {email}
                </a>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-cognac"
                >
                  <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                  {phone}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
