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
    darkUrl: "/images/hero.webp",
    lightUrl: "/images/hero-light.webp",
  },
  struggle: {
    label: "Struggle Pillar Icon",
    darkUrl: "/images/pillars/struggle.webp",
    lightUrl: "/images/pillars/struggle-light.webp",
  },
  faith: {
    label: "Faith Pillar Icon",
    darkUrl: "/images/pillars/faith.webp",
    lightUrl: "/images/pillars/faith-light.webp",
  },
  transcendence: {
    label: "Transcendence Pillar Icon",
    darkUrl: "/images/pillars/transcendence.webp",
    lightUrl: "/images/pillars/transcendence-light.webp",
  },
  glyph: {
    label: "Signature Glyph Graphic",
    darkUrl: "/images/details/glyph.webp",
    lightUrl: "/images/details/glyph-light.webp",
  },
  tag: {
    label: "Woven Identification Tag",
    darkUrl: "/images/details/tag.webp",
    lightUrl: "/images/details/tag-light.webp",
  },
  scripture: {
    label: "Sacred Inscription Closeup",
    darkUrl: "/images/details/scripture.webp",
    lightUrl: "/images/details/scripture-light.webp",
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
      // Public pages already have a usable image set (defaults + any local cache),
      // so nothing is blocked on Firestore from here on.
      setLoading(false);

      // 2. Try Firestore if active — deferred off the critical rendering path so this
      // background sync doesn't compete with initial paint / hydration for CPU time.
      if (db) {
        const firestoreDb = db;
        const syncFromFirestore = async () => {
          try {
            const docRef = doc(firestoreDb, "configs", "theme-images");
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
        };

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
          (window as any).requestIdleCallback(syncFromFirestore, { timeout: 3000 });
        } else {
          setTimeout(syncFromFirestore, 0);
        }
      }
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
