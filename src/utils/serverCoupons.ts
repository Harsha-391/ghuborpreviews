// Server-only read of active coupons, same approach as serverProducts.ts:
// Firestore's public REST API with plain fetch, cached via Next's data cache.
// Lets MarqueeBanner's real promo text appear in the server-rendered HTML
// instead of always starting from the hardcoded "NEW DROPS EVERY WEEK"
// default and swapping client-side once fetchActiveCoupons() resolves.
export const COUPONS_REVALIDATE = 300; // seconds; admin edits appear within 5 minutes

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE = PROJECT ? `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents` : null;

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
};
type FsDocument = { name: string; fields?: Record<string, FsValue> };

function decode(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  return null;
}

function decodeDoc(doc: FsDocument): Record<string, unknown> {
  return Object.fromEntries(Object.entries(doc.fields ?? {}).map(([k, v]) => [k, decode(v)]));
}

/** Mirrors isCouponCurrentlyActive() in cms.ts; keep the two in step. */
function isActive(c: Record<string, unknown>): boolean {
  if (c.active === false) return false;
  const now = Date.now();
  const startDate = c.startDate as number | null | undefined;
  const endDate = c.endDate as number | null | undefined;
  if (startDate && now < startDate) return false;
  if (c.neverExpires === false && endDate && now > endDate) return false;
  return true;
}

async function getActiveCoupons(): Promise<Array<Record<string, unknown>>> {
  if (!BASE) return [];
  try {
    const res = await fetch(`${BASE}/cms-coupons?pageSize=300`, {
      next: { revalidate: COUPONS_REVALIDATE, tags: ["coupons"] },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { documents?: FsDocument[] };
    return (json.documents ?? []).map(decodeDoc).filter(isActive);
  } catch {
    return [];
  }
}

/** Mirrors couponToMarqueeText() in MarqueeBannerClient; keep the two in step. */
export async function getMarqueeItems(): Promise<string[]> {
  const coupons = await getActiveCoupons();
  if (coupons.length === 0) return ["NEW DROPS EVERY WEEK"];
  return coupons.map((c) => {
    const discount = c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`;
    const minAmount = (c.minAmount as number) || 0;
    const minText = minAmount > 0 ? ` ON ORDERS ₹${minAmount}+` : "";
    return `USE CODE ${c.code} FOR ${discount}${minText}`;
  });
}
