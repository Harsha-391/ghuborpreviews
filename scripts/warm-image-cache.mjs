// Requests every image size the storefront serves, so the image optimizer has
// each one cached before a real visitor asks for it. An uncached size is
// resized on the spot, which is the one slow request this removes.
//
// Run after a deploy, or after adding/replacing product or hero images:
//   npm run warm                      (production)
//   npm run warm -- http://localhost:3000
import fs from "fs";

const origin = (process.argv[2] ?? "https://www.ghubor.com").replace(/\/$/, "");
const CONCURRENCY = 6;
const ACCEPT = "image/avif,image/webp,image/apng,image/*,*/*;q=0.8";
// Widths for product photos that are only rendered in the browser (later
// slides of a card or gallery), so they never appear in the page HTML.
const SLIDE_WIDTHS = [384, 640, 828, 1080];

const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
  (fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").match(/NEXT_PUBLIC_FIREBASE_PROJECT_ID="?([^"\r\n]+)/)?.[1] : undefined);

const html = async (path) => (await fetch(origin + path)).text();
const imageUrls = (page) =>
  (page.match(/\/_next\/image\?url=[^\s"'<>\\]+/g) ?? []).map((u) => u.replace(/&amp;/g, "&")).filter((u) => /[?&]w=\d+/.test(u));

const targets = new Set();

// 1. Everything the server-rendered pages reference, at every width in their srcsets.
const shop = await html("/shop");
const productPaths = [...new Set(shop.match(/\/shop\/[A-Za-z0-9_-]+/g) ?? [])];
for (const path of ["/", "/shop", "/about", ...productPaths]) {
  imageUrls(await html(path)).forEach((u) => targets.add(u));
}

// 2. Product photos beyond the first, which load as the visitor swipes.
if (projectId) {
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/cms-products?pageSize=300`);
  const walk = (v, out) => {
    if (v?.stringValue?.startsWith("https://")) out.add(v.stringValue);
    v?.arrayValue?.values?.forEach((x) => walk(x, out));
    Object.values(v?.mapValue?.fields ?? {}).forEach((x) => walk(x, out));
  };
  const photos = new Set();
  for (const d of (await res.json()).documents ?? []) Object.values(d.fields ?? {}).forEach((v) => walk(v, photos));
  for (const src of photos) for (const w of SLIDE_WIDTHS) targets.add(`/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`);
}

const queue = [...targets];
let cold = 0;
let failed = 0;
let slowest = { ms: 0, url: "" };
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (let url = queue.pop(); url; url = queue.pop()) {
      const started = Date.now();
      try {
        const res = await fetch(origin + url, { headers: { Accept: ACCEPT } });
        await res.arrayBuffer();
        const ms = Date.now() - started;
        if (!res.ok) failed++;
        if (res.headers.get("x-vercel-cache") === "MISS") cold++;
        if (ms > slowest.ms) slowest = { ms, url };
      } catch {
        failed++;
      }
    }
  })
);

console.log(`${targets.size} image sizes requested on ${origin}: ${cold} were not cached yet, ${failed} failed.`);
if (slowest.url) console.log(`Slowest: ${slowest.ms} ms  ${decodeURIComponent(slowest.url).slice(0, 140)}`);
