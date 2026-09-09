"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, ShoppingBag, CornerDownRight, Check, Loader2, AlertCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Product } from "../../data/products";
import { getCart } from "../../utils/store";
import { useAuth } from "../../components/AuthContext";
import WaxSeal from "../../components/WaxSeal";
import { fetchCoupons, isCouponCurrentlyActive, CMSCoupon, fetchStorefrontProducts } from "../../utils/cms";
import { Tag } from "lucide-react";
import { sanitizePhoneInput } from "../../utils/phone";

interface DisplayCartItem {
  product: Product;
  size: string;
  qty: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const ease = [0.16, 1, 0.3, 1] as const;
  const { user, profile, loading: authLoading } = useAuth();

  // Customers must be signed in before ordering — bounce anyone who lands
  // here directly (e.g. a bookmarked/shared link) back through /login.
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?next=/checkout");
    }
  }, [authLoading, user, router]);

  const [cartItems, setCartItems] = useState<DisplayCartItem[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
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

  // ─── PIN code lookup (India Post) ──────────────────────────────────────────
  // Validates the entered PIN code exists, and auto-fills city/state from it.
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "valid" | "invalid" | "unverified">("idle");
  const [pincodeError, setPincodeError] = useState("");

  useEffect(() => {
    const pin = formData.zip.trim();
    if (!/^\d{6}$/.test(pin)) {
      setPincodeStatus("idle");
      setPincodeError("");
      return;
    }

    let cancelled = false;
    setPincodeStatus("checking");
    setPincodeError("");

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (cancelled) return;

        const result = Array.isArray(data) ? data[0] : null;
        if (result?.Status === "Success" && result.PostOffice?.length > 0) {
          const po = result.PostOffice[0];
          setFormData((prev) => ({
            ...prev,
            city: po.District || prev.city,
            state: po.State || prev.state,
          }));
          setPincodeStatus("valid");
        } else {
          setPincodeStatus("invalid");
          setPincodeError("This PIN code doesn't exist in India. Please check it.");
        }
      } catch (err) {
        if (cancelled) return;
        // Network/API hiccup — don't hard-block checkout over a third-party outage.
        console.warn("PIN code lookup failed:", err);
        setPincodeStatus("unverified");
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [formData.zip]);


  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchStorefrontProducts()
      .then(setAllProducts)
      .catch((err) => console.warn("Failed to load storefront products on checkout:", err));
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

  const [coupons, setCoupons] = useState<CMSCoupon[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CMSCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [defaultDismissed, setDefaultDismissed] = useState(false);

  useEffect(() => {
    fetchCoupons().then(setCoupons);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + parsePrice(item.product.price) * item.qty, 0);
  const shipping = 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const applyCouponToState = (coupon: CMSCoupon) => {
    const discount = coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

    setDiscountAmount(discount);
    setAppliedCoupon(coupon);

    localStorage.setItem("ghubor-applied-coupon", JSON.stringify({
      code: coupon.code,
      discount,
      type: coupon.type,
      value: coupon.value
    }));
  };

  // Restore a coupon already applied on the cart page, or auto-apply the
  // default (e.g. LAUNCH35) once coupons + cart total are known.
  useEffect(() => {
    if (appliedCoupon || defaultDismissed || coupons.length === 0 || subtotal === 0) return;

    const saved = localStorage.getItem("ghubor-applied-coupon");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = coupons.find((c) => c.code === parsed.code);
        if (match && isCouponCurrentlyActive(match) && (!match.minAmount || subtotal >= match.minAmount)) {
          applyCouponToState(match);
          return;
        }
      } catch {
        // fall through to clearing below
      }
      localStorage.removeItem("ghubor-applied-coupon");
    }

    const defaultCoupon = coupons.find((c) => c.isDefault && isCouponCurrentlyActive(c));
    if (!defaultCoupon) return;
    if (defaultCoupon.minAmount && subtotal < defaultCoupon.minAmount) return;

    applyCouponToState(defaultCoupon);
  }, [coupons, subtotal, appliedCoupon, defaultDismissed]);

  const otherActiveCoupons = coupons.filter(
    (c) => isCouponCurrentlyActive(c) && !c.isDefault && c.id !== appliedCoupon?.id
  );

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponCode.trim()) return;

    const match = coupons.find((c) => c.code === couponCode.trim().toUpperCase());

    if (!match) {
      setCouponError("INVALID PROMO CODE.");
      return;
    }

    if (!isCouponCurrentlyActive(match)) {
      setCouponError("COUPON IS NOT CURRENTLY ACTIVE.");
      return;
    }

    if (match.minAmount && subtotal < match.minAmount) {
      setCouponError(`MINIMUM PURCHASE IS ₹${match.minAmount}.`);
      return;
    }

    applyCouponToState(match);
  };

  const handleRemoveCoupon = () => {
    if (appliedCoupon?.isDefault) {
      setDefaultDismissed(true);
    }
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

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, zip: e.target.value.replace(/\D/g, "").slice(0, 6) }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, phone: sanitizePhoneInput(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zip) {
      alert("Please fill in all shipping fields to proceed.");
      return;
    }
    if (formData.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (pincodeStatus === "invalid") {
      alert("This PIN code doesn't exist in India. Please correct it before proceeding.");
      return;
    }
    if (pincodeStatus === "checking") {
      alert("Still verifying the PIN code — one moment.");
      return;
    }

    localStorage.setItem("ghubor-checkout-info", JSON.stringify(formData));
    router.push("/payment");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center text-primary font-mono text-xs uppercase tracking-widest">
        {authLoading ? "Loading..." : "Redirecting to sign in..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-xs sm:text-sm font-mono font-bold tracking-[0.3em] uppercase block mb-3 animate-pulse">
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
            <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-widest text-primary border-b border-border-theme pb-3">
              Shipping Destination
            </h2>

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="GIBBOR WARRIOR"
                className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-sm sm:text-base font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="RITUAL@EMAIL.COM"
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-sm sm:text-base font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted font-mono">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    className="w-full bg-bg-page/40 border border-border-theme rounded-lg p-3 pl-10 text-sm sm:text-base font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest">Street Address</label>
              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="SANCTUARY WING, HOUSE NO, STREET"
                className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-sm sm:text-base font-mono text-text-page outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest">Postal / ZIP Code (PIN)</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleZipChange}
                  placeholder="400001"
                  className={`w-full bg-bg-page/40 border rounded-lg p-3 pr-10 text-sm sm:text-base font-mono text-text-page outline-none transition-colors ${
                    pincodeStatus === "invalid" ? "border-red-500/60 focus:border-red-500" : "border-border-theme focus:border-primary/50"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {pincodeStatus === "checking" && <Loader2 className="w-4 h-4 text-text-muted animate-spin" />}
                  {pincodeStatus === "valid" && <Check className="w-4 h-4 text-primary" />}
                  {pincodeStatus === "invalid" && <AlertCircle className="w-4 h-4 text-red-500" />}
                </span>
              </div>
              {pincodeStatus === "invalid" && (
                <span className="text-xs font-mono font-semibold text-red-500">{pincodeError}</span>
              )}
              {pincodeStatus === "unverified" && (
                <span className="text-xs font-mono text-text-muted">Couldn&apos;t verify this PIN code right now — double-check it&apos;s correct.</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="MUMBAI"
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-sm sm:text-base font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="MAHARASHTRA"
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-sm sm:text-base font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <p className="text-[10px] font-mono text-text-dim uppercase tracking-wide -mt-3">
              City &amp; state auto-fill from your PIN code — edit if needed.
            </p>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-bg-page font-mono text-sm sm:text-base tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-bold mt-4 shadow-md hover:shadow-primary/10"
            >
              <span>CONTINUE TO PAYMENT</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* RIGHT: Order Review Panel (Col 8-12) */}
          <div className="lg:col-span-5 bg-bg-card border border-border-theme rounded-2xl p-6 flex flex-col gap-6 relative overflow-visible shadow-lg">
            {/* Premium Stamped Wax Seal */}
            <div className="absolute top-[-30px] right-[-15px] z-30 pointer-events-none hidden sm:block">
              <WaxSeal size={70} />
            </div>

            <h2 className="text-sm sm:text-base font-mono font-bold uppercase tracking-widest text-primary border-b border-border-theme pb-3">
              Order Review
            </h2>

            {/* List of items being checked out */}
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3 items-center border-b border-border-theme pb-3">
                  <div className="relative w-12 h-15 rounded bg-bg-page/40 border border-border-theme overflow-hidden shrink-0">
                    <Image src={item.product.image} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-sm font-bold text-text-page truncate uppercase tracking-wider">{item.product.title}</h3>
                    <p className="text-xs text-text-muted font-mono font-semibold mt-0.5">SIZE: {item.size} / QTY: {item.qty}</p>
                  </div>
                  <span className="text-sm font-mono font-bold text-primary shrink-0">{item.product.price}</span>
                </div>
              ))}
            </div>

            {/* Coupon Promo Input */}
            <div className="border-t border-b border-border-theme py-4 flex flex-col gap-2">
              <span className="text-xs sm:text-sm font-mono font-semibold text-text-page uppercase tracking-widest block">Apply Coupon</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="COVENANT CODE"
                  disabled={!!appliedCoupon?.isDefault}
                  className="flex-grow min-w-0 bg-bg-page/40 border border-border-theme rounded-lg px-3 py-2.5 text-sm font-mono text-text-page outline-none focus:border-primary/50 transition-colors placeholder:text-text-muted/50 uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!!appliedCoupon?.isDefault}
                  className="shrink-0 bg-primary hover:bg-primary/90 text-bg-page text-xs sm:text-sm font-mono font-bold px-4 rounded-lg uppercase tracking-wider transition-colors cursor-pointer border-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <span className="text-xs font-mono font-semibold text-red-500 uppercase tracking-wider">{couponError}</span>
              )}
              {appliedCoupon && (
                <div className="flex justify-between items-center bg-primary/10 border border-primary/20 rounded-lg px-3 py-2 mt-1 font-mono text-xs sm:text-sm font-semibold text-primary">
                  <span>
                    COUPON &quot;{appliedCoupon.code}&quot; ACTIVE
                    {appliedCoupon.isDefault && <span className="text-text-muted font-normal"> (default)</span>}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-400 font-bold cursor-pointer ml-2 border-none bg-transparent"
                  >
                    REMOVE
                  </button>
                </div>
              )}
              {appliedCoupon?.isDefault && (
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wide">
                  Remove the default coupon to apply a different code.
                </span>
              )}

              {otherActiveCoupons.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-2">
                  {otherActiveCoupons.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 bg-bg-page/40 border border-border-theme rounded-lg px-3 py-2 text-xs font-mono text-text-muted"
                    >
                      <Tag className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>
                        Also available: <span className="font-bold text-text-page">{c.code}</span> —{" "}
                        {c.type === "percentage" ? `${c.value}% OFF` : `₹${c.value} OFF`}
                        {c.minAmount > 0 && ` on orders ₹${c.minAmount}+`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 font-mono text-sm sm:text-base font-semibold text-text-muted pt-2">
              <div className="flex justify-between">
                <span>SUBTOTAL:</span>
                <span className="text-text-page font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>DISCOUNT ({appliedCoupon?.code}):</span>
                  <span className="font-bold">- ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>SHIPPING:</span>
                <span className="text-primary font-bold">FREE (COMP)</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-border-theme pt-3 text-xl sm:text-2xl font-extrabold text-primary">
                <span className="text-sm sm:text-base">TOTAL:</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-bg-page/50 border border-border-theme rounded-xl p-3.5 mt-2">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-semibold text-text-muted leading-normal uppercase">
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
