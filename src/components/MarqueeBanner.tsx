"use client";

import React, { useRef, useState, useEffect } from "react";

export default function MarqueeBanner() {
  const items = [
    "LAUNCH35 FOR 35% OFF",
    "LAUNCH35 FOR 35% OFF",
    "LAUNCH35 FOR 35% OFF",
    "LAUNCH35 FOR 35% OFF",
    "LAUNCH35 FOR 35% OFF",
    "LAUNCH35 FOR 35% OFF",
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetWidth, setOffsetWidth] = useState(0);

  useEffect(() => {
    const measureWidth = () => {
      if (containerRef.current) {
        const firstChild = containerRef.current.firstElementChild as HTMLElement;
        if (firstChild) {
          // Measure client bounding rect for fractional pixel accuracy to prevent jitter
          setOffsetWidth(firstChild.getBoundingClientRect().width || firstChild.offsetWidth);
        }
      }
    };

    // Run measurement on mount
    measureWidth();

    // Re-measure on resize to maintain perfect alignment
    window.addEventListener("resize", measureWidth);
    return () => window.removeEventListener("resize", measureWidth);
  }, []);

  const repeatItems = (
    <div 
      className="flex shrink-0 items-center gap-16 pr-16"
      style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
    >
      {items.map((item, idx) => (
        <span 
          key={idx} 
          className="flex items-center gap-8 text-[9px] sm:text-xs font-light tracking-[0.25em] uppercase text-[#DEDBC8]/90"
          style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
        >
          <span>{item}</span>
          <span className="text-[#5C0606] text-xs select-none">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#080202] border-b border-white/5 py-2.5 overflow-hidden select-none relative z-[100] flex">
      {/* Dynamic Keyframes using pixel-based animation instead of percentage translation to prevent browser rounding jitter at 120 FPS */}
      {offsetWidth > 0 && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes bannerMarquee {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-${offsetWidth}px, 0, 0);
            }
          }
          .animate-banner-marquee {
            display: flex;
            animation: bannerMarquee 35s linear infinite;
            will-change: transform;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            perspective: 1000px;
            -webkit-perspective: 1000px;
            transform-style: preserve-3d;
          }
        `}} />
      )}

      {/* Subtle background noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.05] pointer-events-none" />
      
      <div 
        ref={containerRef}
        className="animate-banner-marquee whitespace-nowrap"
        style={{ transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
      >
        {repeatItems}
        {repeatItems}
        {repeatItems}
        {repeatItems}
      </div>
    </div>
  );
}
