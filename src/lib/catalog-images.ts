import fs from "node:fs";
import path from "node:path";

/**
 * Server-only helper that discovers the catalog photographs extracted by
 * `npm run catalog:extract`.
 *
 * The extractor names every file after its product slug —
 * `dual-camera-harness-strap-01.png`, `…-02.png`, and so on — so a product's
 * complete gallery can be derived from the directory itself. That keeps the
 * gallery in sync with whatever was actually extracted, with no hand-maintained
 * list to drift out of date.
 *
 * This module reads from disk, so it must only be imported from server
 * components / build-time code. Client components receive the resolved image
 * paths as props instead.
 */

const CATALOG_DIR = path.join(process.cwd(), "public", "images", "catalog");

const IMAGE_FILE = /\.(png|jpe?g|webp|avif)$/i;
const SLUGGED_FILE = /^(.*)-(\d+)\.(png|jpe?g|webp|avif)$/i;

let cache: Map<string, string[]> | null = null;

/** Reads the catalog directory once per build and groups files by slug. */
function readCatalogDirectory(): Map<string, string[]> {
  if (cache) return cache;

  const bySlug = new Map<string, string[]>();

  try {
    for (const entry of fs.readdirSync(CATALOG_DIR)) {
      if (!IMAGE_FILE.test(entry)) continue;

      const match = entry.match(SLUGGED_FILE);
      const slug = match ? match[1] : entry.replace(IMAGE_FILE, "");

      const list = bySlug.get(slug) ?? [];
      list.push(`/images/catalog/${entry}`);
      bySlug.set(slug, list);
    }

    // `-01` sorts before `-02`; the zero padding keeps this stable.
    for (const [slug, list] of bySlug) {
      bySlug.set(slug, [...list].sort());
    }
  } catch {
    // Directory does not exist yet — no catalog images have been extracted.
  }

  cache = bySlug;
  return bySlug;
}

/** Every extracted photograph for a product slug, in filename order. */
export function getCatalogImages(slug: string): string[] {
  return readCatalogDirectory().get(slug) ?? [];
}

/** True when at least one catalog photograph has been extracted. */
export function hasCatalogImages(): boolean {
  return readCatalogDirectory().size > 0;
}
