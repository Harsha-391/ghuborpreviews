"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const words = ["Struggle.", "Faith.", "Transcendence."];

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const TARGET_COUNT = 64;

  // Preload home page assets in background
  useEffect(() => {
    const imagesToPreload = [
      "/images/hero.png",
      "/logo-white.png",
      "/images/pillars/struggle.png",
      "/images/pillars/faith.png",
      "/images/pillars/transcendence.png",
      "/images/details/glyph.png",
      "/images/details/tag.png"
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Preload background video
    const videoUrl = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4";
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = videoUrl;
    document.head.appendChild(link);

    return () => {
      try {
        document.head.removeChild(link);
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Word sequence timer (1.5s per word, total 4.5s)
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < words.length - 1) {
          return prev + 1;
        } else {
          clearInterval(wordInterval);
          setIsDone(true);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(wordInterval);
  }, []);

  // Artifact counter timer (ticks up rapidly to 64 over ~4.2s to finish just before fade out)
  useEffect(() => {
    const totalDuration = 4200;
    const intervalTime = totalDuration / TARGET_COUNT; // ~65.6ms

    const counterInterval = setInterval(() => {
      setCount((prev) => {
        if (prev < TARGET_COUNT) {
          return prev + 1;
        } else {
          clearInterval(counterInterval);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(counterInterval);
  }, []);

  // Trigger page reveal after completion
  useEffect(() => {
    if (isDone && count === TARGET_COUNT) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isDone, count, onComplete]);

  // Format count with leading zeros (e.g. 000, 045, 064)
  const formatCount = (num: number) => {
    return String(num).padStart(3, "0");
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center select-none">
      {/* Noise overlay for brand feel */}
      <div className="bg-noise absolute inset-0 opacity-[0.06] pointer-events-none" />
      
      {/* Sequence of fading words */}
      <div className="relative h-24 md:h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={wordIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-serif italic text-primary text-5xl md:text-7xl font-light tracking-wide text-center"
          >
            {words[wordIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Bottom Right Hand-Numbered Counter */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-right">
        <p className="text-[9px] text-gray-600 font-mono uppercase tracking-[0.25em] mb-1">
          GARMENT TRACE
        </p>
        <div className="font-mono text-xs md:text-sm text-primary/80 font-light tracking-wider">
          <span>{formatCount(count)}</span>
          <span className="text-gray-700 mx-1.5">/</span>
          <span className="text-gray-500">064</span>
        </div>
      </div>
    </div>
  );
}
