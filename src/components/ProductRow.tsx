"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CmsImage from "./CmsImage";
import { useDragScroll } from "./useDragScroll";
import { Product } from "../data/products";
import { useStorefrontProducts } from "../utils/useStorefrontProducts";

const COPIES = 3; // loop seamlessly in both directions by staying inside the middle copy
const MIN_PER_COPY = 8; // a copy must be wider than any viewport
const SPEED = 36; // px per second
const CARD = "w-[42vw] shrink-0 mr-2 sm:w-[30vw] md:mr-3 md:w-[22vw] lg:w-[16vw]";
const CARD_SIZES = "(min-width: 1024px) 16vw, (min-width: 768px) 22vw, (min-width: 640px) 30vw, 42vw";

/**
 * Netflix-style row. A native horizontal scroller that glides on its own, so
 * swiping, trackpads and keyboard scrolling all work as normal. Hovering,
 * touching, focusing or dragging pauses it; it carries on from wherever it was
 * left. Vertical wheel and swipe gestures always go to the page.
 */
export default function ProductRow() {
  const products = useStorefrontProducts();
  const railRef = useRef<HTMLDivElement>(null);
  const engine = useRef<{ pause: () => void; resume: (delay: number) => void } | null>(null);

  const unit = useMemo<Product[]>(() => {
    if (!products?.length) return [];
    const repeats = Math.ceil(MIN_PER_COPY / products.length);
    return Array.from({ length: repeats }, () => products).flat();
  }, [products]);

  useDragScroll(railRef, {
    onDragStart: () => engine.current?.pause(),
    onDragEnd: () => engine.current?.resume(1500),
  });

  useEffect(() => {
    const el = railRef.current;
    if (!el || unit.length === 0) return;

    const loopWidth = () => el.scrollWidth / COPIES;
    const normalized = () => {
      const lw = loopWidth();
      let p = el.scrollLeft;
      if (!lw) return p;
      while (p < lw) p += lw;
      while (p >= 2 * lw) p -= lw;
      return p;
    };

    let pos = loopWidth();
    el.scrollLeft = pos;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let inView = false;
    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = (t: number) => {
      const dt = last ? Math.min(t - last, 50) : 0;
      last = t;
      pos += (SPEED * dt) / 1000;
      const lw = loopWidth();
      if (pos >= 2 * lw) pos -= lw;
      el.scrollLeft = pos;
      raf = requestAnimationFrame(tick);
    };

    const update = () => {
      const shouldRun = !reduced && inView && !paused && !document.hidden;
      if (shouldRun && !raf) {
        pos = normalized();
        el.scrollLeft = pos;
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const pause = () => {
      clearTimeout(resumeTimer);
      paused = true;
      update();
    };
    const resume = (delay: number) => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        paused = false;
        update();
      }, delay);
    };
    engine.current = { pause, resume };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(el);

    const onEnter = () => pause();
    const onLeave = () => resume(500);
    const onTouchEnd = () => resume(2500);
    const onFocusOut = () => resume(800);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("focusin", onEnter);
    el.addEventListener("focusout", onFocusOut);
    document.addEventListener("visibilitychange", update);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      observer.disconnect();
      engine.current = null;
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("focusin", onEnter);
      el.removeEventListener("focusout", onFocusOut);
      document.removeEventListener("visibilitychange", update);
    };
  }, [unit]);

  const nudge = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    engine.current?.pause();
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
    engine.current?.resume(3000);
  };

  if (products !== null && products.length === 0) return null;

  return (
    <section aria-labelledby="archives-heading" className="bg-black pb-20 pt-2 text-white md:pb-28">
      <div className="mb-5 flex items-end justify-between gap-4 px-3 md:mb-7 md:px-5">
        <div>
          <span className="mb-2 block text-[11px] uppercase tracking-[0.3em] text-white/50">THE ARCHIVES</span>
          <h2 id="archives-heading" className="font-serif text-2xl font-light italic md:text-4xl">
            Sanctuary Offerings
          </h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.2em] ring-1 ring-inset ring-white/25 transition-colors duration-200 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          View All Offerings
        </Link>
      </div>

      <div className="group/row relative">
        <div
          ref={railRef}
          aria-label="Sanctuary Offerings"
          className="drag-scroll no-scrollbar flex overflow-x-auto overflow-y-hidden overscroll-x-contain"
        >
          {products === null
            ? Array.from({ length: 8 }, (_, i) => <RowSkeleton key={i} />)
            : Array.from({ length: COPIES }, (_, copy) =>
                unit.map((product, i) => (
                  <RowCard key={`${copy}-${i}-${product.id}`} product={product} hidden={copy !== 1} />
                ))
              )}
        </div>

        {products !== null && (
          <>
            <button
              type="button"
              onClick={() => nudge(-1)}
              aria-label="Scroll offerings left"
              className="absolute inset-y-0 left-0 hidden w-14 items-center justify-center bg-gradient-to-r from-black/70 to-transparent opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 cursor-pointer [@media(hover:hover)]:flex"
            >
              <ChevronLeft size={28} strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Scroll offerings right"
              className="absolute inset-y-0 right-0 hidden w-14 items-center justify-center bg-gradient-to-l from-black/70 to-transparent opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 cursor-pointer [@media(hover:hover)]:flex"
            >
              <ChevronRight size={28} strokeWidth={1.25} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}

// Copies outside the middle one are visual duplicates for the loop: still
// clickable, but hidden from assistive tech and the tab order.
function RowCard({ product, hidden }: { product: Product; hidden: boolean }) {
  const href = `/shop/${product.id}`;
  return (
    <div className={CARD} aria-hidden={hidden || undefined}>
      <Link href={href} draggable={false} tabIndex={hidden ? -1 : 0} className="group/item block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-white/[0.06]">
          <CmsImage
            slot={`product-${product.id}`}
            fallback={product.image || "/logo-white.svg"}
            alt={hidden ? "" : product.title}
            sizes={CARD_SIZES}
            draggable={false}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover/item:scale-[1.04]"
          />
        </div>
        <p className="mt-2.5 truncate text-[12px] leading-5 text-white/85 md:text-[13px]">{product.title}</p>
        <p className="text-[12px] leading-5 text-white/50">{product.price}</p>
      </Link>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div aria-hidden className={CARD}>
      <div className="aspect-[3/4] rounded-md bg-white/[0.06]" />
      <div className="my-1 mt-3.5 h-3 w-2/3 rounded-sm bg-white/[0.06]" />
      <div className="my-1 h-3 w-1/4 rounded-sm bg-white/[0.06]" />
    </div>
  );
}
