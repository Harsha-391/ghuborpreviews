"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Shield, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getCart, clearCart } from "../../utils/store";
import { products } from "../../data/products";
import { useAuth } from "../../components/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function PaymentPage() {
  const router = useRouter();
  const ease = [0.16, 1, 0.3, 1] as const;
  const { user } = useAuth();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>("");
  const [paymentMode, setPaymentMode] = useState<"full" | "partial">("full");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [shippingAddress, setShippingAddress] = useState<any>({});

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
        console.warn("Failed to fetch Firestore products on payment:", err);
      }
      setAllProducts(mergedProducts);
    };

    loadAllProducts();
  }, []);

  // Load cart items and calculate total price
  useEffect(() => {
    if (allProducts.length === 0) return;

    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
    const subtotal = items.reduce((acc, item) => {
      const product = allProducts.find((p) => p.id === item.id);
      if (product) {
        const price = parseInt(product.price.replace(/[^0-9]/g, ""), 10);
        return acc + price * item.qty;
      }
      return acc;
    }, 0);
    setTotalPrice(subtotal);

    // Read coupon discount
    if (typeof window !== "undefined") {
      const savedCoupon = localStorage.getItem("ghubor-applied-coupon");
      if (savedCoupon) {
        try {
          const parsed = JSON.parse(savedCoupon);
          setDiscount(parsed.discount || 0);
          setCouponCode(parsed.code || "");
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [router, allProducts]);

  // Load verified customer details from website checkout state
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkoutInfoStr = localStorage.getItem("ghubor-checkout-info");
      if (checkoutInfoStr) {
        try {
          setShippingAddress(JSON.parse(checkoutInfoStr));
        } catch (e) {
          console.error("Failed to parse checkout info:", e);
        }
      }
    }
  }, []);

  const discountedTotal = Math.max(0, totalPrice - discount);
  const partialPrice = Math.round(discountedTotal * 0.3); // 30% deposit
  const finalPrice = paymentMode === "full" ? discountedTotal : partialPrice;

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStep("LAUNCHING SECURE GATEWAY...");

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Please verify your internet connection.");
      setLoading(false);
      return;
    }

    setLoadingStep("CONTACTING DROP CHANNELS...");

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_TCwgntE4R0J9C7";

    const options = {
      key: keyId,
      amount: finalPrice * 100, // Razorpay takes amount in paise (rupees * 100)
      currency: "INR",
      name: "GHUBOR SANCTUARY",
      description: paymentMode === "full" ? "Acquisition Settle - Full Value" : "Acquisition Secure - 30% Sanctuary Deposit",
      image: "/logo-black.svg",
      handler: async function (response: any) {
        setLoadingStep("VERIFYING INSCRIBED LEDGER...");
        try {
          // Generate order identification number
          const orderNo = `GH-02-${Math.floor(1000 + Math.random() * 9000)}`;
          sessionStorage.setItem("ghubor-last-order-no", orderNo);

          const cart = getCart();
          const orderItems = cart
            .map((item) => {
              const product = allProducts.find((p) => p.id === item.id);
              return {
                id: item.id,
                size: item.size,
                qty: item.qty,
                title: product?.title || "",
                price: product?.price || "",
                image: product?.image || "",
              };
            })
            .filter((item) => item.title !== "");

          if (!db) {
            throw new Error("Database instance is not initialized.");
          }

          // Save order document to Firestore
          await addDoc(collection(db, "orders"), {
            uid: user?.uid || "guest",
            orderNo,
            items: orderItems,
            subtotal: totalPrice,
            discount,
            couponCode,
            total: discountedTotal,
            amountPaid: finalPrice,
            amountDue: discountedTotal - finalPrice,
            paymentMode,
            paymentId: response.razorpay_payment_id || "simulated_pay",
            shippingAddress,
            status: paymentMode === "full" ? "paid_preparing" : "deposit_unpaid_balance",
            createdAt: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Firestore order registry failed (Firebase config may not be loaded):", dbErr);
        }

        // Clear cart on success
        clearCart();
        router.push("/checkout/success");
      },
      prefill: {
        name: shippingAddress.name || "",
        email: shippingAddress.email || "",
        contact: shippingAddress.phone || "",
      },
      notes: {
        paymentMode,
        originalTotal: totalPrice.toString(),
        amountPaid: finalPrice.toString(),
        amountDue: (totalPrice - finalPrice).toString(),
      },
      theme: {
        color: "#5C0606",
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    try {
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Razorpay initiation failed:", err);
      alert("Failed to initialize Razorpay checkout. Please check the developer console.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background Noise and glows */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3 animate-pulse">
            RITUAL DEPOSIT
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-text-page font-light tracking-wide leading-none">
            Secure Authorization
          </h1>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        <div className="max-w-md mx-auto bg-bg-card border border-border-theme rounded-3xl p-6 sm:p-8 relative shadow-lg">
          
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-6" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-primary animate-pulse">
                {loadingStep}
              </h2>
              <p className="text-[10px] text-text-muted font-mono mt-4 uppercase max-w-[200px] leading-relaxed">
                Do not refresh this portal. Securing replica inside inscription records.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="flex flex-col gap-6">
              
              {/* Price Indicator */}
              <div className="text-center bg-bg-page/40 border border-border-theme rounded-2xl py-6 px-4">
                <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest">TRANSACTION VALUATION</span>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-primary mt-1">₹{discountedTotal.toLocaleString("en-IN")}</p>
                {discount > 0 ? (
                  <span className="text-[9px] text-primary font-mono uppercase mt-0.5 block">
                    Promo Code &quot;{couponCode}&quot; Applied (-₹{discount.toLocaleString("en-IN")})
                  </span>
                ) : (
                  <span className="text-[9px] text-text-muted font-mono uppercase mt-0.5 block">0% SURCHARGE APPLIED</span>
                )}
              </div>

              {/* Payment Split Selector */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block mb-1">Select Payment Split</span>
                
                <div className="flex flex-col gap-3">
                  {/* Full payment */}
                  <label className={`flex items-start gap-3 p-4 bg-bg-page/40 border rounded-2xl cursor-pointer transition-all duration-300 ${
                    paymentMode === "full" ? "border-primary bg-primary/5" : "border-border-theme hover:border-text-muted"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === "full"}
                      onChange={() => setPaymentMode("full")}
                      className="accent-primary mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col cursor-pointer">
                      <span className="font-mono text-xs font-semibold text-text-page">PAY FULL VALUE</span>
                      <span className="text-[10px] text-text-muted font-mono mt-0.5">Settle entire value of ₹{discountedTotal.toLocaleString("en-IN")} now.</span>
                    </div>
                  </label>

                  {/* Partial payment */}
                  <label className={`flex items-start gap-3 p-4 bg-bg-page/40 border rounded-2xl cursor-pointer transition-all duration-300 ${
                    paymentMode === "partial" ? "border-primary bg-primary/5" : "border-border-theme hover:border-text-muted"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentMode === "partial"}
                      onChange={() => setPaymentMode("partial")}
                      className="accent-primary mt-0.5 cursor-pointer"
                    />
                    <div className="flex flex-col cursor-pointer">
                      <span className="font-mono text-xs font-semibold text-text-page">PAY SANCTUARY DEPOSIT (30%)</span>
                      <span className="text-[10px] text-text-muted font-mono mt-0.5">
                        Pay ₹{partialPrice.toLocaleString("en-IN")} now to reserve tag. Balance ₹{(discountedTotal - partialPrice).toLocaleString("en-IN")} due on delivery.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Customer Details Review */}
              <div className="bg-bg-page/40 border border-border-theme rounded-2xl p-4 flex flex-col gap-2 font-mono text-[10px] text-text-muted">
                <span className="uppercase text-primary font-semibold tracking-wider pb-1.5 border-b border-border-theme mb-1">Verified Inscription Info</span>
                <div className="flex justify-between">
                  <span>RECIPIENT:</span>
                  <span className="text-text-page font-medium uppercase">{shippingAddress.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>OUTREACH:</span>
                  <span className="text-text-page font-medium">{shippingAddress.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span>EMAIL:</span>
                  <span className="text-text-page font-medium truncate max-w-[200px]">{shippingAddress.email}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span>DESTINATION:</span>
                  <span className="text-text-page font-medium text-right uppercase max-w-[200px] leading-relaxed">
                    {shippingAddress.address}, {shippingAddress.city} - {shippingAddress.zip}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-bg-page font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-md hover:shadow-primary/10"
              >
                <span>LAUNCH SECURE RAZORPAY GATEWAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] text-text-muted font-mono uppercase border-t border-border-theme pt-4">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>3D-SECURE PROTOCOL ACTIVE</span>
              </div>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
