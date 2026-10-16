/**
 * ============================================================================
 *  SITE COPY
 * ============================================================================
 *  Every piece of marketing copy lives here, so wording can be revised without
 *  touching a component.
 *
 *  IMPORTANT: the About page copy is transcribed from the company's own catalog
 *  (company profile, vision, mission and product standards). Everything else
 *  describes the product offering and how the collection is presented. No
 *  history, founding date, certification, facility, award, testimonial or client
 *  name has been invented. Replace or refine freely.
 * ============================================================================
 */

export const homeContent = {
  hero: {
    eyebrow: "Leather Wind",
    title: "Crafted in Leather. Defined by Quality.",
    description:
      "Discover the Leather Wind collection, presented with attention to detail, material and design.",
    primaryCta: "Explore Our Collection",
    secondaryCta: "Inquire on WhatsApp",
  },

  featured: {
    eyebrow: "Selected Pieces",
    title: "From the Collection",
    description:
      "A considered selection from the Leather Wind catalog. Each item links to its full product page.",
    cta: "View All Products",
    emptyTitle: "The collection is being prepared",
    emptyDescription:
      "Product photography is being finalised. In the meantime, you are welcome to enquire directly.",
  },

  categories: {
    eyebrow: "Browse by Category",
    title: "The Range",
    description:
      "Explore the collection by product category. Every category links to the corresponding products.",
    cta: "All Categories",
    emptyTitle: "Categories coming soon",
    emptyDescription:
      "Catalog categories will appear here once the product range has been published.",
  },

  brand: {
    eyebrow: "Our Standards",
    title: "Made with Care",
    paragraphs: [
      "Every piece is crafted using high-grade, full-grain or top-grain leather, sourced responsibly and finished with rust-proof hardware chosen for lasting reliability.",
      "Stitching is uniform throughout, edges are hand-burnished to a smooth finish, and each item is inspected against our standards before it leaves us.",
    ],
    points: [
      {
        title: "Genuine Leather Only",
        body: "Products are crafted using high-grade, full-grain or top-grain leather, sourced responsibly.",
      },
      {
        title: "Built to Last",
        body: "Rust-proof buckles, zippers and clasps, precision stitching and hand-finished edges.",
      },
      {
        title: "Custom Orders",
        body: "Personalised work is available, including embossing and tailored designs.",
      },
    ],
  },

  inquiry: {
    eyebrow: "Enquiries",
    title: "Interested in a Piece?",
    description:
      "Send the item you are interested in directly to us on WhatsApp. Every enquiry is prefilled with the product name, so we know exactly which item you mean.",
    cta: "Browse the Collection",
  },
} as const;

export const productsContent = {
  eyebrow: "Catalog",
  title: "Our Products",
  description:
    "The complete Leather Wind collection. Search by name, filter by category, and open any item for its full specification.",
  searchLabel: "Search products",
  searchPlaceholder: "Search by product name",
  categoryLabel: "Category",
  allCategories: "All Categories",
  sortLabel: "Sort by",
  loadMore: "Load More Products",
  showingLabel: "Showing",
  clearFilters: "Clear filters",
  emptyTitle: "No products match your search",
  emptyDescription:
    "Try a different product name, or clear the filters to see the full collection.",
  emptyCatalogTitle: "The catalog is being prepared",
  emptyCatalogDescription:
    "Product records have not been published yet. Use the WhatsApp button or the contact page to enquire.",
  resultSingular: "product",
  resultPlural: "products",
} as const;

export const aboutContent = {
  eyebrow: "About Us",
  title: "Leather Wind",
  intro:
    "Leather Wind is a leather goods company. The catalog opens with a clear ambition — to become a globally recognized brand for premium leather accessories, known for craftsmanship, timeless design and exceptional quality.",
  highlight:
    "10 Years of Excellence, Social Responsibility, and a Bright Future Ahead.",
  sections: [
    {
      title: "Our Vision",
      body: [
        "To become a globally recognized brand for premium leather accessories, known for unparalleled craftsmanship, timeless designs, and exceptional quality. We aim to inspire confidence and style through our innovative leather creations while promoting sustainability in every step of our production.",
        "Our vision is to redefine elegance and functionality for modern consumers worldwide.",
      ],
    },
    {
      title: "Our Mission",
      body: [
        "To craft high-quality, durable, and stylish leather products that exceed customer expectations. We are committed to using the finest materials and traditional techniques to create accessories that embody elegance and reliability.",
        "Our mission is to provide a seamless experience, ensuring customer satisfaction while maintaining ethical and sustainable practices in all operations.",
      ],
    },
    {
      title: "Materials & Craftsmanship",
      body: [
        "All products are crafted using high-grade, full-grain or top-grain leather, sourced responsibly, and finished with rust-proof metal components — buckles, zippers and clasps — chosen for lasting reliability.",
        "Every stitch is uniform, ensuring strength and a polished appearance. Edges are hand-burnished for a smooth, refined look, and each piece is carefully inspected before it leaves us.",
      ],
    },
    {
      title: "Standards & Responsibility",
      body: [
        "Products are stress-tested to handle everyday use, and the leather is treated to withstand moderate exposure to water without compromising its integrity. Packaging materials are recyclable or biodegradable.",
        "We partner with suppliers who prioritise fair wages and safe working conditions, and we provide after-sales services including care tips and repair guidance.",
      ],
    },
    {
      title: "Custom Orders",
      body: [
        "We accommodate requests for personalised products, including embossing and tailored designs. Feedback is welcomed, and it is part of how the range continues to improve.",
      ],
    },
  ],
  ctaTitle: "Enquire About the Collection",
  ctaDescription:
    "Tell us which items you are interested in and we will follow up directly.",
} as const;

export const contactContent = {
  eyebrow: "Contact",
  title: "Get in Touch",
  description:
    "Questions about a product, a specification or availability — WhatsApp is the fastest route to us.",
  formNotice:
    "This form does not submit to a server. It opens WhatsApp with your message prepared so you can send it yourself — nothing is transmitted until you press send.",
  formSuccessHint:
    "WhatsApp should now be open with your message. Press send to deliver it to us.",
  formUnavailable:
    "No WhatsApp number has been configured for this site yet, so the form cannot prepare a message. Please use the contact details listed on this page.",
} as const;

export const notFoundContent = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist, or the product may have been moved or renamed.",
  ctaHome: "Back to Home",
  ctaProducts: "Browse the Collection",
} as const;
