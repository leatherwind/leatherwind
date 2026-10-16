import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  activeSocialLinks,
  hasAnyContactDetail,
  isWhatsAppConfigured,
  siteConfig,
} from "@/config/site";
import { getPopulatedCategories } from "@/lib/products";
import { Wordmark } from "@/components/layout/Wordmark";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Site footer.
 *
 * Only real, supplied information is rendered: contact rows disappear when the
 * corresponding value is empty, and the social list is hidden entirely until at
 * least one genuine URL is configured.
 */
export function Footer() {
  const socials = activeSocialLinks();
  const categories = getPopulatedCategories();
  const year = new Date().getFullYear();
  const { email, phone, address } = siteConfig.contact;

  return (
    <footer className="mt-section bg-espresso text-ivory">
      <div className="lw-container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Wordmark tone="light" size="md" />
            <p className="mt-6 max-w-sm text-body-sm text-ivory/65">
              {siteConfig.shortDescription}
            </p>
            <div className="mt-8">
              <WhatsAppButton variant="primary" size="md" />
            </div>
          </div>

          {/* Catalog */}
          <nav aria-label="Catalog" className="lg:col-span-2">
            <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-ivory/50">
              Catalog
            </h2>
            <ul className="mt-5 space-y-3 text-body-sm">
              <li>
                <Link href="/products" className="text-ivory/80 transition-colors hover:text-cognac">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-ivory/80 transition-colors hover:text-cognac">
                  Categories
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="text-ivory/80 transition-colors hover:text-cognac"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company" className="lg:col-span-2">
            <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-ivory/50">
              Company
            </h2>
            <ul className="mt-5 space-y-3 text-body-sm">
              <li>
                <Link href="/about" className="text-ivory/80 transition-colors hover:text-cognac">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-ivory/80 transition-colors hover:text-cognac">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact — hidden entirely when nothing has been supplied */}
          {hasAnyContactDetail() ? (
            <div className="lg:col-span-4">
              <h2 className="text-caption font-semibold uppercase tracking-[0.18em] text-ivory/50">
                Contact
              </h2>
              <ul className="mt-5 space-y-3 text-body-sm text-ivory/80">
                {isWhatsAppConfigured() ? (
                  <li>WhatsApp enquiries available</li>
                ) : null}
                {email ? (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-cognac"
                    >
                      <Mail aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {email}
                    </a>
                  </li>
                ) : null}
                {phone ? (
                  <li>
                    <a
                      href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex items-center gap-2 transition-colors hover:text-cognac"
                    >
                      <Phone aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      {phone}
                    </a>
                  </li>
                ) : null}
                {address ? (
                  <li className="flex items-start gap-2">
                    <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span className="whitespace-pre-line">{address}</span>
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Social */}
        {socials.length > 0 ? (
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-8">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption uppercase tracking-[0.16em] text-ivory/70 transition-colors hover:text-cognac"
              >
                {social.label}
              </a>
            ))}
          </div>
        ) : null}

        {/* Legal */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-caption text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.copyright.holder}. All rights reserved.
          </p>
          <p className="tracking-[0.08em]">
            Product showcase and business enquiries only.
          </p>
        </div>
      </div>
    </footer>
  );
}
