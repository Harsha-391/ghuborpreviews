import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsImage from "./CmsImage";
import heroImage from "../../public/images/hero-light.webp";
import heroImageMobile from "../../public/images/hero-mobile.webp";

// Server-rendered: the image and copy are in the first paint, nothing is
// animated in. The static import gives a build-time blur placeholder.
// Two art-directed crops: a wide group shot for desktop, a tighter portrait
// crop (same photo, centered on fewer models so prints stay legible) for
// narrow/phone screens — picked purely by CSS breakpoint, no JS.
export default function Hero() {
  return (
    <section className="relative h-screen supports-[height:100svh]:h-svh min-h-[560px] w-full overflow-hidden bg-black text-white">
      <CmsImage
        slot="hero"
        fallback={heroImage}
        alt="Six models in Ghubor graphic tees, backs turned, inside a Jaipur fort courtyard at sunset"
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={75}
        placeholder="blur"
        className="hidden object-cover object-center md:block"
      />
      <CmsImage
        slot="hero-mobile"
        fallback={heroImageMobile}
        alt="Ghubor graphic tees, backs turned, inside a Jaipur fort courtyard at sunset"
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={75}
        placeholder="blur"
        className="block object-cover object-center md:hidden"
      />

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
