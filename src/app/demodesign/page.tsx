"use client";

import { useEffect, useState } from "react";
import FlexCarousel from "../../components/FlexCarousel";
import { Product } from "../../data/products";
import { fetchStorefrontProducts } from "../../utils/cms";

export default function DemoDesignPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStorefrontProducts()
      .then(setProducts)
      .catch((err) => console.warn("demodesign: failed to load products from Firebase:", err))
      .finally(() => setLoading(false));
  }, []);

  // FlexCarousel reads images into a WebGL texture, which requires the browser
  // to fetch them as CORS-clean (crossOrigin="anonymous"). Firebase Storage's
  // bucket has no CORS configuration, so raw firebasestorage.googleapis.com
  // URLs fail that check silently (card renders, texture stays the grey
  // placeholder). Routing through Next's own image optimizer makes the request
  // same-origin, which sidesteps CORS entirely without touching bucket config.
  const toSameOrigin = (url: string) => {
    if (!url) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return `/_next/image?url=${encodeURIComponent(url)}&w=1200&q=80`;
    }
    return url;
  };

  const items = products.map((product) => ({
    src: toSameOrigin(product.image || product.darkImage || product.lightImage || "/logo-white.svg"),
    alt: product.title,
    title: product.title,
    subtitle: product.price,
  }));

  return (
    <div className="min-h-screen bg-bg-page text-text-page flex flex-col items-center justify-center gap-10 px-4 py-16">
      <div className="text-center">
        <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
          DEMO DESIGN
        </span>
        <h1 className="font-serif italic text-3xl sm:text-4xl text-text-page font-light tracking-wide">
          Product Carousel
        </h1>
      </div>

      {loading ? (
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Loading products from Firebase...
        </p>
      ) : items.length === 0 ? (
        <p className="text-xs font-mono text-text-muted uppercase tracking-widest">
          No published products found.
        </p>
      ) : (
        <div style={{ width: "100%", maxWidth: "1200px", height: "560px", position: "relative" }}>
          <FlexCarousel
            items={items}
            preset="liquid"
            intro="rise"
            cardHeight={0.5}
            gap={12}
            squeeze={0.2}
            focusOnClick
            captions
            fit="natural"
            radius={0}
            lensWidth={0.74}
            lensHeight={1.18}
            tilt={62}
            roundness={1}
            bend={0.34}
            reach={0.38}
            curl="twist"
            dispersion={0.45}
            liquid={0}
            followCursor={false}
            autoplay={false}
            interval={4}
            captureWheel
          />
        </div>
      )}
    </div>
  );
}
