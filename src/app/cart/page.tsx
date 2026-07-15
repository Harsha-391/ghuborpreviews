"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, Plus, Minus } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { products, Product } from "../../data/products";
import { getCart, removeFromCart, updateCartQty } from "../../utils/store";
import WaxSeal from "../../components/WaxSeal";
import { db } from "../../utils/firebase";

interface DisplayCartItem {
  product: Product;
  size: string;
  qty: number;
}

export default function CartPage() {
  const ease = [0.16, 1, 0.3, 1] as const;
  const router = useRouter();

  const [cartItems, setCartItems] = useState<DisplayCartItem[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadAllProducts = async () => {
      let mergedProducts: any[] = [...products];
      try {
        if (db) {
          const { collection, getDocs } = await import("firebase/firestore");
          const snap = await getDocs(collection(db, "cms-products"));
          if (!snap.empty) {
            const dbList = snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                ...data,
                image: data.darkImage || data.lightImage || "",
                backImage: data.galleryDark?.[0] || data.galleryLight?.[0] || ""
              };
            });
            mergedProducts = [...dbList, ...products];
          }
        }
      } catch (err) {
        console.warn("Failed to fetch Firestore products on cart:", err);
      }
      setAllProducts(mergedProducts);
    };

    loadAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    const loadCart = () => {
      const items = getCart();
      const displayItems = items
        .map((item) => {
          const product = allProducts.find((p) => p.id === item.id);
          return {
            product,
            size: item.size,
            qty: item.qty,
          };
        })
        .filter((item) => item.product !== undefined) as DisplayCartItem[];
      setCartItems(displayItems);
    };

    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => {
      window.removeEventListener("cart-updated", loadCart);
    };
  }, [allProducts]);

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.product.price) * item.qty, 0);
  const shipping = 0; // Free comp shipping
  const total = subtotal + shipping;

  const handleRemove = (id: string, size: string) => {
    removeFromCart(id, size);
  };

  const handleQtyChange = (id: string, size: string, newQty: number) => {
    updateCartQty(id, size, newQty);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background Noise and glows */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3 animate-pulse">
            THE ARCHIVES
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-text-page font-light tracking-wide leading-none">
            Acquired Artifacts
          </h1>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Left: Cart items (Col 1-7) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {cartItems.map((item, idx) => (
                <motion.div
                  key={`${item.product.id}-${item.size}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1, ease }}
                  className="flex gap-4 sm:gap-6 bg-bg-card border border-border-theme rounded-2xl p-4 sm:p-6 hover:border-primary/20 transition-all duration-300 shadow-sm"
                >
                  {/* Image */}
                  <Link
                    href={`/shop/${item.product.id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-bg-page/40 border border-border-theme shrink-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-text-page uppercase hover:text-primary transition-colors">
                          <Link href={`/shop/${item.product.id}`}>{item.product.title}</Link>
                        </h3>
                        <span className="text-xs sm:text-sm font-mono font-medium text-primary">
                          {item.product.price}
                        </span>
                      </div>

                      {/* Sizing & details */}
                      <div className="flex items-center gap-6 mt-1">
                        <span className="font-mono text-[10px] text-text-muted uppercase">SIZE: {item.size}</span>
                        
                        {/* Qty Adjustment */}
                        <div className="flex items-center gap-2 border border-border-theme rounded px-2 py-0.5 bg-bg-page/30">
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.size, item.qty - 1)}
                            className="text-text-muted hover:text-primary p-0.5 transition-colors cursor-pointer"
                            aria-label="Decrease Qty"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs text-primary font-semibold min-w-[12px] text-center">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.size, item.qty + 1)}
                            className="text-text-muted hover:text-primary p-0.5 transition-colors cursor-pointer"
                            aria-label="Increase Qty"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-border-theme mt-3">
                      <span className="text-[9px] text-text-muted font-mono uppercase">{item.product.drop}</span>

                      <button
                        onClick={() => handleRemove(item.product.id, item.size)}
                        className="text-text-muted hover:text-red-500 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Summary panel (Col 8-12) */}
            <div className="lg:col-span-5 bg-bg-card border border-border-theme rounded-2xl p-6 flex flex-col gap-6 relative overflow-visible shadow-lg">
              {/* Premium Stamped Wax Seal */}
              <div className="absolute top-[-30px] right-[-15px] z-30 pointer-events-none hidden sm:block">
                <WaxSeal size={70} />
              </div>

              <h2 className="text-xs font-mono uppercase tracking-widest text-primary border-b border-border-theme pb-3">
                Acquisition Summary
              </h2>

              <div className="flex flex-col gap-3 font-mono text-xs text-text-muted">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="text-text-page font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING:</span>
                  <span className="text-primary font-medium">FREE (SANCTUARY COMP)</span>
                </div>
                <div className="flex justify-between border-t border-border-theme pt-3 text-sm font-bold text-primary">
                  <span>TOTAL:</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="bg-bg-page/60 border border-border-theme rounded-lg p-2.5 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <input
                  type="text"
                  placeholder="ENTER PROMO CODE"
                  className="bg-transparent outline-none border-none text-[10px] font-mono text-primary placeholder-text-dim/50 flex-grow uppercase"
                />
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 text-bg-page font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold shadow-md hover:shadow-primary/10"
              >
                <span>INITIATE RITUAL CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-text-muted font-mono uppercase">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Secure SSL encrypted drop servers</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-bg-card border border-border-theme rounded-3xl max-w-xl mx-auto px-6 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-text-muted mx-auto mb-6" />
            <h2 className="text-base text-text-page uppercase tracking-widest mb-2 font-mono">Sanctuary is Empty</h2>
            <p className="text-xs text-text-muted font-light max-w-sm mx-auto mb-8 leading-relaxed">
              No artifacts have been selected. Secure your weapons in the sanctuary archives.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-bg-page font-mono text-xs px-6 py-3 rounded-full font-medium tracking-widest transition-transform duration-300 hover:scale-102"
            >
              <span>EXPLORE ARCHIVES</span>
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
