"use client";

import { useEffect, useState } from "react";
import FlexCarousel from "./FlexCarousel";
import { Product } from "../data/products";
import { fetchStorefrontProducts } from "../utils/cms";

/**
 * Auto-scrolling WebGL product carousel, placed directly below the hero.
 * Images are proxied through /_next/image so the WebGL texture read isn't
 * blocked by Firebase Storage's lack of CORS headers (see demodesign page).
 * The wrapper is sized by aspect-ratio (not a fixed px height) and uses
 * .edge-fade-mask so the liquid-lens card warp tapers off at the viewport
 * edges instead of getting hard-clipped by the container boundary.
 */
export default function FeaturedCarouselSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchStorefrontProducts()
      .then(setProducts)
      .catch((err) => console.warn("FeaturedCarouselSection: failed to load products:", err));
  }, []);

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

  if (items.length === 0) return null;

  return (
    <section className="w-full bg-bg-page py-10 sm:py-14 overflow-hidden">
      <div
        className="w-full edge-fade-mask"
        style={{ aspectRatio: "16 / 7", minHeight: "320px", maxHeight: "560px", position: "relative" }}
      >
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
          autoplay
          interval={3}
          captureWheel={false}
        />
      </div>
    </section>
  );
}
