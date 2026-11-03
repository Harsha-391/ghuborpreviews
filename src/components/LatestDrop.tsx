"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import CmsImage from "./CmsImage";
import { Product } from "../data/products";
import { fetchStorefrontProducts } from "../utils/cms";
import { isInWishlist, toggleWishlist } from "../utils/store";

const MAX_PRODUCTS = 12;
const SKELETON_COUNT = 5;
// Card widths per the PRD: 72vw mobile, 30vw tablet, 22vw desktop.
const CARD = "w-[72vw] shrink-0 snap-start md:w-[30vw] lg:w-[22vw]";
const CARD_SIZES = "(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 72vw";

/**
 * "Latest Drop": the homepage's only product fetch, rendered as a native
 * scroll-snap rail. No autoplay, no JS-driven translate, no wheel capture.
 * The browser does the scrolling; buttons just call scrollBy.
 */
export default function LatestDrop() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchStorefrontProducts()
      .then((list) => !cancelled && setProducts(list.slice(0, MAX_PRODUCTS)))
      .catch((err) => {
        console.warn("LatestDrop: storefront product load failed:", err);
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Enable/disable the arrows by watching the first and last card inside the
  // rail, which avoids a scroll listener.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !products || products.length === 0) return;
    const first = rail.firstElementChild;
    const last = rail.lastElementChild;
    if (!first || !last) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const visible = entry.intersectionRatio > 0.9;
          if (entry.target === first) setAtStart(visible);
          if (entry.target === last) setAtEnd(visible);
        }
      },
      { root: rail, threshold: [0, 0.9, 1] }
    );
    observer.observe(first);
    observer.observe(last);
    return () => observer.disconnect();
  }, [products]);

  const scrollByCard = (dir: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild as HTMLElement | null;
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const loading = products === null;
  const empty = !loading && products.length === 0;

  return (
    <section id="lineup" aria-labelledby="latest-drop-heading" className="bg-white py-20 md:py-28">
      <div className="mx-auto mb-8 flex max-w-[1600px] items-end justify-between gap-6 px-4 md:mb-10 md:px-10">
        <div>
          <span className="mb-3 block text-[11px] uppercase tracking-[0.3em] text-primary">THE CURRENT DROP</span>
          <h2 id="latest-drop-heading" className="font-serif text-3xl font-light italic md:text-5xl">
            Latest Drop
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 py-2 text-[11px] uppercase tracking-[0.25em] underline-offset-[10px] decoration-1 hover:underline"
          >
            Discover more
          </Link>
          <div className="hidden gap-2 md:flex">
            <RailButton label="Previous products" disabled={loading || empty || atStart} onClick={() => scrollByCard(-1)}>
              <ArrowLeft size={18} strokeWidth={1.5} />
            </RailButton>
            <RailButton label="Next products" disabled={loading || empty || atEnd} onClick={() => scrollByCard(1)}>
              <ArrowRight size={18} strokeWidth={1.5} />
            </RailButton>
          </div>
        </div>
      </div>

      {empty ? (
        // Same footprint as the rail, so nothing below moves.
        <div className="mx-4 flex h-[calc(90vw+3rem)] items-center justify-center border border-border-theme md:mx-10 md:h-[calc(37.5vw+3rem)] lg:h-[calc(27.5vw+3rem)]">
          <Link href="/shop" className="text-[11px] uppercase tracking-[0.25em] text-primary hover:underline underline-offset-8">
            View All Offerings
          </Link>
        </div>
      ) : (
        <ul
          ref={railRef}
          tabIndex={0}
          aria-label="Latest Drop products"
          aria-busy={loading}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black md:gap-4 md:scroll-px-10 md:px-10"
        >
          {loading
            ? Array.from({ length: SKELETON_COUNT }, (_, i) => <SkeletonCard key={i} />)
            : products.map((product) => <RailCard key={product.id} product={product} />)}
        </ul>
      )}
    </section>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset ring-black/15 transition-colors duration-200 hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
    >
      {children}
    </button>
  );
}

// Text rows use fixed line-heights and single-line truncation so the
// skeleton and the real card are exactly the same height.
function SkeletonCard() {
  return (
    <li aria-hidden className={CARD}>
      <div className="aspect-[4/5] w-full bg-black/[0.04]" />
      <div className="mt-3 h-4 w-2/3 bg-black/[0.04]" />
      <div className="mt-1 h-4 w-1/4 bg-black/[0.04]" />
    </li>
  );
}

function RailCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const update = () => setWishlisted(isInWishlist(product.id));
    update();
    window.addEventListener("wishlist-updated", update);
    return () => window.removeEventListener("wishlist-updated", update);
  }, [product.id]);

  return (
    <li className={`group ${CARD}`}>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/[0.04]">
        <Link href={`/shop/${product.id}`} aria-label={product.title} className="absolute inset-0 block">
          <CmsImage
            slot={`product-${product.id}`}
            fallback={product.image || "/logo-black.svg"}
            alt={product.title}
            sizes={CARD_SIZES}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 ring-1 ring-inset ring-black/[0.08] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <Heart size={16} strokeWidth={1.5} className={wishlisted ? "fill-primary text-primary" : "text-black"} />
        </button>
      </div>
      <h3 className="mt-3 truncate text-[11px] uppercase leading-4 tracking-[0.2em]">
        <Link href={`/shop/${product.id}`} className="hover:text-primary">
          {product.title}
        </Link>
      </h3>
      <p className="mt-1 text-[11px] leading-4 tracking-[0.1em] text-primary">{product.price}</p>
    </li>
  );
}
