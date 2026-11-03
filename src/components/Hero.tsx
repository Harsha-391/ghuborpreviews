import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CmsImage from "./CmsImage";
import heroImage from "../../public/images/hero-light.webp";

// Server-rendered: the image and copy are in the first paint, nothing is
// animated in. The static import gives a build-time blur placeholder.
export default function Hero() {
  return (
    <section className="relative h-screen supports-[height:100svh]:h-svh min-h-[560px] w-full overflow-hidden bg-black text-white">
      <CmsImage
        slot="hero"
        fallback={heroImage}
        alt="Draped linen garment on a stone figure, Ghubor Covenant Drop I"
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={75}
        placeholder="blur"
        className="object-cover object-center"
      />

      {/* Legibility scrims: top for the transparent header, bottom for the copy. */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/45 to-transparent" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent_50%)]" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-14 text-center md:items-start md:px-5 md:pb-20 md:text-left">
        <p className="mb-5 text-[11px] uppercase tracking-[0.35em] text-white/80">COVENANT DROP I</p>
        <h1 className="max-w-3xl font-serif text-4xl font-light italic leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
          Armor for the modern Gibbor. Wearable scripture.
        </h1>
        <Link
          href="/shop"
          className="group mt-9 inline-flex items-center gap-5 rounded-full bg-primary py-2 pl-6 pr-2 text-[11px] font-bold tracking-[0.25em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span>ENTER THE RITUAL</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-primary">
            <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      {/* Header turns solid once this passes under it (~80% down the hero). */}
      <div data-header-sentinel aria-hidden className="pointer-events-none absolute left-0 top-[80%] h-px w-px" />
    </section>
  );
}
