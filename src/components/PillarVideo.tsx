"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";

/**
 * Background video that downloads nothing until it is near the viewport:
 * the poster (resized through the image optimizer) is attached ~800px ahead,
 * the video plays only while in view and pauses when it leaves. Under reduced
 * motion it never plays, so the poster is all that shows.
 */
export default function PillarVideo({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [posterSrc, setPosterSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // A <video poster> is fetched eagerly even with preload="none", so only set
    // it once the card is close, keeping it off the critical path of the hero.
    const optimizedPoster = getImageProps({ src: poster, alt: "", width: 828, height: 1035 }).props.src;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPosterSrc(optimizedPoster);
        near.disconnect();
      },
      { rootMargin: "800px 0px" }
    );
    near.observe(video);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => near.disconnect();

    // Starting a video spins up the decoder on the main thread (~50ms on a slow
    // phone). Only do it once the card has stayed half-visible for a moment, and
    // in idle time, so scrolling past it never stutters.
    let dwell: ReturnType<typeof setTimeout> | undefined;
    let idle: number | undefined;
    const start = () => {
      const play = () =>
        video.play().catch(() => {
          /* autoplay refused: the poster stays */
        });
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(play, { timeout: 1000 });
      else play();
    };
    const visible = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(dwell);
        if (idle !== undefined) window.cancelIdleCallback?.(idle);
        if (entry.isIntersecting) dwell = setTimeout(start, 400);
        else video.pause();
      },
      { threshold: 0.5 }
    );
    visible.observe(video);
    return () => {
      near.disconnect();
      visible.disconnect();
      clearTimeout(dwell);
      if (idle !== undefined) window.cancelIdleCallback?.(idle);
    };
  }, [poster]);

  return (
    <video
      ref={ref}
      src={src}
      poster={posterSrc}
      preload="none"
      muted
      loop
      playsInline
      aria-hidden
      className={className}
    />
  );
}
