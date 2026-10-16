import type { Product } from "@/types/product";

/**
 * ============================================================================
 *  PRODUCT CATALOG
 * ============================================================================
 *  This is the single source of truth for every product on the site.
 *
 *  Each record maps 1:1 to a page of the supplied Leather Wind catalog — the
 *  eighteen products listed on the catalog contents page, in the same order.
 *  Product names, descriptions, feature bullets, materials and labelled
 *  dimensions are transcribed from the catalog. Where the catalog documents
 *  nothing for a field, the field is omitted rather than guessed.
 *
 *  Required fields
 *    id          unique string (also used as the React key)
 *    slug        URL segment → /products/<slug>
 *    name        exact product name from the catalog
 *    category    must match a `slug` in src/data/categories.ts
 *    image       path under /public
 *
 *  Photographs are produced by `npm run catalog:extract`, which pulls the
 *  embedded images out of the PDF into public/images/catalog/ and names each
 *  file after the product slug (see PRODUCT_PAGE_MAP in that script).
 * ============================================================================
 */
export const products: Product[] = [
  {
    id: "lw-01",
    slug: "dual-camera-harness-strap",
    name: "Dual Camera Harness Strap",
    category: "straps-and-belts",
    summary:
      "A padded full-grain leather harness for carrying two cameras.",
    description:
      "Crafted from full-grain leather, this dual camera harness offers comfort and durability, making it perfect for photographers who need to carry two cameras with ease.",
    materials: ["Full-grain leather"],
    features: [
      "Thick padding for extra comfort",
      "Wide contact area",
      "Front two D-rings for hanging glasses etc.",
      "Strong hook for any DSLR camera",
      "Adjustable size",
      "Safety strap for double security",
    ],
    specifications: [{ label: "Strap width", value: '1" / 2.5 cm' }],
    image: "/images/catalog/dual-camera-harness-strap-01.png",
    imageAlt:
      "Dual camera harness strap in tan full-grain leather with two cameras attached",
    featured: true,
    order: 1,
  },
  {
    id: "lw-02",
    slug: "hiking-waist-leg-pack-sling",
    name: "Hiking Waist Leg Pack Sling",
    category: "pouches-and-holders",
    summary:
      "A genuine leather waist and thigh pack for hands-free carrying.",
    description:
      "Designed for outdoor adventurers, this genuine leather waist and thigh pack combines style and functionality, providing a secure, hands-free option for carrying essentials.",
    materials: ["Genuine leather"],
    image: "/images/catalog/hiking-waist-leg-pack-sling-01.png",
    imageAlt:
      "Dark brown leather hiking waist and leg pack with zipped pocket, brass rivets and a detachable thigh strap",
    order: 2,
  },
  {
    id: "lw-03",
    slug: "scissor-holder-pouch-case",
    name: "Scissor Holder Pouch Case",
    category: "pouches-and-holders",
    summary: "Leather pouches that hold and protect scissors.",
    description:
      "Stylish and sturdy leather pouches designed to securely hold and protect your scissors.",
    materials: ["Leather"],
    image: "/images/catalog/scissor-holder-pouch-case-01.png",
    imageAlt:
      "Tan leather scissor holder pouch case with dark brown strap closures and metal snap buttons",
    order: 3,
  },
  {
    id: "lw-04",
    slug: "barber-leather-waist-pouch",
    name: "Barber Leather Waist Pouch",
    category: "pouches-and-holders",
    summary: "A leather tool pouch for barbers, worn at the waist.",
    description:
      "A premium leather pouch designed for barbers, offering convenient access and secure storage for tools on the go.",
    specifications: [
      {
        label: "Labelled dimensions",
        value: '24 cm / 9.44", 22 cm / 8.66" and 20 cm / 7.87"',
      },
    ],
    image: "/images/catalog/barber-leather-waist-pouch-01.png",
    imageAlt:
      "Black leather barber waist pouch with contrast stitching, multiple front pockets and an adjustable strap",
    order: 4,
  },
  {
    id: "lw-05",
    slug: "motorbike-saddle-tool-bag",
    name: "Motorbike Saddle Tool Bag",
    category: "bags-and-cases",
    summary: "A rugged leather saddle tool bag for carrying tools on a ride.",
    description:
      "Rugged and durable leather saddlebags, perfect for storing essentials during your rides in style.",
    specifications: [
      {
        label: "Labelled dimensions",
        value: '21", 15.5", 9.5", 5.5" and 2.5"',
      },
    ],
    image: "/images/catalog/motorbike-saddle-tool-bag-01.png",
    imageAlt:
      "Brown distressed leather motorbike saddle tool bag laid open with a carry handle and elastic tool loops",
    featured: true,
    order: 5,
  },
  {
    id: "lw-06",
    slug: "portable-golf-ball-bag",
    name: "Portable Golf Ball Bag",
    category: "bags-and-cases",
    summary: "A small leather bag for carrying golf balls.",
    description:
      "A sleek, lightweight leather bag designed for easy carrying and quick access to your golf balls on the go.",
    specifications: [
      {
        label: "Labelled dimensions",
        value:
          '5.6", 4.1", 2.3" and 2" (the 1.89" golf ball is shown for scale only and is not included)',
      },
    ],
    image: "/images/catalog/portable-golf-ball-bag-01.png",
    imageAlt:
      "Round brown leather golf ball bag with a leather loop, shown with a golf ball for scale",
    order: 6,
  },
  {
    id: "lw-07",
    slug: "leather-dog-walking-harness",
    name: "Leather Dog Walking Harness",
    category: "pet",
    summary: "A premium leather walking harness for dogs.",
    description:
      "Crafted from premium leather, this harness offers comfort and durability for your dog during walks.",
    materials: ["Premium leather"],
    specifications: [
      {
        label: "Sizing",
        value:
          "Measured by neck girth and chest girth — see the fitting guide in the catalog",
      },
    ],
    image: "/images/catalog/leather-dog-walking-harness-01.png",
    imageAlt:
      "Tan leather dog walking harness with a metal buckle and rings, showing neck and chest measurement points",
    order: 7,
  },
  {
    id: "lw-08",
    slug: "leather-waist-belts",
    name: "Leather Waist Belts",
    category: "straps-and-belts",
    summary: "Full leather belts with a classic rectangular buckle.",
    description:
      "Crafted from premium leather, our waist belts combine timeless style with exceptional durability. Perfect for any occasion, they showcase impeccable craftsmanship and rugged elegance.",
    materials: ["Premium leather"],
    image: "/images/catalog/leather-waist-belts-01.png",
    imageAlt:
      "Black leather waist belt coiled to show a silver rectangular buckle and single-prong closure",
    order: 8,
  },
  {
    id: "lw-09",
    slug: "leather-desk-pad-set",
    name: "Leather Desk Pad Set",
    category: "home-and-desk",
    summary: "A real leather desk surface with matching desk accessories.",
    description:
      "Crafted from real leather, this desk pad offers a stylish, functional surface for your keyboard, mouse, and laptop. Protect your desk while elevating your workspace with a sleek, antique finish.",
    materials: ["Real leather"],
    image: "/images/catalog/leather-desk-pad-set-01.png",
    imageAlt:
      "Dark brown leather desk pad on a desk with a keyboard, mouse, monitor and coffee cup",
    featured: true,
    order: 9,
  },
  {
    id: "lw-10",
    slug: "leather-wallets",
    name: "Leather Wallets",
    category: "everyday-carry",
    summary: "Bifold and flap wallets in premium leather.",
    description:
      "Crafted for durability and style, our wallets combine premium leather with practical design for everyday use.",
    materials: ["Premium leather"],
    image: "/images/catalog/leather-wallets-01.png",
    imageAlt:
      "Open brown leather bifold wallet showing card slots and a clear identification window",
    featured: true,
    order: 10,
  },
  {
    id: "lw-11",
    slug: "leather-tablet-laptop-bags",
    name: "Leather Tablet & Laptop Bags",
    category: "bags-and-cases",
    summary: "Leather bags and sleeves with padded device compartments.",
    description:
      "From daily use to professional needs, our bags blend rugged charm with functional design.",
    materials: ["Leather"],
    image: "/images/catalog/leather-tablet-laptop-bags-01.png",
    imageAlt:
      "Dark brown leather messenger bag with top carry handles and a detachable shoulder strap",
    featured: true,
    order: 11,
  },
  {
    id: "lw-12",
    slug: "leather-drawer-pulls",
    name: "Leather Drawer Pulls",
    category: "home-and-desk",
    summary: "Handmade pure leather handles for cabinets and drawers.",
    description:
      "Elevate your cabinets and drawers with these handmade pure leather handles — sleek, durable, and effortlessly stylish.",
    materials: ["Pure leather"],
    image: "/images/catalog/leather-drawer-pulls-01.png",
    imageAlt:
      "Tan leather drawer pull with a white snap fastener, one of a set fitted to a chest of drawers",
    order: 12,
  },
  {
    id: "lw-13",
    slug: "leather-whip-holster",
    name: "Leather Whip Holster",
    category: "pouches-and-holders",
    summary: "A leather holder that keeps a whip secure.",
    description:
      "Handcrafted for durability and style, this premium leather holder keeps your whip secure — ideal for horse riding or Halloween flair.",
    materials: ["Premium leather"],
    image: "/images/catalog/leather-whip-holster-01.png",
    imageAlt:
      "Tan leather whip holster with two silver snap buttons, shown on white",
    order: 13,
  },
  {
    id: "lw-14",
    slug: "leather-watch-straps",
    name: "Leather Watch Straps",
    category: "straps-and-belts",
    summary: "Leather watch straps with a metal buckle and keeper.",
    description:
      "Versatile and sturdy, Leather Wind watch straps blend lasting comfort with timeless style. Designed to elevate any look, they're crafted for durability and elegance.",
    materials: ["Leather"],
    image: "/images/catalog/leather-watch-straps-01.png",
    imageAlt:
      "Brown leather watch strap shown flat with a gold-tone buckle and keeper",
    featured: true,
    order: 14,
  },
  {
    id: "lw-15",
    slug: "leather-sunglasses-sleeve",
    name: "Leather Sunglasses Sleeve",
    category: "everyday-carry",
    summary: "A minimalist full-grain leather sleeve for eyewear.",
    description:
      "Keep your eyewear safe in style with this minimalist, handcrafted full-grain leather sleeve — perfect for travel and outdoor adventures.",
    materials: ["Full-grain leather"],
    specifications: [{ label: "Dimensions", value: '6.5" × 3"' }],
    image: "/images/catalog/leather-sunglasses-sleeve-01.png",
    imageAlt:
      "Tan full-grain leather sunglasses sleeve with a centre snap button and side rivets",
    order: 15,
  },
  {
    id: "lw-16",
    slug: "leather-case-for-notebook",
    name: "Leather Case for Notebook",
    category: "bags-and-cases",
    summary: "A leather folio case for a notebook and pen.",
    description:
      "Crafted with premium leather, this accessory combines sleek design with practicality. Perfect for professionals and creatives seeking style and function.",
    materials: ["Premium leather"],
    specifications: [
      { label: "Labelled dimensions", value: '13" × 8.6"; 4" panels' },
    ],
    image: "/images/catalog/leather-case-for-notebook-01.png",
    imageAlt:
      "Brown leather notebook case opened flat with a tan lining, closure strap and pen loop",
    featured: true,
    order: 16,
  },
  {
    id: "lw-17",
    slug: "leather-cord-keepers",
    name: "Leather Cord Keepers",
    category: "everyday-carry",
    summary: "Small real leather keepers with a metal snap.",
    materials: ["Real leather"],
    specifications: [{ label: "Dimensions", value: '2" × 1.25"' }],
    image: "/images/catalog/leather-cord-keepers-01.png",
    imageAlt:
      "Small brown antique-finish leather cord keeper with a round silver metal snap",
    order: 17,
  },
  {
    id: "lw-18",
    slug: "leather-wedding-ring-case",
    name: "Leather Wedding Ring Case",
    category: "everyday-carry",
    summary: "A handcrafted full-grain leather case for a ring.",
    description:
      "Celebrate life's precious moments with this handcrafted full grain leather ring case — perfect for proposals, weddings, and cherished keepsakes.",
    materials: ["Handcrafted full-grain leather"],
    specifications: [{ label: "Dimensions", value: '2.25" × 2.25"' }],
    image: "/images/catalog/leather-wedding-ring-case-01.png",
    imageAlt:
      "Closed tan full-grain leather wedding ring case with a snap closure",
    order: 18,
  },
];
