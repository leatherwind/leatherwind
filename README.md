# Leather Wind — website

A product showcase and enquiry website for **Leather Wind**, built from the company's
own PDF catalog. It is a **presentation site, not a shop**: there is no cart, no
checkout, no prices, no accounts and no payment. The single conversion action is an
enquiry on WhatsApp, prefilled with the exact product the visitor is looking at.

Built with the Next.js App Router, TypeScript and Tailwind CSS. Every product record,
photograph, description and specification on the site is taken from the supplied
`Leatherwind Catalog.pdf` — nothing has been invented.

---

## 1. Requirements

- **Node.js 22** (pinned via `engines` in `package.json`, so Vercel uses Node 22
  too) and npm.
- That's it. No database, no API keys, no third-party services.

---

## 2. Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### All available scripts

| Command                   | What it does                                                              |
| ------------------------- | ------------------------------------------------------------------------- |
| `npm run dev`             | Start the development server.                                              |
| `npm run build`           | Production build.                                                          |
| `npm run start`           | Serve the production build.                                                |
| `npm run lint`            | Run ESLint.                                                                |
| `npm run typecheck`       | Run the TypeScript compiler with no output.                                |
| `npm run catalog:extract` | Extract text + product photographs from the catalog PDF (see below).       |

---

## 3. Getting the catalog photographs onto the site

The site ships with **all product data already filled in** from the catalog
(`src/data/products.ts`), but the product **photographs** still need to be
extracted from the PDF, because images cannot be committed as text.

Run this once, from the project root, with `Leatherwind Catalog.pdf` present:

```bash
npm install
npm run catalog:extract
```

This writes:

- `public/images/catalog/<product-slug>-01.png`, `-02.png`, … — the embedded
  product photographs, named after the product they belong to.
- `catalog/catalog.txt` — all extractable text, page by page.
- `catalog/manifest.json` — an index of every extracted image.

Restart `npm run dev` (or rebuild) afterwards and the photographs appear
throughout the site automatically. **Nothing else needs editing**: galleries are
discovered from the folder, so a product shows as many photographs as were
extracted for it.

> **If `npm run catalog:extract` reports "no photograph-sized images found"**, the
> PDF stores each product image as a full-page scan rather than an embedded
> photograph. In that case, re-export the catalog pages as PNG images, drop them
> into `catalog/pages/`, and they can be cropped from there.
>
> **Fallback:** if you cannot run Node locally, export each product photograph
> from your PDF reader as a PNG and save it into `public/images/catalog/` using
> the slug names listed in `src/data/products.ts` (for example
> `leather-wallets-01.png`). The site picks them up with no code change.

Until the photographs exist, every image position shows a neutral branded
placeholder rather than a broken image or a stand-in stock photo.

---

## 4. Where everything lives

```
src/
  app/                      Pages (App Router)
    page.tsx                /            home
    products/page.tsx       /products    catalog with search, filter, sort
    products/[slug]/page.tsx /products/x product detail
    categories/page.tsx     /categories
    about/page.tsx          /about
    contact/page.tsx        /contact
    not-found.tsx           404
    sitemap.ts robots.ts    SEO routes
    layout.tsx globals.css  shell, fonts, design system
    opengraph-image.tsx     generated social share card
  components/               UI, grouped by role (ui, layout, home, products, contact)
  config/
    site.ts                 ← business details, nav, WhatsApp message templates
    content.ts              ← all page copy
  data/
    products.ts             ← the product catalog (18 products)
    categories.ts           ← product categories
  lib/
    whatsapp.ts             ← WhatsApp deep-link builder
    products.ts             ← query / filter / sort / related helpers
    seo.ts                  ← metadata + JSON-LD builders
    catalog-images.ts       ← discovers extracted photographs (server-side)
    utils.ts                ← small shared helpers
  types/product.ts          ← domain types
public/
  images/catalog/           ← extracted catalog photographs (git-committed)
  favicon.svg
scripts/
  extract-catalog.mjs       ← the PDF extractor
```

### Editing the catalog

- **Products** — `src/data/products.ts`. One object per product. Add, edit or
  reorder freely; no component needs to change. Omit any field the catalog does
  not document rather than writing `N/A`.
