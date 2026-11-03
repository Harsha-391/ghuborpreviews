// Plain (non-client) module so Server Components can read the defaults.
// ImageConfigContext re-exports everything here for existing importers.
export interface ImageSlotConfig {
  label: string;
  darkUrl: string;
  lightUrl: string;
}

export type ImageConfigs = Record<string, ImageSlotConfig>;

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
