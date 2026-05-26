"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Review {
  quote: string;
  author: string;
  location: string;
  tag: string;
}

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  const reviews: Review[] = [
    {
      quote: "The weight of the canvas is unbelievable. It literally feels like armor. The oxblood stitching is subtle but striking.",
      author: "Rohan Sharma",
      location: "Mumbai",
      tag: "GARMENT N° 02-045",
    },
    {
      quote: "Hand-numbered tag inside is such a premium detail. Knowing there are only a handful of these in the world makes it feel like an artifact.",
      author: "Priya Mehta",
      location: "New Delhi",
      tag: "GARMENT N° 02-112",
    },
    {
      quote: "It's not just clothing, it's scripture. The gothic prints and heavy drape are unlike anything else in my collection. Absolutely worth the drop.",
      author: "Aarav Deshmukh",
      location: "Bangalore",
      tag: "GARMENT N° 02-089",
    },
    {
      quote: "Fighting battles nobody sees. When I wear this, it acts like a second skin. The custom blackletter embroidery is pure craftsmanship.",
      author: "Kabir Bhatia",
      location: "Chandigarh",
      tag: "GARMENT N° 02-204",
    },
    {
      quote: "The depth of the crimson graphics is stunning. A silent statement. Perfect drape, insanely heavy fabric, and the signature glyph stands out.",
      author: "Ananya Roy",
      location: "Pune",
      tag: "GARMENT N° 02-177",
    },
    {
      quote: "Each piece is indeed a testament of struggle and faith. The packaging, the tag, the drape—everything screams premium streetwear.",
      author: "Vikram Adiga",
      location: "Hyderabad",
      tag: "GARMENT N° 02-056",
    },
  ];

  // Adjust visible cards count based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = reviews.length - visibleCards;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section id="reviews" className="bg-black py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none border-t border-white/5">
      {/* Background Noise and Subtle Red Glow */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <span className="text-primary text-[10px] sm:text-xs font-light tracking-[0.3em] uppercase block mb-3">
              TESTAMENTS
            </span>
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#E1E0CC] font-light tracking-wide leading-none">
              Witnessed in struggle.
            </h2>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonials"
              className="w-10 h-10 rounded-full border border-white/10 bg-black flex items-center justify-center text-primary/75 hover:text-white hover:border-primary/40 hover:bg-[#100505]/40 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next testimonials"
              className="w-10 h-10 rounded-full border border-white/10 bg-black flex items-center justify-center text-primary/75 hover:text-white hover:border-primary/40 hover:bg-[#100505]/40 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="overflow-hidden w-full relative -mx-3 px-3">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
            }}
          >
            {reviews.map((review, index) => {
              // Set width dynamically depending on size
              const cardWidth = visibleCards === 3 ? "w-1/3" : visibleCards === 2 ? "w-1/2" : "w-full";

              return (
                <div
                  key={index}
                  className={`${cardWidth} shrink-0 px-3`}
                >
                  <div className="bg-[#0c0c0c] border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col justify-between min-h-[280px] group transition-all duration-500 hover:border-primary/20 hover:bg-[#120808] hover:shadow-[0_10px_30px_rgba(92,6,6,0.05)] relative overflow-hidden h-full">
                    {/* Oxblood accent spot on hover */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-950/0 group-hover:bg-red-950/5 rounded-full blur-2xl transition-all duration-500 pointer-events-none" />
                    
                    {/* Quote Icon */}
                    <div className="mb-6 flex justify-between items-start">
                      <Quote className="w-8 h-8 text-[#5C0606] opacity-40 group-hover:opacity-85 transition-opacity duration-500" />
                      <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded border border-white/5">
                        {review.tag}
                      </span>
                    </div>

                    {/* Quote Text */}
                    <p className="text-gray-400 group-hover:text-[#E1E0CC] text-xs sm:text-sm font-light leading-relaxed mb-8 transition-colors duration-500 flex-grow">
                      &ldquo;{review.quote}&rdquo;
                    </p>

                    {/* User Profile */}
                    <div className="border-t border-white/5 pt-4 flex justify-between items-end mt-auto">
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-primary tracking-wide">
                          {review.author}
                        </h4>
                        <p className="text-[10px] text-gray-500 uppercase font-light tracking-widest mt-0.5">
                          {review.location}
                        </p>
                      </div>
                      
                      {/* Active glyph */}
                      <div className="w-6 h-6 opacity-20 group-hover:opacity-75 transition-opacity duration-500 filter invert brightness-125">
                        <img src="/images/details/glyph.png" alt="" className="w-full h-full object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx ? "bg-primary w-6" : "bg-white/10 hover:bg-white/30"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