- **Categories** — `src/data/categories.ts`. The catalog does not group its
  products, so these six categories were derived from the products themselves
  (Bags & Cases, Pouches & Holders, Straps & Belts, Everyday Carry, Home & Desk,
  Pet). Rename freely — to change a category's URL, update its `slug` **and** the
  matching `category` value on each product.
- **Copy** — `src/config/content.ts`.
- **Business details** — `src/config/site.ts`.

### About the WhatsApp enquiry

`src/lib/whatsapp.ts` is the only place that builds a WhatsApp link, and the
number lives only in `src/config/site.ts`. Each product page, product card and
the contact form prefills a message identifying the exact product by name (and by
code, when a code exists).

**The number is already set** to `+92 334 4700220` (the Lahore office number from
the catalog back cover). To change it, edit one line in `src/config/site.ts`:

```ts
// src/config/site.ts
whatsappNumber: "923344700220", // international format, digits only, no +
```

(You can also set `NEXT_PUBLIC_WHATSAPP_NUMBER` in the environment instead; it
takes precedence.) The visitor always presses send themselves — the site never
sends anything on its own. If the number is ever cleared, every WhatsApp button
gracefully falls back to the contact page instead of rendering a dead link.

---

## 5. Business details to supply

Everything below was taken from the catalog where the catalog states it. The
items marked **needed** are the only gaps.

| Item                                        | Status                                                                |
| ------------------------------------------- | --------------------------------------------------------------------- |
| Brand name                                  | From catalog: **LEATHERWIND**. Confirmed to be rendered as "Leather Wind". |
| Website                                     | From catalog: `Leatherwind.pk/` → used as the fallback production URL. |
| Lahore office — address, phone, email       | From catalog back cover. Already live on `/contact` and in the footer. |
| New York office — address, phone, email     | From catalog back cover. Already live on `/contact`.                   |
| Tagline                                     | From catalog: "Quality That Can't Be Beat" / "Innovation in every step". |
| Company profile (vision, mission, standards)| From catalog pages 2–4. Already live on `/about`.                      |
| WhatsApp number                             | **Set** to `+92 334 4700220` (Lahore office) in `src/config/site.ts`.  |
| Social profile URLs                         | **Not supplied.** Instagram / Facebook / LinkedIn are hidden until real URLs are added to `src/config/site.ts`. |
| **Product SKUs / codes**                    | **Needed (optional).** The catalog prints no product codes, so the WhatsApp message identifies products by name only. If codes exist, add `sku` to each record and they are included automatically. |
| Logo artwork                                | **Needed (optional).** The catalog has an "LV" monogram, but no scalable file was supplied, so the site uses a restrained typographic wordmark. Drop a PNG/SVG into `public/images/brand/` to use it instead. |

### Two things to confirm

1. **Brand name styling.** Catalog cover reads **LEATHERWIND** (one word); the
   brief says "Leather Wind". Confirmed: the site uses **"Leather Wind"**.
2. **Product categories.** The catalog has no categories, so the six on the site
   are derived and were confirmed as-is. Adjust them in
   `src/data/categories.ts` if you would group them differently.

### Known catalog quirks

- The **Leather Cord Keepers** page prints the desk-pad description instead of its
  own. Rather than ship wrong copy, that product currently has no description —
  send the correct line and it can be added.
- There are **no product codes** anywhere in the catalog.
- The Motorbike Saddle Tool Bag and Portable Golf Ball Bag pages label several
  dimensions without saying which is which, so they are listed as "labelled
  dimensions" exactly as printed.

---

## 6. Publish to GitHub

The project is ready to commit as-is. From the project root:

```bash
git init
git add .
git commit -m "Leather Wind website"
git branch -M main
git remote add origin https://github.com/<your-account>/<your-repo>.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `.next/`, the source PDF and the
raw page exports. It does **not** exclude `public/images/catalog/`, so the
extracted product photographs are committed and travel with the repository.

> Never commit a real `.env` file. `.env.example` is the template, and it is the
> only environment file tracked.

---

## 7. Deploy to Vercel

1. Go to <https://vercel.com/new> and sign in.
2. **Import** the GitHub repository you just pushed.
3. Accept the detected settings — Vercel recognises Next.js automatically.
   - Build command: `next build`
   - Output: handled automatically
   - Install command: `npm install`
4. *(Optional)* Add environment variables before deploying — all optional:
   - `NEXT_PUBLIC_SITE_URL` — your production domain, e.g. `https://leatherwind.pk`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — digits only
