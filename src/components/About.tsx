"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  const headingSegments = [
    {
      text: "Derived from the Hebrew Gibbor, ",
      className: "text-text-page font-light",
    },
    {
      text: "a mighty warrior, hero, ",
      className: "text-primary font-serif italic tracking-wide",
    },
    {
      text: "Ghubor makes wearable scripture for people fighting battles nobody sees.",
      className: "text-text-page font-light",
    },
  ];

  // Concise body text
  const bodyText =
    "Ghubor makes wearable scripture for the silent battles nobody else sees. Each garment stands as a concrete testament of struggle, faith, and transcendence—meticulously engineered to feel like armor, constructed to become second skin.";

  return (
    <section
      id="about"
      className="bg-bg-page py-20 px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Inner Card */}
      <div
        ref={containerRef}
        className="bg-bg-card rounded-3xl p-8 sm:p-12 md:p-16 max-w-6xl mx-auto border border-border-theme shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Crimson ink pool — top-left corner bleed */}
        <div
          className="absolute -top-40 -left-40 w-[340px] h-[300px] opacity-[0.20]"
          style={{ background: "#C0392B", borderRadius: "73% 27% 63% 37% / 54% 47% 53% 46%", filter: "blur(85px)" }}
        />
        {/* Deep oxblood — bottom-right corner bleed */}
        <div
          className="absolute -bottom-40 -right-40 w-[380px] h-[320px] opacity-[0.15]"
          style={{ background: "#5C0606", borderRadius: "38% 62% 46% 54% / 60% 35% 65% 40%", filter: "blur(95px)" }}
        />
        {/* Warm parchment bleed — mid-left */}
        <div
          className="absolute top-1/2 -left-24 -translate-y-1/2 w-[220px] h-[280px] opacity-[0.07]"
          style={{ background: "#D4C5A9", borderRadius: "55% 45% 35% 65% / 48% 60% 40% 52%", filter: "blur(65px)" }}
        />
        {/* Small crimson scatter — top-right */}
        <div
          className="absolute top-[10%] right-[8%] w-[160px] h-[140px] opacity-[0.10]"
          style={{ background: "#C0392B", borderRadius: "64% 36% 52% 48% / 45% 56% 44% 55%", filter: "blur(55px)" }}
        />

        {/* Small Category Label */}
        <div className="text-center mb-6">
          <span className="text-primary text-[10px] sm:text-xs font-light tracking-[0.25em] uppercase border-b border-primary/25 pb-1">
            The Mythos & Foundation
          </span>
        </div>

        {/* Main Heading Segmented and Styled */}
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <WordsPullUpMultiStyle
            segments={headingSegments}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-[1.1] sm:leading-[1.05] tracking-tight"
          />
        </div>

        {/* Divider */}
        <div className="w-16 h-[1px] bg-primary/20 mx-auto mb-10" />

        {/* Viewport Fade-in Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center leading-relaxed"
        >
          <p className="text-text-page/90 text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide">
            {bodyText}
          </p>
        </motion.div>

        {/* Brand Foundation Emotional Pillars Summary Icons (Visual layout touch) */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 text-center border-t border-border-theme pt-8">
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-primary/70 tracking-widest uppercase">Struggle</h4>
            <p className="text-[8px] sm:text-[10px] text-text-dim font-light mt-1 uppercase tracking-wider">The weight of human</p>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-primary/70 tracking-widest uppercase">Faith</h4>
            <p className="text-[8px] sm:text-[10px] text-text-dim font-light mt-1 uppercase tracking-wider">Belief without proof</p>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-primary/70 tracking-widest uppercase">Transcendence</h4>
            <p className="text-[8px] sm:text-[10px] text-text-dim font-light mt-1 uppercase tracking-wider">Armor becomes skin</p>
          </div>
        </div>

      </div>
    </section>
  );
}
