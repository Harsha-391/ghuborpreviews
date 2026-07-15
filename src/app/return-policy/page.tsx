"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

const sections = [
  {
    heading: "I. Overview",
    body: `We want you to receive your garment and feel the full weight of what it means. If something is not right — size, condition, or otherwise — our return process exists to make it right. Returns are accepted under the conditions listed below, within the window specified.`,
  },
  {
    heading: "II. Return Eligibility",
    body: `Returns are accepted if ALL of the following are true:

— The return is initiated within 7 days of confirmed delivery.
— The garment is unworn, unwashed, and in original condition.
— All original tags (including the hand-numbered drop tag) are still attached.
— The item is returned in its original packaging or equivalent protective packaging.
— The order was not a "Final Sale" or flash-drop item (these are explicitly marked at purchase).

Returns will be REJECTED if:
— The item shows signs of wear, wash, or alteration.
— The hand-numbered drop tag has been removed.
— The return is initiated after the 7-day window.
— The item has been damaged due to mishandling after receipt.`,
  },
  {
    heading: "III. How to Initiate a Return",
    body: `To begin the return process:

1. Email support@gmail.com with subject: RETURN REQUEST — [Order Number]
2. Include: your order number, reason for return, and photographs of the item showing its current condition.
3. Our team will review within 2–3 business days and, if approved, issue a Return Authorization Number (RAN).
4. Pack the garment securely. Write the RAN clearly on the outside of the package.
5. Ship to the address provided in our approval email.
6. Share the tracking number with us once shipped.

Returns sent without a Return Authorization Number will not be accepted and will be returned to sender.`,
  },
  {
    heading: "IV. Return Shipping Costs",
    body: `— If the return is due to our error (wrong item, manufacturing defect): Ghubor covers the return shipping cost. We will provide a prepaid label.
— If the return is due to a change of preference or size: The customer bears the return shipping cost.

We strongly recommend using a tracked courier service. Ghubor is not liable for items lost in return transit.`,
  },
  {
    heading: "V. Exchanges",
    body: `We offer size exchanges subject to availability:

— Exchange requests must follow the same initiation process as returns (email with order number and reason).
— Exchanges are fulfilled only if the requested size/variant is in stock.
— If the requested size is unavailable, a refund will be offered instead.
— Exchanged items are dispatched after the original item is received and inspected (typically 5–7 business days).`,
  },
  {
    heading: "VI. Inspection & Processing",
    body: `Once we receive your returned item:

— Our team inspects it within 2 business days of receipt.
— You will be notified via email with the inspection outcome.
— If approved: a refund or exchange is initiated within 2 business days of approval.
— If rejected (item fails inspection): the item will be returned to you at your expense.`,
  },
  {
    heading: "VII. Non-Returnable Items",
    body: `The following items are strictly non-returnable:

— Items explicitly marked "Final Sale" at time of purchase.
— Flash-drop or emergency-drop items purchased during a limited timed event.
— Items that have been worn, washed, customised, or altered.
— Items purchased using promotional discount codes exceeding 25% off (unless defective).
— Gift cards and store credit.`,
  },
  {
    heading: "VIII. Consumer Rights",
    body: `Nothing in this policy overrides your rights as a consumer under the Consumer Protection Act, 2019 (India). If you believe a statutory right has been violated, you may contact the National Consumer Helpline at 1800-11-4000 or lodge a complaint at consumerhelpline.gov.in.`,
  },
];

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-page text-text-page relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[15%] right-[-10%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-red-900/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-mono text-text-dim hover:text-primary uppercase tracking-widest transition-colors mb-12">
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Legal Document</span>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-text-page font-light leading-tight mb-4">
            Return Policy
          </h1>
          <div className="w-16 h-[1px] bg-primary/25 mb-6" />
          <p className="text-text-muted text-sm font-light leading-relaxed max-w-2xl">
            Every garment leaves our hands with intent. If it arrives wrong, we correct it — no compromise. Effective date: <span className="text-primary font-mono text-xs">June 1, 2026</span>
          </p>
        </div>

        {/* Key facts bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            ["Return Window", "7 days from delivery"],
            ["Condition", "Unworn, tags attached"],
            ["Exchange", "Subject to availability"],
            ["Contact", "support@gmail.com"],
          ].map(([label, value]) => (
            <div key={label as string} className="bg-bg-card border border-border-theme rounded-xl p-4">
              <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest mb-1">{label}</p>
              <p className="text-[11px] text-text-muted font-light">{value}</p>
            </div>
          ))}
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

        {/* Step-by-step visual */}
        <div className="mt-12 bg-bg-card border border-border-theme rounded-2xl p-6 sm:p-8">
          <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-6">Return Journey at a Glance</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { step: "01", label: "Email Us", desc: "Send request within 7 days" },
              { step: "02", label: "Get RAN", desc: "Receive authorization in 2–3 days" },
              { step: "03", label: "Ship Item", desc: "Pack securely with RAN marked" },
              { step: "04", label: "Inspection", desc: "2 business days on arrival" },
              { step: "05", label: "Resolution", desc: "Refund or exchange issued" },
            ].map(({ step, label, desc }) => (
              <div key={step} className="flex-1 text-center border border-border-theme rounded-xl p-4">
                <p className="text-2xl font-light text-primary/30 font-mono mb-1">{step}</p>
                <p className="text-[11px] font-mono text-text-page uppercase tracking-wider mb-1">{label}</p>
                <p className="text-[10px] text-text-dim">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-bg-card border border-border-theme rounded-2xl p-6 sm:p-8">
          <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-5">Other Legal Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Refund Policy", href: "/refund-policy" },
              { label: "Shipping Policy", href: "/shipping-policy" },
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
