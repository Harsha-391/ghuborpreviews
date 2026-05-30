"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface AnimatedWordProps {
  word: string;
  index: number;
  totalWords: number;
  progress: MotionValue<number>;
}

export default function AnimatedWord({ word, index, totalWords, progress }: AnimatedWordProps) {
  const wordProgress = index / totalWords;
  const start = Math.max(0, wordProgress - 0.15);
  const end = Math.min(1, wordProgress + 0.05);

  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block mr-1.5 last:mr-0 transition-colors duration-150"
    >
      {word}
    </motion.span>
  );
}
