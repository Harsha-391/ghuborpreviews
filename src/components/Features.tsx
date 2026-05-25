import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight } from "lucide-react";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle";

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

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
      className="min-h-screen bg-black relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none flex flex-col justify-center"
    >
      {/* Subtle background noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.12] pointer-events-none z-0" />
      
      {/* Oxblood background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/10 rounded-full blur-[150px] pointer-events-none z-0" />

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
          className="relative h-[480px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl flex flex-col justify-end p-6 group"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="noise-overlay absolute inset-0 opacity-[0.3] mix-blend-overlay pointer-events-none" />
          </div>

          {/* Card Content */}
          <div className="relative z-10">
            <span className="text-[10px] font-mono text-primary/60 tracking-widest block mb-2 uppercase">
              Artifact Showcase
            </span>
            <h3 className="font-blackletter text-2xl sm:text-3xl text-[#E1E0CC] font-light leading-none">
              Sacred silhouettes.
            </h3>
          </div>
        </motion.div>

        {/* Card 2 - Struggle */}
        <motion.div
          variants={cardVariants}
          className="bg-[#120b0b] rounded-2xl border border-white/5 shadow-2xl p-6 flex flex-col justify-between h-[480px] group transition-all duration-300 hover:border-primary/20"
        >
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-1">
                <img
                  src="/images/pillars/struggle.png"
                  alt="Struggle Icon"
                  className="w-full h-full object-cover rounded filter contrast-125"
                />
              </div>
              <span className="text-xs font-mono text-primary/50 tracking-wider">
                01
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-light text-[#E1E0CC] font-serif tracking-wide mb-6">
              Struggle.
            </h3>

            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  The weight of being human: grief, doubt, and the silent, unseen war.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  Armor forged to protect the soul from external battles.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  Premium oxblood canvas representing earthly struggle.
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
          className="bg-[#120b0b] rounded-2xl border border-white/5 shadow-2xl p-6 flex flex-col justify-between h-[480px] group transition-all duration-300 hover:border-primary/20"
        >
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-1">
                <img
                  src="/images/pillars/faith.png"
                  alt="Faith Icon"
                  className="w-full h-full object-cover rounded filter contrast-125"
                />
              </div>
              <span className="text-xs font-mono text-primary/50 tracking-wider">
                02
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-light text-[#E1E0CC] font-serif tracking-wide mb-6">
              Faith.
            </h3>

            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  Belief without proof: the quiet rituals that hold us upright.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  Wearable scripture fragments printed as private journal entries.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  Deep navy stitches representing sacred devotion and trust.
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
          className="bg-[#120b0b] rounded-2xl border border-white/5 shadow-2xl p-6 flex flex-col justify-between h-[480px] group transition-all duration-300 hover:border-primary/20"
        >
          <div>
            {/* Icon Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-1">
                <img
                  src="/images/pillars/transcendence.png"
                  alt="Transcendence Icon"
                  className="w-full h-full object-cover rounded filter contrast-125"
                />
              </div>
              <span className="text-xs font-mono text-primary/50 tracking-wider">
                03
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-light text-[#E1E0CC] font-serif tracking-wide mb-6">
              Transcendence.
            </h3>

            {/* Checklist */}
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  Rising above the flesh: the moment the armor becomes skin.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  The signature Gibbor mark appearing on each final artifact.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span className="text-xs text-gray-400 font-light leading-tight">
                  Hand-numbered tag verifying origin, rendering it unique.
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
