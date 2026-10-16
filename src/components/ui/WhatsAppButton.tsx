import { MessageCircle } from "lucide-react";
import type { Product } from "@/types/product";
import {
  buildGeneralInquiryUrl,
  buildProductInquiryUrl,
} from "@/lib/whatsapp";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  buttonStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/Button";
import Link from "next/link";

/**
 * The single WhatsApp action used across the whole site.
 *
 * Two responsibilities, deliberately kept together:
 *   1. Ask src/lib/whatsapp.ts for the correct deep link (product-aware or
 *      generic). The number is never hard-coded in a component.
 *   2. Behave gracefully when no number has been configured yet: instead of
 *      rendering a dead link, it routes the visitor to the contact page.
 *
 * Renders as a plain <a>, so it works in server components with no bundle cost.
 */

interface WhatsAppButtonProps {
  /** When provided, the prefilled message identifies this exact product. */
  product?: Product;
  /** Override the default generic enquiry message. */
  message?: string;
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Hide the leading icon (used inside dense layouts). */
  hideIcon?: boolean;
  /** Where to send visitors if WhatsApp is not configured yet. */
  fallbackHref?: string;
}

export function WhatsAppButton({
  product,
  message,
  label = "Inquire on WhatsApp",
  variant = "primary",
  size = "md",
  className,
  hideIcon = false,
  fallbackHref = "/contact",
}: WhatsAppButtonProps) {
  const href = product
    ? buildProductInquiryUrl(product)
    : buildGeneralInquiryUrl(message ?? siteConfig.whatsappMessages.generalInquiry);

  const icon = hideIcon ? null : (
    <MessageCircle aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.75} />
  );

  if (!href) {
    return (
      <Link
        href={fallbackHref}
        className={buttonStyles({ variant, size, className })}
        title="WhatsApp enquiries are not configured yet — use the contact page."
      >
        {icon}
        <span>Contact Us</span>
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonStyles({ variant, size, className }))}
      aria-label={product ? `Inquire about ${product.name} on WhatsApp` : label}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
