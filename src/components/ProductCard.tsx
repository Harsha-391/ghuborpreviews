"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Plus } from "lucide-react";
import CmsImage from "./CmsImage";
import { useDragScroll } from "./useDragScroll";
import { Product } from "../data/products";
import { getCardImages } from "../utils/useStorefrontProducts";
import { isInWishlist, toggleWishlist } from "../utils/store";

const AUTOPLAY_MS = 3500;

/** Shared product grid: 2 per row on phones, 3 on tablets, 4 on desktop. */
export const PRODUCT_GRID = "grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3 md:gap-x-3 md:gap-y-8 lg:grid-cols-4";
export const PRODUCT_CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw";

interface ProductCardProps {
  product: Product;
  sizes: string;
  /** Offsets this card's autoplay so neighbouring cards don't flip in unison. */
  autoplayDelay?: number;
}

/**
 * Product card whose photo strip is a native scroll-snap track: swipe with a
 * finger, drag with a mouse, use the arrows or dots, or let it advance on its
 * own. Autoplay only runs while the card is on screen and nobody is hovering,
 * focusing, touching or dragging it, and never under reduced motion.
 */
export default function ProductCard({ product, sizes, autoplayDelay = 0 }: ProductCardProps) {
  const images = useMemo(() => getCardImages(product), [product]);
  const multi = images.length > 1;
  const href = `/shop/${product.id}`;

  const trackRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  // Highest photo index allowed to load: the next one in line, or any jumped to.
  const [loadUpTo, setLoadUpTo] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const paused = useRef({ hover: false, focus: false, touch: false, drag: false });
  const touchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    setLoadUpTo((n) => Math.max(n, i));
    track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  }, []);

  useDragScroll(trackRef, {
    onDragStart: () => {
      paused.current.drag = true;
    },
    onDragEnd: () => {
      paused.current.drag = false;
      const track = trackRef.current;
      if (track) goTo(Math.round(track.scrollLeft / track.clientWidth));
    },
  });

  useEffect(() => {
    const update = () => setWishlisted(isInWishlist(product.id));
    update();
    window.addEventListener("wishlist-updated", update);
    return () => window.removeEventListener("wishlist-updated", update);
  }, [product.id]);

  // Start preloading the second photo once the card is close to the viewport.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multi) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoadUpTo((n) => Math.max(n, 1));
        observer.disconnect();
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, [multi]);

  // Which photo is showing, from an observer rooted on the track (no scroll listener).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multi) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const i = Number((entry.target as HTMLElement).dataset.index);
          indexRef.current = i;
          setIndex(i);
          setLoadUpTo((n) => Math.max(n, i + 1));
        }
      },
      { root: track, threshold: 0.6 }
    );
    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [multi, images]);

  // Autoplay.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multi || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = false;
    let interval: ReturnType<typeof setInterval> | undefined;
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.5 });
    observer.observe(track);

    const start = setTimeout(() => {
      interval = setInterval(() => {
        const p = paused.current;
        if (!visible || document.hidden || p.hover || p.focus || p.touch || p.drag) return;
        goTo((indexRef.current + 1) % images.length);
      }, AUTOPLAY_MS);
    }, autoplayDelay);

    return () => {
      observer.disconnect();
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [multi, images.length, autoplayDelay, goTo]);

  useEffect(() => () => clearTimeout(touchTimer.current), []);

  const step = (dir: 1 | -1) => goTo((indexRef.current + dir + images.length) % images.length);

  return (
    <article className="group/card min-w-0">
      <div
        className="group/media relative aspect-[3/4] w-full overflow-hidden rounded-md bg-black/[0.04]"
        onMouseEnter={() => (paused.current.hover = true)}
        onMouseLeave={() => (paused.current.hover = false)}
        onFocus={() => (paused.current.focus = true)}
        onBlur={() => (paused.current.focus = false)}
        onTouchStart={() => {
          clearTimeout(touchTimer.current);
          paused.current.touch = true;
        }}
        onTouchEnd={() => {
          touchTimer.current = setTimeout(() => (paused.current.touch = false), 4000);
        }}
      >
        <div
          ref={trackRef}
          aria-roledescription={multi ? "carousel" : undefined}
          aria-label={multi ? `${product.title} photos` : undefined}
          className={`no-scrollbar flex h-full w-full overflow-y-hidden ${
            multi ? "drag-scroll snap-x snap-mandatory overflow-x-auto overscroll-x-contain" : "overflow-x-hidden"
          }`}
        >
          {images.map((img, i) => (
            <Link
              key={img.url}
              href={href}
              data-index={i}
              draggable={false}
              tabIndex={i === 0 ? 0 : -1}
              aria-hidden={i === 0 ? undefined : true}
              aria-label={i === 0 ? product.title : undefined}
              className="relative block h-full w-full shrink-0 snap-start snap-always"
            >
              {i === 0 ? (
                <CmsImage
                  slot={`product-${product.id}`}
                  fallback={img.url}
                  alt={img.alt}
                  sizes={sizes}
                  draggable={false}
                  className="object-cover object-center"
                />
              ) : i <= loadUpTo ? (
                <Image src={img.url} alt={img.alt} fill sizes={sizes} draggable={false} className="object-cover object-center" />
              ) : null}
            </Link>
          ))}
        </div>

        {multi && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={`Previous photo of ${product.title}`}
              className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black opacity-0 ring-1 ring-inset ring-black/[0.08] transition-opacity duration-200 group-hover/media:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer [@media(hover:hover)]:flex"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={`Next photo of ${product.title}`}
              className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-black opacity-0 ring-1 ring-inset ring-black/[0.08] transition-opacity duration-200 group-hover/media:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer [@media(hover:hover)]:flex"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-0.5">
              {images.map((img, i) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show photo ${i + 1} of ${images.length}`}
                  aria-current={index === i}
                  className="pointer-events-auto p-1 cursor-pointer"
                >
                  <span
                    className={`block h-1.5 w-1.5 rounded-full ring-1 ring-black/10 transition-colors duration-200 ${
                      index === i ? "bg-white" : "bg-white/45"
                    }`}
                  />
                </button>
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={wishlisted ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 ring-1 ring-inset ring-black/[0.08] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <Heart size={15} strokeWidth={1.5} className={wishlisted ? "fill-primary text-primary" : "text-black"} />
        </button>
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2 px-0.5">
        <div className="min-w-0">
          <h3 className="truncate text-[12px] leading-5 md:text-[13px]">
            <Link href={href} className="hover:text-primary">
              {product.title}
            </Link>
          </h3>
          <p className="truncate text-[12px] leading-5 text-text-muted">
            {product.mrp && <span className="mr-1.5 text-text-dim line-through">{product.mrp}</span>}
            {product.price}
          </p>
        </div>
        <Link
          href={href}
          aria-label={`View ${product.title}`}
          className="-mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200 hover:bg-black/[0.05] focus-visible:outline-2 focus-visible:outline-black"
        >
          <Plus size={18} strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}

/** Same footprint as ProductCard, so swapping one for the other moves nothing. */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden className="min-w-0">
      <div className="aspect-[3/4] w-full rounded-md bg-black/[0.04]" />
      <div className="mt-2.5 px-0.5">
        <div className="my-1 h-3 w-2/3 rounded-sm bg-black/[0.04]" />
        <div className="my-1 h-3 w-1/4 rounded-sm bg-black/[0.04]" />
      </div>
    </div>
  );
}
