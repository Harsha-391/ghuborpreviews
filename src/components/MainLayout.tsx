"use client";

import MarqueeBanner from "./MarqueeBanner";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import ProductLineup from "./ProductLineup";
import Reviews from "./Reviews";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative">

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* Sections */}
      <Hero />
      <ProductLineup />
      <About />
      <Features />
      <Reviews />

      <Footer />

    </div>
  );
}
