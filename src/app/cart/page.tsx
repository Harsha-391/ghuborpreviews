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

interface DisplayCartItem {
  product: Product;
  size: string;
  qty: number;
}

export default function CartPage() {
  const ease = [0.16, 1, 0.3, 1] as const;
  const router = useRouter();

  const [cartItems, setCartItems] = useState<DisplayCartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const items = getCart();
      const displayItems = items
        .map((item) => {
          const product = products.find((p) => p.id === item.id);
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
  }, []);

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
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background Noise and glows */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            THE ARCHIVES
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#E1E0CC] font-light tracking-wide leading-none">
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
                  className="flex gap-4 sm:gap-6 bg-black/60 border border-white/5 rounded-2xl p-4 sm:p-6 hover:border-primary/20 transition-all duration-300"
                >
                  {/* Image */}
                  <Link
                    href={`/shop/${item.product.id}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-black/40 border border-white/5 shrink-0"
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
                        <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-[#E1E0CC] uppercase">
                          <Link href={`/shop/${item.product.id}`}>{item.product.title}</Link>
                        </h3>
                        <span className="text-xs sm:text-sm font-mono font-medium text-primary">
                          {item.product.price}
                        </span>
                      </div>

                      {/* Sizing & details */}
                      <div className="flex items-center gap-6 mt-1">
                        <span className="font-mono text-[10px] text-gray-500 uppercase">SIZE: {item.size}</span>
                        
                        {/* Qty Adjustment */}
                        <div className="flex items-center gap-2 border border-white/10 rounded px-2 py-0.5">
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.size, item.qty - 1)}
                            className="text-gray-500 hover:text-white p-0.5 transition-colors cursor-pointer"
                            aria-label="Decrease Qty"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs text-primary/95 min-w-[12px] text-center">{item.qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.product.id, item.size, item.qty + 1)}
                            className="text-gray-500 hover:text-white p-0.5 transition-colors cursor-pointer"
                            aria-label="Increase Qty"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-3">
                      <span className="text-[9px] text-gray-600 font-mono uppercase">{item.product.drop}</span>

                      <button
                        onClick={() => handleRemove(item.product.id, item.size)}
                        className="text-gray-500 hover:text-red-500 transition-colors p-1 cursor-pointer"
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
            <div className="lg:col-span-5 bg-black/80 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
              <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 border-b border-white/5 pb-3">
                Acquisition Summary
              </h2>

              <div className="flex flex-col gap-3 font-mono text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="text-[#E1E0CC]">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>SHIPPING:</span>
                  <span className="text-primary">FREE (SANCTUARY COMP)</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-3 text-sm font-bold text-primary">
                  <span>TOTAL:</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="bg-black/60 border border-white/5 rounded-lg p-2.5 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-primary/60" />
                <input
                  type="text"
                  placeholder="ENTER PROMO CODE"
                  className="bg-transparent outline-none border-none text-[10px] font-mono text-primary placeholder-gray-600 flex-grow uppercase"
                />
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-[#D4D0BC] text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold"
              >
                <span>INITIATE RITUAL CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Secure SSL encrypted drop servers</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-black/40 border border-white/5 rounded-3xl max-w-xl mx-auto px-6">
            <ShoppingBag className="w-8 h-8 text-gray-700 mx-auto mb-6" />
            <h2 className="text-base text-primary uppercase tracking-widest mb-2 font-mono">Sanctuary is Empty</h2>
            <p className="text-xs text-gray-500 font-light max-w-sm mx-auto mb-8 leading-relaxed">
              No artifacts have been selected. Secure your weapons in the sanctuary archives.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-black font-mono text-xs px-6 py-3 rounded-full font-medium tracking-widest transition-transform duration-300 hover:scale-102"
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
