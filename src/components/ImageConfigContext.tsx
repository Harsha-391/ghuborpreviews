"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useTheme } from "./ThemeContext";

export interface ImageSlotConfig {
  label: string;
  darkUrl: string;
  lightUrl: string;
}

export type ImageConfigs = Record<string, ImageSlotConfig>;

interface ImageConfigContextType {
  configs: ImageConfigs;
  getImageUrl: (id: string, fallback?: string) => string;
  updateImageConfig: (id: string, theme: "light" | "dark", url: string) => Promise<void>;
  saveAllConfigs: (newConfigs: ImageConfigs) => Promise<void>;
  resetToDefault: () => void;
  loading: boolean;
}

const ImageConfigContext = createContext<ImageConfigContextType | undefined>(undefined);

export const DEFAULT_IMAGE_CONFIGS: ImageConfigs = {
  hero: {
    label: "Hero Background Image",
    darkUrl: "/images/hero.png",
    lightUrl: "/images/hero-light.png",
  },
  struggle: {
    label: "Struggle Pillar Icon",
    darkUrl: "/images/pillars/struggle.png",
    lightUrl: "/images/pillars/struggle-light.png",
  },
  faith: {
    label: "Faith Pillar Icon",
    darkUrl: "/images/pillars/faith.png",
    lightUrl: "/images/pillars/faith-light.png",
  },
  transcendence: {
    label: "Transcendence Pillar Icon",
    darkUrl: "/images/pillars/transcendence.png",
    lightUrl: "/images/pillars/transcendence-light.png",
  },
  glyph: {
    label: "Signature Glyph Graphic",
    darkUrl: "/images/details/glyph.png",
    lightUrl: "/images/details/glyph-light.png",
  },
  tag: {
    label: "Woven Identification Tag",
    darkUrl: "/images/details/tag.png",
    lightUrl: "/images/details/tag-light.png",
  },
  scripture: {
    label: "Sacred Inscription Closeup",
    darkUrl: "/images/details/scripture.png",
    lightUrl: "/images/details/scripture-light.png",
  },
  "product-hoodie": {
    label: "Sacred Shield Hoodie Image",
    darkUrl: "/images/products/hoodie.png",
    lightUrl: "/images/products/hoodie-light.png",
  },
  "product-jacket": {
    label: "Silent Battle Field Jacket Image",
    darkUrl: "/images/products/jacket.png",
    lightUrl: "/images/products/jacket-light.png",
  },
  "product-longsleeve": {
    label: "Modern Gibbor Mockneck Image",
    darkUrl: "/images/products/longsleeve.png",
    lightUrl: "/images/products/longsleeve-light.png",
  },
  "product-pants": {
    label: "Sanctuary Work Pants Image",
    darkUrl: "/images/products/pants.png",
    lightUrl: "/images/products/pants-light.png",
  },
  "product-tshirt": {
    label: "Scripture Fragment Tee Image",
    darkUrl: "/images/products/tshirt.png",
    lightUrl: "/images/products/tshirt-light.png",
  },
  "product-tshirt-back": {
    label: "Scripture Fragment Tee Back Image",
    darkUrl: "/images/products/tshirt-back.png",
    lightUrl: "/images/products/tshirt-back-light.png",
  },
  "product-hoodie-back": {
    label: "Sacred Shield Hoodie Back Image",
    darkUrl: "/images/products/hoodie-back.png",
    lightUrl: "/images/products/hoodie-back-light.png",
  },
  "product-jacket-back": {
    label: "Silent Battle Field Jacket Back Image",
    darkUrl: "/images/products/jacket-back.png",
    lightUrl: "/images/products/jacket-back-light.png",
  },
  "product-longsleeve-back": {
    label: "Modern Gibbor Mockneck Back Image",
    darkUrl: "/images/products/longsleeve-back.png",
    lightUrl: "/images/products/longsleeve-back-light.png",
  },
  "product-cap": {
    label: "Faith Calligraphy Cap Image",
    darkUrl: "/images/products/cap.png",
    lightUrl: "/images/products/cap-light.png",
  },
};

export function ImageConfigProvider({ children }: { children: React.ReactNode }) {
  const [configs, setConfigs] = useState<ImageConfigs>(DEFAULT_IMAGE_CONFIGS);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  // Load configs on mount
  useEffect(() => {
    const loadConfigs = async () => {
      // 1. Try to load from LocalStorage first (instant render)
      let stored: ImageConfigs | null = null;
      if (typeof window !== "undefined") {
        const storedStr = localStorage.getItem("ghubor-image-configs");
        if (storedStr) {
          try {
            stored = JSON.parse(storedStr);
          } catch (e) {
            console.error("Error parsing local image configs:", e);
          }
        }
      }

      if (stored) {
        setConfigs({ ...DEFAULT_IMAGE_CONFIGS, ...stored });
      }

      // 2. Try Firestore if active
      if (db) {
        try {
          const docRef = doc(db, "configs", "theme-images");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as ImageConfigs;
            const merged = { ...DEFAULT_IMAGE_CONFIGS, ...data };
            setConfigs(merged);
            if (typeof window !== "undefined") {
              localStorage.setItem("ghubor-image-configs", JSON.stringify(merged));
            }
          }
        } catch (err) {
          console.warn("Firestore image configs retrieval failed, relying on local state:", err);
        }
      }
      setLoading(false);
    };

    loadConfigs();
  }, []);

  const getImageUrl = (id: string, fallback?: string): string => {
    const config = configs[id];
    if (!config) return fallback || "";
    return theme === "light" ? config.lightUrl : config.darkUrl;
  };

  const updateImageConfig = async (id: string, t: "light" | "dark", url: string) => {
    const updated = {
      ...configs,
      [id]: {
        ...configs[id],
        [t === "light" ? "lightUrl" : "darkUrl"]: url,
      },
    };

    setConfigs(updated);

    // Save to LocalStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("ghubor-image-configs", JSON.stringify(updated));
    }

    // Save to Firestore
    if (db) {
      try {
        const docRef = doc(db, "configs", "theme-images");
        await setDoc(docRef, updated);
      } catch (err) {
        console.error("Firestore image config save failed:", err);
      }
    }
  };

  const saveAllConfigs = async (newConfigs: ImageConfigs) => {
    setConfigs(newConfigs);

    // Save to LocalStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("ghubor-image-configs", JSON.stringify(newConfigs));
    }

    // Save to Firestore
    if (db) {
      try {
        const docRef = doc(db, "configs", "theme-images");
        await setDoc(docRef, newConfigs);
      } catch (err) {
        console.error("Firestore save failed:", err);
      }
    }
  };

  const resetToDefault = () => {
    setConfigs(DEFAULT_IMAGE_CONFIGS);
    if (typeof window !== "undefined") {
      localStorage.removeItem("ghubor-image-configs");
    }
    // Async save back to Firestore if available
    if (db) {
      const docRef = doc(db, "configs", "theme-images");
      setDoc(docRef, DEFAULT_IMAGE_CONFIGS).catch((err) =>
        console.error("Firestore reset failed:", err)
      );
    }
  };

  return (
    <ImageConfigContext.Provider
      value={{
        configs,
        getImageUrl,
        updateImageConfig,
        saveAllConfigs,
        resetToDefault,
        loading,
      }}
    >
      {children}
    </ImageConfigContext.Provider>
  );
}

export function useImageConfig() {
  const context = useContext(ImageConfigContext);
  if (context === undefined) {
    throw new Error("useImageConfig must be used within an ImageConfigProvider");
  }
  return context;
}
