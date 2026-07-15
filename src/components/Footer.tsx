"use client";

import Link from "next/link";
import { Mail, MapPin, Clock, ExternalLink, Shield, Package, RefreshCw, Truck } from "lucide-react";
import { useImageConfig } from "./ImageConfigContext";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Sign In", href: "/login" },
  { label: "Profile", href: "/profile" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy", icon: Shield },
  { label: "Refund Policy", href: "/refund-policy", icon: RefreshCw },
  { label: "Return Policy", href: "/return-policy", icon: Package },
  { label: "Shipping Policy", href: "/shipping-policy", icon: Truck },
];

export default function Footer() {
  const { getImageUrl } = useImageConfig();

  return (
    <footer id="inquiries" className="bg-bg-page border-t border-border-theme relative overflow-hidden select-none">
      {/* Background accents */}
      <div className="bg-noise absolute inset-0 opacity-[0.05] pointer-events-none z-0" />
      <div className="absolute -top-32 -left-32 w-[420px] h-[380px] opacity-[0.07] pointer-events-none z-0"
        style={{ background: "#C0392B", borderRadius: "73% 27% 63% 37% / 54% 47% 53% 46%", filter: "blur(100px)" }} />
      <div className="absolute -bottom-24 -right-24 w-[360px] h-[320px] opacity-[0.05] pointer-events-none z-0"
        style={{ background: "#5C0606", borderRadius: "38% 62% 46% 54% / 60% 35% 65% 40%", filter: "blur(90px)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] opacity-[0.03] pointer-events-none z-0"
        style={{ background: "#D4C5A9", borderRadius: "55% 45% 38% 62% / 50% 60% 40% 50%", filter: "blur(120px)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Hero brand row ─────────────────────────────────────── */}
        <div className="pt-16 pb-12 border-b border-border-theme flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded overflow-hidden opacity-60 hover:opacity-100 transition-opacity duration-500 filter invert brightness-125 shrink-0">
              <img src={getImageUrl("glyph")} alt="Gibbor Mark" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-blackletter text-3xl sm:text-4xl text-text-page leading-none tracking-wide">Ghubor</h2>
              <p className="text-[10px] text-text-dim font-mono uppercase tracking-[0.3em] mt-1.5">For the Modern Gibbor</p>
            </div>
          </div>

          {/* Brand quote */}
          <p className="text-text-muted text-xs sm:text-sm font-light max-w-md lg:text-right leading-relaxed font-serif italic opacity-70">
            Wearable scripture. Hand-numbered drops. Every garment an artifact — a testament of struggle, faith, and transcendence.
          </p>
        </div>

        {/* ── Main grid ──────────────────────────────────────────── */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 border-b border-border-theme">

          {/* Column 1 — The Covenant */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <h4 className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase">The Covenant</h4>
            <p className="text-text-dim text-[11px] font-light leading-relaxed">
              Ghubor derives from the Hebrew <em>Gibbor</em> — a mighty warrior, champion, hero. We forge armor for silent battles.
              Limited drops. Archival-grade garments. No compromises.
            </p>
            <div className="space-y-2 text-[11px] text-text-dim font-light">
              <div className="flex items-start gap-2">
                <Package className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-0.5" />
                <span>64 garments per silhouette. Hand-numbered. Archival.</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-0.5" />
                <span>3–5 business day processing. Tracked worldwide shipping.</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary/50 shrink-0 mt-0.5" />
                <span>Dispatched from Jaipur, India.</span>
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-3 pt-1">
              <a href="https://instagram.com/ghubor.clothing" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-full border border-border-theme flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all duration-300">
                <InstagramIcon />
              </a>
              <a href="mailto:support@gmail.com" aria-label="Email"
                className="w-8 h-8 rounded-full border border-border-theme flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all duration-300">
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2 — Navigate */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase">Navigate</h4>
            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-[11px] text-text-muted hover:text-primary transition-colors duration-200 uppercase tracking-wider font-light flex items-center gap-1.5 group">
                    <span className="w-0 group-hover:w-2 overflow-hidden transition-all duration-300 text-primary/60">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Legal */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase">Legal</h4>
            <ul className="space-y-3.5">
              {legalLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-[11px] text-text-muted hover:text-primary transition-colors duration-200 uppercase tracking-wider font-light flex items-center gap-2 group">
                    <Icon className="w-3 h-3 text-primary/40 group-hover:text-primary/70 transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="pt-4 border-t border-border-theme space-y-2">
              <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest">Secure Shopping</p>
              <div className="flex flex-wrap gap-2">
                {["SSL Encrypted", "PCI Compliant", "Safe Checkout"].map((badge) => (
                  <span key={badge}
                    className="text-[8px] font-mono text-text-dim uppercase tracking-wider border border-border-theme px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 4 — Reach Us */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-mono text-primary tracking-[0.3em] uppercase">Reach Us</h4>
            <div className="space-y-5">
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-widest font-mono mb-1.5">Inquiries & Orders</p>
                <a href="mailto:support@gmail.com"
                  className="text-[11px] text-text-muted hover:text-primary transition-colors duration-200 font-light inline-flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  support@gmail.com
                </a>
              </div>
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-widest font-mono mb-1.5">Instagram</p>
                <a href="https://instagram.com/ghubor.clothing" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-text-muted hover:text-primary transition-colors duration-200 font-light inline-flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3" />
                  @ghubor.clothing
                </a>
              </div>
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-widest font-mono mb-1.5">Drop Support Hours</p>
                <p className="text-[11px] text-text-muted font-light">Mon–Sat · 10am–6pm IST</p>
                <p className="text-[10px] text-text-dim font-mono mt-0.5">Reply within 24–48 hours</p>
              </div>
              <div>
                <p className="text-[9px] text-text-dim uppercase tracking-widest font-mono mb-1.5">Business</p>
                <p className="text-[11px] text-text-muted font-light leading-relaxed">Collaborations & stockist inquiries: support@gmail.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── GST / GSTIN info row ───────────────────────────────── */}
        <div className="py-5 border-b border-border-theme flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
          <div>
            <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest mb-0.5">Registered Business</p>
            <p className="text-[11px] text-text-muted font-mono">Unite Fashion · Jaipur, Rajasthan · India</p>
          </div>
          <div className="sm:ml-auto flex flex-wrap gap-x-8 gap-y-2">
            {[
              ["Delivery", "Pan-India + International"],
              ["Processing", "3–5 Business Days"],
              ["Returns", "7 Days from Delivery"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest mb-0.5">{k}</p>
                <p className="text-[11px] text-text-muted font-light">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Hand-numbered tag artifact */}
          <div className="w-48 border border-border-theme rounded-lg p-3 bg-bg-card/80 backdrop-blur shadow-xl relative shrink-0">
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#5C0606] rounded-full m-2 animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-bg-page flex items-center justify-center p-0.5 border border-border-theme shrink-0">
                <img src={getImageUrl("tag")} alt="Tag Icon" className="w-full h-full object-cover filter contrast-125 brightness-90" />
              </div>
              <div className="text-left">
                <p className="text-[7px] text-text-dim font-mono uppercase tracking-widest">GARMENT N°</p>
                <p className="text-[10px] text-primary font-mono font-medium">01-098 / DROP 01</p>
              </div>
            </div>
          </div>

          {/* Copyright + legal links mini */}
          <div className="text-center sm:text-right space-y-2">
            <p className="text-[10px] text-text-dim font-mono uppercase tracking-widest">GHUBOR © 2026. FOR THE MODERN GIBBOR.</p>
            <p className="text-[10px] text-text-dim font-mono uppercase tracking-widest">Fighting Battles Nobody Sees.</p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1 pt-1">
              {legalLinks.map(({ label, href }) => (
                <Link key={href} href={href}
                  className="text-[9px] font-mono text-text-dim hover:text-text-muted uppercase tracking-wider transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
