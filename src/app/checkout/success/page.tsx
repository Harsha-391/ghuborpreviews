"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, FileText } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

import { useState, useEffect } from "react";

export default function CheckoutSuccessPage() {
  const ease = [0.16, 1, 0.3, 1] as const;
  const [orderNo, setOrderNo] = useState("GH-01-PENDING");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("ghubor-last-order-no");
      if (cached) {
        setOrderNo(cached);
      } else {
        const fallback = `GH-01-${Math.floor(1000 + Math.random() * 9000)}`;
        setOrderNo(fallback);
      }
    }
  }, []);


  return (
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background Noise and glows */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex flex-col items-center">
        
        <div className="max-w-xl text-center bg-black/60 border border-white/5 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Decorative Glows */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-red-950/10 rounded-full blur-xl" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-red-950/10 rounded-full blur-xl" />

          {/* Success Check Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            className="mb-8"
          >
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto filter drop-shadow-[0_0_15px_rgba(222,219,200,0.3)] animate-pulse" />
          </motion.div>

          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            AUTHENTICATION SECURED
          </span>
          
          <h1 className="font-serif italic text-3xl sm:text-4xl text-[#E1E0CC] font-light tracking-wide leading-none mb-6">
            Replica Registered.
          </h1>

          {/* Order Tag Badge */}
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-lg p-3 bg-[#080808]/80 backdrop-blur shadow-xl mb-8">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse" />
            <span className="text-[11px] text-gray-500 font-mono uppercase tracking-widest">ORDER IDENTIFICATION:</span>
            <span className="text-xs text-primary font-mono font-medium">{orderNo}</span>
          </div>

          <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed mb-8 max-w-md mx-auto">
            Your garment selection has been recorded within the archives of **Drop 01** and is being prepared in the dark. An email notification ritual containing sizing specifications and transaction details has been sent to your address.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/shop"
              className="w-full sm:w-auto bg-primary hover:bg-[#D4D0BC] text-black font-mono font-medium text-xs tracking-widest py-3.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase shadow-md shadow-primary/10"
            >
              <span>RETURN TO ARCHIVES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-white font-mono text-xs tracking-widest py-3.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer uppercase"
            >
              <span>GO TO HOME</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 font-mono uppercase border-t border-white/5 pt-6 mt-8">
            <ShieldCheck className="w-4 h-4 text-[#5C0606]" />
            <span>TRANSACTION RECORD COMPLETE</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
