#!/usr/bin/env node
/**
 * ============================================================================
 *  Leather Wind — catalog page cropper
 * ============================================================================
 *
 *  Turns the full-page catalog scans in `pdf to images/` into individual,
 *  web-ready product photographs in `public/images/catalog/`.
 *
 *  Why this exists
 *    The catalog PDF stores each product page as a single flat image, so the
 *    photographs cannot simply be pulled out of the PDF as embedded objects —
 *    they have to be cropped out of the page. Doing that by hand, 18 times, is
 *    slow and inconsistent, so this script does it.
 *
 *  How it crops
 *    For every page it:
 *      1. Measures the page, then estimates the page background colour from the
 *         outer border (catalog pages are printed on white/near-white paper).
 *      2. Builds an "ink" mask of every pixel that differs from that background
 *         and groups the ink into connected blobs.
 *      3. Picks the blob that looks most like the product photograph, using a
 *         hint box (below) only as a tie-breaker. So if a hint is a few percent
 *         off, the crop still lands on the real photograph rather than on text.
 *      4. Crops that rectangle, pads it to a 4:5 portrait frame on white — the
 *         exact ratio the product cards and gallery use — and writes a JPEG.
 *
 *    Product photographs are padded to 4:5 so nothing is ever cropped away by
 *    the site's `object-cover` cards. The cover and profile photographs are left
 *    at their natural proportions because the editorial sections crop them
 *    deliberately.
 *
 *  Usage
 *    npm run catalog:images          crop every page
 *    node scripts/crop-catalog-images.mjs --dry    report boxes, write nothing
 *    node scripts/crop-catalog-images.mjs --page 12
 *
 *  The HINTS table below holds the approximate position of each photograph,
 *  read off the pages by eye. They are hints, not truths: the pixel analysis
 *  decides the final rectangle. Adjust a hint if a particular crop lands badly.
 *
 *  This script is a build-time helper. It is excluded from the Next.js build and
 *  from ESLint; it has no effect on the deployed site.
 * ============================================================================
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const PAGES_DIR = path.join(ROOT, "pdf to images");
const OUT_DIR = path.join(ROOT, "public", "images", "catalog");
const REPORT_PATH = path.join(ROOT, "catalog", "crop-report.json");

const PAGE_FILE = (page) =>
  `Leatherwind Catalog_page-${String(page).padStart(4, "0")}.jpg`;

/* -------------------------------------------------------------------------- */
/*  Tunables                                                                   */
/* -------------------------------------------------------------------------- */

/** Width, in pixels, that pages are reduced to for the pixel analysis. */
const ANALYSIS_WIDTH = 320;

/** How far a pixel may sit from the background colour and still count as ink. */
const BACKGROUND_TOLERANCE = 30;

/** Blobs smaller than this are ignored (specks, punctuation, JPEG noise). */
const MIN_BLOB_PIXELS = 40;

/** Breathing room added around a crop, as a fraction of the page. */
const CROP_MARGIN = 0.012;

/** The frame every product photograph is padded into. */
const PRODUCT_ASPECT = 4 / 5;

/** Longest edge of an output file. Sources are small, so this rarely bites. */
const MAX_OUTPUT_EDGE = 1600;

/**
 * page → product, matching PRODUCT_PAGE_MAP in scripts/extract-catalog.mjs.
 *
 * `hints` are [left, top, right, bottom] fractions of the page for the main
 * photograph and, optionally, a second photograph of the same product (which
 * becomes the second image in that product's gallery).
 *
 * `pad` pads the crop to a 4:5 portrait frame; product photographs want this so
 * the site's `object-cover` cards never trim the product. Cover/profile
 * photographs do not, because the editorial sections crop them on purpose.
 */
