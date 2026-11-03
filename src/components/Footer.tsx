import Link from "next/link";
import { Mail, MapPin, Clock, ExternalLink, Shield, Package, RefreshCw, Truck } from "lucide-react";
import CmsImage from "./CmsImage";
import { DEFAULT_IMAGE_CONFIGS } from "./ImageConfigContext";

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
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

const heading = "text-[10px] text-white/50 tracking-[0.3em] uppercase";
const small = "text-[9px] text-white/45 uppercase tracking-widest mb-1.5";
const linkCls = "text-[11px] text-white/70 hover:text-white transition-colors duration-200";
const iconBtn =
  "w-9 h-9 rounded-full ring-1 ring-inset ring-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200";

// Black footer. Server-renderable: the only client pieces are the CMS images.
export default function Footer() {
  return (
    <footer id="inquiries" className="bg-black text-white select-none">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── Hero brand row ─────────────────────────────────────── */}
        <div className="pt-20 pb-12 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div className="flex items-center gap-5">
            <div className="relative w-12 h-12 overflow-hidden shrink-0">
              <CmsImage slot="glyph" fallback={DEFAULT_IMAGE_CONFIGS.glyph.lightUrl} alt="Gibbor Mark" sizes="48px" className="object-cover" />
            </div>
            <div>
              <h2 className="font-serif italic text-4xl font-light leading-none tracking-wide">Ghubor</h2>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.3em] mt-2">For the Modern Gibbor</p>
            </div>
          </div>

          {/* Brand quote */}
          <p className="text-white/60 text-sm font-light max-w-md lg:text-right leading-relaxed font-serif italic">
            Wearable scripture. Hand-numbered drops. Every garment an artifact — a testament of struggle, faith, and transcendence.
          </p>
        </div>

        {/* ── Main grid ──────────────────────────────────────────── */}
        <div className="py-14 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 border-b border-white/10">

          {/* Column 1 — The Covenant */}
          <div className="col-span-2 md:col-span-1 space-y-6">
            <h4 className={heading}>The Covenant</h4>
            <p className="text-white/55 text-[11px] font-light leading-relaxed">
              Ghubor derives from the Hebrew <em>Gibbor</em> — a mighty warrior, champion, hero. We forge armor for silent battles.
              Limited drops. Archival-grade garments. No compromises.
            </p>
            <div className="space-y-2 text-[11px] text-white/55 font-light">
              <div className="flex items-start gap-2">
                <Package className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>64 garments per silhouette. Hand-numbered. Archival.</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>3–5 business day processing. Tracked worldwide shipping.</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span>Dispatched from Jaipur, India.</span>
              </div>
            </div>
            {/* Socials */}
            <div className="flex items-center gap-2 pt-1">
              <a href="https://instagram.com/ghubor.clothing" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={iconBtn}>
                <InstagramIcon />
              </a>
              <a href="mailto:support@ghubor.com" aria-label="Email" className={iconBtn}>
                <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Column 2 — Navigate */}
          <div className="space-y-6">
            <h4 className={heading}>Navigate</h4>
            <ul className="space-y-3.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${linkCls} uppercase tracking-wider font-light`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Legal */}
          <div className="space-y-6">
            <h4 className={heading}>Legal</h4>
            <ul className="space-y-3.5">
              {legalLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className={`${linkCls} uppercase tracking-wider font-light flex items-center gap-2`}>
                    <Icon className="w-3 h-3 text-white/40 shrink-0" strokeWidth={1.5} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Trust badges */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <p className="text-[9px] text-white/45 uppercase tracking-widest">Secure Shopping</p>
              <div className="flex flex-wrap gap-2">
                {["SSL Encrypted", "PCI Compliant", "Safe Checkout"].map((badge) => (
                  <span key={badge} className="text-[8px] text-white/55 uppercase tracking-wider ring-1 ring-inset ring-white/15 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 4 — Reach Us */}
          <div className="space-y-6">
            <h4 className={heading}>Reach Us</h4>
            <div className="space-y-5">
              <div>
                <p className={small}>Inquiries & Orders</p>
                <a href="mailto:support@ghubor.com" className={`${linkCls} font-light inline-flex items-center gap-1.5`}>
                  <Mail className="w-3 h-3" strokeWidth={1.5} />
                  support@ghubor.com
                </a>
              </div>
              <div>
                <p className={small}>Instagram</p>
                <a href="https://instagram.com/ghubor.clothing" target="_blank" rel="noopener noreferrer" className={`${linkCls} font-light inline-flex items-center gap-1.5`}>
                  <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                  @ghubor.clothing
                </a>
              </div>
              <div>
                <p className={small}>Drop Support Hours</p>
                <p className="text-[11px] text-white/70 font-light">Mon–Sat · 10am–6pm IST</p>
                <p className="text-[10px] text-white/45 mt-0.5">Reply within 24–48 hours</p>
              </div>
              <div>
                <p className={small}>Business</p>
                <p className="text-[11px] text-white/70 font-light leading-relaxed">Collaborations & stockist inquiries: support@ghubor.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── GST / GSTIN info row ───────────────────────────────── */}
        <div className="py-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
          <div>
            <p className="text-[9px] text-white/45 uppercase tracking-widest mb-0.5">Registered Business</p>
            <p className="text-[11px] text-white/70">Unite Fashion · Jaipur, Rajasthan · India</p>
          </div>
          <div className="sm:ml-auto flex flex-wrap gap-x-8 gap-y-2">
            {[
              ["Delivery", "Pan-India + International"],
              ["Processing", "3–5 Business Days"],
              ["Returns", "7 Days from Delivery"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[9px] text-white/45 uppercase tracking-widest mb-0.5">{k}</p>
                <p className="text-[11px] text-white/70 font-light">{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Hand-numbered tag artifact */}
          <div className="w-48 ring-1 ring-inset ring-white/15 p-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 overflow-hidden shrink-0">
                <CmsImage slot="tag" fallback={DEFAULT_IMAGE_CONFIGS.tag.lightUrl} alt="Tag Icon" sizes="32px" className="object-cover" />
              </div>
              <div className="text-left">
                <p className="text-[7px] text-white/45 uppercase tracking-widest">GARMENT N°</p>
                <p className="text-[10px] text-white font-medium">01-098 / DROP 01</p>
              </div>
            </div>
          </div>

          {/* Copyright + legal links mini */}
          <div className="text-center sm:text-right space-y-2">
            <p className="text-[10px] text-white/45 uppercase tracking-widest">GHUBOR © 2026. FOR THE MODERN GIBBOR.</p>
            <p className="text-[10px] text-white/45 uppercase tracking-widest">Fighting Battles Nobody Sees.</p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1 pt-1">
              {legalLinks.map(({ label, href }) => (
                <Link key={href} href={href} className="text-[9px] text-white/45 hover:text-white uppercase tracking-wider transition-colors duration-200">
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
