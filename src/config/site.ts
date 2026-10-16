/**
 * Leather Wind — central business configuration.
 *
 * ⚠️  SINGLE SOURCE OF TRUTH FOR BUSINESS DETAILS.
 *
 * Every value in this file comes from the company's own catalog. Nothing has
 * been invented. Any value still unknown is left empty on purpose; the interface
 * detects empty values and hides the corresponding element rather than
 * displaying a placeholder that looks real.
 *
 * Value precedence for the public fields below:
 *   1. Environment variable (so a host can override without a code change)
 *   2. The literal fallback written here
 *
 * See README.md → "Business details to supply" for the checklist.
 */

function env(value: string | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Raw WhatsApp number: international format, digits only. */
const WHATSAPP_NUMBER =
  env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || "923344700220";

/** A company office, as printed on the catalog back cover. */
export interface Office {
  name: string;
  address: string;
  phone: string;
  email: string;
}

/**
 * Both offices printed on the catalog back cover. Typed explicitly (rather than
 * inline literals) so the fields stay plain `string` values that components can
 * test for emptiness.
 */
const OFFICES: Office[] = [
  {
    name: "Lahore, Pakistan",
    address: "Plot # 158, Street 3, Awan Market, 17km Ferozpur Road.",
    phone: "+92 334 4700220",
    email: "leatherwind96@gmail.com",
  },
  {
    name: "New York, USA",
    address: "Valley Stream, Long Island, NY.",
    phone: "+1 929 258 1517",
    email: "ahmarilyas40@gmail.com",
  },
];

export const siteConfig = {
  /**
   * Brand identity. `name` is used for the wordmark, titles and structured
   * data. `tagline` is a short positioning line, not a company claim.
   */
  name: "Leather Wind",
  wordmark: "Leather Wind",
  tagline: "Crafted in Leather. Defined by Quality.",
  shortDescription:
    "Leather Wind presents a considered collection of leather goods — presented through material, craftsmanship detail and design.",

  /**
   * Production domain. The catalog back cover prints "Leatherwind.pk/", so
   * that domain is used as the fallback. Confirm it (and the preferred www /
   * non-www form) before launch, or override with NEXT_PUBLIC_SITE_URL.
   * Used for canonical URLs, Open Graph images and the sitemap.
   */
  url: env(process.env.NEXT_PUBLIC_SITE_URL) || "https://leatherwind.pk",

  locale: "en_GB",

  /** Business WhatsApp number, digits only (no "+", no spaces). */
  whatsappNumber: WHATSAPP_NUMBER,

  /**
   * Primary contact details, taken from the back cover of the catalog.
   * Any value left empty is hidden across the site rather than faked.
   */
  contact: {
    email:
      env(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "leatherwind96@gmail.com",
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE) || "+92 334 4700220",
    address:
      env(process.env.NEXT_PUBLIC_CONTACT_ADDRESS) ||
      "Plot # 158, Street 3, Awan Market, 17km Ferozpur Road, Lahore, Pakistan",
  },

  /**
   * Both offices printed on the catalog back cover. Rendered on /contact.
   */
  offices: OFFICES,

  /**
   * Social profiles. The catalog prints the handle "Leatherwind.pk/" with
   * LinkedIn, Facebook and Instagram marks but no full URLs, so these are left
   * empty until the company supplies the exact links. Empty entries are
   * omitted from the footer and contact page.
   */
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  },

  /** Primary navigation. Kept short on purpose. */
  nav: [
    { label: "Home", href: "/" },
    { label: "Our Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  /**
   * Wording used to build the prefilled WhatsApp enquiry message. Kept here so
   * the message template can be updated without touching components.
   */
  whatsappMessages: {
    intro: "Hello Leather Wind, I am interested in the following product:",
    productLabel: "Product",
    codeLabel: "Product Code",
    closing:
      "Could you please share more information about this product?\n\nThank you.",
    generalInquiry:
      "Hello Leather Wind, I would like to enquire about your leather collection. Could you please share more information?",
    contactPage:
      "Hello Leather Wind, I would like to get in touch regarding your leather products.",
  },

  /** Used in <meta> fallbacks and the footer. */
  copyright: {
    holder: "Leather Wind",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** True when a usable WhatsApp number has been configured. */
export const isWhatsAppConfigured = (): boolean =>
  /^\d{8,15}$/.test(siteConfig.whatsappNumber);

/** True when WhatsApp can be offered as an action; otherwise the UI falls back. */
export const hasAnyContactDetail = (): boolean =>
  Boolean(
    siteConfig.contact.email ||
      siteConfig.contact.phone ||
      siteConfig.contact.address ||
      isWhatsAppConfigured(),
  );

/** Social entries that have a real URL, in display order. */
export const activeSocialLinks = (): { label: string; url: string }[] =>
  (
    [
      ["Instagram", siteConfig.social.instagram],
      ["Facebook", siteConfig.social.facebook],
      ["LinkedIn", siteConfig.social.linkedin],
      ["YouTube", siteConfig.social.youtube],
    ] as const
  )
    .filter(([, url]) => url.trim().length > 0)
    .map(([label, url]) => ({ label, url: url.trim() }));
