#!/usr/bin/env node
/**
 * ============================================================================
 *  Leather Wind — catalog extractor
 * ============================================================================
 *
 *  Reads the source PDF and produces three things:
 *
 *    catalog/catalog.txt      All extractable text, page by page.
 *    catalog/manifest.json    An index of every image found, with its page and
 *                             pixel dimensions, so images can be matched to
 *                             products reliably.
 *    public/images/catalog/   The embedded product photographs, written as PNG.
 *
 *  Usage
 *    node scripts/extract-catalog.mjs              extract text + images
 *    node scripts/extract-catalog.mjs --text       text only
 *    node scripts/extract-catalog.mjs --render     also render each full page
 *                                                  to catalog/pages/page-XX.png
 *
 *  This script is a build-time helper. It is excluded from the Next.js build
 *  and from ESLint; it has no effect on the deployed site.
 * ============================================================================
 */

import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const ARGS = new Set(process.argv.slice(2));
const TEXT_ONLY = ARGS.has("--text");
const RENDER_PAGES = ARGS.has("--render");

const IMAGE_DIR = path.join(ROOT, "public", "images", "catalog");
const CATALOG_DIR = path.join(ROOT, "catalog");
const PAGE_DIR = path.join(CATALOG_DIR, "pages");

/** Minimum edge length, in pixels, for an extracted image to be kept. */
const MIN_IMAGE_EDGE = 140;

/**
 * Maps a PDF page number to a file-name prefix.
 *
 * The Leather Wind catalog has a fixed structure: page 1 is the cover, pages
 * 3-5 are the profile / standards / contents, pages 6-23 are the eighteen
 * product pages in contents order, and page 24 is the back cover. Naming the
 * output after the product (rather than after the page) is what makes the
 * extracted photographs directly usable in src/data/products.ts.
 */
const PRODUCT_PAGE_MAP = {
  1: "catalog-cover",
  2: "catalog-profile",
  6: "dual-camera-harness-strap",
  7: "hiking-waist-leg-pack-sling",
  8: "scissor-holder-pouch-case",
  9: "barber-leather-waist-pouch",
  10: "motorbike-saddle-tool-bag",
  11: "portable-golf-ball-bag",
  12: "leather-dog-walking-harness",
  13: "leather-waist-belts",
  14: "leather-desk-pad-set",
  15: "leather-wallets",
  16: "leather-tablet-laptop-bags",
  17: "leather-drawer-pulls",
  18: "leather-whip-holster",
  19: "leather-watch-straps",
  20: "leather-sunglasses-sleeve",
  21: "leather-case-for-notebook",
  22: "leather-cord-keepers",
  23: "leather-wedding-ring-case",
  24: "catalog-backdrop",
};

/** File-name prefix for a page: the product slug when known, else the page. */
function prefixForPage(pageNumber) {
  return (
    PRODUCT_PAGE_MAP[pageNumber] ?? `page-${String(pageNumber).padStart(2, "0")}`
  );
}

const log = (...args) => console.log("[catalog]", ...args);
const warn = (...args) => console.warn("[catalog]", ...args);

/* -------------------------------------------------------------------------- */
/*  Locate the PDF                                                             */
/* -------------------------------------------------------------------------- */

function findPdf() {
  const explicit = process.argv.find((arg) => arg.toLowerCase().endsWith(".pdf"));
  if (explicit) {
    const resolved = path.resolve(ROOT, explicit);
    if (fs.existsSync(resolved)) return resolved;
    throw new Error(`PDF not found: ${resolved}`);
  }

  const candidates = fs
    .readdirSync(ROOT)
    .filter((file) => file.toLowerCase().endsWith(".pdf"));

  if (candidates.length === 0) {
    throw new Error(
      "No PDF found in the project root. Place the Leather Wind catalog PDF here and run again.",
    );
  }

  // Prefer a file whose name mentions the catalog.
  const preferred =
    candidates.find((file) => /catalog/i.test(file)) ?? candidates[0];

  return path.join(ROOT, preferred);
}

