import type { Metadata } from "next";
import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { contactContent } from "@/config/content";
import {
  activeSocialLinks,
  hasAnyContactDetail,
  isWhatsAppConfigured,
  siteConfig,
} from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = buildMetadata({
  title: contactContent.title,
  description: contactContent.description,
  path: "/contact",
});

/**
 * Contact page.
 *
 * Only genuinely supplied details are rendered. Until the company provides
 * them, the page says exactly which items are still needed instead of showing
 * placeholder phone numbers or a form that silently does nothing.
 */
export default function ContactPage() {
  const socials = activeSocialLinks();
  const hasDetails = hasAnyContactDetail();

  return (
    <>
      <section className="border-b border-sand bg-ivory">
        <div className="lw-container pb-12 pt-10 lg:pb-16 lg:pt-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          <p className="lw-eyebrow mt-8">{contactContent.eyebrow}</p>
          <h1 className="mt-4 text-display-lg">{contactContent.title}</h1>
          <p className="mt-6 max-w-2xl text-body-lg text-charcoal/75">
            {contactContent.description}
          </p>
        </div>
      </section>

      <section className="lw-container py-section">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Details */}
          <div className="lg:col-span-5">
            {/* WhatsApp — the primary route */}
            <div className="border border-sand bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <MessageCircle
                  aria-hidden="true"
                  className="h-5 w-5 text-cognac"
                  strokeWidth={1.75}
                />
                <h2 className="font-serif text-xl text-espresso">WhatsApp</h2>
              </div>
              <p className="mt-4 text-body-sm text-charcoal/70">
                The fastest way to reach us about a specific product. Your message opens
                with the item you are interested in already identified.
              </p>
              <div className="mt-6">
                <WhatsAppButton size="lg" className="w-full justify-center" />
              </div>
            </div>

            {/* Offices — both addresses printed on the catalog back cover. */}
            <div className="mt-8 border border-sand bg-white p-6 sm:p-8">
              <h2 className="font-serif text-xl text-espresso">Offices</h2>
              <div className="mt-6 space-y-8">
                {siteConfig.offices.map((office) => (
                  <div key={office.name}>
                    <h3 className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                      {office.name}
                    </h3>
                    <ul className="mt-3 space-y-3 text-body-sm">
                      {office.address ? (
                        <li className="flex items-start gap-3">
                          <MapPin
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-cognac"
                            strokeWidth={1.75}
                          />
                          <span className="text-charcoal/80">{office.address}</span>
                        </li>
                      ) : null}

                      {office.phone ? (
                        <li className="flex items-start gap-3">
                          <Phone
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-cognac"
                            strokeWidth={1.75}
                          />
                          <a
                            href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}
                            className="text-charcoal/80 transition-colors hover:text-cognac"
                          >
                            {office.phone}
                          </a>
                        </li>
                      ) : null}

                      {office.email ? (
                        <li className="flex items-start gap-3">
                          <Mail
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-cognac"
                            strokeWidth={1.75}
                          />
                          <a
                            href={`mailto:${office.email}`}
                            className="text-charcoal/80 transition-colors hover:text-cognac"
                          >
                            {office.email}
                          </a>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Social profiles — shown only when real URLs are configured. */}
            {socials.length > 0 ? (
              <div className="mt-8 border border-sand bg-white p-6 sm:p-8">
                <h2 className="font-serif text-xl text-espresso">Follow Us</h2>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-body-sm">
                  {socials.map((social) => (
                    <li key={social.label} className="flex items-center gap-2">
                      <Globe
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-cognac"
                        strokeWidth={1.75}
                      />
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-charcoal/80 transition-colors hover:text-cognac"
                      >
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Nothing configured yet — say so plainly. */}
            {!hasDetails ? (
              <div className="mt-8 border border-dashed border-sand bg-sand/30 p-6">
                <h2 className="text-caption font-semibold uppercase tracking-[0.14em] text-charcoal/60">
                  Contact details pending
                </h2>
                <p className="mt-3 text-body-sm text-charcoal/70">
                  No WhatsApp number, email, phone number or address has been configured
                  for this site yet. Add them in{" "}
                  <code className="bg-white px-1.5 py-0.5 text-[0.8125rem] text-espresso">
                    src/config/site.ts
                  </code>{" "}
                  and they will appear here, in the footer and on every product page
                  automatically.
                </p>
              </div>
            ) : isWhatsAppConfigured() ? null : (
              <p className="mt-6 text-body-sm text-charcoal/60">
                WhatsApp has not been configured yet, so enquiries currently go through
                the details above.
              </p>
            )}
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
