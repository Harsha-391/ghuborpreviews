"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Product } from "../../data/products";
import Navbar from "../../components/Navbar";
import MarqueeBanner from "../../components/MarqueeBanner";
import Footer from "../../components/Footer";
import { useStorefrontProducts } from "../../utils/useStorefrontProducts";
import ProductCard, { ProductCardSkeleton, PRODUCT_GRID, PRODUCT_CARD_SIZES } from "../../components/ProductCard";

interface ShopViewProps {
  /** Products rendered on the server (null if Firestore was unreachable there). */
  initialProducts: Product[] | null;
  /** The ?q= search, applied in the browser. Empty on the server-rendered version. */
  q?: string;
}

/**
 * The /shop page body. The server renders it with every product and no query,
 * so the full grid is in the HTML; <ShopWithQuery> then re-renders it in the
 * browser with the ?q= filter applied.
 */
export function ShopView({ initialProducts, q = "" }: ShopViewProps) {
  const products = useStorefrontProducts(initialProducts);
  const productsLoading = products === null;
  const displayProducts = products ?? [];

  const filteredProducts = displayProducts.filter((product) => {
    if (!q) return true;
    const queryStr = q.toLowerCase();
    return (
      product.title.toLowerCase().includes(queryStr) ||
      (product.description || "").toLowerCase().includes(queryStr) ||
      (product.category && product.category.toLowerCase().includes(queryStr))
    );
  });

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
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

/** Reads ?q= (browser only) and tracks the view and search. */
export function ShopWithQuery({ initialProducts }: { initialProducts: Product[] | null }) {
  const q = useSearchParams().get("q") || "";

  useEffect(() => {
    // Analytics writes to Firestore; load it lazily so it stays off the first load.
    import("../../utils/analytics").then(({ trackPageView, trackSearch }) => {
      trackPageView("/shop");
      if (q) {
        trackSearch(q);
      }
    });
  }, [q]);

  return <ShopView initialProducts={initialProducts} q={q} />;
}