/* -------------------------------------------------------------------------- */
/*  pdf.js loader                                                              */
/* -------------------------------------------------------------------------- */

async function loadPdfjs() {
  const candidates = [
    "pdfjs-dist/legacy/build/pdf.mjs",
    "pdfjs-dist/build/pdf.mjs",
  ];

  for (const specifier of candidates) {
    try {
      return await import(specifier);
    } catch {
      // Try the next known entry point.
    }
  }

  throw new Error(
    "pdfjs-dist is not installed. Run `npm install` first (pdfjs-dist is a devDependency).",
  );
}

/* -------------------------------------------------------------------------- */
/*  Image helpers                                                              */
/* -------------------------------------------------------------------------- */

/** Converts whatever pdf.js hands us into straight RGBA bytes. */
function toRgba({ data, width, height }) {
  const pixels = width * height;
  const out = new Uint8ClampedArray(pixels * 4);

  if (data.length === pixels * 4) {
    out.set(data);
    return out;
  }

  if (data.length === pixels * 3) {
    for (let i = 0, j = 0; i < pixels; i += 1, j += 3) {
      out[i * 4] = data[j];
      out[i * 4 + 1] = data[j + 1];
      out[i * 4 + 2] = data[j + 2];
      out[i * 4 + 3] = 255;
    }
    return out;
  }

  if (data.length === pixels) {
    for (let i = 0; i < pixels; i += 1) {
      const value = data[i];
      out[i * 4] = value;
      out[i * 4 + 1] = value;
      out[i * 4 + 2] = value;
      out[i * 4 + 3] = 255;
    }
    return out;
  }

  // 1-bit packed bitmaps: expand eight pixels per byte.
  if (data.length === Math.ceil((width * height) / 8)) {
    for (let i = 0; i < pixels; i += 1) {
      const byte = data[(i / 8) | 0];
      const bit = (byte >> (7 - (i % 8))) & 1;
      const value = bit ? 255 : 0;
      out[i * 4] = value;
      out[i * 4 + 1] = value;
      out[i * 4 + 2] = value;
      out[i * 4 + 3] = 255;
    }
    return out;
  }

  return null;
}

async function writePng(filePath, { data, width, height }) {
  const rgba = toRgba({ data, width, height });
  if (!rgba) return false;

  const { PNG } = require("pngjs");
  const png = new PNG({ width, height });
  png.data = Buffer.from(rgba.buffer, rgba.byteOffset, rgba.byteLength);

  await new Promise((resolve, reject) => {
    png
      .pack()
      .pipe(fs.createWriteStream(filePath))
      .on("finish", resolve)
      .on("error", reject);
  });

  return true;
}