const PAGES = [
  { page: 1, slug: "catalog-cover", pad: false, hints: [[0.005, 0.55, 0.89, 0.805], [0.635, 0.225, 0.995, 0.575]] },
  { page: 2, slug: "catalog-profile", pad: false, hints: [[0.15, 0.05, 0.995, 0.455]] },

  { page: 6, slug: "dual-camera-harness-strap", pad: true, hints: [[0.135, 0.265, 0.39, 0.555], [0.57, 0.265, 0.865, 0.555]] },
  { page: 7, slug: "hiking-waist-leg-pack-sling", pad: true, hints: [[0.335, 0.265, 0.665, 0.58], [0.29, 0.625, 0.71, 0.945]] },
  { page: 8, slug: "scissor-holder-pouch-case", pad: true, hints: [[0.225, 0.405, 0.665, 0.665], [0.42, 0.265, 0.78, 0.415]] },
  { page: 9, slug: "barber-leather-waist-pouch", pad: true, hints: [[0.225, 0.275, 0.765, 0.625], [0.295, 0.675, 0.7, 0.955]] },
  { page: 10, slug: "motorbike-saddle-tool-bag", pad: true, hints: [[0.18, 0.25, 0.85, 0.46], [0.31, 0.49, 0.69, 0.74]] },
  { page: 11, slug: "portable-golf-ball-bag", pad: true, hints: [[0.14, 0.625, 0.37, 0.915]] },
  { page: 12, slug: "leather-dog-walking-harness", pad: true, hints: [[0.26, 0.29, 0.78, 0.6]] },
  { page: 13, slug: "leather-waist-belts", pad: true, hints: [[0.255, 0.305, 0.725, 0.545], [0.145, 0.595, 0.365, 0.915]] },
  { page: 14, slug: "leather-desk-pad-set", pad: true, hints: [[0.23, 0.275, 0.755, 0.545], [0.495, 0.795, 0.76, 0.94]] },
  { page: 15, slug: "leather-wallets", pad: true, hints: [[0.22, 0.28, 0.78, 0.47], [0.23, 0.49, 0.77, 0.735]] },
  { page: 16, slug: "leather-tablet-laptop-bags", pad: true, hints: [[0.225, 0.26, 0.76, 0.545], [0.65, 0.61, 0.935, 0.73]] },
  { page: 17, slug: "leather-drawer-pulls", pad: true, hints: [[0.31, 0.585, 0.685, 0.94]] },
  { page: 18, slug: "leather-whip-holster", pad: true, hints: [[0.145, 0.26, 0.385, 0.615], [0.565, 0.26, 0.89, 0.605]] },
  { page: 19, slug: "leather-watch-straps", pad: true, hints: [[0.3, 0.265, 0.53, 0.58], [0.565, 0.265, 0.7, 0.58]] },
  { page: 20, slug: "leather-sunglasses-sleeve", pad: true, hints: [[0.17, 0.29, 0.775, 0.505], [0.235, 0.605, 0.6, 0.76]] },
  { page: 21, slug: "leather-case-for-notebook", pad: true, hints: [[0.245, 0.305, 0.805, 0.57], [0.525, 0.7, 0.87, 0.865]] },
  { page: 22, slug: "leather-cord-keepers", pad: true, hints: [[0.355, 0.275, 0.655, 0.525], [0.435, 0.715, 0.87, 0.88]] },
  { page: 23, slug: "leather-wedding-ring-case", pad: true, hints: [[0.33, 0.295, 0.715, 0.58], [0.265, 0.615, 0.735, 0.945]] },
];

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                              */
/* -------------------------------------------------------------------------- */

const log = (...args) => console.log("[crop]", ...args);
const warn = (...args) => console.warn("[crop]", ...args);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Inclusive-rectangle helpers. Boxes are {minX, minY, maxX, maxY}. */
const boxWidth = (b) => b.maxX - b.minX + 1;
const boxHeight = (b) => b.maxY - b.minY + 1;

function intersectionArea(a, b) {
  const w = Math.min(a.maxX, b.maxX) - Math.max(a.minX, b.minX) + 1;
  const h = Math.min(a.maxY, b.maxY) - Math.max(a.minY, b.minY) + 1;
  return w > 0 && h > 0 ? w * h : 0;
}

function unionBox(a, b) {
  return {
    minX: Math.min(a.minX, b.minX),
    minY: Math.min(a.minY, b.minY),
    maxX: Math.max(a.maxX, b.maxX),
    maxY: Math.max(a.maxY, b.maxY),
  };
}

/** Intersection over union of two inclusive rectangles, 0 … 1. */
function boxIoU(a, b) {
  const overlap = intersectionArea(a, b);
  if (overlap === 0) return 0;
  const union =
    boxWidth(a) * boxHeight(a) + boxWidth(b) * boxHeight(b) - overlap;
  return union > 0 ? overlap / union : 0;
}

