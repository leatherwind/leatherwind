import type { Category } from "@/types/product";

/**
 * ============================================================================
 *  CATEGORIES
 * ============================================================================
 *  The Leather Wind catalog presents eighteen products in contents order but
 *  does not group them into categories, so these groups were derived from the
 *  products themselves. Every product in src/data/products.ts belongs to
 *  exactly one category below, and no category is empty.
 *
 *  Renaming a category only requires editing `name` here; renaming a `slug`
 *  means updating the matching `category` value in the product records.
 * ============================================================================
 */
export const categories: Category[] = [
  {
    slug: "bags-and-cases",
    name: "Bags & Cases",
    description:
      "Rugged leather carry for tools, devices and everyday items, with padded and organised interiors.",
    image: "/images/catalog/leather-tablet-laptop-bags-01.png",
    imageAlt: "Leather tablet and laptop bags from the Leather Wind collection",
    order: 1,
  },
  {
    slug: "pouches-and-holders",
    name: "Pouches & Holders",
    description:
      "Waist and belt-mounted leather pouches built to keep tools and equipment close at hand.",
    image: "/images/catalog/barber-leather-waist-pouch-01.png",
    imageAlt: "Leather waist pouches from the Leather Wind collection",
    order: 2,
  },
  {
    slug: "straps-and-belts",
    name: "Straps & Belts",
    description:
      "Leather belts, harnesses and straps that carry, secure and finish an outfit.",
    image: "/images/catalog/leather-waist-belts-01.png",
    imageAlt: "Leather belts and straps from the Leather Wind collection",
    order: 3,
  },
  {
    slug: "everyday-carry",
    name: "Everyday Carry",
    description:
      "Small leather pieces for daily use and gifting — wallets, sleeves, keepers and ring cases.",
    image: "/images/catalog/leather-wallets-01.png",
    imageAlt: "Leather wallets from the Leather Wind collection",
    order: 4,
  },
  {
    slug: "home-and-desk",
    name: "Home & Desk",
    description:
      "Leather for the workspace and the home, from full desk surfaces to furniture handles.",
    image: "/images/catalog/leather-desk-pad-set-01.png",
    imageAlt: "Leather desk pads and home accessories from the Leather Wind collection",
    order: 5,
  },
  {
    slug: "pet",
    name: "Pet",
    description: "Handcrafted leather for dogs, made for everyday walks.",
    image: "/images/catalog/leather-dog-walking-harness-01.png",
    imageAlt: "Leather dog walking harness from the Leather Wind collection",
    order: 6,
  },
];
