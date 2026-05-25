import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export default function WordsPullUp({ text, className = "", showAsterisk = false }: WordsPullUpProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.h1
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline-flex flex-wrap justify-center select-none ${className}`}
    >
      {words.map((word, idx) => {
        const isLastWord = idx === words.length - 1;
        return (
          <span
            key={idx}
            className="relative inline-block mr-[0.25em] last:mr-0"
          >
            <motion.span
              variants={wordVariants}
              className="inline-block relative"
            >
              {word}
              {isLastWord && showAsterisk && (
                <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] text-primary select-none font-sans font-light">
                  *
                </span>
              )}
            </motion.span>
          </span>
        );
      })}
    </motion.h1>
  );
}
