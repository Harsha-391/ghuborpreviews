"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadFirebase, whenIdle } from "../utils/loadFirebase";
import { DEFAULT_IMAGE_CONFIGS, type ImageConfigs } from "../utils/imageDefaults";

export { DEFAULT_IMAGE_CONFIGS } from "../utils/imageDefaults";
export type { ImageConfigs, ImageSlotConfig } from "../utils/imageDefaults";

interface ImageConfigContextType {
  configs: ImageConfigs;
  getImageUrl: (id: string, fallback?: string) => string;
  updateImageConfig: (id: string, theme: "light" | "dark", url: string) => Promise<void>;
  saveAllConfigs: (newConfigs: ImageConfigs) => Promise<void>;
  resetToDefault: () => void;
  loading: boolean;
}

const ImageConfigContext = createContext<ImageConfigContextType | undefined>(undefined);

// First render (server + hydration) now uses the real Firestore-backed
// configs whenever the server-side fetch in layout.tsx succeeded (see
// `initialConfigs`) — the admin's actual hero/pillar/detail images are
// already in the HTML, no flash, no crossfade needed for the common case.
// DEFAULT_IMAGE_CONFIGS only still matters as a last-resort fallback for a
// slot Firestore has never had, or if that server-side fetch itself failed.
export function ImageConfigProvider({
  children,
  initialConfigs,
}: {
  children: React.ReactNode;
  initialConfigs?: ImageConfigs;
}) {
  const [configs, setConfigs] = useState<ImageConfigs>(
    initialConfigs ? { ...DEFAULT_IMAGE_CONFIGS, ...initialConfigs } : DEFAULT_IMAGE_CONFIGS
  );
  const [loading, setLoading] = useState(!initialConfigs);

  // Load configs on mount
  useEffect(() => {
    const loadConfigs = async () => {
      // 1. Try to load from LocalStorage first (instant render) — only
      // matters when the server-side fetch didn't already give us data.
      let stored: ImageConfigs | null = null;
      if (!initialConfigs && typeof window !== "undefined") {
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
      // Public pages already have a usable image set (server-fetched Firestore
      // data, or defaults + any local cache), so nothing is blocked here.
      setLoading(false);

      // 2. Try Firestore if active — deferred off the critical rendering path so this
      // background sync doesn't compete with initial paint / hydration for CPU time.
      {
        const syncFromFirestore = async () => {
          try {
            const { fs, db } = await loadFirebase();
            if (!db) return;
            const docRef = fs.doc(db, "configs", "theme-images");
            const docSnap = await fs.getDoc(docRef);
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

        whenIdle(syncFromFirestore, 3000);
      }
    };

    loadConfigs();
  }, []);

  // Light-only site: always resolve the light variant.
  const getImageUrl = useCallback(
    (id: string, fallback?: string): string => {
      const config = configs[id];
      if (!config) return fallback || "";
      return config.lightUrl || fallback || "";
    },
    [configs]
  );

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
    const { fs, db } = await loadFirebase();
    if (db) {
      try {
        const docRef = fs.doc(db, "configs", "theme-images");
        await fs.setDoc(docRef, updated);
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
    const { fs, db } = await loadFirebase();
    if (db) {
      try {
        const docRef = fs.doc(db, "configs", "theme-images");
        await fs.setDoc(docRef, newConfigs);
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
    loadFirebase()
      .then(({ fs, db }) => {
        if (!db) return;
        return fs.setDoc(fs.doc(db, "configs", "theme-images"), DEFAULT_IMAGE_CONFIGS);
      })
      .catch((err) => console.error("Firestore reset failed:", err));
  };

  const value = useMemo(
    () => ({ configs, getImageUrl, updateImageConfig, saveAllConfigs, resetToDefault, loading }),
    // The mutators close over `configs`, so they only change when it does.
    [configs, getImageUrl, loading]
  );

  return (
    <ImageConfigContext.Provider value={value}>
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
