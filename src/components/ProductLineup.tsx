"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Heart, X, Lock } from "lucide-react";
import { products } from "../data/products";
import { toggleWishlist, isInWishlist } from "../utils/store";
import { useImageConfig } from "./ImageConfigContext";
import { useTheme } from "./ThemeContext";
import { fetchDropSettings, fetchHomeProducts, CMSDropSettings } from "../utils/cms";

export default function ProductLineup() {
  const [settings, setSettings] = useState<CMSDropSettings | null>(null);
  const [displayProducts, setDisplayProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    fetchDropSettings().then(setSettings);
    
    fetchHomeProducts().then((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        // Filter out unpublished items
        setDisplayProducts(dbProducts.filter(p => p.published !== false));
      } else {
        setDisplayProducts(products);
      }
    });
  }, []);

  return (
    <section
      id="lineup"
      className="bg-bg-page py-24 border-t border-border-theme relative overflow-hidden select-none"
    >
      {/* Dynamic Keyframes injected locally */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes productsMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .animate-products-marquee {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: productsMarquee 35s linear infinite;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .animate-products-marquee:hover {
          animation-play-state: paused;
        }
        .marquee-mask {
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
      `}} />

      {/* Background elements */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-red-950/10 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-red-950/10 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 px-4 sm:px-6 lg:px-8">
          <span className="text-primary text-[10px] sm:text-xs font-light tracking-[0.3em] uppercase block mb-3">
            THE CURRENT DROP
          </span>
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-text-page font-light tracking-wide leading-none">
            {settings ? `${settings.dropNumber}: ${settings.dropTitle}` : "Drop 01: Wearable Scripture"}
          </h2>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        {/* Horizontal Marquee Container with edge fading */}
        {displayProducts.length > 0 && (
          <div className="w-full overflow-hidden py-4 flex marquee-mask">
            <div className="animate-products-marquee px-[15vw]">
              {/* First Set */}
              {displayProducts.map((product) => (
                <ProductCard
                  key={`${product.id}-set1`}
                  product={product}
                  settings={settings}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
              {/* Repeated Set for Infinite Loop */}
              {displayProducts.map((product) => (
                <ProductCard
                  key={`${product.id}-set2`}
                  product={product}
                  settings={settings}
                  onClick={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>
        )}

        {/* See All Products Redirect CTA */}
        <div className="mt-16 text-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-4 bg-transparent border border-primary/20 hover:border-primary text-primary hover:text-black hover:bg-primary rounded-full py-3 px-8 text-xs sm:text-sm font-medium tracking-widest transition-all duration-300 group cursor-pointer shadow-[0_4px_15px_rgba(222,219,200,0.05)] hover:shadow-[0_4px_25px_rgba(222,219,200,0.15)]"
          >
            <span>SEE ALL PRODUCTS</span>
            <span className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-black/10 flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>

      {/* Warning Modal */}
      {selectedProduct && (
        <ShipmentModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}

// ─── CARD SUB-COMPONENT ──────────────────────────────────────────────────────
interface ProductCardProps {
  product: any;
  settings: CMSDropSettings | null;
  onClick: () => void;
}

function ProductCard({ product, settings, onClick }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const { theme } = useTheme();
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

  const getProductImage = () => {
    // 1. Check general theme overrides from Images Tab in Admin
    const customized = getImageUrl("product-" + product.id);
    if (customized && !customized.includes("fallback")) return customized;
    
    // 2. Otherwise use the product's direct fields
    if (theme === "light") {
      return product.lightImage || product.image || "/images/products/fallback.png";
    }
    return product.darkImage || product.image || "/images/products/fallback.png";
  };

  return (
    <div
      onClick={onClick}
      className="w-[280px] sm:w-[320px] shrink-0 flex flex-col h-[480px] bg-bg-card border border-border-theme rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/20 hover:bg-bg-card-alt hover:shadow-[0_15px_40px_rgba(92,6,6,0.06)] whitespace-normal group relative cursor-pointer"
    >
      {/* Product Image Frame */}
      <div className="relative block aspect-[4/5] w-full overflow-hidden bg-bg-page/40">
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-bg-page/70 backdrop-blur-md border border-border-theme rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5C0606] animate-pulse" />
          <span className="text-[9px] font-mono text-primary/80 uppercase tracking-widest">
            {settings ? settings.dropNumber : (product.drop || "DROP 01")}
          </span>
        </div>

        {/* Limited tag */}
        <div className="absolute top-4 right-14 z-20 bg-bg-page/40 backdrop-blur-sm border border-border-theme rounded px-2 py-0.5">
          <span className="text-[8px] font-mono text-text-muted tracking-wider">LIMITED / 64</span>
        </div>

        {/* Floating Heart Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3.5 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/85 border border-white/10 text-primary/70 hover:text-white transition-all cursor-pointer shadow-lg"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? "fill-red-600 text-red-600 border-none" : "text-primary/70"}`} />
        </button>

        <img
          src={getProductImage()}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-primary text-bg-page font-mono text-[10px] px-5 py-2.5 rounded-full font-medium tracking-widest shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            VIEW GARMENT
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-text-page group-hover:text-primary transition-colors uppercase truncate max-w-[170px] sm:max-w-[200px]">
              {product.title}
            </h3>
            <span className="text-xs sm:text-sm font-mono font-medium text-primary/80 ml-2">
              {product.price}
            </span>
          </div>
          
          <p className="text-[11px] text-text-muted font-light leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-400 transition-colors">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-border-theme flex justify-between items-center mt-auto">
          <span className="text-[9px] text-text-dim uppercase font-mono tracking-wider">
            {product.weight}
          </span>
          
          <button
            onClick={handleHeartClick}
            className="inline-flex items-center gap-1.5 text-[10px] font-light text-primary hover:text-white transition-colors uppercase tracking-widest cursor-pointer"
          >
            <span>{wishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}</span>
            <Heart className={`w-3 h-3 ${wishlisted ? "fill-red-600 text-red-600 border-none" : "text-primary/70"}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── WARNING MODAL SUB-COMPONENT ─────────────────────────────────────────────
interface ShipmentModalProps {
  product: any;
  settings: CMSDropSettings | null;
  onClose: () => void;
}

function ShipmentModal({ product, settings, onClose }: ShipmentModalProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const { theme } = useTheme();
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

  const handleWishlistToggle = () => {
    toggleWishlist(product.id);
  };

  const getProductImage = () => {
    const customized = getImageUrl("product-" + product.id);
    if (customized && !customized.includes("fallback")) return customized;
    if (theme === "light") {
      return product.lightImage || product.image || "/images/products/fallback.png";
    }
    return product.darkImage || product.image || "/images/products/fallback.png";
  };

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0B0B0B] border border-border-theme rounded-2xl max-w-md w-full overflow-hidden shadow-[0_25px_60px_rgba(92,6,6,0.15)] relative animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors z-20 cursor-pointer p-1 rounded-full hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Diagonal Warning Accent Band */}
        <div className="h-1.5 bg-gradient-to-r from-[#5C0606] via-[#A82525] to-[#5C0606] w-full" />

        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          {/* Header Warning Circle */}
          <div className="w-14 h-14 rounded-full bg-[#5C0606]/10 border border-[#5C0606]/35 flex items-center justify-center text-primary mb-6 shadow-[0_0_20px_rgba(92,6,6,0.1)]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>

          <span className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase mb-2">
            SHIPMENT IN PREPARATION
          </span>
          
          <h3 className="font-serif italic text-2xl text-text-page font-light leading-tight mb-4">
            {product.title}
          </h3>

          <div className="w-8 h-[1px] bg-primary/20 mb-5" />

          {/* Product image mini preview */}
          <div className="w-24 h-24 rounded-lg overflow-hidden bg-bg-page/30 border border-border-theme/80 mb-5 relative">
            <img
              src={getProductImage()}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <p className="text-xs text-text-muted font-light leading-relaxed mb-6 whitespace-pre-line">
            {settings ? settings.shipmentNotice : `We are currently getting the shipment ready for Drop 01. 
            All checkouts and acquisitions are sealed at this moment. 
            Secure this artifact in your wishlist to receive immediate release coordinates and notifications.`}
          </p>

          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleWishlistToggle}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 px-6 text-xs font-mono font-medium tracking-wider transition-all duration-300 cursor-pointer ${
                wishlisted
                  ? "bg-red-950/40 border border-red-800/60 text-red-200 hover:bg-red-900/40"
                  : "bg-primary text-bg-page hover:bg-white hover:text-black shadow-lg"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-red-400 text-red-400" : ""}`} />
              <span>{wishlisted ? "WISHLISTED" : "SECURE TO WISHLIST"}</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-full border border-border-theme hover:border-text-muted text-text-muted hover:text-white py-3 px-6 text-xs font-mono font-medium tracking-wider transition-all cursor-pointer bg-transparent"
            >
              CLOSE ARCHIVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
