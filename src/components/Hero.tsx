import Link from "next/link";
import { getImageProps, type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import heroImage from "../../public/images/hero-light.webp";
import heroImageMobile from "../../public/images/hero-mobile.webp";
import { DEFAULT_IMAGE_CONFIGS } from "../utils/imageDefaults";
import { getImageConfigs } from "../utils/serverImageConfig";

const WIDE = "(min-width: 768px)";
const NARROW = "(max-width: 767.98px)";

// Server-rendered: the image and copy are in the first paint, nothing is
// animated in. Two art-directed crops in one <picture>: a wide group shot for
// desktop and a tighter portrait crop for phones. The browser downloads only
// the one that matches the screen, and each is preloaded only for its own
// media query. An image the admin has set for a slot (read on the server, see
// serverImageConfig.ts) replaces the bundled one for that slot.
export default async function Hero() {
  const configs = await getImageConfigs();
  const pick = (slot: string, bundled: StaticImageData) => {
    const url = configs[slot]?.lightUrl;
    return url && url !== DEFAULT_IMAGE_CONFIGS[slot]?.lightUrl ? url : bundled;
  };
  const common = {
    alt: "Ghubor graphic tees, backs turned, inside a Jaipur fort courtyard at sunset",
    fill: true,
    sizes: "100vw",
    quality: 75,
    priority: true,
    fetchPriority: "high" as const,
  };
  const { props: wide } = getImageProps({ ...common, src: pick("hero", heroImage) });
  const { props: narrow } = getImageProps({ ...common, src: pick("hero-mobile", heroImageMobile) });

  return (
    <section className="relative h-screen supports-[height:100svh]:h-svh min-h-[560px] w-full overflow-hidden bg-black text-white">
      <link rel="preload" as="image" imageSrcSet={wide.srcSet} imageSizes="100vw" media={WIDE} fetchPriority="high" />
      <link rel="preload" as="image" imageSrcSet={narrow.srcSet} imageSizes="100vw" media={NARROW} fetchPriority="high" />
      <picture>
        <source media={WIDE} srcSet={wide.srcSet} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element -- getImageProps output; <picture> needs a plain <img> */}
        <img {...narrow} alt={common.alt} className="object-cover object-center" />
      </picture>

      {/* Legibility scrims: top for the transparent header, bottom for the copy. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/45 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent_50%)]" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-8 px-6 pb-10 text-center md:flex-row md:items-end md:justify-between md:px-10 md:pb-14 md:text-left">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-white/80">
            New Drop <span className="mx-2 text-white/40">/</span> SS26
          </p>
          <h1 className="max-w-2xl font-sans text-4xl font-bold uppercase leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Wear the Statement
          </h1>
          <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/70">
            Beast <span className="mx-2 text-primary">·</span> Dominion of Death
          </p>
        </div>
        <Link
          href="/shop"
          className="group inline-flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-white transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Shop the Collection
          <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Header turns solid once this passes under it (~80% down the hero). */}
      <div data-header-sentinel aria-hidden className="pointer-events-none absolute left-0 top-[80%] h-px w-px" />
    </section>
  );
}
