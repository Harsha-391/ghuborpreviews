"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ArrowLeft, Truck } from "lucide-react";

const sections = [
  {
    heading: "I. Overview",
    body: `Every Ghubor garment is prepared with deliberate care before it is dispatched. This policy covers our processing times, shipping partners, delivery timelines, tracking procedures, and what happens when things go wrong in transit. We ship from Jaipur, India, to most global destinations.`,
  },
  {
    heading: "II. Order Processing",
    body: `— Orders are processed within 3–5 business days of payment confirmation (Monday–Saturday, excluding public holidays).
— Limited drops and pre-orders may have extended processing times of up to 10–14 business days. These exceptions are clearly communicated on the product page.
— You will receive a dispatch confirmation email with tracking information once your order has been shipped.
— Orders cannot be modified or cancelled once they have entered the dispatch queue.`,
  },
  {
    heading: "III. Domestic Shipping (India)",
    body: `We ship pan-India using the following partners:

— Delhivery, Shiprocket, BlueDart, or equivalent tracked couriers depending on your pin code.
— Standard delivery: 4–7 business days after dispatch.
— Express delivery: 2–3 business days after dispatch (available for select pin codes at checkout, additional charge applies).

Free shipping on all domestic orders above ₹3,000. Orders below ₹3,000 may incur a nominal shipping fee displayed at checkout.`,
  },
  {
    heading: "IV. International Shipping",
    body: `We ship internationally to most countries. Standard timelines:

— South Asia (Nepal, Sri Lanka, Bangladesh): 5–10 business days
— Southeast Asia (UAE, Singapore, Malaysia): 7–14 business days
— Europe & UK: 10–18 business days
— North America (USA, Canada): 10–20 business days
— Australia & New Zealand: 12–20 business days

International orders are shipped via DHL, FedEx, or Aramex depending on destination. All international shipments are tracked. Ghubor is not responsible for customs clearance delays or additional import duties/taxes levied by your country — these are borne by the customer.`,
  },
  {
    heading: "V. Tracking Your Order",
    body: `Once your order is dispatched:

— A tracking number is sent to your registered email address.
— Track in real-time via the courier partner's website or the tracking link in your email.
— If you have a Ghubor account, tracking updates will appear under Profile → My Orders.
— Please allow 12–24 hours after dispatch for tracking to activate on the courier's system.`,
  },
  {
    heading: "VI. Failed Deliveries & Undeliverable Addresses",
    body: `If a delivery attempt fails:

— The courier will attempt delivery up to 3 times. After 3 failed attempts, the package is returned to our facility.
— Ghubor is not responsible for failed deliveries due to an incorrect address provided at checkout.
— If a package is returned to us: we will contact you to reconfirm the address and arrange re-dispatch. A re-dispatch shipping fee may apply.
— If you do not respond within 14 days of our notification, the order will be refunded minus the shipping costs originally incurred.`,
  },
  {
    heading: "VII. Damaged or Lost in Transit",
    body: `If your parcel arrives visibly damaged:

— Accept the package but photograph the damage immediately before opening.
— Email support@ghubor.com within 48 hours of delivery with photos of the packaging and the damaged item.
— We will file a claim with the courier and, upon resolution, dispatch a replacement or issue a full refund.

If tracking shows "Delivered" but you did not receive the package:
— Check with neighbours and building reception.
— Contact us within 5 days of the marked delivery date.
— We will initiate a courier investigation, which may take 5–10 business days to resolve.`,
  },
  {
    heading: "VIII. Customs, Duties & Taxes",
    body: `For international orders:

— The recipient is solely responsible for all customs duties, import taxes, and brokerage fees.
— Ghubor declares the true value of all shipments — we do not under-declare on customs forms.
— If a shipment is refused or abandoned at customs, Ghubor is not liable for the item or its value once it leaves our warehouse.
— Customs clearance can add 2–5 business days to estimated delivery times in some countries.`,
  },
  {
    heading: "IX. Public Holidays & Delays",
    body: `During major public holidays (Diwali, Christmas, Eid, etc.) and peak sale periods, processing and delivery timelines may extend by 3–7 additional business days. We will communicate expected delays proactively via email and our Instagram (@ghubor.clothing).`,
  },
  {
    heading: "X. Contact for Shipping Queries",
    body: `For any shipping-related queries:

Email: support@ghubor.com
Subject format: SHIPPING — [Your Order Number]
Response time: Within 24–48 hours (Mon–Sat, 10am–6pm IST).

Please have your order number and email address ready when reaching out.`,
  },
];

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-page text-text-page relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[15%] left-[-10%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[350px] h-[350px] bg-red-900/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-mono text-text-dim hover:text-primary uppercase tracking-widest transition-colors mb-12">
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Legal Document</span>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-text-page font-light leading-tight mb-4">
            Shipping Policy
          </h1>
          <div className="w-16 h-[1px] bg-primary/25 mb-6" />
          <p className="text-text-muted text-sm font-light leading-relaxed max-w-2xl">
            We dispatch from Jaipur, India. Every shipment is tracked. Every garment packed with care. Effective date: <span className="text-primary font-mono text-xs">June 1, 2026</span>
          </p>
        </div>

        {/* Shipping at a glance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            ["Processing", "3–5 business days"],
            ["Domestic", "4–7 days post-dispatch"],
            ["International", "10–20 days post-dispatch"],
            ["Free Shipping", "India orders above ₹3,000"],
          ].map(([label, value]) => (
            <div key={label as string} className="bg-bg-card border border-border-theme rounded-xl p-4">
              <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest mb-1">{label}</p>
              <p className="text-[11px] text-text-muted font-light">{value}</p>
            </div>
          ))}
        </div>

        {/* Coverage regions visual */}
        <div className="mb-10 bg-bg-card border border-border-theme rounded-2xl p-6 sm:p-8">
          <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-5">Shipping Destinations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { region: "India", time: "4–7 days", free: "₹3,000+" },
              { region: "South Asia", time: "5–10 days", free: "—" },
              { region: "SE Asia / UAE", time: "7–14 days", free: "—" },
              { region: "Europe / UK", time: "10–18 days", free: "—" },
              { region: "North America", time: "10–20 days", free: "—" },
            ].map(({ region, time, free }) => (
              <div key={region} className="border border-border-theme rounded-xl p-3 text-center">
                <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1">{region}</p>
                <p className="text-[10px] text-text-muted">{time}</p>
                {free !== "—" && <p className="text-[9px] text-emerald-500/70 font-mono mt-0.5">Free {free}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="bg-bg-card/50 border border-border-theme rounded-2xl p-6 sm:p-8 hover:border-primary/15 transition-all duration-300">
              <h2 className="text-xs sm:text-sm font-mono tracking-widest text-primary uppercase mb-4">{section.heading}</h2>
              <div className="space-y-2">
                {section.body.split("\n").map((line, j) => (
                  <p key={j} className={`text-[11px] sm:text-xs leading-relaxed ${
                    line.startsWith("—") ? "text-text-muted pl-3 border-l border-border-theme"
                    : /^\d+\./.test(line) ? "text-text-muted pl-3"
                    : line.trim() === "" ? "h-2"
                    : "text-text-dim"
                  }`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-bg-card border border-border-theme rounded-2xl p-6 sm:p-8">
          <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-5">Other Legal Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Refund Policy", href: "/refund-policy" },
              { label: "Return Policy", href: "/return-policy" },
            ].map(({ label, href }) => (
              <Link key={href} href={href}
                className="border border-border-theme hover:border-primary/30 rounded-xl p-4 text-xs font-mono text-text-muted hover:text-primary uppercase tracking-wider transition-all duration-200 flex items-center justify-between group">
                {label}
                <ArrowLeft className="w-3.5 h-3.5 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
