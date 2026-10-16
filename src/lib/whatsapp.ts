import { siteConfig, isWhatsAppConfigured } from "@/config/site";
import type { Product } from "@/types/product";

/**
 * Leather Wind WhatsApp utilities.
 *
 * This is the ONLY place that knows how to turn a product record into a
 * WhatsApp deep link. Product cards, product detail pages, the home page and
 * the contact page all go through these helpers, so the business number is
 * never duplicated in a component.
 *
 * The visitor always sends the message manually — we only pre-fill it.
 */

const WA_BASE = "https://wa.me";

/** Digits only: strips "+", spaces, dashes and parentheses. */
export function normalizeWhatsAppNumber(input: string): string {
  return input.replace(/[^\d]/g, "");
}

/**
 * Builds the enquiry message for a specific product.
 *
 * Field-by-field rules:
 *   - The product name is always included (it is required data).
 *   - The product code line is included ONLY when a SKU exists.
 *   - Extra documented context (category / a short material line) is appended
 *     when present, so the company can identify the item unambiguously.
 */
export function buildProductInquiryMessage(product: Product): string {
  const { intro, productLabel, codeLabel, closing } = siteConfig.whatsappMessages;

  const lines: string[] = [intro, ""];
  lines.push(`${productLabel}: ${product.name}`);

  const code = product.sku?.trim();
  if (code) {
    lines.push(`${codeLabel}: ${code}`);
  }

  lines.push("", closing);

  return lines.join("\n");
}

/**
 * Returns a wa.me URL for a product enquiry, or `null` when no WhatsApp number
 * has been configured yet. Callers treat `null` as "offer the contact page
 * instead" — we never build a link to a number that does not exist.
 */
export function buildProductInquiryUrl(product: Product): string | null {
  return buildWhatsAppUrl(buildProductInquiryMessage(product));
}

/** Generic enquiry link, used by the header CTA, hero and footer. */
export function buildGeneralInquiryUrl(
  message: string = siteConfig.whatsappMessages.generalInquiry,
): string | null {
  return buildWhatsAppUrl(message);
}

/**
 * Low-level URL builder. Encodes the message with encodeURIComponent so
 * newlines, ampersands and non-ASCII characters survive the round trip.
 */
export function buildWhatsAppUrl(message: string): string | null {
  const number = normalizeWhatsAppNumber(siteConfig.whatsappNumber);
  if (!isWhatsAppConfigured() || number.length === 0) {
    return null;
  }
  return `${WA_BASE}/${number}?text=${encodeURIComponent(message)}`;
}

/** Convenience flag for components that need to branch on availability. */
export const whatsAppAvailable = isWhatsAppConfigured;
