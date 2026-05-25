import { motion, MotionValue, useTransform } from "framer-motion";

interface AnimatedLetterProps {
  char: string;
  index: number;
  totalChars: number;
  progress: MotionValue<number>;
}

export default function AnimatedLetter({ char, index, totalChars, progress }: AnimatedLetterProps) {
  const charProgress = index / totalChars;
  const start = charProgress - 0.1;
  const end = charProgress + 0.05;

  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  // Use non-breaking space for spaces to ensure correct wrapping and spacing
  const displayChar = char === " " ? "\u00A0" : char;

  return (
    <motion.span
      style={{ opacity }}
      className="inline-block transition-colors duration-150"
    >
      {displayChar}
    </motion.span>
  );
}
