"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { products, Product } from "../../data/products";
import { getWishlist, toggleWishlist } from "../../utils/store";

export default function WishlistPage() {
  const ease = [0.16, 1, 0.3, 1] as const;

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      const ids = getWishlist();
      const items = products.filter((p) => ids.includes(p.id));
      setWishlistItems(items);
    };

    loadWishlist();
    window.addEventListener("wishlist-updated", loadWishlist);
    return () => {
      window.removeEventListener("wishlist-updated", loadWishlist);
    };
  }, []);

  const handleRemove = (id: string) => {
    toggleWishlist(id);
  };

  return (
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background Noise and glows */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            THE SANCTUARY
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#E1E0CC] font-light tracking-wide leading-none">
            Marked Artifacts
          </h1>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        {wishlistItems.length > 0 ? (
          <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            {wishlistItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease }}
                className="flex flex-col sm:flex-row gap-6 items-center bg-black/60 border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0 select-none">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Info */}
                <div className="flex-grow text-center sm:text-left">
                  <span className="text-[8px] font-mono text-gray-500 tracking-wider uppercase border border-white/5 px-2 py-0.5 rounded">
                    {item.drop}
                  </span>
                  <h3 className="text-sm sm:text-base font-semibold tracking-widest text-[#E1E0CC] uppercase mt-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-light mt-1 uppercase tracking-wider">{item.fabric}</p>
                  <p className="text-xs text-primary/80 font-mono mt-2">{item.price}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0 items-center justify-center">
                  <span className="bg-[#5C0606]/15 border border-[#5C0606]/35 text-primary font-mono text-[9px] tracking-widest py-3 px-5 rounded-full text-center uppercase select-none w-full sm:w-auto font-medium shadow-[0_0_8px_rgba(92,6,6,0.1)]">
                    COMING SOON
                  </span>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-white/5 hover:border-white/10 text-gray-500 hover:text-red-500 font-mono text-[10px] py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>REMOVE</span>
                  </button>
                </div>
              </motion.div>
            ))}

            <div className="mt-12 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-mono text-primary/80 hover:text-white uppercase tracking-widest border-b border-primary/20 pb-1 hover:border-white transition-all duration-300"
              >
                <span>RETURN TO FOUNDATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-black/40 border border-white/5 rounded-3xl max-w-xl mx-auto px-6">
            <Heart className="w-8 h-8 text-gray-700 mx-auto mb-6" />
            <h2 className="text-base text-primary uppercase tracking-widest mb-2 font-mono">Wishlist is Silent</h2>
            <p className="text-xs text-gray-500 font-light max-w-sm mx-auto mb-8 leading-relaxed">
              No artifacts have been marked. Visit the Sanctuary foundation to secure your selections in your wishlist directly from the home page.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-black font-mono text-xs px-6 py-3 rounded-full font-medium tracking-widest transition-transform duration-300 hover:scale-102"
            >
              <span>EXPLORE FOUNDATION</span>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
