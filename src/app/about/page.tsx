"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutPage() {
  const ease = [0.16, 1, 0.3, 1] as const;

  const pillars = [
    {
      title: "I. STRUGGLE",
      subtitle: "The weight of human experience",
      desc: "Every garment is forged to acknowledge the silent wars we fight. The heavy canvas and raw construction represent the friction of earthly existence—a burden borne with dignity.",
    },
    {
      title: "II. FAITH",
      subtitle: "Belief without evidence",
      desc: "Private scripture prints and hidden details represent the inner conviction that keeps us upright. It is a quiet dialogue between the fabric and the skin, a testament of hope in the dark.",
    },
    {
      title: "III. TRANSCENDENCE",
      subtitle: "The moment the armor becomes skin",
      desc: "The final evolution. The garment is no longer an external shield, but an extension of the wearer's identity. Hand-numbered drop tags certify its status as an archival relic.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background Noise and glows */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-10%] w-[450px] h-[450px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[450px] h-[450px] bg-red-900/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Global Navbar */}
      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Intro Section */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-4 animate-pulse">
            THE MYTHOS & FOUNDATION
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-[#E1E0CC] font-light tracking-wide leading-tight mb-8">
            Armor for the Modern Gibbor.
          </h1>
          <div className="w-16 h-[1px] bg-primary/25 mx-auto mb-8" />
          <p className="text-gray-400 text-sm sm:text-base font-light leading-relaxed mb-6">
            Ghubor derives its name from the Hebrew *Gibbor*, meaning a mighty warrior, champion, or hero. We do not make fashion. We forge wearable scripture—artifacts engineered to stand as physical shields for those fighting battles nobody else sees.
          </p>
          <p className="text-gray-500 text-xs sm:text-sm font-light uppercase tracking-widest leading-relaxed">
            no marketing. no retail stores. no compromises. <br />
            every garment a testament.
          </p>
        </div>

        {/* Brand Signatures Callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="bg-[#0b0606] border border-white/5 rounded-3xl p-8 sm:p-12 md:p-16 mb-24 relative overflow-hidden shadow-xl"
        >
          {/* Subtle logo backing */}
          <div className="absolute right-0 bottom-0 opacity-[0.03] translate-x-12 translate-y-12">
            <img src="/logo-white.png" alt="" className="w-96" />
          </div>

          <h2 className="font-serif italic text-2xl sm:text-3xl text-primary font-light mb-6">
            The Three Signatures
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-8 max-w-2xl font-light">
            To recognize a Gibbor across a crowded street, every artifact in our collection is bound by three architectural signatures: Gothic blackletter typography, a rich deep-oxblood or dark obsidian palette, and a hand-numbered serial tag verifying its limited origin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-white/5 rounded-xl p-4 bg-black/40">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">I. GOTHIC TYPOGRAPHY</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-light leading-relaxed">Bold calligraphic forms representing strength, history, and sacred text.</p>
            </div>
            <div className="border border-white/5 rounded-xl p-4 bg-black/40">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">II. THE OXBLOOD GLOW</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-light leading-relaxed">A signature deep red accent stitching and interior details symbolizing devotion.</p>
            </div>
            <div className="border border-white/5 rounded-xl p-4 bg-black/40">
              <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">III. HAND-NUMBERED TAG</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-light leading-relaxed">Unique drops limited to exactly 64 replicas per silhouette.</p>
            </div>
          </div>
        </motion.div>

        {/* Pillars Grid */}
        <div className="space-y-16 mb-12">
          <div className="text-center">
            <span className="text-primary text-[10px] font-mono tracking-widest uppercase">THE PILlARS OF ENDURANCE</span>
            <div className="w-8 h-[1px] bg-primary/20 mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease }}
                className="bg-black/50 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/20 transition-all duration-300 hover:bg-[#120808]/50"
              >
                <div>
                  <h3 className="text-sm font-semibold tracking-widest text-[#E1E0CC] mb-1 font-mono">{pillar.title}</h3>
                  <h4 className="text-[10px] text-primary/75 italic font-serif mb-4 uppercase tracking-wider">{pillar.subtitle}</h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">{pillar.desc}</p>
                </div>
                <div className="mt-8 border-t border-white/5 pt-4 flex items-center justify-between">
                  <span className="text-[8px] font-mono text-gray-600 uppercase">ARTIFACT SYMBOL</span>
                  <div className="w-5 h-5 opacity-40 filter invert brightness-125">
                    <img src="/images/details/glyph.png" alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
