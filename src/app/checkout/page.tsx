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
import WaxSeal from "../../components/WaxSeal";
import { db } from "../../utils/firebase";

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
        console.warn("Failed to fetch Firestore products on checkout:", err);
      }
      setAllProducts(mergedProducts);
    };

    loadAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return; // Wait for products to load

    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
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
  }, [router, allProducts]);

  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
  };

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.removeItem("ghubor-applied-coupon");
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.product.price) * item.qty, 0);
  const shipping = 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) return;

    try {
      const { db } = await import("../../utils/firebase");
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      if (!db) {
        setCouponError("SANCTUARY OFFLINE.");
        return;
      }

      const q = query(collection(db, "cms-coupons"), where("code", "==", couponCode.trim().toUpperCase()));
      const snap = await getDocs(q);

      if (snap.empty) {
        setCouponError("INVALID Promo CODE.");
        return;
      }

      const couponDoc = snap.docs[0].data();
      if (!couponDoc.active) {
        setCouponError("COUPON IS NO LONGER ACTIVE.");
        return;
      }

      if (couponDoc.minAmount && subtotal < couponDoc.minAmount) {
        setCouponError(`MINIMUM PURCHASE IS ₹${couponDoc.minAmount}.`);
        return;
      }

      let discount = 0;
      if (couponDoc.type === "percentage") {
        discount = Math.round((subtotal * couponDoc.value) / 100);
      } else {
        discount = couponDoc.value;
      }

      setDiscountAmount(discount);
      setAppliedCoupon(couponDoc);

      localStorage.setItem("ghubor-applied-coupon", JSON.stringify({
        code: couponDoc.code,
        discount,
        type: couponDoc.type,
        value: couponDoc.value
      }));
    } catch (err) {
      console.error(err);
      setCouponError("FAILED TO APPLY Promo.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    localStorage.removeItem("ghubor-applied-coupon");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zip) {
      alert("Please fill in all shipping fields to proceed.");
      return;
    }
    localStorage.setItem("ghubor-checkout-info", JSON.stringify(formData));
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3 animate-pulse">
            ACQUISITION SECURE
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-text-page font-light tracking-wide leading-none">
            Shipping Ritual
          </h1>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* LEFT: Shipping Form (Col 1-7) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-bg-card border border-border-theme rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary border-b border-border-theme pb-3">
              Shipping Destination
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="GIBBOR WARRIOR"
                className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="RITUAL@EMAIL.COM"
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Street Address</label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="SANCTUARY WING, HOUSE NO, STREET"
                className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">City / State</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="MUMBAI, MH"
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">Postal / ZIP Code</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="400001"
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-bg-page font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-md hover:shadow-primary/10"
            >
              <span>CONTINUE TO PAYMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* RIGHT: Order Review Panel (Col 8-12) */}
          <div className="lg:col-span-5 bg-bg-card border border-border-theme rounded-2xl p-6 flex flex-col gap-6 relative overflow-visible shadow-lg">
            {/* Premium Stamped Wax Seal */}
            <div className="absolute top-[-30px] right-[-15px] z-30 pointer-events-none hidden sm:block">
              <WaxSeal size={70} />
            </div>

            <h2 className="text-xs font-mono uppercase tracking-widest text-primary border-b border-border-theme pb-3">
              Order Review
            </h2>

            {/* List of items being checked out */}
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-center border-b border-border-theme pb-3">
                  <div className="w-12 h-15 rounded bg-bg-page/40 border border-border-theme overflow-hidden shrink-0">
                    <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-[11px] font-semibold text-text-page truncate uppercase tracking-wider">{item.product.title}</h3>
                    <p className="text-[9px] text-text-muted font-mono mt-0.5">SIZE: {item.size} / QTY: {item.qty}</p>
                  </div>
                  <span className="text-[11px] font-mono text-primary shrink-0">{item.product.price}</span>
                </div>
              ))}
            </div>

            {/* Coupon Promo Input */}
            <div className="border-t border-b border-border-theme py-4 flex flex-col gap-2">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest block">Apply Coupon</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="COVENANT CODE"
                  className="flex-grow bg-bg-page/40 border border-border-theme rounded-lg px-3 py-2 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors placeholder:text-text-muted/50 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-primary hover:bg-primary/90 text-bg-page text-[10px] font-mono px-4 rounded-lg uppercase tracking-wider transition-colors cursor-pointer border-none"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <span className="text-[9px] font-mono text-red-500 uppercase tracking-wider">{couponError}</span>
              )}
              {appliedCoupon && (
                <div className="flex justify-between items-center bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 mt-1 font-mono text-[9px] text-primary">
                  <span>COUPON &quot;{appliedCoupon.code}&quot; ACTIVE</span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-400 font-semibold cursor-pointer ml-2 border-none bg-transparent"
                  >
                    REMOVE
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs text-text-muted pt-2">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="text-text-page">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>DISCOUNT ({appliedCoupon?.code}):</span>
                  <span>- ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>SHIPPING:</span>
                <span className="text-primary">FREE (COMP)</span>
              </div>
              <div className="flex justify-between border-t border-border-theme pt-3 text-sm font-bold text-primary">
                <span>TOTAL:</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-bg-page/50 border border-border-theme rounded-xl p-3.5 mt-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-[10px] text-text-muted leading-normal uppercase">
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
