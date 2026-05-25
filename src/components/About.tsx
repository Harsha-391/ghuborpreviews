import { useRef } from "react";
import { useScroll } from "framer-motion";
import WordsPullUpMultiStyle from "./WordsPullUpMultiStyle";
import AnimatedLetter from "./AnimatedLetter";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the About card container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const headingSegments = [
    {
      text: "Derived from the Hebrew Gibbor, ",
      className: "text-[#E1E0CC] font-light",
    },
    {
      text: "a mighty warrior, hero, ",
      className: "text-primary font-serif italic tracking-wide",
    },
    {
      text: "Ghubor makes wearable scripture for people fighting battles nobody sees.",
      className: "text-[#E1E0CC] font-light",
    },
  ];

  // Adapted body text based on Ghubor's brand guidelines
  const bodyText =
    "Every piece going forward carries three signatures so a Ghubor is recognizable across a crowded street: gothic blackletter typography, an oxblood or deep crimson palette, dense scripture-like body copy, a signature glyph, and a hand-numbered tag inside. Each piece is an artifact, a testament of struggle, faith, and transcendence. Built for the modern Gibbor. Designed to feel like armor, bound to become skin.";

  const characters = bodyText.split("");

  return (
    <section
      id="about"
      className="bg-black py-20 px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* Inner Card */}
      <div
        ref={containerRef}
        className="bg-[#101010] rounded-3xl p-8 sm:p-12 md:p-16 max-w-6xl mx-auto border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Subtle Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-950/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-950/10 rounded-full blur-[80px]" />

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

        {/* Progressive Scroll Character Reveal */}
        <div className="max-w-3xl mx-auto text-center leading-relaxed">
          <p className="text-[#DEDBC8]/90 text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-wide inline">
            {characters.map((char, index) => (
              <AnimatedLetter
                key={index}
                char={char}
                index={index}
                totalChars={characters.length}
                progress={scrollYProgress}
              />
            ))}
          </p>
        </div>

        {/* Brand Foundation Emotional Pillars Summary Icons (Visual layout touch) */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16 text-center border-t border-white/5 pt-8">
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-primary/70 tracking-widest uppercase">Struggle</h4>
            <p className="text-[8px] sm:text-[10px] text-gray-500 font-light mt-1 uppercase tracking-wider">The weight of human</p>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-primary/70 tracking-widest uppercase">Faith</h4>
            <p className="text-[8px] sm:text-[10px] text-gray-500 font-light mt-1 uppercase tracking-wider">Belief without proof</p>
          </div>
          <div>
            <h4 className="text-[10px] sm:text-xs font-semibold text-primary/70 tracking-widest uppercase">Transcendence</h4>
            <p className="text-[8px] sm:text-[10px] text-gray-500 font-light mt-1 uppercase tracking-wider">Armor becomes skin</p>
          </div>
        </div>

      </div>
    </section>
  );
}