function growBox(box, marginX, marginY, width, height) {
  return {
    minX: clamp(box.minX - marginX, 0, width - 1),
    minY: clamp(box.minY - marginY, 0, height - 1),
    maxX: clamp(box.maxX + marginX, 0, width - 1),
    maxY: clamp(box.maxY + marginY, 0, height - 1),
  };
}

const median = (values) => {
  if (values.length === 0) return 0;
  values.sort((a, b) => a - b);
  return values[values.length >> 1];
};

/* -------------------------------------------------------------------------- */
/*  Pixel analysis                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Background colour, taken from the outermost two rows and columns. Catalog
 * pages are on paper, so the border is a reliable sample of the page colour.
 */
function estimateBackground(data, width, height, channels) {
  const rs = [];
  const gs = [];
  const bs = [];

  const sample = (x, y) => {
    const i = (y * width + x) * channels;
    rs.push(data[i]);
    gs.push(data[i + 1]);
    bs.push(data[i + 2]);
  };

  for (let x = 0; x < width; x += 1) {
    sample(x, 0);
    if (height > 1) sample(x, 1);
    sample(x, height - 1);
    if (height > 2) sample(x, height - 2);
  }
  for (let y = 0; y < height; y += 1) {
    sample(0, y);
    if (width > 1) sample(1, y);
    sample(width - 1, y);
    if (width > 2) sample(width - 2, y);
  }

  return { r: median(rs), g: median(gs), b: median(bs) };
}

/** Labels every connected group of non-background pixels and measures it. */
function findBlobs(data, width, height, channels, background) {
  const total = width * height;
  const ink = new Uint8Array(total);

  for (let p = 0; p < total; p += 1) {
    const i = p * channels;
    const distance = Math.max(
      Math.abs(data[i] - background.r),
      Math.abs(data[i + 1] - background.g),
      Math.abs(data[i + 2] - background.b),
    );
    ink[p] = distance > BACKGROUND_TOLERANCE ? 1 : 0;
  }

  const visited = new Uint8Array(total);
  const stack = new Int32Array(total);
  const blobs = [];

  for (let start = 0; start < total; start += 1) {
    if (!ink[start] || visited[start]) continue;

    let top = 0;
    stack[top++] = start;
    visited[start] = 1;

    let pixels = 0;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    while (top > 0) {
      const p = stack[--top];
      const x = p % width;
      const y = (p - x) / width;

      pixels += 1;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      if (x > 0 && ink[p - 1] && !visited[p - 1]) {
        visited[p - 1] = 1;
        stack[top++] = p - 1;
      }
      if (x < width - 1 && ink[p + 1] && !visited[p + 1]) {
        visited[p + 1] = 1;
        stack[top++] = p + 1;
      }
      if (y > 0 && ink[p - width] && !visited[p - width]) {
        visited[p - width] = 1;
        stack[top++] = p - width;
      }
      if (y < height - 1 && ink[p + width] && !visited[p + width]) {
        visited[p + width] = 1;
        stack[top++] = p + width;
      }
    }

    if (pixels >= MIN_BLOB_PIXELS) {
      blobs.push({ pixels, minX, minY, maxX, maxY });
    }
  }

  return blobs;
}

/**
 * Chooses the blob that is most likely to be the photograph.
 *
 * The hint is a tie-breaker rather than an instruction: a blob's pixel count is
 * weighted by how well it overlaps the hint, so a hint that is slightly wrong
 * still lands on the large photographic blob instead of on a heading.
 */
