"use client";

import Link from "next/link";
import ProductCard, { ProductCardSkeleton, PRODUCT_GRID, PRODUCT_CARD_SIZES } from "./ProductCard";
import { useStorefrontProducts } from "../utils/useStorefrontProducts";

const SKELETON_COUNT = 4;

/**
 * "Latest Drop": a static grid of every published product, 2 per row on
 * phones, 3 on tablets, 4 on desktop. The grid itself never moves; each card
 * runs its own photo slideshow.
 */
export default function LatestDrop() {
  const products = useStorefrontProducts();
  const loading = products === null;
  const empty = !loading && products.length === 0;

  return (
    <section id="lineup" aria-labelledby="latest-drop-heading" className="bg-white pb-16 pt-10 md:pb-24 md:pt-14">
      <div className="mb-5 flex items-center justify-between gap-4 px-3 md:mb-7 md:px-5">
        <h2 id="latest-drop-heading" className="font-serif text-2xl font-light italic md:text-4xl">
          Latest Drop
        </h2>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.2em] ring-1 ring-inset ring-black/15 transition-colors duration-200 hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          Discover more
        </Link>
      </div>

      {empty ? (
        <div className="mx-3 flex aspect-[3/2] items-center justify-center rounded-md border border-border-theme md:mx-5 md:aspect-[4/1]">
          <Link href="/shop" className="text-[11px] uppercase tracking-[0.25em] text-primary hover:underline underline-offset-8">
            View All Offerings
          </Link>
        </div>
      ) : (
        <div aria-busy={loading} className={`${PRODUCT_GRID} px-3 md:px-5`}>
          {loading
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => <ProductCardSkeleton key={i} />)
            : products.map((product, i) => (
                <ProductCard key={product.id} product={product} sizes={PRODUCT_CARD_SIZES} autoplayDelay={(i % 4) * 700} />
              ))}
        </div>
      )}
    </section>
  );
}
