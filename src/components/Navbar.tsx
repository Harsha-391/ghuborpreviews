"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, Info, Store, User } from "lucide-react";
import { useAuth } from "./AuthContext";

interface NavbarProps {
  absolute?: boolean;
}

export default function Navbar({ absolute = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

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
    { name: "Shop", href: "/shop", icon: Store },
    { name: "About", href: "/about", icon: Info },
    { name: user ? "Covenant" : "Sign In", href: user ? "/profile" : "/login", icon: User },
    { name: wishlistCount > 0 ? `Wishlist (${wishlistCount})` : "Wishlist", href: "/wishlist", icon: Heart },
    { name: cartCount > 0 ? `Cart (${cartCount})` : "Cart", href: "/cart", icon: ShoppingBag },
  ];


  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div
      className={`${
        absolute ? "absolute top-0 left-0 right-0" : "relative bg-[#070202] border-b border-white/5"
      } z-[999] p-4 flex justify-center select-none`}
    >
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between bg-black/90 backdrop-blur-md rounded-full border border-white/10 px-6 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300">
        
        {/* LOGO (Increased size from h-4 to h-8/h-10/h-12) */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo-white.png"
            alt="Ghubor Logo"
            className="h-7 sm:h-9 md:h-11 object-contain transition-transform duration-300 hover:scale-102"
          />
        </Link>

        {/* DESKTOP LINKS (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs lg:text-sm font-light tracking-widest uppercase transition-colors relative py-1 ${
                  isActive ? "text-primary font-medium" : "text-primary/75 hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* MOBILE HAMBURGER BUTTON (Hidden on Desktop) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="text-primary hover:text-white p-1 cursor-pointer transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-20 left-4 right-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-6 md:hidden z-[1000]"
          >
            {/* Header / Brand label inside mobile menu */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono text-gray-500 tracking-[0.25em] uppercase">
                SANCTUARY MENU
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5C0606] animate-pulse" />
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-4">
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 py-3 px-4 rounded-xl border transition-all ${
                        isActive
                          ? "bg-[#5C0606]/10 border-primary/20 text-primary font-semibold"
                          : "bg-transparent border-transparent text-primary/80 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-primary/60" />
                      <span className="text-sm font-light tracking-widest uppercase">{link.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom brand footer inside mobile menu */}
            <div className="border-t border-white/5 pt-4 text-center">
              <p className="text-[8px] text-gray-600 font-mono tracking-widest uppercase">
                GHUBOR © 2026. FOR THE MODERN GIBBOR.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