/** Wraps pdf.js's callback-or-sync object store lookup in a promise. */
function getStoreObject(store, name) {
  return new Promise((resolve, reject) => {
    let settled = false;

    try {
      store.get(name, (value) => {
        settled = true;
        resolve(value);
      });
    } catch (error) {
      if (settled) return;
      reject(error);
    }
  });
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
  fs.mkdirSync(CATALOG_DIR, { recursive: true });

  const pdfPath = findPdf();
  log(`source: ${path.relative(ROOT, pdfPath)}`);

  const pdfjs = await loadPdfjs();
  const { OPS } = pdfjs;

  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({
    data,
    // Node-friendly flags.
    useSystemFonts: false,
    disableFontFace: true,
    isEvalSupported: false,
    useWorkerFetch: false,
  }).promise;

  log(`pages: ${doc.numPages}`);

  const textSections = [];
  const manifest = { source: path.basename(pdfPath), pages: doc.numPages, images: [] };

  let written = 0;

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
    const page = await doc.getPage(pageNumber);

    /* ---- Text ---- */
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    textSections.push(`\n===== PAGE ${pageNumber} =====\n${pageText || "(no extractable text)"}\n`);

    /* ---- Optionally render the full page ---- */
    if (RENDER_PAGES) {
      try {
        const canvasModule = await import("@napi-rs/canvas");
        const viewport = page.getViewport({ scale: 2.5 });
        const canvas = canvasModule.createCanvas(viewport.width, viewport.height);
        const context = canvas.getContext("2d");
        await page.render({ canvasContext: context, viewport }).promise;
        fs.mkdirSync(PAGE_DIR, { recursive: true });
        const pageFile = path.join(
          PAGE_DIR,
          `page-${String(pageNumber).padStart(2, "0")}.png`,
        );
        fs.writeFileSync(pageFile, canvas.toBuffer("image/png"));
        log(`rendered ${path.relative(ROOT, pageFile)}`);
      } catch (error) {
        warn(
          `could not render page ${pageNumber} (install @napi-rs/canvas for page rendering): ${error.message}`,
        );
      }
    }

    if (TEXT_ONLY) continue;

    /* ---- Embedded images ---- */
    let operatorList;
    try {
      operatorList = await page.getOperatorList();
    } catch (error) {
      warn(`page ${pageNumber}: could not read operator list (${error.message})`);
      continue;
    }

    const inlineImages = [];

    operatorList.fnArray.forEach((fn, index) => {
      const args = operatorList.argsArray[index];
      if (fn === OPS.paintImageXObject) {
        inlineImages.push({ kind: "xobject", name: args?.[0] });
      } else if (fn === OPS.paintInlineImageXObject) {
        inlineImages.push({ kind: "inline", data: args?.[0] });
      }
      // paintImageMaskXObject and paintJpegXObject entries are intentionally
      // skipped: masks are stencils, not photographs.
    });

    let index = 0;
    for (const entry of inlineImages) {
      let image = null;

      try {
        if (entry.kind === "inline") {
          image = entry.data;
        } else if (typeof entry.name === "string") {
          try {
            image = await getStoreObject(page.objs, entry.name);
          } catch {
            image = await getStoreObject(page.commonObjs, entry.name);
          }
        }
      } catch {
        image = null;
      }

      if (!image || !image.width || !image.height || !image.data) continue;

      const tooSmall =
        Math.min(image.width, image.height) < MIN_IMAGE_EDGE;
      if (tooSmall) continue;

      index += 1;
      const fileName = `${prefixForPage(pageNumber)}-${String(index).padStart(2, "0")}.png`;
      const filePath = path.join(IMAGE_DIR, fileName);

      try {
        const ok = await writePng(filePath, image);
        if (!ok) {
          warn(`page ${pageNumber}: unsupported pixel format for image ${index}`);
          continue;
        }
      } catch (error) {
        warn(`page ${pageNumber}: failed to write image ${index} (${error.message})`);
        continue;
      }

      written += 1;
      manifest.images.push({
        file: `public/images/catalog/${fileName}`,
        page: pageNumber,
        width: image.width,
        height: image.height,
        bytes: fs.statSync(filePath).size,
      });
    }

    page.cleanup();
  }

  /* ---- Write outputs ---- */
  const textPath = path.join(CATALOG_DIR, "catalog.txt");
  fs.writeFileSync(
    textPath,
    [
      "Leather Wind — extracted catalog text",
      `Source: ${path.basename(pdfPath)}`,
      `Pages: ${doc.numPages}`,
      "Generated by scripts/extract-catalog.mjs",
      "",
      ...textSections,
    ].join("\n"),
    "utf8",
  );
  log(`wrote ${path.relative(ROOT, textPath)}`);

  const manifestPath = path.join(CATALOG_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  log(`wrote ${path.relative(ROOT, manifestPath)} (${manifest.images.length} images)`);

  log(
    written > 0
      ? `done — ${written} photographs written to public/images/catalog/`
      : "done — no photograph-sized images found; use --render for full-page images",
  );

  if (written === 0 && !RENDER_PAGES) {
    warn(
      "If this catalog stores each product photo as a full-page scan, run: node scripts/extract-catalog.mjs --render",
    );
  }

  await doc.destroy();
}

main().catch((error) => {
  console.error("\n[catalog] extraction failed:", error.message);
  console.error(
    "\nIf this is unexpected, the manual fallback also works: export each catalog page from your PDF reader as a PNG and drop the files into catalog/pages/.\n",
  );
  process.exitCode = 1;
});
