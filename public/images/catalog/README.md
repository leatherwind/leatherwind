# /public/images/catalog

Product photographs extracted from the Leather Wind PDF catalog.

These files are produced automatically by:

```bash
npm run catalog:extract
```

The script reads `Leatherwind Catalog.pdf` from the project root, extracts every
embedded raster image, filters out decorative noise, and writes the results
here. Each extracted file is listed in `catalog/manifest.json` together with the
page it came from, so images can be matched to products reliably.

Naming: `<product-slug>-<index>.png`, e.g. `leather-wallets-01.png`. The slug
comes from the page-to-product map in `scripts/extract-catalog.mjs`, so the
product data in `src/data/products.ts` can reference the files directly.

Do not overwrite these with unrelated stock photography — every image on the
site must be an actual Leather Wind catalog photograph.
