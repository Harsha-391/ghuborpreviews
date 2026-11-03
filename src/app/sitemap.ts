import type { MetadataRoute } from "next";
import { getStorefrontProducts } from "../utils/serverProducts";
import { absoluteUrl } from "../utils/seo";

// Generated from the live catalogue, so new and retired products are picked up
// automatically (the old hand-written sitemap.xml went stale).
export const revalidate = 300; // keep in step with PRODUCTS_REVALIDATE (must be a literal)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = (await getStorefrontProducts()) ?? [];
  const toDate = (v: unknown) => {
    const d = typeof v === "number" || typeof v === "string" ? new Date(v) : null;
    return d && !Number.isNaN(d.getTime()) ? d : undefined;
  };

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/shop"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    ...["/shipping-policy", "/return-policy", "/refund-policy", "/privacy-policy"].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  return [
    ...pages,
    ...products.map((p) => ({
      url: absoluteUrl(`/shop/${p.id}`),
      lastModified: toDate((p as unknown as { updatedAt?: unknown }).updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