function chooseBlob(blobs, hint, pageWidth, pageHeight) {
  if (blobs.length === 0) return null;

  const pageArea = pageWidth * pageHeight;

  const scored = blobs.map((blob) => {
    const iou = boxIoU(blob, hint);
    const sizePenalty = boxWidth(blob) * boxHeight(blob) < pageArea * 0.01 ? 0.25 : 1;
    return { blob, iou, score: blob.pixels * (1 + 3 * iou) * sizePenalty };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0].blob;

  // A photograph that has been cut out of its background arrives as several
  // blobs (body, strap, buckle). Reunite the substantial ones that sit with the
  // winner; tiny blobs are left behind so stray text is not swept in.
  const keepAbove = best.pixels * 0.25;
  const neighbourhood = growBox(
    best,
    Math.round(pageWidth * 0.04),
    Math.round(pageHeight * 0.04),
    pageWidth,
    pageHeight,
  );

  let box = { minX: best.minX, minY: best.minY, maxX: best.maxX, maxY: best.maxY };

  for (const blob of blobs) {
    if (blob === best || blob.pixels < keepAbove) continue;
    const touches = intersectionArea(blob, neighbourhood) > 0;
    if (touches) box = unionBox(box, blob);
  }

  return { box, iou: scored[0].iou, considered: blobs.length };
}

/* -------------------------------------------------------------------------- */
/*  Per-page work                                                              */
/* -------------------------------------------------------------------------- */

/** Normalised [l, t, r, b] hint → inclusive pixel box. */
function hintBox(hint, width, height) {
  const [left, top, right, bottom] = hint;
  return {
    minX: clamp(Math.round(left * width), 0, width - 1),
    minY: clamp(Math.round(top * height), 0, height - 1),
    maxX: clamp(Math.round(right * width) - 1, 0, width - 1),
    maxY: clamp(Math.round(bottom * height) - 1, 0, height - 1),
  };
}

async function processPage(sharp, entry, { dry }) {
  const source = path.join(PAGES_DIR, PAGE_FILE(entry.page));

  if (!fs.existsSync(source)) {
    warn(`page ${entry.page}: missing ${path.relative(ROOT, source)} — skipped`);
    return null;
  }

  // Decode once, upright, as straight RGB. Every measurement and every crop
  // below works off this one buffer, so coordinates can never disagree.
  const { data, info } = await sharp(source)
    .rotate()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  const background = estimateBackground(data, width, height, channels);

  const analysisHeight = Math.max(1, Math.round((height / width) * ANALYSIS_WIDTH));
  const { data: small } = await sharp(data, {
    raw: { width, height, channels },
  })
    .resize({ width: ANALYSIS_WIDTH, height: analysisHeight, fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const blobs = findBlobs(small, ANALYSIS_WIDTH, analysisHeight, channels, background);

  const results = [];
  const chosen = [];
  let emitted = 0;

  for (let index = 0; index < entry.hints.length; index += 1) {
    const hint = hintBox(entry.hints[index], ANALYSIS_WIDTH, analysisHeight);
    const picked = chooseBlob(blobs, hint, ANALYSIS_WIDTH, analysisHeight);

    const pageArea = ANALYSIS_WIDTH * analysisHeight;
    const fallenBack = !picked || boxWidth(picked.box) * boxHeight(picked.box) < pageArea * 0.02;
    const analysisBox = fallenBack ? hint : picked.box;

    // Back to full resolution, with a little air around the photograph.
    const scaleX = width / ANALYSIS_WIDTH;
    const scaleY = height / analysisHeight;
    const marginX = Math.round(width * CROP_MARGIN);
    const marginY = Math.round(height * CROP_MARGIN);

    const raw = {
      minX: Math.floor(analysisBox.minX * scaleX),
      minY: Math.floor(analysisBox.minY * scaleY),
      maxX: Math.ceil((analysisBox.maxX + 1) * scaleX) - 1,
      maxY: Math.ceil((analysisBox.maxY + 1) * scaleY) - 1,
    };

    const grown = growBox(raw, marginX, marginY, width, height);

    const crop = {
      left: grown.minX,
      top: grown.minY,
      width: boxWidth(grown),
      height: boxHeight(grown),
    };

    // Never ask for a rectangle that runs off the page.
    crop.width = Math.min(crop.width, width - crop.left);
    crop.height = Math.min(crop.height, height - crop.top);

    // A second hint can resolve to the same photograph as the first. Two
    // identical images in one gallery help nobody, so drop the repeat.
    const duplicate = chosen.some((box) => boxIoU(box, grown) > 0.5);
    if (duplicate) {
      log(`page ${String(entry.page).padStart(2, "0")} · hint ${index + 1} resolved to an image already cropped — skipped`);
      continue;
    }

    chosen.push(grown);
    emitted += 1;

    const name = `${entry.slug}-${String(emitted).padStart(2, "0")}.jpg`;
    const target = path.join(OUT_DIR, name);

    const record = {
      page: entry.page,
      slug: entry.slug,
      file: name,
      source: path.relative(ROOT, source),
      pageSize: `${width}x${height}`,
      crop,
      padded: entry.pad,
      usedHint: fallenBack,
      hintMatch: picked ? Number(picked.iou.toFixed(2)) : 0,
      blobs: picked ? picked.considered : 0,
    };

    results.push(record);

    log(
      `page ${String(entry.page).padStart(2, "0")} → ${name}\n` +
        `         page ${width}x${height} · crop ${crop.width}x${crop.height} at ${crop.left},${crop.top}` +
        ` · blobs ${record.blobs} · hint match ${record.hintMatch}` +
        (fallenBack ? " · USED HINT" : "") +
        (entry.pad ? " · padded 4:5" : ""),
    );

    if (dry) continue;

    let pipeline = sharp(data, { raw: { width, height, channels } }).extract(crop);

    if (entry.pad) {
      // Pad into an exact 4:5 portrait frame on white, centring the photograph.
      const aspect = crop.width / crop.height;
      let outWidth = crop.width;
      let outHeight = crop.height;

      if (aspect > PRODUCT_ASPECT) {
        outHeight = Math.round(crop.width / PRODUCT_ASPECT);
      } else {
        outWidth = Math.round(crop.height * PRODUCT_ASPECT);
      }

      const padX = Math.round((outWidth - crop.width) / 2);
      const padY = Math.round((outHeight - crop.height) / 2);

      pipeline = pipeline.extend({
        left: padX,
        right: outWidth - crop.width - padX,
        top: padY,
        bottom: outHeight - crop.height - padY,
        background: "#ffffff",
      });

      record.output = `${outWidth}x${outHeight}`;
    } else {
      record.output = `${crop.width}x${crop.height}`;
    }

    // sharp always applies `extend` after any `resize`, so the pad and the
    // downscale are done in two passes — otherwise the padding would be
    // computed against the pre-resize size and land in the wrong place.
    const croppedAndPadded = await pipeline.png().toBuffer();

    await sharp(croppedAndPadded)
      .resize({
        width: MAX_OUTPUT_EDGE,
        height: MAX_OUTPUT_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90, progressive: true })
      .toFile(target);
  }

  return results;
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  const args = new Set(process.argv.slice(2));
  const dry = args.has("--dry");

  const pageArgIndex = process.argv.indexOf("--page");
  const onlyPage = pageArgIndex === -1 ? null : Number(process.argv[pageArgIndex + 1]);

  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error(
      "\n[crop] sharp is required to crop the catalog pages.\n" +
        "       Run `npm install` (sharp is a devDependency for this script).\n",
    );
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(PAGES_DIR)) {
    console.error(
      `\n[crop] no page images found.\n` +
        `       Export every page of the catalog PDF as a JPG and save it in:\n` +
        `       ${path.relative(ROOT, PAGES_DIR)}\\\n` +
        `       Naming: "Leatherwind Catalog_page-0001.jpg", … page-0024.jpg\n`,
    );
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Remove photographs from an earlier run so a changed format or naming scheme
  // cannot leave two versions of the same product behind.
  if (!dry) {
    const stale = fs
      .readdirSync(OUT_DIR)
      .filter((entry) => /-\d+\.(png|jpe?g|webp|avif)$/i.test(entry));

    for (const entry of stale) {
      fs.rmSync(path.join(OUT_DIR, entry));
    }

    if (stale.length > 0) {
      log(`removed ${stale.length} file(s) from a previous run`);
    }
  }

  const work = onlyPage
    ? PAGES.filter((entry) => entry.page === onlyPage)
    : PAGES;

  if (work.length === 0) {
    warn(`no page configuration matches --page ${onlyPage}`);
    process.exitCode = 1;
    return;
  }

  const report = [];

  for (const entry of work) {
    try {
      const results = await processPage(sharp, entry, { dry });
      if (results) report.push(...results);
    } catch (error) {
      warn(`page ${entry.page}: failed (${error.message})`);
    }
  }

  if (!dry) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
    log(`wrote ${path.relative(ROOT, REPORT_PATH)}`);
    log(`done — ${report.length} photograph(s) written to public/images/catalog/`);
    log("Check them over; if one crop lands badly, nudge that page's hint and run again.");
  } else {
    log(`dry run — ${report.length} crop(s) planned, nothing written`);
  }
}

main().catch((error) => {
  console.error("\n[crop] cropping failed:", error.message);
  process.exitCode = 1;
});