5. Click **Deploy**.

### Add your domain

1. In the Vercel project, open **Settings → Domains**.
2. Add your domain (for example `leatherwind.pk` and `www.leatherwind.pk`).
3. At your domain registrar, point the DNS records at Vercel exactly as the
   Domains screen instructs (an `A` record for the apex, a `CNAME` for `www`).
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy so canonical URLs,
   the Open Graph image and the sitemap all use it.

### Redeploying after a change

Push to `main` — Vercel builds and deploys automatically. To update product
photographs or product data: run `npm run catalog:extract` (if needed), commit,
and push.

---

## 8. Dependency versions and security

Versions are pinned deliberately. Next.js has had a run of critical React Server
Components advisories, and Vercel blocks deploys that use an affected version.

| Package                | Version   | Why                                                                        |
| ---------------------- | --------- | -------------------------------------------------------------------------- |
| `next`                 | `15.5.28` | Newest 15.x (Maintenance LTS). Patched for CVE-2025-66478 (critical RSC RCE), the December 2025 follow-ups, and the 14 October 2026 out-of-band release (CVE-2026-96889 and others). |
| `react` / `react-dom`  | `19.3.1`  | Current stable; patched for the upstream React advisories.                 |
| `eslint-config-next`   | `15.5.28` | Must match `next`.                                                          |

Two rules when updating:

- **Keep `next` and `eslint-config-next` on exactly the same version.**
- Node is pinned to `22.x` in `engines`. Vercel reads this, so the build uses
  Node 22 rather than auto-upgrading on a new major release.

`next` 15.5 pulls `sharp` (used by the image optimiser) at `^0.35.5` or later,
which carries the patched `librsvg` needed for CVE-2026-96889. Nothing extra to
do — just never pin `sharp` below `0.35.5`.

### Refresh the lockfile

`package-lock.json` is committed, so it must not be left pointing at the
vulnerable `15.1.6`. `npm install` rewrites it in place:

```bash
npm install
git add package.json package-lock.json
git commit -m "Pin patched Next.js 15.5.28 and React 19.3.1"
git push
```

Vercel runs `npm install` (not `npm ci`) for npm projects, so it reconciles the
lock against `package.json` either way — but commit the refreshed lock so the
repository stays consistent and the security scan sees the patched versions.

---

## 9. Notes on verification

- **`next build` has been verified on Vercel.** It completed and generated all 29
  routes. That run used the previous pins (`next@15.1.6`); the `15.5.28` upgrade
  has not been built here, so confirm it once more on the redeploy.
- `npm run typecheck` and `npm run lint` have **not** been run in this
  environment (no shell was available). Run them once locally to be sure.
- **Photographs still depend on `npm run catalog:extract`.** The product data is
  complete; the images need that script run on your machine.
- The catalog text was read from page images; product names, dimensions and
  descriptions were transcribed carefully but are worth a quick proofread against
  the PDF.
- `next/font` downloads the two fonts at build time, so the **first build needs
  network access**.

---

## 10. Design system

The palette is fixed and small, and is defined once in `tailwind.config.ts`:

| Token      | Hex       | Use                                     |
| ---------- | --------- | --------------------------------------- |
| `espresso` | `#241914` | Anchor surfaces, footer, hero overlay   |
| `leather`  | `#3A2921` | Secondary dark surfaces                 |
| `cognac`   | `#A66B45` | The single accent — primary actions      |
| `ivory`    | `#F7F3ED` | Default page background                 |
| `sand`     | `#E7DCCE` | Quiet panels, dividers, placeholders    |
| `charcoal` | `#302C29` | Body copy on light surfaces             |
| `white`    | `#FFFFFF` | Maximum-contrast copy on dark surfaces  |

Headings use Cormorant Garamond (serif); UI and body copy use Inter (sans).
The site is responsive at 375 / 768 / 1024 / 1440 px, honours
`prefers-reduced-motion`, and is keyboard navigable throughout (skip link,
visible focus styles, a keyboard-operable image viewer, labelled form controls
and breadcrumb trails).
