import sharp from "sharp";
import fs from "fs";
import path from "path";

const root = process.cwd();
const publicDir = path.join(root, "public");

// [srcRelativeToPublic, destRelativeToPublic, maxWidth]
const jobs = [];

// --- Site-wide images (hero, pillars, details, products) ---
const siteImages = [
  ["images/hero.png", "images/hero.webp", 1920],
  ["images/hero-light.png", "images/hero-light.webp", 1920],
  ["images/pillars/faith.png", "images/pillars/faith.webp", 900],
  ["images/pillars/faith-light.png", "images/pillars/faith-light.webp", 900],
  ["images/pillars/struggle.png", "images/pillars/struggle.webp", 900],
  ["images/pillars/struggle-light.png", "images/pillars/struggle-light.webp", 900],
  ["images/pillars/transcendence.png", "images/pillars/transcendence.webp", 900],
  ["images/pillars/transcendence-light.png", "images/pillars/transcendence-light.webp", 900],
  ["images/details/glyph.png", "images/details/glyph.webp", 800],
  ["images/details/glyph-light.png", "images/details/glyph-light.webp", 800],
  ["images/details/tag.png", "images/details/tag.webp", 800],
  ["images/details/tag-light.png", "images/details/tag-light.webp", 800],
  ["images/details/scripture.png", "images/details/scripture.webp", 1200],
  ["images/details/scripture-light.png", "images/details/scripture-light.webp", 1200],
  ["images/products/hoodie.png", "images/products/hoodie.webp", 1200],
  ["images/products/hoodie-light.png", "images/products/hoodie-light.webp", 1200],
  ["images/products/hoodie-back.png", "images/products/hoodie-back.webp", 1200],
  ["images/products/hoodie-back-light.png", "images/products/hoodie-back-light.webp", 1200],
  ["images/products/jacket.png", "images/products/jacket.webp", 1200],
  ["images/products/jacket-light.png", "images/products/jacket-light.webp", 1200],
  ["images/products/jacket-back.png", "images/products/jacket-back.webp", 1200],
  ["images/products/jacket-back-light.png", "images/products/jacket-back-light.webp", 1200],
  ["images/products/longsleeve.png", "images/products/longsleeve.webp", 1200],
  ["images/products/longsleeve-light.png", "images/products/longsleeve-light.webp", 1200],
  ["images/products/longsleeve-back.png", "images/products/longsleeve-back.webp", 1200],
  ["images/products/longsleeve-back-light.png", "images/products/longsleeve-back-light.webp", 1200],
  ["images/products/pants.png", "images/products/pants.webp", 1200],
  ["images/products/pants-light.png", "images/products/pants-light.webp", 1200],
  ["images/products/tshirt.png", "images/products/tshirt.webp", 1200],
  ["images/products/tshirt-light.png", "images/products/tshirt-light.webp", 1200],
  ["images/products/tshirt-back.png", "images/products/tshirt-back.webp", 1200],
  ["images/products/tshirt-back-light.png", "images/products/tshirt-back-light.webp", 1200],
  ["images/products/cap.png", "images/products/cap.webp", 1200],
  ["images/products/cap-light.png", "images/products/cap-light.webp", 1200],
];
for (const [s, d, w] of siteImages) jobs.push([s, d, w]);

