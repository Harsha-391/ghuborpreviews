import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { products } from "../data/products";
import { toggleWishlist, isInWishlist } from "../utils/store";

export default function ProductLineup() {
  const ease = [0.16, 1, 0.3, 1] as const;

  // Show only 6 products (we have exactly 6 in our data source)
  const lineupProducts = products.slice(0, 6);

  return (
    <section
      id="lineup"
      className="bg-black py-24 border-t border-white/5 relative overflow-hidden select-none"
    >
      {/* Dynamic Keyframes injected locally */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes productsMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-products-marquee {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: productsMarquee 35s linear infinite;
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
          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#E1E0CC] font-light tracking-wide leading-none">
            Drop 02: Wearable Scripture
          </h2>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        {/* Horizontal Marquee Container with edge fading */}
        <div className="w-full overflow-hidden py-4 flex marquee-mask">
          <div className="animate-products-marquee px-[15vw]">
            {/* First Set of 6 */}
            {lineupProducts.map((product) => (
              <ProductCard key={`${product.id}-set1`} product={product} />
            ))}
            {/* Repeated Set of 6 for Infinite Loop */}
            {lineupProducts.map((product) => (
              <ProductCard key={`${product.id}-set2`} product={product} />
            ))}
          </div>
        </div>

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
    </section>
  );
}

// Sub-component for individual product card inside marquee
function ProductCard({ product }: { product: any }) {
  const [wishlisted, setWishlisted] = useState(false);

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
    <div className="w-[280px] sm:w-[320px] shrink-0 flex flex-col h-[480px] bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/20 hover:bg-[#120808]/85 hover:shadow-[0_15px_40px_rgba(92,6,6,0.06)] whitespace-normal group relative">
      {/* Product Image Frame */}
      <Link href={`/shop/${product.id}`} className="relative block aspect-[4/5] w-full overflow-hidden bg-black/40">
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5C0606] animate-pulse" />
          <span className="text-[9px] font-mono text-primary/80 uppercase tracking-widest">{product.drop}</span>
        </div>

        {/* Limited tag moved to left to avoid overlapping the heart button */}
        <div className="absolute top-4 right-14 z-20 bg-black/40 backdrop-blur-sm border border-white/5 rounded px-2 py-0.5">
          <span className="text-[8px] font-mono text-gray-500 tracking-wider">LIMITED / 64</span>
        </div>

        {/* Floating Heart Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3.5 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/85 border border-white/10 text-primary/80 hover:text-white transition-all cursor-pointer shadow-lg"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? "fill-red-600 text-red-600 border-none" : "text-primary/70"}`} />
        </button>

        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-primary text-black font-mono text-xs px-5 py-2.5 rounded-full font-medium tracking-widest shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            EXAMINE ARTIFACT
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-[#E1E0CC] group-hover:text-primary transition-colors uppercase truncate max-w-[170px] sm:max-w-[200px]">
              <Link href={`/shop/${product.id}`}>{product.title}</Link>
            </h3>
            <span className="text-xs sm:text-sm font-mono font-medium text-primary/80 ml-2">
              {product.price}
            </span>
          </div>
          
          <p className="text-[11px] text-gray-500 font-light leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-400 transition-colors">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex justify-between items-center mt-auto">
          <span className="text-[9px] text-gray-600 uppercase font-mono tracking-wider">
            {product.weight}
          </span>
          
          <Link
            href={`/shop/${product.id}`}
            className="inline-flex items-center gap-1 text-[10px] font-light text-primary hover:text-white transition-colors uppercase tracking-widest"
          >
            <span>DETAILS</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
