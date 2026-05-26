"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "../components/Preloader";
import MarqueeBanner from "../components/MarqueeBanner";
import Hero from "../components/Hero";
import About from "../components/About";
import Features from "../components/Features";
import Reviews from "../components/Reviews";
import { Mail } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-black text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative">
      
      {/* Preloader */}
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* Sections */}
      <Hero loading={loading} />
      <About />
      <Features />
      <Reviews />

      {/* Section 4: Inquiries (Gothic themed footer) */}
      <section
        id="inquiries"
        className="bg-black py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden select-none"
      >
        <div className="bg-noise absolute inset-0 opacity-[0.05] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
          
          {/* Signature Glyph in center */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-8 rounded overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-500 filter invert brightness-125">
            <img
              src="/images/details/glyph.png"
              alt="Gibbor Mark Signature"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <h2 className="font-serif italic text-2xl sm:text-3xl lg:text-4xl text-[#E1E0CC] font-light mb-6 tracking-wide">
            Assumed inside the myth.
          </h2>

          {/* Body copies in fragments */}
          <p className="text-gray-500 text-xs sm:text-sm font-light max-w-md mb-10 leading-relaxed uppercase tracking-widest">
            no marketing. no shop now. no links. <br />
            only wearable scripture. hand-numbered drops. <br />
            every garment an artifact.
          </p>

          {/* Action links */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
            <a
              href="mailto:ritual@ghubor.com"
              className="inline-flex items-center gap-3 text-xs sm:text-sm font-light text-primary hover:text-white transition-colors tracking-widest uppercase border-b border-primary/20 pb-1"
            >
              <Mail className="w-4 h-4 text-primary/60" />
              <span>ritual@ghubor.com</span>
            </a>
            <a
              href="https://instagram.com/ghubor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-xs sm:text-sm font-light text-primary hover:text-white transition-colors tracking-widest uppercase border-b border-primary/20 pb-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-primary/60"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span>@ghubor.mythos</span>
            </a>
          </div>

          {/* Hand numbered tag visual artifact */}
          <div className="w-44 border border-white/10 rounded-lg p-3 bg-[#080808]/80 backdrop-blur shadow-2xl relative">
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#5C0606] rounded-full m-2 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-black flex items-center justify-center p-0.5 border border-white/5">
                <img
                  src="/images/details/tag.png"
                  alt="Tag Icon"
                  className="w-full h-full object-cover filter contrast-125 brightness-90"
                />
              </div>
              <div className="text-left">
                <p className="text-[7px] text-gray-500 font-mono uppercase tracking-widest">GARMENT N°</p>
                <p className="text-[10px] text-primary font-mono font-medium">01-098 / DROP 02</p>
              </div>
            </div>
          </div>

          {/* Copyright details */}
          <div className="mt-20 pt-8 border-t border-white/5 w-full flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-600 font-light tracking-widest">
            <p className="uppercase">GHUBOR © 2026. FOR THE MODERN GIBBOR.</p>
            <p className="uppercase mt-2 sm:mt-0">FIGHTING BATTLES NOBODY SEES.</p>
          </div>

        </div>
      </section>

    </div>
  );
}
