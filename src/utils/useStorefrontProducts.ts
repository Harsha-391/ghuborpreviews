"use client";

import { useEffect, useState } from "react";
import { Product } from "../data/products";
import { whenIdle } from "./loadFirebase";

// One client request per page load, shared by every section that lists
// products. cms.ts (and with it the Firebase SDK) is imported on demand.
let pending: Promise<Product[]> | null = null;

function loadOnce(): Promise<Product[]> {
  if (!pending) {
    pending = import("./cms")
      .then(({ fetchStorefrontProducts }) => fetchStorefrontProducts())
      .catch((err) => {
        console.warn("Storefront product load failed:", err);
        pending = null; // allow a retry on the next mount
        return [];
      });
  }
  return pending;
}

const signature = (list: Product[]) => JSON.stringify(list.map((p) => [p.id, p.title, p.price, p.mrp, p.image]));

/**
 * Products for a listing. With `initial` (rendered on the server) the cards
 * are in the HTML from the first paint; once the browser is idle the list is
 * refreshed quietly in case an admin published something in the meantime.
 * Without it, returns `null` while loading, then the products (possibly empty).
 */
export function useStorefrontProducts(initial?: Product[] | null): Product[] | null {
  const [products, setProducts] = useState<Product[] | null>(initial ?? null);

  useEffect(() => {
    let cancelled = false;
    if (initial) {
      const cancelIdle = whenIdle(() => {
        loadOnce().then((fresh) => {
          if (!cancelled && fresh.length > 0 && signature(fresh) !== signature(initial)) setProducts(fresh);
        });
      }, 4000);
      return () => {
        cancelled = true;
        cancelIdle();
      };
    }
    loadOnce().then((list) => {
      if (!cancelled) setProducts(list);
    });
    return () => {
      cancelled = true;
    };
    // `initial` comes from the server and is fixed for the page's lifetime.
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
