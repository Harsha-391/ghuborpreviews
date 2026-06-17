"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, Heart } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { fetchDropSettings, CMSDropSettings } from "../../../utils/cms";

export default function ProductDetailPage() {
  const [settings, setSettings] = useState<CMSDropSettings | null>(null);

  useEffect(() => {
    fetchDropSettings().then(setSettings);
  }, []);

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      {/* Noise Overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      
      {/* Ambient Red Glows */}
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md bg-black/60 border border-white/5 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-[#5C0606]/10 border border-[#5C0606]/35 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            ACQUISITIONS LOCKED
          </span>
          
          <h1 className="font-serif italic text-3xl sm:text-4xl text-[#E1E0CC] font-light tracking-wide leading-none mb-6">
            The Archive is Sealed
          </h1>
          
          <p className="text-xs text-gray-500 font-light leading-relaxed mb-8 uppercase tracking-widest whitespace-pre-line">
            {settings ? settings.shipmentNotice : "we are preparing drop 01. \norders are not yet open. \nwe will notify you when the ritual begins."}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full bg-primary hover:bg-[#D4D0BC] text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold"
            >
              <span>RETURN TO FOUNDATION</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/wishlist"
              className="w-full bg-transparent hover:bg-bg-card-alt border border-white/10 hover:border-primary/50 text-[#E1E0CC] hover:text-primary font-mono text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold"
            >
              <span>VIEW YOUR WISHLIST</span>
              <Heart className="w-4 h-4 text-red-600 fill-red-600 border-none" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
