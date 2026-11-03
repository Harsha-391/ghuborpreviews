"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useAuth } from "./AuthContext";

interface NavbarProps {
  /**
   * "transparent" floats over a hero and turns solid once the element marked
   * `data-header-sentinel` scrolls under the header. "solid" is for every other page.
   */
  variant?: "transparent" | "solid";
  /** @deprecated Ignored. Kept so pages that still pass it keep compiling. */
  absolute?: boolean;
}

const ICON = { size: 18, strokeWidth: 1.5 } as const;

// Opening: visibility flips immediately (so focus() works on the first frame)
// and only opacity fades. Closing: visibility is transitioned too, so the
// element stays visible until the fade-out has finished.
function overlayState(open: boolean) {
  return open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]";
}

function readCounts() {
  try {
    const wishlist = JSON.parse(localStorage.getItem("ghubor-wishlist") || "[]");
    const cart = JSON.parse(localStorage.getItem("ghubor-cart") || "[]");
    return {
      wishlist: Array.isArray(wishlist) ? wishlist.length : 0,
      cart: Array.isArray(cart) ? cart.reduce((acc: number, item: { qty?: number }) => acc + (item.qty || 0), 0) : 0,
    };
  } catch {
    return { wishlist: 0, cart: 0 };
  }
}

export default function Navbar({ variant = "solid" }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [counts, setCounts] = useState({ wishlist: 0, cart: 0 });
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Badge counts come from localStorage and are refreshed by the store events.
  useEffect(() => {
    const update = () => setCounts(readCounts());
    update();
    window.addEventListener("wishlist-updated", update);
    window.addEventListener("cart-updated", update);
    return () => {
      window.removeEventListener("wishlist-updated", update);
      window.removeEventListener("cart-updated", update);
    };
  }, []);

  // Transparent → solid without scroll listeners: one observer on a sentinel
  // near the bottom of the hero; state only changes when it crosses the header.
  useEffect(() => {
    if (variant !== "transparent") return;
    const sentinel = document.querySelector("[data-header-sentinel]");
    if (!sentinel) {
      setPastHero(true);
      return;
    }
    const headerH = window.matchMedia("(min-width: 768px)").matches ? 80 : 64;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < headerH),
      { rootMargin: `-${headerH}px 0px 0px 0px` }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [variant]);

  // Overlays: Escape closes, page scroll is locked while one is open.
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Close overlays on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const solid = variant === "solid" || pastHero || menuOpen;
  const accountHref = user ? "/profile" : "/login";
  const accountLabel = user ? "Account" : "Sign in";

  const iconBtn = `relative h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full ring-1 ring-inset transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current ${
    solid
      ? "bg-black/[0.04] ring-black/[0.08] hover:bg-black/[0.08]"
      : "bg-white/10 ring-white/[0.18] hover:bg-white/20"
  }`;

  const textLink = (href: string) =>
    `text-[11px] tracking-[0.25em] uppercase py-2 underline-offset-[10px] decoration-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${
      pathname === href ? "underline" : ""
    }`;

  const mobileLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: user ? "Covenant" : "Sign In", href: accountHref },
    { name: "Wishlist", href: "/wishlist" },
    { name: `Cart${counts.cart > 0 ? ` (${counts.cart})` : ""}`, href: "/cart" },
  ];

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/shop?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header
        data-state={solid ? "solid" : "transparent"}
        className={`fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b select-none transition-colors duration-200 ${
          solid ? "bg-white text-black border-border-theme" : "bg-transparent text-white border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-4 px-3 md:px-5"
        >
          {/* Left: links (desktop) / menu toggle (mobile) */}
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`${iconBtn} inline-flex md:hidden`}
            >
              {menuOpen ? <X {...ICON} /> : <Menu {...ICON} />}
            </button>
            <Link href="/shop" className={`hidden md:inline ${textLink("/shop")}`}>
              Shop
            </Link>
            <Link href="/about" className={`hidden md:inline ${textLink("/about")}`}>
              About
            </Link>
          </div>

          {/* Center: logo. Both variants are stacked so the switch is an opacity change, not a new download. */}
          <Link href="/" aria-label="Ghubor home" className="relative block h-12 w-[72px] md:h-16 md:w-24">
            <Image
              src="/logo-white.svg"
              alt=""
              fill
              priority={variant === "transparent"}
              sizes="96px"
              className={`object-contain transition-opacity duration-200 ${solid ? "opacity-0" : "opacity-100"}`}
            />
            <Image
              src="/logo-black.svg"
              alt=""
              fill
              priority={variant === "solid"}
              sizes="96px"
              className={`object-contain transition-opacity duration-200 ${solid ? "opacity-100" : "opacity-0"}`}
            />
          </Link>

          {/* Right: hanging icon cluster, sitting a few px below the link baseline. */}
          <div className="flex items-center justify-end gap-1.5 md:translate-y-1 md:gap-2">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className={`${iconBtn} inline-flex`}>
              <Search {...ICON} />
            </button>
            <Link href={accountHref} aria-label={accountLabel} className={`${iconBtn} hidden md:inline-flex`}>
              <User {...ICON} />
            </Link>
            <Link
              href="/wishlist"
              aria-label={counts.wishlist > 0 ? `Wishlist, ${counts.wishlist} saved` : "Wishlist"}
              className={`${iconBtn} hidden md:inline-flex`}
            >
              <Heart {...ICON} />
              {counts.wishlist > 0 && (
                <span aria-hidden className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${counts.cart} ${counts.cart === 1 ? "item" : "items"}`}
              className={`${iconBtn} inline-flex !w-auto gap-1.5 px-3 md:px-3.5`}
            >
              <ShoppingBag {...ICON} />
              <span className="min-w-[1ch] text-[11px] leading-none tabular-nums">{counts.cart}</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Solid pages reserve the header's height so content never sits under it. */}
      {variant === "solid" && <div aria-hidden className="h-[var(--header-h)]" />}

      {/* Mobile menu: full-screen white sheet under the header, opacity only. */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`fixed inset-0 z-40 flex flex-col bg-white px-6 pb-10 pt-[calc(var(--header-h)+2.5rem)] duration-200 md:hidden ${overlayState(menuOpen)}`}
      >
        <ul className="flex flex-col gap-5">
          {mobileLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`font-serif italic text-4xl font-light leading-tight ${
                  pathname === link.href ? "text-primary" : "text-black"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-auto border-t border-border-theme pt-5 text-center text-[10px] uppercase tracking-[0.25em] text-text-dim">
          GHUBOR © 2026. FOR THE MODERN GIBBOR.
        </p>
      </div>

      {/* Search overlay: opacity only, keeps the /shop?q= behaviour. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        aria-hidden={!searchOpen}
        inert={!searchOpen}
        className={`fixed inset-0 z-[60] bg-white duration-150 ${overlayState(searchOpen)}`}
      >
        <div className="flex h-[var(--header-h)] items-center justify-end px-3 md:px-5">
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] ring-1 ring-inset ring-black/[0.08] hover:bg-black/[0.08] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <X {...ICON} />
          </button>
        </div>
        <form onSubmit={submitSearch} className="mx-auto mt-[12vh] max-w-3xl px-6">
          <label htmlFor="site-search" className="mb-4 block text-[11px] uppercase tracking-[0.3em] text-primary">
            Search
          </label>
          <div className="flex items-center gap-4 border-b border-black pb-3">
            <Search {...ICON} className="shrink-0 text-black/50" />
            <input
              ref={searchInputRef}
              id="site-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the drop"
              className="w-full bg-transparent font-serif italic text-3xl md:text-5xl font-light text-black outline-none placeholder:text-black/25"
            />
          </div>
        </form>
      </div>
    </>
  );
}
