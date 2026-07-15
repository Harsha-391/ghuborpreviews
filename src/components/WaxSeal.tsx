"use client";

import { motion } from "framer-motion";

interface WaxSealProps {
  className?: string;
  size?: number;
}

export default function WaxSeal({ className = "", size = 70 }: WaxSealProps) {
  return (
    <motion.div
      className={`relative select-none pointer-events-auto inline-block ${className}`}
      style={{ width: size, height: size }}
      whileHover={{ scale: 1.05, rotate: 3 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(92,6,6,0.35)]"
      >
        <defs>
          {/* Main Wax Gradient */}
          <radialGradient id="waxGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#A91B1B" />
            <stop offset="60%" stopColor="#780E0E" />
            <stop offset="100%" stopColor="#4A0505" />
          </radialGradient>

          {/* Inner Highlight/Border Gradient */}
          <linearGradient id="embossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#780E0E" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.8" />
          </linearGradient>

          {/* Shadow filter for embossing */}
          <filter id="embossShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feOffset dx="-0.5" dy="-0.5" />
            <feGaussianBlur stdDeviation="0.8" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.6" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Outer melted organic seal body */}
        <path
          d="M 50,8 
             C 65,7 72,11 83,21 
             C 93,31 95,43 92,57 
             C 89,71 85,82 73,89 
             C 61,96 49,94 37,92 
             C 25,90 14,83 9,71 
             C 4,59 5,47 11,35 
             C 17,23 25,12 37,9 
             C 42,8 46,9 50,8 Z"
          fill="url(#waxGrad)"
        />

        {/* Outer Highlight ring */}
        <path
          d="M 50,8 
             C 65,7 72,11 83,21 
             C 93,31 95,43 92,57 
             C 89,71 85,82 73,89 
             C 61,96 49,94 37,92 
             C 25,90 14,83 9,71 
             C 4,59 5,47 11,35 
             C 17,23 25,12 37,9 
             C 42,8 46,9 50,8 Z"
          fill="url(#embossGrad)"
          style={{ mixBlendMode: "overlay" }}
        />

        {/* Inner depressed stamp circle */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="#6B0C0C"
          stroke="#400404"
          strokeWidth="1.5"
          className="filter drop-shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
        />

        {/* Embossed logo glyph: Gothic Cross styled "G" shape */}
        <g
          fill="#A31818"
          stroke="#FF5555"
          strokeWidth="0.5"
          filter="url(#embossShadow)"
          className="transform translate-x-[36px] translate-y-[32px] scale-[0.7]"
        >
          {/* Vertical Bar */}
          <path d="M 16,4 H 24 V 44 H 16 Z" />
          {/* Horizontal Bar */}
          <path d="M 4,16 H 36 V 24 H 4 Z" />
          
          {/* Gothic points */}
          <path d="M 20,0 L 25,4 H 15 Z" />
          <path d="M 20,48 L 25,44 H 15 Z" />
          <path d="M 0,20 L 4,15 V 25 Z" />
          <path d="M 40,20 L 36,15 V 25 Z" />
          
          {/* Inner ring */}
          <circle cx="20" cy="20" r="6" fill="none" stroke="#FF5555" strokeWidth="1.5" />
        </g>
        
        {/* Fine highlight on inner rim */}
        <circle
          cx="50"
          cy="50"
          r="29"
          fill="none"
          stroke="#FF6666"
          strokeWidth="0.5"
          opacity="0.35"
        />
      </svg>
      
      {/* Mini verification label below seal */}
      <span className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 font-mono text-[7px] text-primary/75 tracking-[0.2em] whitespace-nowrap uppercase">
        SIGIL RELIC
      </span>
    </motion.div>
  );
}
