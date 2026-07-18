"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

const sections = [
  {
    heading: "I. Overview",
    body: `Ghubor operates a limited-drop apparel label with a strict, transparent refund policy. Given the archival and limited-edition nature of our garments — each hand-numbered to a maximum of 64 per silhouette — refunds are only granted under the specific circumstances outlined below.

Please read this policy carefully before placing an order. By completing a purchase, you acknowledge and agree to the terms stated herein.`,
  },
  {
    heading: "II. Eligibility for Refund",
    body: `Refunds are available under the following conditions:

— Defective or Damaged Garment: The item received has a manufacturing defect, is structurally damaged, or is materially different from what was described.
— Wrong Item Delivered: You received an incorrect size, colorway, or product entirely.
— Non-Delivery: Your order was marked delivered by the courier but never physically received, and an investigation confirms it was lost in transit.
— Cancelled Before Dispatch: If you cancel your order before it has been dispatched from our facility (usually within 24 hours of order placement).

Refunds are NOT available for:
— Change of mind or sizing errors made at checkout.
— Slight tonal variations in fabric (natural in hand-dyed or stone-washed garments).
— Items that have been worn, washed, altered, or damaged after receipt.
— Limited-drop items marked "Final Sale" at time of purchase.`,
  },
  {
    heading: "III. Refund Process",
    body: `To initiate a refund request:

1. Email support@ghubor.com with subject line: REFUND REQUEST — [Your Order Number]
2. Include: your order number, a brief description of the issue, and clear photographs (for defect/damage claims).
3. Our team will review and respond within 2–3 business days.
4. If approved, you may be asked to return the item (see Return Policy for shipping instructions).
5. Refunds are processed within 7–10 business days of approval.`,
  },
  {
    heading: "IV. Refund Method",
    body: `Approved refunds are credited as follows:

— Online Payments (Credit/Debit Card, UPI, Net Banking): Refunded to the original payment method within 7–10 business days after processing. Bank processing times may vary.
— Store Credit (Optional): You may opt to receive Ghubor store credit usable on your next order, processed faster (within 2 business days).

We do not offer cash refunds under any circumstances.`,
  },
  {
    heading: "V. Partial Refunds",
    body: `In cases where only part of an order is eligible for a refund (e.g., one item in a multi-item order is defective), only the amount corresponding to the eligible item will be refunded. Shipping charges are non-refundable unless the error was ours.`,
  },
  {
    heading: "VI. Pre-Order & Limited Drop Refunds",
    body: `Pre-order items follow a special refund clause:

— If the pre-order is cancelled by Ghubor before dispatch, a full refund is issued automatically.
— If a pre-order is cancelled by the customer after the garment enters production (typically 2–4 weeks before dispatch), a 15% processing fee is deducted from the refund.
— Once a pre-ordered item has shipped, standard refund eligibility applies.`,
  },
  {
    heading: "VII. Contact for Refund Disputes",
    body: `If you disagree with our assessment of your refund request, you may escalate by:

— Replying to the original refund email with additional evidence.
— Contacting us at support@ghubor.com marked ESCALATION — [Order Number].
— If unresolved, disputes may be referred to the consumer forum under the Consumer Protection Act, 2019 (India).

We are committed to resolving all disputes fairly and transparently.`,
  },
];

export default function RefundPolicyPage() {
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
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Legal Document</span>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-text-page font-light leading-tight mb-4">
            Refund Policy
          </h1>
          <div className="w-16 h-[1px] bg-primary/25 mb-6" />
          <p className="text-text-muted text-sm font-light leading-relaxed max-w-2xl">
            We stand behind every garment we forge. If something is wrong, we make it right. Effective date: <span className="text-primary font-mono text-xs">June 1, 2026</span>
          </p>
        </div>

        {/* Key facts bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            ["Refund Window", "7 days from delivery"],
            ["Processing Time", "7–10 business days"],
            ["Method", "Original payment / Credit"],
            ["Contact", "support@ghubor.com"],
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

        <div className="mt-16 bg-bg-card border border-border-theme rounded-2xl p-6 sm:p-8">
          <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-5">Other Legal Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Return Policy", href: "/return-policy" },
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
