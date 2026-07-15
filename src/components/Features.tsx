"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle";
import { useImageConfig } from "./ImageConfigContext";

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { getImageUrl } = useImageConfig();

  const headerSegments = [
    {
      text: "Wearable scripture forged for silent battles. ",
      className: "text-primary font-light",
    },
    {
      text: "Dark. Sacred. Spare. Speaks in fragments.",
      className: "text-gray-500 font-light italic font-serif",
    },
  ];

  // Variants for staggered entrance animation of the cards
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      id="features"
      className="min-h-screen bg-bg-page relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none flex flex-col justify-center"
    >
      {/* Subtle background noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.12] pointer-events-none z-0" />
      
      {/* Left flank — organic crimson splash */}
      <div
        className="absolute top-[20%] -left-24 w-[440px] h-[520px] opacity-[0.07] pointer-events-none z-0"
        style={{ background: "#C0392B", borderRadius: "64% 36% 52% 48% / 45% 56% 44% 55%", filter: "blur(100px)" }}
      />
      {/* Right flank — deep oxblood */}
      <div
        className="absolute bottom-[15%] -right-24 w-[400px] h-[480px] opacity-[0.06] pointer-events-none z-0"
        style={{ background: "#5C0606", borderRadius: "42% 58% 67% 33% / 55% 42% 58% 45%", filter: "blur(110px)" }}
      />
      {/* Center — warm parchment ambient breath */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] opacity-[0.04] pointer-events-none z-0"
        style={{ background: "#D4C5A9", borderRadius: "55% 45% 38% 62% / 50% 60% 40% 50%", filter: "blur(130px)" }}
      />
      {/* Small top-right accent drop */}
      <div
        className="absolute top-[8%] right-[12%] w-[200px] h-[180px] opacity-[0.08] pointer-events-none z-0"
        style={{ background: "#C0392B", borderRadius: "73% 27% 46% 54% / 54% 47% 53% 46%", filter: "blur(70px)" }}
      />

      {/* Header Container */}
      <div className="text-center mb-16 relative z-10 max-w-4xl mx-auto">
        <span className="text-[10px] sm:text-xs text-primary/60 tracking-[0.3em] uppercase block mb-4">
          THE SIGNATURE PILLARS
        </span>
        <WordsPullUpMultiStyle
          segments={headerSegments}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-relaxed"
        />
      </div>

      {/* 4-column card grid */}
      <motion.div
        ref={containerRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-7xl mx-auto relative z-10 w-full"
      >
        
        {/* Card 1 - Video Card */}
        <motion.div
          variants={cardVariants}
          className="relative h-[480px] rounded-2xl overflow-hidden border border-border-theme shadow-2xl flex flex-col justify-end p-6 group"
        >
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover filter brightness-75 contrast-125"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-page via-bg-page/20 to-transparent" />
            <div className="noise-overlay absolute inset-0 opacity-[0.3] mix-blend-overlay pointer-events-none" />
          </div>

          {/* Card Content */}
          <div className="relative z-10">
            <span className="text-[10px] font-mono text-primary/60 tracking-widest block mb-2 uppercase">
              Artifact Showcase
            </span>
            <h3 className="font-blackletter text-2xl sm:text-3xl text-text-page font-light leading-none">
              Sacred silhouettes.
            </h3>
          </div>
        </motion.div>

        {/* Card 2 - Struggle */}
        <motion.div
          variants={cardVariants}
          className="bg-bg-card-alt rounded-2xl border border-border-theme shadow-2xl p-6 flex flex-col justify-between h-[480px] group transition-all duration-300 hover:border-primary/20"
        >
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-bg-page border border-border-theme flex items-center justify-center p-1">
                <img
                  src={getImageUrl("struggle")}
                  alt="Struggle Icon"
                  className="w-full h-full object-cover rounded filter contrast-125"
                />
              </div>
              <span className="text-xs font-mono text-text-muted tracking-wider">
                01
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-light text-text-page font-serif tracking-wide mb-6">
              01. Armored Build
            </h3>

            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  Engineered with 480GSM ultra-heavyweight cotton canvas and combed loopback weave.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  Structured contours and dropped shoulders that drape to act as a physical shield.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  Distressed raw edge hems symbolizing lifetime resilience and the weight of struggle.
                </span>
              </li>
            </ul>
          </div>

          {/* Learn More Link */}
          <div>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-xs font-light text-primary/80 group-hover:text-primary transition-colors tracking-widest uppercase mt-4"
            >
              <span>DESCEND FURTHER</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>

        {/* Card 3 - Faith */}
        <motion.div
          variants={cardVariants}
          className="bg-bg-card-alt rounded-2xl border border-border-theme shadow-2xl p-6 flex flex-col justify-between h-[480px] group transition-all duration-300 hover:border-primary/20"
        >
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-bg-page border border-border-theme flex items-center justify-center p-1">
                <img
                  src={getImageUrl("faith")}
                  alt="Faith Icon"
                  className="w-full h-full object-cover rounded filter contrast-125"
                />
              </div>
              <span className="text-xs font-mono text-text-muted tracking-wider">
                02
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-light text-text-page font-serif tracking-wide mb-6">
              02. Hidden Inscriptions
            </h3>

            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  Private scripture fragments printed on the interior lining of collars and hoods.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  High-density oxblood and matte black gothic calligraphy chest embroidery.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  A personal dialogue between the garment and your skin, representing silent faith.
                </span>
              </li>
            </ul>
          </div>

          {/* Learn More Link */}
          <div>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-xs font-light text-primary/80 group-hover:text-primary transition-colors tracking-widest uppercase mt-4"
            >
              <span>READ SCRIPTA</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>

        {/* Card 4 - Transcendence */}
        <motion.div
          variants={cardVariants}
          className="bg-bg-card-alt rounded-2xl border border-border-theme shadow-2xl p-6 flex flex-col justify-between h-[480px] group transition-all duration-300 hover:border-primary/20"
        >
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-bg-page border border-border-theme flex items-center justify-center p-1">
                <img
                  src={getImageUrl("transcendence")}
                  alt="Transcendence Icon"
                  className="w-full h-full object-cover rounded filter contrast-125"
                />
              </div>
              <span className="text-xs font-mono text-text-muted tracking-wider">
                03
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-light text-text-page font-serif tracking-wide mb-6">
              03. Archival Relics
            </h3>

            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  Limited production runs of exactly 64 hand-numbered replicas per silhouette.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  Custom hand-numbered leather patches and woven interior tracking codes.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-text-muted font-light leading-tight">
                  Each garment stands as a certified relic of struggle, faith, and transcendence.
                </span>
              </li>
            </ul>
          </div>

          {/* Learn More Link */}
          <div>
            <a
              href="#about"
              className="inline-flex items-center gap-2 text-xs font-light text-primary/80 group-hover:text-primary transition-colors tracking-widest uppercase mt-4"
            >
              <span>ENTER THE RITUAL</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-[-45deg] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
