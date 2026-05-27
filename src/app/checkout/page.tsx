"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, ShoppingBag, CornerDownRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { products, Product } from "../../data/products";
import { getCart } from "../../utils/store";
import { useAuth } from "../../components/AuthContext";

interface DisplayCartItem {
  product: Product;
  size: string;
  qty: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const ease = [0.16, 1, 0.3, 1] as const;
  const { profile } = useAuth();

  const [cartItems, setCartItems] = useState<DisplayCartItem[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  // Pre-fill user profile credentials
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || profile.name || "",
        email: prev.email || profile.email || "",
        phone: prev.phone || profile.phone || "",
        address: prev.address || profile.address || "",
        city: prev.city || profile.city || "",
        zip: prev.zip || profile.zip || "",
      }));
    }
  }, [profile]);


  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
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
  }, [router]);

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.product.price) * item.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zip) {
      alert("Please fill in all ritual shipping fields to proceed.");
      return;
    }
    // Save info and continue
    localStorage.setItem("ghubor-checkout-info", JSON.stringify(formData));
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            ACQUISITION SECURE
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#E1E0CC] font-light tracking-wide leading-none">
            Shipping Ritual
          </h1>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* LEFT: Shipping Form (Col 1-7) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-black/60 border border-white/5 rounded-2xl p-6 sm:p-8 flex flex-col gap-5">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 border-b border-white/5 pb-3">
              Shipping Destination
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="GIBBOR WARRIOR"
                className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="RITUAL@EMAIL.COM"
                  className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Street Address</label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="SANCTUARY WING, HOUSE NO, STREET"
                className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">City / State</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="MUMBAI, MH"
                  className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Postal / ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="400001"
                  className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-[#D4D0BC] text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-lg hover:shadow-primary/20"
            >
              <span>CONTINUE TO PAYMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* RIGHT: Order Review Panel (Col 8-12) */}
          <div className="lg:col-span-5 bg-black/80 border border-white/5 rounded-2xl p-6 flex flex-col gap-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 border-b border-white/5 pb-3">
              Order Review
            </h2>

            {/* List of items being checked out */}
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-center border-b border-white/5 pb-3">
                  <div className="w-12 h-15 rounded bg-black border border-white/5 overflow-hidden shrink-0">
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-[11px] font-semibold text-[#E1E0CC] truncate uppercase tracking-wider">{item.product.title}</h3>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">SIZE: {item.size} / QTY: {item.qty}</p>
                  </div>
                  <span className="text-[11px] font-mono text-primary shrink-0">{item.product.price}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs text-gray-400 border-t border-white/5 pt-4">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="text-[#E1E0CC]">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>SHIPPING:</span>
                <span className="text-primary">FREE (COMP)</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3 text-sm font-bold text-primary">
                <span>TOTAL:</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-[#090505] border border-white/5 rounded-xl p-3.5 mt-2">
              <ShieldCheck className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
              <div className="text-[10px] text-gray-500 leading-normal uppercase">
                Secure drop channels. All transactions are logged and encrypted.
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
