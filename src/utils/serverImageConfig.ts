// Server-only read of configs/theme-images, mirroring serverProducts.ts's
// approach: Firestore's public REST API with plain fetch (no Firebase SDK on
// the server), cached via Next's data cache. Lets the admin's configured
// hero/pillar/detail images appear in the server-rendered HTML on first
// paint, instead of ImageConfigProvider always starting from
// DEFAULT_IMAGE_CONFIGS and only resolving the real value client-side.
import { DEFAULT_IMAGE_CONFIGS, type ImageConfigs } from "./imageDefaults";

export const IMAGE_CONFIG_REVALIDATE = 300; // seconds; admin edits appear within 5 minutes

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const BASE = PROJECT ? `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents` : null;

type FsValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  mapValue?: { fields?: Record<string, FsValue> };
  arrayValue?: { values?: FsValue[] };
};

function decode(v: FsValue): unknown {
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.arrayValue) return (v.arrayValue.values ?? []).map(decode);
  if (v.mapValue) return decodeFields(v.mapValue.fields ?? {});
  return null;
}

function decodeFields(fields: Record<string, FsValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]));
}

/** Merged with DEFAULT_IMAGE_CONFIGS so every slot is always present, even
 * ones Firestore hasn't seen yet or that are missing a theme variant. */
export async function getImageConfigs(): Promise<ImageConfigs> {
  if (!BASE) return DEFAULT_IMAGE_CONFIGS;
  try {
    const res = await fetch(`${BASE}/configs/theme-images`, {
      next: { revalidate: IMAGE_CONFIG_REVALIDATE, tags: ["image-configs"] },
    });
    if (!res.ok) return DEFAULT_IMAGE_CONFIGS;
    const json = (await res.json()) as { fields?: Record<string, FsValue> };
    if (!json.fields) return DEFAULT_IMAGE_CONFIGS;
    const data = decodeFields(json.fields) as ImageConfigs;
    return { ...DEFAULT_IMAGE_CONFIGS, ...data };
  } catch {
    return DEFAULT_IMAGE_CONFIGS;
  }
}
