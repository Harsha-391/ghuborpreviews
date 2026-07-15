"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "./Preloader";
import MarqueeBanner from "./MarqueeBanner";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import ProductLineup from "./ProductLineup";
import Reviews from "./Reviews";
import Footer from "./Footer";

export default function MainLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shown = sessionStorage.getItem("ghubor-preloader-shown");
      if (shown) {
        setLoading(false);
      }
    }
  }, []);

  const handleComplete = () => {
    setLoading(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("ghubor-preloader-shown", "true");
    }
  };

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative">
      
      {/* Preloader */}
      <AnimatePresence>
        {loading && <Preloader onComplete={handleComplete} />}
      </AnimatePresence>

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* Sections */}
      <Hero loading={loading} />
      <ProductLineup />
      <About />
      <Features />
      <Reviews />

      <Footer />

    </div>
  );
}
