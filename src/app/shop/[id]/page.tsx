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
import { useImageConfig } from "../../../components/ImageConfigContext";
import { trackPageView, trackProductView } from "../../../utils/analytics";
import WaxSeal from "../../../components/WaxSeal";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const ease = [0.16, 1, 0.3, 1] as const;
  const { getImageUrl } = useImageConfig();

  // Dynamic Product State with local fallback
  const [product, setProduct] = useState<Product | undefined>(() => products.find((p) => p.id === id));

  // States
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"details" | "ritual" | "sizing">("details");
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // Track page + product view
  useEffect(() => {
    if (id) {
      trackPageView(`/shop/${id}`);
      trackProductView(id);
    }
  }, [id]);
  const [wishlisted, setWishlisted] = useState(false);

  // Fetch from Firestore
  useEffect(() => {
    const fetchDbProduct = async () => {
      try {
        if (!db) return;
        const docRef = doc(db, "cms-products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({
            id: docSnap.id,
            ...data,
            image: data.darkImage || data.lightImage || "",
            backImage: data.galleryDark?.[0] || data.galleryLight?.[0] || ""
          } as Product);
        }
      } catch (err) {
        console.warn("Firestore product document query failed, using local product:", err);
      }
    };
    fetchDbProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
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
      <div className="min-h-screen bg-bg-page flex flex-col items-center justify-center text-center p-6 text-text-page">
        <h1 className="font-serif italic text-3xl text-primary mb-4">Artifact Lost in the Dust</h1>
        <p className="text-text-muted mb-8 max-w-sm">The artifact you are seeking does not exist or has been retired from the sanctuary.</p>
        <Link href="/shop" className="text-xs tracking-widest uppercase border border-primary/20 hover:border-primary text-primary px-6 py-3 rounded-full transition-colors">
          Return to Archives
        </Link>
      </div>
    );
  }

  // Safe Fallbacks for Custom CMS Products
  const sizeScale = product.sizeScale || [
    { size: "S", chest: "48 inches", length: "27 inches", sleeve: "24.5 inches" },
    { size: "M", chest: "50 inches", length: "28 inches", sleeve: "25 inches" },
    { size: "L", chest: "52 inches", length: "29 inches", sleeve: "25.5 inches" },
    { size: "XL", chest: "54 inches", length: "30 inches", sleeve: "26 inches" }
  ];
  const details = product.details || [
    "480GSM Heavyweight Streetwear Build",
    "Signature blackletter embroidery details",
    "Hand-numbered authentic drop tag (Strictly Limited)",
    "Ribbed accents and drop shoulder silhouette",
    "Made in India, finished in the sanctuary"
  ];
  const howToUse = product.howToUse || [
    "Wear as a protective outer shield during silent battles.",
    "Pair with washed obsidian denim or Sanctuary cargo pants.",
    "Dry clean or wash cold inside out to protect thread integrity."
  ];

  // Dynamic values resolved using ImageConfigContext
  const currentProductImage = getImageUrl("product-" + product.id, product.image);
  const currentProductBackImage = product.backImage ? getImageUrl("product-" + product.id + "-back", product.backImage) : undefined;

  const galleryImages = [
    { label: "Front View", url: currentProductImage },
    ...(currentProductBackImage ? [{ label: "Back View", url: currentProductBackImage }] : []),
    { label: "The Glyph", url: getImageUrl("glyph") },
    { label: "Woven Tag", url: getImageUrl("tag") },
    { label: "Scripture", url: getImageUrl("scripture") },
  ];

  const activeImage = galleryImages[activeIndex]?.url || currentProductImage;

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
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
            <div className="flex-grow aspect-[4/5] bg-bg-page/40 border border-border-theme rounded-3xl overflow-hidden relative">
              {/* Subtle Drop Badge */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-1.5 bg-bg-page/70 backdrop-blur-md border border-border-theme rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[9px] font-mono text-primary/80 uppercase tracking-widest">{product.drop || "DROP 01"}</span>
              </div>

              {/* View Label Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-bg-page/80 backdrop-blur-md border border-border-theme rounded-full px-4 py-1.5 shadow-lg">
                <span className="text-[9px] font-mono text-primary uppercase tracking-[0.2em] font-semibold">
                  {galleryImages[activeIndex]?.label}
                </span>
              </div>

              <motion.img
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                src={activeImage || undefined}
                alt={product.title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Thumbnail Navigation List */}
            <div className="flex md:flex-col gap-3 justify-center md:justify-start">
              {galleryImages.map((imgItem, idx) => (
                <button
                  key={imgItem.url + "-" + idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-16 h-16 md:w-20 md:h-20 bg-bg-card rounded-xl border overflow-hidden transition-all duration-300 relative shrink-0 cursor-pointer ${
                    activeIndex === idx
                      ? "border-primary shadow-[0_0_15px_rgba(222,219,200,0.2)] scale-102"
                      : "border-border-theme hover:border-text-muted"
                  }`}
                >
                  <img
                    src={imgItem.url || undefined}
                    alt={imgItem.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Details & Options Section (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-8 bg-bg-nav border border-border-theme rounded-3xl p-6 sm:p-8 relative">
            
            {/* Absolute Stamped Wax Seal */}
            <div className="absolute top-[-25px] right-[-15px] z-30 pointer-events-none hidden sm:block">
              <WaxSeal size={65} />
            </div>

            {/* Title, Badge & Price */}
            <div>
              <div className="flex items-center gap-2 mb-2 pr-12">
                <span className="text-[9px] font-mono text-text-muted tracking-wider bg-bg-page border border-border-theme rounded px-2 py-0.5 uppercase">
                  HAND-NUMBERED
                </span>
                <span className="text-[9px] font-mono text-primary/80 tracking-wider bg-bg-page border border-border-theme rounded px-2 py-0.5 uppercase">
                  LIMITED DROP (64 PCS)
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <h1 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-text-page tracking-wide mb-2 uppercase flex-grow">
                  {product.title}
                </h1>
                <button
                  onClick={handleHeartClick}
                  className="p-3 rounded-full bg-bg-page/70 hover:bg-bg-page/90 border border-border-theme text-primary/80 hover:text-white transition-all cursor-pointer shadow-lg shrink-0 bg-transparent border-none outline-none"
                  aria-label="Add to Wishlist"
                >
                  <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-red-600 text-red-600 border-none" : "text-primary/70"}`} />
                </button>
              </div>
              <div className="text-xl sm:text-2xl font-mono text-primary font-semibold mt-4">
                <div className="flex gap-3 items-baseline">
                  {product.mrp && (
                    <span className="line-through text-text-dim text-sm sm:text-base font-normal">
                      {product.mrp}
                    </span>
                  )}
                  <span>{product.price}</span>
                </div>
                <span className="text-[10px] text-text-muted font-light tracking-wide block mt-1 uppercase font-sans">
                  Duties & taxes included. Shipping computed at ritual checkout.
                </span>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="border-t border-b border-border-theme py-4">
              <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">
                {product.fullDescription || product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
                  SELECT SIZE
                </label>
                <button
                  onClick={() => setActiveTab("sizing")}
                  className="text-[10px] text-primary/75 hover:text-primary uppercase tracking-widest border-b border-primary/20 hover:border-primary pb-0.5 transition-colors cursor-pointer bg-transparent border-none outline-none"
                >
                  SIZING SPECIFICATIONS
                </button>
              </div>

              <div className="flex gap-2">
                {sizeScale.map((m) => (
                  <button
                    key={m.size}
                    onClick={() => {
                      setSelectedSize(m.size);
                      setActiveTab("sizing");
                    }}
                    className={`min-w-12 h-12 flex items-center justify-center font-mono text-xs border rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedSize === m.size
                        ? "border-primary bg-primary text-bg-page font-semibold shadow-[0_0_15px_rgba(222,219,200,0.15)]"
                        : "border-border-theme hover:border-text-muted text-primary/80 hover:text-primary"
                    }`}
                  >
                    {m.size}
                  </button>
                ))}
              </div>

              {/* Dynamic Size Display */}
              {selectedSize && (
                <div className="mt-4 bg-bg-page/60 border border-border-theme rounded-xl p-3 flex items-center gap-2">
                  <CornerDownRight className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                    {selectedSize} Specs:{" "}
                    {sizeScale.find((s) => s.size === selectedSize)?.chest && (
                      <span className="text-primary">
                        Chest: {sizeScale.find((s) => s.size === selectedSize)?.chest}
                      </span>
                    )}
                    {sizeScale.find((s) => s.size === selectedSize)?.length && (
                      <span className="text-primary ml-2">
                        Length: {sizeScale.find((s) => s.size === selectedSize)?.length}
                      </span>
                    )}
                    {sizeScale.find((s) => s.size === selectedSize)?.sleeve && (
                      <span className="text-primary ml-2">
                        Sleeve: {sizeScale.find((s) => s.size === selectedSize)?.sleeve}
                      </span>
                    )}
                    {sizeScale.find((s) => s.size === selectedSize)?.waist && (
                      <span className="text-primary ml-2">
                        Waist: {sizeScale.find((s) => s.size === selectedSize)?.waist}
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
                className="w-full bg-primary hover:bg-primary/95 text-bg-page font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 shadow-md shadow-primary/10 hover:shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold"
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
                className="w-full bg-transparent hover:bg-bg-card-alt border border-primary/45 hover:border-primary text-primary font-mono text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer uppercase font-semibold bg-transparent"
              >
                ORDER DIRECTLY (BUY NOW)
              </button>
            </div>

            {/* Guarantees panel */}
            <div className="grid grid-cols-3 gap-2 border-t border-border-theme pt-6 text-center">
              <div className="flex flex-col items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary/75" />
                <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider leading-relaxed">Protected<br/>Shipment</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 border-l border-r border-border-theme">
                <Truck className="w-4 h-4 text-primary/75" />
                <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider leading-relaxed">Sanctuary<br/>Logistics</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-primary/75" />
                <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider leading-relaxed">Secured<br/>Returns</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tab Interface Section (Details, Ritual, Sizing) */}
        <div className="mt-16 bg-bg-nav border border-border-theme rounded-3xl p-6 sm:p-10">
          {/* Tab buttons */}
          <div className="flex border-b border-border-theme mb-8 font-mono text-[10px] uppercase tracking-widest overflow-x-auto">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-4 px-6 relative shrink-0 transition-colors cursor-pointer bg-transparent border-none outline-none ${
                activeTab === "details" ? "text-primary font-semibold" : "text-text-muted hover:text-primary"
              }`}
            >
              Material Specs
              {activeTab === "details" && (
                <motion.div layoutId="activeTabBorder" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("ritual")}
              className={`py-4 px-6 relative shrink-0 transition-colors cursor-pointer bg-transparent border-none outline-none ${
                activeTab === "ritual" ? "text-primary font-semibold" : "text-text-muted hover:text-primary"
              }`}
            >
              The Ritual Guide
              {activeTab === "ritual" && (
                <motion.div layoutId="activeTabBorder" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("sizing")}
              className={`py-4 px-6 relative shrink-0 transition-colors cursor-pointer bg-transparent border-none outline-none ${
                activeTab === "sizing" ? "text-primary font-semibold" : "text-text-muted hover:text-primary"
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
                    <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">
                      Every piece is woven utilizing heavy construction techniques. The thread tension is tailored to maximize drape weight, preventing fabric deformation over long-term wear. All seams are double-reinforced with heavy cotton thread.
                    </p>
                    <div className="flex flex-col gap-2 font-mono text-xs pt-2">
                      <div className="flex justify-between border-b border-border-theme pb-1">
                        <span className="text-text-dim uppercase">Fabric Composition:</span>
                        <span className="text-text-page">{product.fabric || "combed cotton"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border-theme pb-1">
                        <span className="text-text-dim uppercase">Weight Category:</span>
                        <span className="text-text-page">{product.weight || "heavyweight"}</span>
                      </div>
                      <div className="flex justify-between border-b border-border-theme pb-1">
                        <span className="text-text-dim uppercase">Trace Number:</span>
                        <span className="text-primary">{product.drop || "DROP 01"} / EXCLUSIVE_RUN_064</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-card border border-border-theme rounded-2xl p-6 flex flex-col justify-center">
                    <h4 className="text-[10px] text-text-dim uppercase tracking-widest font-mono mb-4">Woven Inscriptions</h4>
                    <ul className="space-y-3">
                      {details.map((detail, index) => (
                        <li key={index} className="flex gap-3 items-start text-xs font-light text-text-muted">
                          <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
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
                  <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-6">
                    A Ghubor is armor for the unseen battles. When putting on the garment, remember the pillars of struggle, faith, and transcendence. It is constructed to feel like second skin.
                  </p>
                  
                  <div className="space-y-4">
                    {howToUse.map((ritual, idx) => (
                      <div key={idx} className="flex gap-4 items-start bg-bg-card border border-border-theme rounded-xl p-4">
                        <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-mono text-[10px] text-primary shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-text-page font-light leading-relaxed">
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
                  <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-6">
                    Measure your existing garments flat against a surface to match with the specifications below. The measurements are exact; fabric flexibility is limited due to the raw, high-density cotton weaves.
                  </p>

                  {/* Measurement table */}
                  <div className="border border-border-theme rounded-xl overflow-hidden bg-bg-card">
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="bg-bg-page/60 border-b border-border-theme text-text-dim">
                          <th className="p-4 uppercase tracking-wider font-light">Size Option</th>
                          {sizeScale[0]?.chest && <th className="p-4 uppercase tracking-wider font-light">Chest Width</th>}
                          {sizeScale[0]?.length && <th className="p-4 uppercase tracking-wider font-light">Garment Length</th>}
                          {sizeScale[0]?.sleeve && <th className="p-4 uppercase tracking-wider font-light">Sleeve Length</th>}
                          {sizeScale[0]?.waist && <th className="p-4 uppercase tracking-wider font-light">Waist Circumference</th>}
                          {sizeScale[0]?.inseam && <th className="p-4 uppercase tracking-wider font-light">Inseam Length</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-theme">
                        {sizeScale.map((row) => (
                          <tr
                            key={row.size}
                            className={`transition-colors hover:bg-bg-card-alt ${
                              selectedSize === row.size ? "bg-primary/10 text-primary font-semibold" : "text-text-muted"
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
