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
    <section id="reviews" className="bg-white px-4 py-24 sm:px-6 md:py-32 lg:px-10 select-none">
      <div className="mx-auto max-w-[1600px]">

        {/* Header */}
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="text-left">
            <span className="mb-4 block text-[11px] uppercase tracking-[0.3em] text-primary">
              TESTAMENTS
            </span>
            <h2 className="font-serif text-4xl font-light italic leading-none tracking-wide md:text-5xl">
              Witnessed in struggle.
            </h2>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous testimonials"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset ring-black/15 transition-colors duration-200 hover:bg-black hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next testimonials"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-inset ring-black/15 transition-colors duration-200 hover:bg-black hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
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
                  <figure className="flex h-full min-h-[280px] flex-col justify-between border border-border-theme p-6 sm:p-8">
                    {/* Quote Icon */}
                    <div className="mb-6 flex items-start justify-between">
                      <Quote size={28} strokeWidth={1.5} className="text-primary/50" />
                      <span className="text-[9px] uppercase tracking-widest text-text-dim">
                        {review.tag}
                      </span>
                    </div>

                    {/* Quote Text */}
                    <blockquote className="mb-8 flex-grow text-sm font-light leading-relaxed text-text-page/80">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>

                    {/* User Profile */}
                    <figcaption className="mt-auto border-t border-border-theme pt-4">
                      <p className="text-sm font-bold tracking-wide text-primary">
                        {review.author}
                      </p>
                      <p className="mt-0.5 text-[10px] font-light uppercase tracking-widest text-text-dim">
                        {review.location}
                      </p>
                    </figcaption>
                  </figure>
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
              aria-current={currentIndex === idx}
              className={`h-1.5 rounded-full transition-colors duration-200 cursor-pointer ${
                currentIndex === idx ? "w-6 bg-primary" : "w-1.5 bg-black/15 hover:bg-black/30"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
