// Server-only product reads for pages, metadata, the sitemap and llms.txt.
//
// Uses Firestore's public REST API with plain fetch (cms-products is publicly
// readable), so no Firebase SDK runs on the server and Next's data cache can
// keep the result. Pages render with real product data in their HTML: fast on
// slow networks, and readable by search engines and AI crawlers.
// Mirrors fetchStorefrontProducts() in cms.ts; keep the two in step.
import { Product } from "../data/products";

export const PRODUCTS_REVALIDATE = 300; // seconds; admin edits appear within 5 minutes

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE = PROJECT ? `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents` : null;

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  referenceValue?: string;
  arrayValue?: { values?: FsValue[] };
  mapValue?: { fields?: Record<string, FsValue> };
};
type FsDocument = { name: string; fields?: Record<string, FsValue> };

function decode(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.referenceValue !== undefined) return v.referenceValue;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) return decodeFields(v.mapValue.fields ?? {});
  return null;
}

function decodeFields(fields: Record<string, FsValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]));
}

function decodeDoc(doc: FsDocument): Record<string, unknown> & { id: string } {
  return { ...decodeFields(doc.fields ?? {}), id: doc.name.split("/").pop() as string };
}

type Fetched<T> = { ok: true; data: T } | { ok: false; notFound: boolean };

async function fsGet<T>(path: string): Promise<Fetched<T>> {
  if (!BASE) return { ok: false, notFound: false };
  try {
    const res = await fetch(`${BASE}/${path}`, { next: { revalidate: PRODUCTS_REVALIDATE, tags: ["products"] } });
    if (res.status === 404) return { ok: false, notFound: true };
    if (!res.ok) return { ok: false, notFound: false };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, notFound: false };
  }
}

function toStorefront(p: Record<string, unknown> & { id: string }): Product {
  const galleryDark = p.galleryDark as string[] | undefined;
  const galleryLight = p.galleryLight as string[] | undefined;
  return {
    ...p,
    image: (p.darkImage as string) || (p.lightImage as string) || "",
    backImage: galleryDark?.[0] || galleryLight?.[0] || "",
  } as unknown as Product;
}

/**
 * Published products in storefront order, or `null` if Firestore could not be
 * reached (callers then fall back to the client-side fetch).
 */
export async function getStorefrontProducts(): Promise<Product[] | null> {
  const docs: FsDocument[] = [];
  let pageToken: string | undefined;
  do {
    const res = await fsGet<{ documents?: FsDocument[]; nextPageToken?: string }>(
      `cms-products?pageSize=300${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`
    );
    if (!res.ok) return null;
    docs.push(...(res.data.documents ?? []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);

  // The client query orders by `order` (which skips documents without it),
  // then drops drafts; do exactly the same.
  return docs
    .map(decodeDoc)
    .filter((p) => typeof p.order === "number" && p.published !== false)
    .sort((a, b) => (a.order as number) - (b.order as number))
    .map(toStorefront);
}

/** One published product, `"not-found"` for a missing or draft one, `null` if Firestore was unreachable. */
export async function getStorefrontProduct(id: string): Promise<Product | "not-found" | null> {
  const res = await fsGet<FsDocument>(`cms-products/${encodeURIComponent(id)}`);
  if (!res.ok) return res.notFound ? "not-found" : null;
  const p = decodeDoc(res.data);
  if (p.published === false) return "not-found";
  return toStorefront(p);
}

/** Only what product cards need, to keep the page payload small. */
export function toCardProduct(p: Product): Product {
  const { id, title, price, mrp, image, backImage, category, description, imagesLight, imagesDark, galleryLight, galleryDark } = p;
  return { id, title, price, mrp, image, backImage, category, description, imagesLight, imagesDark, galleryLight, galleryDark } as Product;
}

/** "₹1,299" → 1299, for structured data. */
export function priceNumber(price: string | undefined): number | null {
  const n = Number(String(price ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}
