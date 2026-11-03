"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import CmsImage from "./CmsImage";
import { useDragScroll } from "./useDragScroll";
import { Product } from "../data/products";
import { useStorefrontProducts } from "../utils/useStorefrontProducts";

const COPIES = 3; // loop seamlessly in both directions by staying inside the middle copy
const MIN_PER_COPY = 8; // a copy must be wider than any viewport
const SPEED = 36; // px per second
const CARD = "w-[42vw] shrink-0 mr-2 sm:w-[30vw] md:mr-3 md:w-[22vw] lg:w-[16vw]";
const CARD_SIZES = "(min-width: 1024px) 18vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 46vw";

/**
 * Netflix-style row. A native horizontal scroller that glides on its own, so
 * swiping, trackpads and keyboard scrolling all work as normal. Hovering,
 * touching, focusing or dragging pauses it; it carries on from wherever it was
 * left. Vertical wheel and swipe gestures always go to the page.
 *
 * One card is "popped" (scaled up, name and price revealed): the leftmost card
 * while the row glides, or whichever card the mouse, finger or keyboard is on.
 */
export default function ProductRow({ initialProducts }: { initialProducts?: Product[] | null }) {
  const products = useStorefrontProducts(initialProducts);
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

  // Auto-glide.
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

  // The pop. The active card is toggled with a data attribute (no React
  // re-render); CSS does the scale and reveal.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || unit.length === 0) return;

    let leftmost: HTMLElement | null = null; // card on the probe line near the left edge
    let pointed: HTMLElement | null = null; // card under the mouse / finger / focus
    let active: HTMLElement | null = null;
    let touchTimer: ReturnType<typeof setTimeout> | undefined;

    const apply = () => {
      const next = pointed ?? leftmost;
      if (next === active) return;
      active?.removeAttribute("data-active");
      next?.setAttribute("data-active", "true");
      active = next;
    };

    // A probe strip covering the right end of the first card slot plus the gap
    // after it, so some card always touches it. Of the cards touching it, the
    // one furthest left that is still on screen is the "leftmost"; when it
    // slides off, the next card takes over.
    let probe: IntersectionObserver | null = null;
    const touching = new Set<HTMLElement>();
    const pickLeftmost = () => {
      const left = rail.getBoundingClientRect().left;
      let best: HTMLElement | null = null;
      let bestX = Infinity;
      for (const card of Array.from(touching)) {
        const x = card.getBoundingClientRect().left - left;
        if (x >= -3 && x < bestX) {
          best = card;
          bestX = x;
        }
      }
      if (best) leftmost = best;
    };
    const buildProbe = () => {
      probe?.disconnect();
      touching.clear();
      const first = rail.querySelector<HTMLElement>("[data-card]");
      if (!first) return;
      const cardW = first.offsetWidth;
      const stride = cardW + parseFloat(getComputedStyle(first).marginRight || "0");
      const width = rail.clientWidth;
      const from = Math.max(2, Math.min(cardW, width) - 3);
      const to = Math.max(from + 2, Math.min(stride, width) - 1);
      probe = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const card = entry.target as HTMLElement;
            if (entry.isIntersecting) touching.add(card);
            else touching.delete(card);
          }
          pickLeftmost();
          apply();
        },
        { root: rail, rootMargin: `0px ${-(width - to)}px 0px ${-from}px` }
      );
      rail.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => probe!.observe(card));
    };
    buildProbe();
    const resize = new ResizeObserver(buildProbe);
    resize.observe(rail);

    const cardFrom = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>("[data-card]") : null;

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = cardFrom(e.target);
      if (card) {
        pointed = card;
        apply();
      }
    };
    const onMouseLeave = () => {
      pointed = null;
      apply();
    };
    const onTouchStart = (e: TouchEvent) => {
      clearTimeout(touchTimer);
      const card = cardFrom(e.target);
      if (card) {
        pointed = card;
        apply();
      }
    };
    const onTouchEnd = () => {
      clearTimeout(touchTimer);
      touchTimer = setTimeout(() => {
        pointed = null;
        apply();
      }, 2500);
    };
    const onFocusIn = (e: FocusEvent) => {
      const card = cardFrom(e.target);
      if (card) {
        pointed = card;
        apply();
      }
    };

    rail.addEventListener("pointerover", onPointerOver);
    rail.addEventListener("mouseleave", onMouseLeave);
    rail.addEventListener("touchstart", onTouchStart, { passive: true });
    rail.addEventListener("touchend", onTouchEnd, { passive: true });
    rail.addEventListener("focusin", onFocusIn);
    rail.addEventListener("focusout", onMouseLeave);

    return () => {
      probe?.disconnect();
      resize.disconnect();
      clearTimeout(touchTimer);
      active?.removeAttribute("data-active");
      rail.removeEventListener("pointerover", onPointerOver);
      rail.removeEventListener("mouseleave", onMouseLeave);
      rail.removeEventListener("touchstart", onTouchStart);
      rail.removeEventListener("touchend", onTouchEnd);
      rail.removeEventListener("focusin", onFocusIn);
      rail.removeEventListener("focusout", onMouseLeave);
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
    <section aria-labelledby="archives-heading" className="bg-black pb-14 pt-2 text-white md:pb-20">
      <div className="mb-1 flex items-end justify-between gap-4 px-3 md:mb-2 md:px-5">
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
        {/* Vertical padding leaves room for the popped card to grow without being clipped. */}
        <div
          ref={railRef}
          aria-label="Sanctuary Offerings"
          className="drag-scroll no-scrollbar flex overflow-x-auto overflow-y-hidden overscroll-x-contain py-6 md:py-8"
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
              className="absolute inset-y-0 left-0 z-20 hidden w-14 items-center justify-center bg-gradient-to-r from-black/70 to-transparent opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 cursor-pointer [@media(hover:hover)]:flex"
            >
              <ChevronLeft size={28} strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              aria-label="Scroll offerings right"
              className="absolute inset-y-0 right-0 z-20 hidden w-14 items-center justify-center bg-gradient-to-l from-black/70 to-transparent opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 focus-visible:opacity-100 cursor-pointer [@media(hover:hover)]:flex"
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
    <div data-card className={`group/card relative ${CARD} data-[active=true]:z-10`} aria-hidden={hidden || undefined}>
      <Link
        href={href}
        draggable={false}
        tabIndex={hidden ? -1 : 0}
        aria-label={hidden ? undefined : `${product.title}, ${product.price}`}
        className="relative block aspect-[3/4] origin-left overflow-hidden rounded-md bg-white/[0.06] transition-transform duration-300 ease-out group-data-[active=true]/card:scale-[1.1] group-data-[active=true]/card:ring-1 group-data-[active=true]/card:ring-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <CmsImage
          slot={`product-${product.id}`}
          fallback={product.image || "/logo-white.svg"}
          alt=""
          sizes={CARD_SIZES}
          draggable={false}
          className="object-cover object-center"
        />

        {/* Revealed on the popped card only. */}
        <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-12 opacity-0 transition-[opacity,transform] duration-300 ease-out group-data-[active=true]/card:translate-y-0 group-data-[active=true]/card:opacity-100 md:px-4 md:pb-4">
          {product.category && (
            <p className="mb-1 truncate text-[9px] uppercase tracking-[0.25em] text-white/55">{product.category}</p>
          )}
          <p className="line-clamp-2 text-[12px] leading-4 text-white md:text-[13px] md:leading-5">{product.title}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="truncate text-[12px] leading-5 text-white/75">
              {product.mrp && <span className="mr-1.5 text-white/40 line-through">{product.mrp}</span>}
              {product.price}
            </p>
            <span aria-hidden className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-black">
              <ArrowUpRight size={14} strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function RowSkeleton() {
  return (
    <div aria-hidden className={CARD}>
      <div className="aspect-[3/4] rounded-md bg-white/[0.06]" />
    </div>
  );
}
