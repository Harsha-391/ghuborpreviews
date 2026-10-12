"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart } from "lucide-react";
import { Product } from "../data/products";
import { toggleWishlist, isInWishlist } from "../utils/store";
import { fetchStorefrontProducts } from "../utils/cms";
import { useImageConfig } from "./ImageConfigContext";

export default function ProductLineup() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchStorefrontProducts()
      .then((list) => setProducts(list.slice(0, 8)))
      .catch((err) => console.warn("ProductLineup: storefront product load failed:", err));
  }, []);

  if (products.length === 0) return null;

  return (
    <section id="lineup" className="bg-bg-page py-16 sm:py-20 border-t border-border-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header: title + "Discover more" link */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-primary text-[10px] sm:text-xs font-light tracking-[0.3em] uppercase block mb-2">
              THE CURRENT DROP
            </span>
            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-text-page font-light tracking-wide">
              Latest Drop
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-primary hover:text-accent transition-colors uppercase tracking-widest shrink-0"
          >
            <span>Discover more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Responsive product grid — 4-col desktop, 2-col mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const { getImageUrl } = useImageConfig();

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));

    const handleUpdate = () => {
      setWishlisted(isInWishlist(product.id));
    };

    window.addEventListener("wishlist-updated", handleUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate);
    };
  }, [product.id]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group flex flex-col">
      <Link
        href={`/shop/${product.id}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-bg-card border border-border-theme"
      >
        <Image
          src={getImageUrl("product-" + product.id, product.image) || "/logo-white.svg"}
          alt={product.title}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-bg-page/80 border border-border-theme text-primary/80 hover:text-primary transition-all cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? "fill-primary text-primary" : "text-primary/70"}`} />
        </button>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-text-page uppercase group-hover:text-primary transition-colors">
          <Link href={`/shop/${product.id}`}>{product.title}</Link>
        </h3>
      </div>
      <span className="text-xs sm:text-sm font-mono text-primary mt-1">{product.price}</span>
    </div>
  );
}
