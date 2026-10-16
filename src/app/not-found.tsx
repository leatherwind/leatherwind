import type { Metadata } from "next";
import { notFoundContent } from "@/config/content";
import { buildMetadata } from "@/lib/seo";
import { LinkButton } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export const metadata: Metadata = {
  ...buildMetadata({
    title: notFoundContent.title,
    description: notFoundContent.description,
    path: "/404",
    noIndex: true,
  }),
  title: notFoundContent.title,
};

/**
 * Custom 404. Keeps the brand intact and gives two clear routes back — the
 * catalog, and a direct enquiry.
 */
export default function NotFound() {
  return (
    <section className="bg-ivory">
      <div className="lw-container flex min-h-[60vh] flex-col justify-center py-section">
        <p className="lw-eyebrow">Error 404</p>
        <h1 className="mt-5 text-display-lg">{notFoundContent.title}</h1>
        <p className="mt-6 max-w-xl text-body-lg text-charcoal/75">
          {notFoundContent.description}
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <LinkButton href="/" variant="dark" size="lg">
            {notFoundContent.ctaHome}
          </LinkButton>
          <LinkButton href="/products" variant="outline" size="lg">
            {notFoundContent.ctaProducts}
          </LinkButton>
          <WhatsAppButton size="lg" variant="primary" />
        </div>
      </div>
    </section>
  );
}
