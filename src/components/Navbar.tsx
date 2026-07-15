"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, Info, Store, User, Sun, Moon, Search } from "lucide-react";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

interface NavbarProps {
  absolute?: boolean;
}

export default function Navbar({ absolute = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const updateCounts = () => {
      if (typeof window !== "undefined") {
        const wishlist = localStorage.getItem("ghubor-wishlist");
        const cart = localStorage.getItem("ghubor-cart");

        const wishlistItems = wishlist ? JSON.parse(wishlist) : [];
        setWishlistCount(wishlistItems.length);

        const cartItems = cart ? JSON.parse(cart) : [];
        const totalItems = cartItems.reduce((acc: number, item: any) => acc + item.qty, 0);
        setCartCount(totalItems);
      }
    };

    updateCounts();

    window.addEventListener("wishlist-updated", updateCounts);
    window.addEventListener("cart-updated", updateCounts);

    return () => {
      window.removeEventListener("wishlist-updated", updateCounts);
      window.removeEventListener("cart-updated", updateCounts);
    };
  }, []);

  const navLinks = [
    { id: "shop", name: "Shop", href: "/shop", icon: Store },
    { id: "about", name: "About", href: "/about", icon: Info },
    { id: "auth", name: user ? "Covenant" : "Sign In", href: user ? "/profile" : "/login", icon: User },
    { id: "wishlist", name: "Wishlist", href: "/wishlist", icon: Heart, badge: wishlistCount > 0 },
    { id: "cart", name: "Cart", href: "/cart", icon: ShoppingBag, count: cartCount },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav
        className={`${absolute
            ? "absolute top-0 left-0 right-0 bg-gradient-to-b from-bg-page/80 via-bg-page/40 to-transparent border-b border-border-theme"
            : "relative bg-bg-nav border-b border-border-theme"
          } z-[999] w-full bg-bg-nav/90 backdrop-blur-md px-6 py-4 md:px-12 flex items-center justify-between transition-all duration-300 select-none`}
      >
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src={theme === "light" ? "/logo-black.svg" : "/logo-white.svg"}
            alt="Ghubor Logo"
            className="h-8 sm:h-9 md:h-10 object-contain transition-all duration-300 hover:scale-105"
          />
        </Link>

        {/* DESKTOP LINKS (Monospace styling with active underline indicator) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`font-mono text-[10px] lg:text-xs tracking-[0.25em] uppercase transition-all duration-300 relative py-1.5 flex items-center gap-2 ${isActive ? "text-primary font-medium" : "text-text-muted hover:text-primary"
                  }`}
              >
                <span>{link.name}</span>
                {link.id === "wishlist" && link.badge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(222,219,200,0.6)] animate-pulse" />
                )}
                {link.id === "cart" && link.count !== undefined && link.count > 0 && (
                  <span className="px-1.5 py-0.5 text-[8px] font-mono leading-none bg-primary text-bg-page rounded-full font-bold shadow-[0_0_6px_rgba(222,219,200,0.3)]">
                    {link.count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-[-3px] left-0 right-0 h-[1px] bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-bg-card-alt text-text-muted hover:text-primary transition-all duration-300 cursor-pointer bg-transparent border-none outline-none"
            aria-label="Toggle Search Bar"
          >
            <Search className="w-4.5 h-4.5 text-primary" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-bg-card-alt text-text-muted hover:text-primary transition-all duration-300 cursor-pointer bg-transparent border-none outline-none"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5 text-primary" /> : <Moon className="w-4.5 h-4.5 text-primary" />}
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON & THEME TOGGLE */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-primary hover:text-white p-1.5 cursor-pointer transition-colors bg-transparent border-none outline-none"
            aria-label="Toggle Search Bar"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={toggleTheme}
            className="text-primary hover:text-white p-1.5 cursor-pointer transition-colors bg-transparent border-none outline-none"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="text-primary hover:text-white p-1.5 cursor-pointer transition-colors bg-transparent border-none outline-none"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE MENU OVERLAY (Full-width Dropdown) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 w-full bg-bg-nav/98 backdrop-blur-xl border-t border-b border-border-theme p-6 shadow-2xl md:hidden z-[1000] flex flex-col gap-6"
            >
              {/* Header / Brand label inside mobile menu */}
              <div className="flex justify-between items-center border-b border-border-theme pb-3">
                <span className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase">
                  SANCTUARY MENU
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>

              {/* Navigation links */}
              <div className="flex flex-col gap-3">
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all ${isActive
                            ? "bg-accent/10 border-primary/20 text-primary font-semibold"
                            : "bg-transparent border-transparent text-text-page/80 hover:text-primary hover:bg-bg-card-alt"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <Icon className="w-4 h-4 text-primary/60" />
                          <span className="text-xs font-mono tracking-widest uppercase">{link.name}</span>
                        </div>
                        {link.id === "wishlist" && link.badge && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--color-primary)] animate-pulse" />
                        )}
                        {link.id === "cart" && link.count !== undefined && link.count > 0 && (
                          <span className="px-2 py-0.5 text-[9px] font-mono leading-none bg-primary text-bg-page rounded-full font-bold shadow-[0_0_6px_rgba(222,219,200,0.4)]">
                            {link.count}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom brand footer inside mobile menu */}
              <div className="border-t border-border-theme pt-4 text-center">
                <p className="text-[8px] text-text-dim font-mono tracking-widest uppercase">
                  GHUBOR © 2026. FOR THE MODERN GIBBOR.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Sliding Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-bg-nav border-b border-border-theme px-6 py-4 md:px-12 flex items-center justify-between z-[998] relative"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                  setShowSearch(false);
                }
              }}
              className="w-full max-w-3xl mx-auto flex items-center gap-3 relative"
            >
              <Search className="w-5 h-5 text-primary/75 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH SANCTUARY DROP ARTIFACTS..."
                className="w-full bg-bg-page/40 border border-border-theme rounded-full py-2.5 pl-12 pr-10 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors uppercase tracking-[0.2em] placeholder:text-text-muted/60"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary cursor-pointer bg-transparent border-none outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

