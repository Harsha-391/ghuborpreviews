"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import WordsPullUp from "./WordsPullUp";
import Navbar from "./Navbar";

export default function Hero({ loading = false }: { loading?: boolean }) {
  const ease = [0.16, 1, 0.3, 1] as const;

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="h-screen w-full relative p-4 md:p-6 flex flex-col justify-between overflow-hidden select-none">
      {/* Inset Container with Rounded Borders */}
      <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden flex flex-col justify-between border border-white/5 bg-black">

        {/* Background Image with Zoom & Dark Gradients */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={loading ? {} : { scale: 1, opacity: 0.55 }}
            transition={{ duration: 2.5, ease: ease }}
            className="w-full h-full"
          >
            <img
              src="/images/hero.png"
              alt="Ghubor Hero Cinematic"
              className="w-full h-full object-cover object-center filter brightness-90 contrast-110"
            />
          </motion.div>

          {/* Noise Overlay */}
          <div className="noise-overlay absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" />

          {/* Red/Oxblood accent glowing spot */}
          <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[160px] pointer-events-none" />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
        </div>

        {/* Navbar */}
        <Navbar absolute={true} />

        {/* Hero Content (Bottom-aligned) */}
        <div className="w-full absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 flex flex-col justify-end min-h-[40vh]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">

            {/* Left 8 columns - Giant Gothic Heading */}
            <div className="lg:col-span-8 flex justify-center lg:justify-start">
              <WordsPullUp
                text="Ghubor"
                loading={loading}
                className="font-blackletter font-medium text-[24vw] sm:text-[22vw] md:text-[20vw] lg:text-[16vw] xl:text-[15vw] 2xl:text-[16vw] leading-[0.8] tracking-normal text-[#E1E0CC] select-none"
              />
            </div>

            {/* Right 4 columns - Description & CTA */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left gap-4 md:gap-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={loading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: ease }}
                className="text-primary/70 text-xs sm:text-sm md:text-base font-light leading-[1.3] tracking-wide max-w-md"
              >
                Armor for the modern Gibbor. Wearable scripture. Fighting battles nobody sees. Forged in the dark, speaking in fragments, bound to become skin.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={loading ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: ease }}
              >
                <Link
                  href="/shop"
                  className="bg-primary text-black rounded-full py-1.5 pl-5 pr-2 flex items-center justify-between gap-4 font-medium text-xs sm:text-sm group hover:gap-6 transition-all duration-300 cursor-pointer shadow-[0_4px_20px_rgba(222,219,200,0.2)] hover:shadow-[0_4px_30px_rgba(222,219,200,0.4)] inline-flex"
                >
                  <span>ENTER THE RITUAL</span>
                  <span className="bg-black rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
                  </span>
                </Link>
              </motion.div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
