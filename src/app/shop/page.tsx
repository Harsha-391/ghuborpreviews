"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { products } from "../../data/products";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toggleWishlist, isInWishlist } from "../../utils/store";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useImageConfig } from "../../components/ImageConfigContext";
import { trackPageView, trackSearch } from "../../utils/analytics";

export default function ShopPage() {
  const ease = [0.16, 1, 0.3, 1] as const;
  const [displayProducts, setDisplayProducts] = useState(products);

  // Track page view
  useEffect(() => { trackPageView("/shop"); }, []);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        if (!db) return;
        const querySnapshot = await getDocs(collection(db, "products"));
        if (!querySnapshot.empty) {
          const list: any[] = [];
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setDisplayProducts(list);
        }
      } catch (err) {
        console.warn("Firestore products query failed (config might be missing), using local fallback:", err);
      }
    };
    fetchDbProducts();
  }, []);

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      {/* Noise Overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      
      {/* Ambient Red Glows */}
      <div className="absolute top-[10%] left-[20%] w-[350px] h-[350px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[25%] right-[15%] w-[450px] h-[450px] bg-red-900/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Title Section */}
        <div className="mb-20 text-center md:text-left">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            THE ARCHIVES
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-text-page font-light tracking-wide mb-4">
            Sanctuary Offerings
          </h1>
          <p className="text-text-muted text-xs sm:text-sm font-light tracking-widest uppercase max-w-xl leading-relaxed">
            Every garment is an artifact, numbered by hand, representing physical scripture. Built for silent wars.
          </p>
        </div>

        {/* 2-Column Product Grid ("in the row of twos") */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {displayProducts.map((product, idx) => (
            <ShopProductCard key={product.id} product={product} idx={idx} ease={ease} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ShopProductCard({ product, idx, ease }: { product: any; idx: number; ease: any }) {
  const [wishlisted, setWishlisted] = useState(false);
  const { getImageUrl } = useImageConfig();

  useEffect(() => {
    setWishlisted(isInWishlist(product.id));

    const handleUpdate = () => {
      setWishlisted(isInWishlist(product.id));
    };

    window.addEventListener("wishlist-updated", handleUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate);
    };
  }, [product.id]);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: idx * 0.1, ease }}
      className="group flex flex-col justify-between border border-border-theme bg-bg-card rounded-3xl overflow-hidden hover:bg-bg-card-alt hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(92,6,6,0.06)] relative"
    >
      {/* Product Image Panel */}
      <Link href={`/shop/${product.id}`} className="relative block aspect-[4/5] bg-bg-page/40 overflow-hidden w-full">
        {/* Micro indicators */}
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-bg-page/70 backdrop-blur-md border border-border-theme rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5C0606] animate-pulse" />
          <span className="text-[9px] font-mono text-primary/80 uppercase tracking-widest">{product.drop}</span>
        </div>
        
        {/* Limited tag moved left to avoid overlapping the heart button */}
        <div className="absolute top-6 right-16 z-20 bg-bg-page/40 backdrop-blur-sm border border-border-theme rounded px-2.5 py-1">
          <span className="text-[9px] font-mono text-text-muted tracking-wider">LIMITED EDITION</span>
        </div>

        {/* Floating Heart Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-5 right-6 z-30 p-2.5 rounded-full bg-bg-page/70 hover:bg-bg-page/90 border border-border-theme text-primary/80 hover:text-white transition-all cursor-pointer shadow-xl"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-600 text-red-600 border-none" : "text-primary/70"}`} />
        </button>

        <img
          src={getImageUrl("product-" + product.id, product.image)}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-page/80 via-transparent to-transparent opacity-60 transition-opacity" />
        
        {/* Hover reveal examine label */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-primary text-bg-page font-mono text-xs px-6 py-3 rounded-full font-medium tracking-widest shadow-xl transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
            EXAMINE ARTIFACT
          </span>
        </div>
      </Link>

      {/* Product Info Footer */}
      <div className="p-8 sm:p-10 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-baseline gap-4 mb-3">
            <h2 className="text-lg sm:text-xl font-bold tracking-widest text-text-page group-hover:text-primary transition-colors uppercase">
              <Link href={`/shop/${product.id}`}>{product.title}</Link>
            </h2>
            <span className="text-base sm:text-lg font-mono font-medium text-primary">
              {product.price}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-6 group-hover:text-text-page transition-colors">
            {product.description}
          </p>
        </div>

        {/* Bottom line detailing specifications */}
        <div className="pt-6 border-t border-border-theme flex justify-between items-center mt-auto">
          <div className="flex gap-4">
            <div className="text-left">
              <p className="text-[8px] text-text-dim font-mono uppercase tracking-widest">FABRIC</p>
              <p className="text-[10px] text-primary/80 font-mono mt-0.5">{product.fabric}</p>
            </div>
            <div className="h-6 w-[1px] bg-border-theme self-center" />
            <div className="text-left">
              <p className="text-[8px] text-text-dim font-mono uppercase tracking-widest">WEIGHT</p>
              <p className="text-[10px] text-primary/80 font-mono mt-0.5">{product.weight}</p>
            </div>
          </div>

          <Link
            href={`/shop/${product.id}`}
            className="inline-flex items-center gap-2 text-xs font-light text-primary hover:text-white transition-colors uppercase tracking-widest"
          >
            <span>VIEW ARTIFACT</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
