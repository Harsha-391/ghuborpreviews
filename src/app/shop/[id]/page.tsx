"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Shield, CornerDownRight, HelpCircle, Truck, RefreshCw, Heart } from "lucide-react";
import { products, Product } from "../../../data/products";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { toggleWishlist, isInWishlist, addToCart } from "../../../utils/store";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../utils/firebase";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const ease = [0.16, 1, 0.3, 1] as const;

  // Dynamic Product State with local fallback
  const [product, setProduct] = useState<Product | undefined>(() => products.find((p) => p.id === id));

  // States
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"details" | "ritual" | "sizing">("details");
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  // Fetch from Firestore
  useEffect(() => {
    const fetchDbProduct = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (err) {
        console.warn("Firestore product document query failed, using local product:", err);
      }
    };
    fetchDbProduct();
  }, [id]);


  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setWishlisted(isInWishlist(product.id));

      const handleUpdate = () => {
        setWishlisted(isInWishlist(product.id));
      };

      window.addEventListener("wishlist-updated", handleUpdate);
      return () => {
        window.removeEventListener("wishlist-updated", handleUpdate);
      };
    }
  }, [product]);

  const handleHeartClick = () => {
    if (product) {
      toggleWishlist(product.id);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, selectedSize, 1);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 3000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product.id, selectedSize, 1);
      router.push("/checkout");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <h1 className="font-serif italic text-3xl text-primary mb-4">Artifact Lost in the Dust</h1>
        <p className="text-gray-500 mb-8 max-w-sm">The artifact you are seeking does not exist or has been retired from the sanctuary.</p>
        <Link href="/shop" className="text-xs tracking-widest uppercase border border-primary/20 hover:border-primary text-primary px-6 py-3 rounded-full transition-colors">
          Return to Archives
        </Link>
      </div>
    );
  }

  // Thumbnails gallery: main image + detailed shots from the assets
  const galleryImages = [
    { label: "Full View", url: product.image },
    { label: "The Glyph", url: "/images/details/glyph.png" },
    { label: "Woven Tag", url: "/images/details/tag.png" },
    { label: "Scripture", url: "/images/details/scripture.png" },
  ];

  return (
    <div className="min-h-screen bg-black text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      {/* Noise Overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      
      {/* Red ambient glows */}
      <div className="absolute top-[20%] left-[-15%] w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] bg-red-900/5 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      {/* Main product showcase structure (Amazon style) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Image Gallery Section (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row-reverse gap-4">
            {/* Active Image Display */}
            <div className="flex-grow aspect-[4/5] bg-black/40 border border-white/5 rounded-3xl overflow-hidden relative">
              {/* Subtle Drop Badge */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5C0606]" />
                <span className="text-[9px] font-mono text-primary/80 uppercase tracking-widest">{product.drop}</span>
              </div>

              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={activeImage}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail Navigation List */}
            <div className="flex md:flex-col gap-3 justify-center md:justify-start">
              {galleryImages.map((imgItem) => (
                <button
                  key={imgItem.url}
                  onClick={() => setActiveImage(imgItem.url)}
                  className={`w-16 h-16 md:w-20 md:h-20 bg-black/60 rounded-xl border overflow-hidden transition-all duration-300 relative shrink-0 cursor-pointer ${
                    activeImage === imgItem.url
                      ? "border-primary shadow-[0_0_15px_rgba(222,219,200,0.2)] scale-102"
                      : "border-white/5 hover:border-white/20"
                  }`}
                >
                  <img
                    src={imgItem.url}
                    alt={imgItem.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details & Options Section (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-8 bg-[#070707] border border-white/5 rounded-3xl p-6 sm:p-8">
            
            {/* Title, Badge & Price */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-mono text-gray-500 tracking-wider bg-black border border-white/5 rounded px-2 py-0.5 uppercase">
                  HAND-NUMBERED
                </span>
                <span className="text-[9px] font-mono text-primary/80 tracking-wider bg-[#5C0606]/20 border border-[#5C0606]/40 rounded px-2 py-0.5 uppercase">
                  LIMITED DROP (64 PCS)
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <h1 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-[#E1E0CC] tracking-wide mb-2 uppercase flex-grow">
                  {product.title}
                </h1>
                <button
                  onClick={handleHeartClick}
                  className="p-3 rounded-full bg-black/60 hover:bg-black/85 border border-white/10 text-primary/80 hover:text-white transition-all cursor-pointer shadow-lg shrink-0"
                  aria-label="Add to Wishlist"
                >
                  <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-600 text-red-600 border-none" : "text-primary/70"}`} />
                </button>
              </div>
              <div className="text-xl sm:text-2xl font-mono text-primary font-semibold mt-4">
                {product.price}
                <span className="text-[10px] text-gray-600 font-light tracking-wide block mt-1 uppercase font-sans">
                  Duties & taxes included. Shipping computed at ritual checkout.
                </span>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="border-t border-b border-white/5 py-4">
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
                  SELECT SIZE
                </label>
                <button
                  onClick={() => setActiveTab("sizing")}
                  className="text-[10px] text-primary/75 hover:text-white uppercase tracking-widest border-b border-primary/20 hover:border-white pb-0.5 transition-colors cursor-pointer"
                >
                  SIZING SPECIFICATIONS
                </button>
              </div>

              <div className="flex gap-2">
                {product.sizeScale.map((m) => (
                  <button
                    key={m.size}
                    onClick={() => {
                      setSelectedSize(m.size);
                      setActiveTab("sizing");
                    }}
                    className={`min-w-12 h-12 flex items-center justify-center font-mono text-xs border rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedSize === m.size
                        ? "border-primary bg-primary text-black font-semibold shadow-[0_0_15px_rgba(222,219,200,0.15)]"
                        : "border-white/10 hover:border-white/30 text-primary/80 hover:text-white"
                    }`}
                  >
                    {m.size}
                  </button>
                ))}
              </div>

              {/* Dynamic Size Display */}
              {selectedSize && (
                <div className="mt-4 bg-black/60 border border-white/5 rounded-xl p-3 flex items-center gap-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {selectedSize} Specs:{" "}
                    {product.sizeScale.find((s) => s.size === selectedSize)?.chest && (
                      <span className="text-primary">
                        Chest: {product.sizeScale.find((s) => s.size === selectedSize)?.chest}
                      </span>
                    )}
                    {product.sizeScale.find((s) => s.size === selectedSize)?.length && (
                      <span className="text-primary ml-2">
                        Length: {product.sizeScale.find((s) => s.size === selectedSize)?.length}
                      </span>
                    )}
                    {product.sizeScale.find((s) => s.size === selectedSize)?.sleeve && (
                      <span className="text-primary ml-2">
                        Sleeve: {product.sizeScale.find((s) => s.size === selectedSize)?.sleeve}
                      </span>
                    )}
                    {product.sizeScale.find((s) => s.size === selectedSize)?.waist && (
                      <span className="text-primary ml-2">
                        Waist: {product.sizeScale.find((s) => s.size === selectedSize)?.waist}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Buy / Acquire Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary hover:bg-[#D4D0BC] text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold"
              >
                {isAddedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SECURED IN CART</span>
                  </>
                ) : (
                  <span>ACQUIRE ARTIFACT</span>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full bg-transparent hover:bg-white/5 border border-primary/45 hover:border-primary text-primary font-mono text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer uppercase font-semibold"
              >
                ORDER DIRECTLY (BUY NOW)
              </button>
            </div>

            {/* Guarantees panel */}
            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#5C0606]" />
                <span className="text-[8px] text-gray-500 uppercase tracking-wider font-mono">100% Verified</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#5C0606]" />
                <span className="text-[8px] text-gray-500 uppercase tracking-wider font-mono">Secure Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#5C0606]" />
                <span className="text-[8px] text-gray-500 uppercase tracking-wider font-mono">Limited Edition</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM: Tabs Section for scripture description, size chart, care (Cols 1-12) */}
        <div className="mt-16 border-t border-white/5 pt-12">
          {/* Tab selectors */}
          <div className="flex justify-center sm:justify-start gap-8 border-b border-white/5 pb-4 mb-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`text-xs font-mono tracking-widest uppercase pb-2 transition-all relative cursor-pointer ${
                activeTab === "details" ? "text-primary font-semibold" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Specifications & Material
              {activeTab === "details" && (
                <motion.div layoutId="activeTabBorder" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("ritual")}
              className={`text-xs font-mono tracking-widest uppercase pb-2 transition-all relative cursor-pointer ${
                activeTab === "ritual" ? "text-primary font-semibold" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              How to wear / Ritual
              {activeTab === "ritual" && (
                <motion.div layoutId="activeTabBorder" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("sizing")}
              className={`text-xs font-mono tracking-widest uppercase pb-2 transition-all relative cursor-pointer ${
                activeTab === "sizing" ? "text-primary font-semibold" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Size Scale Guide
              {activeTab === "sizing" && (
                <motion.div layoutId="activeTabBorder" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
          </div>

          {/* Tab contents */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="flex flex-col gap-4">
                    <h3 className="font-serif italic text-lg sm:text-xl text-primary font-light">Structure & Materiality</h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                      Every piece is woven utilizing heavy construction techniques. The thread tension is tailored to maximize drape weight, preventing fabric deformation over long-term wear. All seams are double-reinforced with heavy cotton threat.
                    </p>
                    <div className="flex flex-col gap-2 font-mono text-xs pt-2">
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-600 uppercase">Fabric Composition:</span>
                        <span className="text-[#E1E0CC]">{product.fabric}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-600 uppercase">Weight Category:</span>
                        <span className="text-[#E1E0CC]">{product.weight}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-600 uppercase">Trace Number:</span>
                        <span className="text-primary">DROP 02 / EXCLUSIVE_RUN_064</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#090909] border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-4">Woven Inscriptions</h4>
                    <ul className="space-y-3">
                      {product.details.map((detail, index) => (
                        <li key={index} className="flex gap-3 items-start text-xs font-light text-gray-400">
                          <Check className="w-3.5 h-3.5 text-[#5C0606] shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}

              {activeTab === "ritual" && (
                <motion.div
                  key="ritual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <h3 className="font-serif italic text-lg sm:text-xl text-primary font-light mb-4">The Wearer&apos;s Ritual</h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mb-6">
                    A Ghubor is armor for the unseen battles. When putting on the garment, remember the pillars of struggle, faith, and transcendence. It is constructed to feel like second skin.
                  </p>
                  
                  <div className="space-y-4">
                    {product.howToUse.map((ritual, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-[#090909] border border-white/5 rounded-xl p-4">
                        <span className="w-6 h-6 rounded-full bg-[#5C0606]/10 border border-[#5C0606]/30 flex items-center justify-center font-mono text-[10px] text-primary shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                          {ritual}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "sizing" && (
                <motion.div
                  key="sizing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-3xl"
                >
                  <h3 className="font-serif italic text-lg sm:text-xl text-primary font-light mb-4">Interactive Sizing scale</h3>
                  <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mb-6">
                    Measure your existing garments flat against a surface to match with the specifications below. The measurements are exact; fabric flexibility is limited due to the raw, high-density cotton weaves.
                  </p>

                  {/* Measurement table */}
                  <div className="border border-white/5 rounded-xl overflow-hidden bg-[#090909]">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="bg-black/60 border-b border-white/5 text-gray-500">
                          <th className="p-4 uppercase tracking-wider font-light">Size Option</th>
                          {product.sizeScale[0]?.chest && <th className="p-4 uppercase tracking-wider font-light">Chest Width</th>}
                          {product.sizeScale[0]?.length && <th className="p-4 uppercase tracking-wider font-light">Garment Length</th>}
                          {product.sizeScale[0]?.sleeve && <th className="p-4 uppercase tracking-wider font-light">Sleeve Length</th>}
                          {product.sizeScale[0]?.waist && <th className="p-4 uppercase tracking-wider font-light">Waist Circumference</th>}
                          {product.sizeScale[0]?.inseam && <th className="p-4 uppercase tracking-wider font-light">Inseam Length</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {product.sizeScale.map((row) => (
                          <tr
                            key={row.size}
                            className={`transition-colors hover:bg-white/5 ${
                              selectedSize === row.size ? "bg-[#5C0606]/10 text-primary font-semibold" : "text-gray-400"
                            }`}
                          >
                            <td className="p-4 flex items-center gap-2">
                              {selectedSize === row.size && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                              {row.size}
                            </td>
                            {row.chest && <td className="p-4">{row.chest}</td>}
                            {row.length && <td className="p-4">{row.length}</td>}
                            {row.sleeve && <td className="p-4">{row.sleeve}</td>}
                            {row.waist && <td className="p-4">{row.waist}</td>}
                            {row.inseam && <td className="p-4">{row.inseam}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
