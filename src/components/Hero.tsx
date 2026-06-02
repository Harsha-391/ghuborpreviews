"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "./Navbar";
import { useImageConfig } from "./ImageConfigContext";

export default function Hero({ loading = false }: { loading?: boolean }) {
  const { getImageUrl } = useImageConfig();
  const ease = [0.16, 1, 0.3, 1] as const;

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="h-screen w-full relative p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none">
      {/* Inset Container with Rounded Borders */}
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col justify-between border border-border-theme bg-bg-page">

        {/* Background Image with Zoom & Dark Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={loading ? {} : { scale: 1, opacity: 0.55 }}
            transition={{ duration: 2.5, ease: ease }}
            style={{ willChange: "transform, opacity" }}
            className="w-full h-full"
          >
            <img
              src={getImageUrl("hero")}
              alt="Ghubor Hero Cinematic"
              className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
            />
          </motion.div>

          {/* Noise Overlay */}
          <div className="noise-overlay absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" />

          {/* Red/Oxblood accent glowing spot */}
          <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[160px] pointer-events-none" />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Navbar */}
        <Navbar absolute={true} />

        {/* Spacer for Navbar overlay */}
        <div className="w-full h-16 sm:h-20 md:h-24 pointer-events-none" />

        {/* Hero Content (Centered, Elevated above the fold) */}
        <div className="w-full z-20 flex flex-col items-center justify-center px-6 py-6 flex-grow max-w-4xl mx-auto text-center gap-6 md:gap-8">

          {/* Brand Glyph Signature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={loading ? {} : { opacity: 0.65, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease }}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 filter invert brightness-125 hover:opacity-100 transition-opacity duration-300 cursor-pointer pointer-events-auto"
            onClick={() => handleNavClick("about")}
            title="Descend to foundations"
          >

          </motion.div>

          {/* Elevated Large Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={loading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease }}
            className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-text-page font-light leading-[1.3] sm:leading-[1.25] tracking-wide max-w-3xl text-center"
          >
            Armor for the modern Gibbor. Wearable scripture.
          </motion.p>

          {/* Elevated CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={loading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease }}
            style={{ willChange: "transform, opacity" }}
          >
            <Link
              href="/shop"
              className="bg-primary text-bg-page rounded-full py-2.5 pl-6 pr-2.5 flex items-center justify-between gap-6 font-medium text-xs sm:text-sm group hover:gap-8 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(222,219,200,0.25)] hover:shadow-[0_4px_35px_rgba(222,219,200,0.5)] inline-flex"
            >
              <span>ENTER THE RITUAL</span>
              <span className="bg-text-page rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-bg-page" />
              </span>
            </Link>
          </motion.div>

        </div>

        {/* Bottom Details Bar */}
        <div className="w-full z-20 px-6 pb-6 md:px-12 md:pb-10 flex justify-between items-center text-[9px] sm:text-[10px] text-text-muted font-mono tracking-[0.2em] uppercase select-none">
          <span>COVENANT DROP II</span>
          <button
            onClick={() => handleNavClick("about")}
            className="animate-bounce hover:text-primary transition-colors cursor-pointer"
          >
            SCROLL TO DESCEND ↓
          </button>
          <span>N° 01-098 / 064</span>
        </div>

      </div>
    </section>
  );
}