// --- Catalog product galleries (the "black 1"/"white 2"/etc raw export folders) ---
// order within each product's imagesDark array: 0=front,1=back,2..5=detail-1..4
const productMap = {
  "black 1": {
    slug: "product-black-1",
    files: [
      "ChatGPT Image Jul 11, 2026, 02_46_18 PM.png",
      "ChatGPT Image Jul 11, 2026, 02_50_38 PM.png",
      "ChatGPT Image Jul 11, 2026, 03_22_14 PM.png",
      "ChatGPT Image Jul 11, 2026, 03_46_07 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_37_12 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_38_30 PM.png",
    ],
  },
  "black 4": {
    slug: "product-black-4",
    files: [
      "ChatGPT Image Jul 11, 2026, 02_00_34 PM.png",
      "ChatGPT Image Jul 11, 2026, 12_50_50 PM.png",
      "ChatGPT Image Jul 11, 2026, 12_52_59 PM.png",
      "ChatGPT Image Jul 11, 2026, 12_58_52 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_15_05 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_24_51 PM.png",
    ],
  },
  blue: {
    slug: "product-blue",
    files: [
      "ChatGPT Image Jul 11, 2026, 05_30_19 PM.png",
      "ChatGPT Image Jul 11, 2026, 05_30_25 PM.png",
      "ChatGPT Image Jul 11, 2026, 05_39_53 PM.png",
      "ChatGPT Image Jul 11, 2026, 05_42_20 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_30_28 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_43_22 PM.png",
    ],
  },
  red: {
    slug: "product-red",
    files: [
      "987037e7-2f37-40b5-83cd-a3cfc54a95bb.png",
      "ChatGPT Image Jul 11, 2026, 12_47_21 PM.png",
      "ChatGPT Image Jul 13, 2026, 03_31_58 PM.png",
      "ChatGPT Image Jul 13, 2026, 03_32_14 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_14_32 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_23_06 PM.png",
    ],
  },
  "white 1": {
    slug: "product-white-1",
    files: [
      "ChatGPT Image Jul 11, 2026, 02_18_09 PM.png",
      "ChatGPT Image Jul 11, 2026, 02_20_12 PM.png",
      "ChatGPT Image Jul 11, 2026, 02_33_39 PM.png",
      "ChatGPT Image Jul 11, 2026, 02_38_56 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_26_52 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_27_12 PM.png",
    ],
  },
  "white 2": {
    slug: "product-white-2",
    files: [
      "ChatGPT Image Jul 11, 2026, 05_08_07 PM.png",
      "ChatGPT Image Jul 11, 2026, 05_10_25 PM.png",
      "ChatGPT Image Jul 11, 2026, 05_18_12 PM.png",
      "ChatGPT Image Jul 11, 2026, 05_20_23 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_33_48 PM.png",
      "ChatGPT Image Jul 9, 2026, 05_34_34 PM.png",
    ],
  },
};

const cleanNames = ["front", "back", "detail-1", "detail-2", "detail-3", "detail-4"];
export const pathMapping = {}; // old public-relative path -> new public-relative path

for (const [folder, { slug, files }] of Object.entries(productMap)) {
  files.forEach((file, i) => {
    const src = `${folder}/${file}`;
    const dest = `images/products-gallery/${slug}/${cleanNames[i]}.webp`;
    jobs.push([src, dest, 1400]);
    pathMapping[`/${src}`] = `/${dest}`;
  });
}

async function run() {
  let totalBefore = 0;
  let totalAfter = 0;
  let ok = 0;
  let failed = 0;

  for (const [srcRel, destRel, maxWidth] of jobs) {
    const srcPath = path.join(publicDir, srcRel);
    const destPath = path.join(publicDir, destRel);

    if (!fs.existsSync(srcPath)) {
      console.warn("MISSING SRC:", srcRel);
      failed++;
      continue;
    }

    fs.mkdirSync(path.dirname(destPath), { recursive: true });

    const before = fs.statSync(srcPath).size;
    try {
      await sharp(srcPath)
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(destPath);
      const after = fs.statSync(destPath).size;
      totalBefore += before;
      totalAfter += after;
      ok++;
      console.log(
        `${srcRel} -> ${destRel}  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
      );
    } catch (e) {
      console.error("FAILED:", srcRel, e.message);
      failed++;
    }
  }

  console.log("\n=== DONE ===");
  console.log(`ok=${ok} failed=${failed}`);
  console.log(
    `total: ${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB`
  );

  fs.writeFileSync(
    path.join(root, "scripts", "path-mapping.json"),
    JSON.stringify(pathMapping, null, 2)
  );
}

run();
