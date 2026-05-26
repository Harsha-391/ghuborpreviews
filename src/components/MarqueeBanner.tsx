import React from "react";

export default function MarqueeBanner() {
  const items = [
    "ARCHIVAL SALE ACTIVE",
    "USE CODE: GIBBOR10 FOR 10% OFF",
    "WEARABLE SCRIPTURE",
    "USE CODE: SACRED15 FOR 15% OFF",
    "FIGHTING BATTLES NOBODY SEES",
    "LIMITED ARTIFACT DROP",
  ];

  const repeatItems = (
    <div className="flex shrink-0 justify-around gap-12 min-w-full">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-6 text-[9px] sm:text-xs font-light tracking-[0.25em] uppercase text-primary/90">
          <span>{item}</span>
          <span className="text-[#5C0606] text-xs select-none">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[#080202] border-b border-white/5 py-2 overflow-hidden select-none relative z-[100] flex">
      {/* Subtle background noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.05] pointer-events-none" />
      
      <div className="flex animate-marquee whitespace-nowrap">
        {repeatItems}
        {repeatItems}
      </div>
    </div>
  );
}
