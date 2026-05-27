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
  const [selectedMethod, setSelectedMethod] = useState<"card" | "upi" | "net">("card");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");

  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
    const subtotal = items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.id);
      if (product) {
        const price = parseInt(product.price.replace(/[^0-9]/g, ""), 10);
        return acc + price * item.qty;
      }
      return acc;
    }, 0);
    setTotalPrice(subtotal);
  }, [router]);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod === "card" && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      alert("Please fill in all credit card specifications.");
      return;
    }

    setLoading(true);
    setLoadingStep("CONTACTING DROP CHANNELS...");

    setTimeout(() => {
      setLoadingStep("VERIFYING AVAILABLE REPLICAS...");
      
      setTimeout(() => {
        setLoadingStep("AUTHORIZING TRANSACTION...");
        
        setTimeout(async () => {
          try {
            // Generate order identification number
            const orderNo = `GH-02-${Math.floor(1000 + Math.random() * 9000)}`;
            sessionStorage.setItem("ghubor-last-order-no", orderNo);

            const checkoutInfoStr = localStorage.getItem("ghubor-checkout-info");
            const shippingAddress = checkoutInfoStr ? JSON.parse(checkoutInfoStr) : {};

            const cart = getCart();
            const orderItems = cart
              .map((item) => {
                const product = products.find((p) => p.id === item.id);
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
              total: totalPrice,
              shippingAddress,
              status: "preparing in dark",
              createdAt: new Date().toISOString(),
            });
          } catch (dbErr) {
            console.warn("Firestore order registry failed (Firebase config may not be loaded):", dbErr);
          }

          // Clear cart on success
          clearCart();
          router.push("/checkout/success");
        }, 1200);
      }, 1000);
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            RITUAL DEPOSIT
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#E1E0CC] font-light tracking-wide leading-none">
            Secure Authorization
          </h1>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        <div className="max-w-md mx-auto bg-black/60 border border-white/5 rounded-3xl p-6 sm:p-8 relative">
          
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-6" />
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-primary/80 animate-pulse">
                {loadingStep}
              </h2>
              <p className="text-[10px] text-gray-500 font-mono mt-4 uppercase max-w-[200px] leading-relaxed">
                Do not refresh this portal. Securing replica inside inscription records.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePayment} className="flex flex-col gap-6">
              
              {/* Price Indicator */}
              <div className="text-center bg-[#090505] border border-white/5 rounded-2xl py-6 px-4">
                <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">TRANSACTION VALUATION</span>
                <p className="text-2xl sm:text-3xl font-mono font-bold text-primary mt-1">₹{totalPrice.toLocaleString("en-IN")}</p>
                <span className="text-[9px] text-gray-600 font-mono uppercase mt-0.5 block">0% SURCHARGE APPLIED</span>
              </div>

              {/* Payment Methods tabs */}
              <div className="flex border border-white/10 rounded-xl overflow-hidden text-center font-mono text-[9px] uppercase">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`flex-1 py-3 cursor-pointer transition-colors ${
                    selectedMethod === "card" ? "bg-[#5C0606]/20 text-primary border-r border-white/10" : "hover:bg-white/5 text-gray-500 border-r border-white/10"
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod("upi")}
                  className={`flex-1 py-3 cursor-pointer transition-colors ${
                    selectedMethod === "upi" ? "bg-[#5C0606]/20 text-primary border-r border-white/10" : "hover:bg-white/5 text-gray-500 border-r border-white/10"
                  }`}
                >
                  UPI (QR/ID)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod("net")}
                  className={`flex-1 py-3 cursor-pointer transition-colors ${
                    selectedMethod === "net" ? "bg-[#5C0606]/20 text-primary" : "hover:bg-white/5 text-gray-500"
                  }`}
                >
                  Net Banking
                </button>
              </div>

              {/* Tab contents */}
              {selectedMethod === "card" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-primary/60" />
                      <span>Card Number</span>
                    </label>
                    <input
                      type="text"
                      name="number"
                      maxLength={16}
                      required
                      value={cardData.number}
                      onChange={handleCardChange}
                      placeholder="4111 2222 3333 4444"
                      className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        maxLength={5}
                        required
                        value={cardData.expiry}
                        onChange={handleCardChange}
                        placeholder="MM/YY"
                        className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Security CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        maxLength={3}
                        required
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        placeholder="***"
                        className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMethod === "upi" && (
                <div className="flex flex-col gap-4 text-center py-4 border border-white/5 rounded-2xl bg-black/40">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Direct UPI Transfer</span>
                  <div className="w-32 h-32 bg-white/10 rounded-xl mx-auto flex items-center justify-center p-3 border border-white/5">
                    {/* Simulated QR Code */}
                    <div className="w-full h-full border border-primary/20 flex flex-col items-center justify-center text-primary/60 font-mono text-[7px] tracking-tighter uppercase p-2 text-center select-none">
                      <Sparkles className="w-4 h-4 text-primary mb-1 animate-pulse" />
                      QR SECURED BY GHUBOR NET
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 max-w-xs mx-auto w-full px-4">
                    <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest text-left">UPI Address ID</label>
                    <input
                      type="text"
                      placeholder="gibbor@upi"
                      className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              )}

              {selectedMethod === "net" && (
                <div className="flex flex-col gap-3 py-4 border border-white/5 rounded-2xl bg-black/40 px-4">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest text-center mb-2 block">Choose Bank Institution</span>
                  {["HDFC BANK RITUAL", "ICICI MONARCHY", "STATE BANK SACRED", "AXIS DEFENSE"].map((bank) => (
                    <label key={bank} className="flex items-center gap-3 p-3 bg-black border border-white/5 rounded-xl hover:border-primary/20 transition-all cursor-pointer">
                      <input type="radio" name="bank" className="accent-[#5C0606]" />
                      <span className="font-mono text-[10px] text-primary/80 uppercase">{bank}</span>
                    </label>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary hover:bg-[#D4D0BC] text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-lg hover:shadow-primary/20"
              >
                <span>AUTHORIZE TRANSACTION</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 font-mono uppercase border-t border-white/5 pt-4">
                <ShieldCheck className="w-4 h-4 text-[#5C0606]" />
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
