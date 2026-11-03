"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before the transition starts, in ms. */
  delay?: number;
  /** Opacity only, no 12px rise. */
  fadeOnly?: boolean;
}

/**
 * One-shot entrance: opacity (and optionally a 12px rise), once, when the
 * element first scrolls into view. Content is visible without JS and when it
 * is already on screen at mount; the hidden start state is only applied to
 * elements below the fold. Reduced motion is handled in globals.css.
 */
export default function Reveal({ children, className = "", delay = 0, fadeOnly = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("armed");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${fadeOnly ? "reveal-fade" : ""} ${className}`}
      data-armed={state !== "idle"}
      data-shown={state === "shown"}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
