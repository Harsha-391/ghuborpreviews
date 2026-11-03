"use client";

import { useEffect, useState } from "react";
import { Product } from "../data/products";
import { fetchStorefrontProducts } from "./cms";

// One request per page load, shared by every homepage section that lists products.
let pending: Promise<Product[]> | null = null;

function loadOnce(): Promise<Product[]> {
  if (!pending) {
    pending = fetchStorefrontProducts().catch((err) => {
      console.warn("Storefront product load failed:", err);
      pending = null; // allow a retry on the next mount
      return [];
    });
  }
  return pending;
}

/** `null` while loading, then the published products (possibly empty). */
export function useStorefrontProducts(): Product[] | null {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadOnce().then((list) => {
      if (!cancelled) setProducts(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}

/**
 * The photos a product card cycles through, mirroring the product page: the CMS
 * gallery if there is one, otherwise front, back and legacy gallery shots.
 */
export function getCardImages(product: Product): { url: string; alt: string }[] {
  const gallery = product.imagesLight?.length ? product.imagesLight : product.imagesDark;
  const urls: { url: string; alt: string }[] = gallery?.length
    ? gallery.map((img) => ({ url: img.url, alt: img.alt || product.title }))
    : [product.image, product.backImage, ...(product.galleryLight?.length ? product.galleryLight : product.galleryDark || [])]
        .filter((u): u is string => !!u)
        .map((url) => ({ url, alt: product.title }));

  const seen = new Set<string>();
  const unique = urls.filter(({ url }) => url && !seen.has(url) && seen.add(url));
  return unique.length ? unique : [{ url: "/logo-black.svg", alt: product.title }];
}
