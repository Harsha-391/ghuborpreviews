"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Product } from "../../data/products";
import Navbar from "../../components/Navbar";
import MarqueeBanner from "../../components/MarqueeBanner";
import Footer from "../../components/Footer";
import { fetchStorefrontProducts } from "../../utils/cms";
import ProductCard, { ProductCardSkeleton, PRODUCT_GRID, PRODUCT_CARD_SIZES } from "../../components/ProductCard";
import { trackPageView, trackSearch } from "../../utils/analytics";

function ShopContent() {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  // Track page view
  useEffect(() => {
    trackPageView("/shop");
    if (q) {
      trackSearch(q);
    }
  }, [q]);

  useEffect(() => {
    fetchStorefrontProducts()
      .then(setDisplayProducts)
      .catch((err) => console.warn("Failed to load storefront products:", err))
      .finally(() => setProductsLoading(false));
  }, []);

  const filteredProducts = displayProducts.filter((product) => {
    if (!q) return true;
    const queryStr = q.toLowerCase();
    return (
      product.title.toLowerCase().includes(queryStr) ||
      product.description.toLowerCase().includes(queryStr) ||
      (product.category && product.category.toLowerCase().includes(queryStr))
    );
  });

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      {/* Noise Overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      
      {/* Ambient Red Glows */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[25%] right-[15%] w-[450px] h-[450px] bg-red-900/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Global Navbar, then the promo line beneath it */}
      <Navbar />
      <MarqueeBanner />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Title Section */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            THE ARCHIVES
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-text-page font-light tracking-wide mb-4">
            Sanctuary Offerings
          </h1>
          {q && (
            <p className="text-primary text-xs font-mono uppercase tracking-widest mb-4">
              Showing results for &quot;{q}&quot; ({filteredProducts.length} artifacts found)
            </p>
          )}
          <p className="text-text-muted text-xs sm:text-sm font-light tracking-widest uppercase max-w-xl leading-relaxed">
            Every garment is an artifact, numbered by hand, representing physical scripture. Built for silent wars.
          </p>
        </div>

        {/* Same grid as the homepage: 2 per row on phones, 3 on tablets, 4 on desktop */}
        {productsLoading ? (
          <div aria-busy="true" aria-label="Loading Sanctuary Archives" className={PRODUCT_GRID}>
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border-theme rounded-3xl bg-bg-card/50">
            <p className="text-sm font-mono text-text-muted uppercase tracking-widest">No matching artifacts found in the Sanctuary</p>
            <Link href="/shop" className="text-xs font-mono text-primary uppercase tracking-widest hover:text-white transition-colors mt-4 inline-block">
              View All Offerings
            </Link>
          </div>
        ) : (
          <div className={PRODUCT_GRID}>
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} sizes={PRODUCT_CARD_SIZES} autoplayDelay={(idx % 4) * 700} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-page flex items-center justify-center text-primary font-mono text-xs uppercase tracking-widest">
        Loading Sanctuary Archives...
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
