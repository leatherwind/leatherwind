# /public/images/catalog

Product photographs cropped out of the Leather Wind catalog pages.

These files are produced automatically by:

```bash
npm run catalog:images
```

The script reads the full-page exports in `pdf to images/`, finds the product
photograph on each page by pixel analysis, crops it, pads the product shots into
a 4:5 portrait frame, and writes the results here as JPEGs.

Naming: `<product-slug>-<index>.jpg`, e.g. `leather-wallets-01.jpg`. The `-01`
file is the product's card image; any further `-02`, `-03` … files become that
product's gallery. The slug comes from the page-to-product map in
`scripts/crop-catalog-images.mjs`, so the product data in
`src/data/products.ts` can reference the files directly.

`catalog/crop-report.json` records the rectangle chosen for every crop, which is
the place to look when a crop lands badly. Nudge that page's hint in the script
and run it again.

Do not overwrite these with unrelated stock photography — every image on the
site must be an actual Leather Wind catalog photograph.
