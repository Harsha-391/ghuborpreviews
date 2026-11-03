"use client";

import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Features from "./Features";
import FeaturedCarouselSection from "./FeaturedCarouselSection";
import ProductLineup from "./ProductLineup";
import Reviews from "./Reviews";
import Footer from "./Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative">
      <Navbar variant="transparent" />

      <main>
        <Hero />
        <FeaturedCarouselSection />
        <ProductLineup />
        <About />
        <Features />
        <Reviews />
      </main>

      <Footer />
    </div>
  );
}
