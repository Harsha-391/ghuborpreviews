"use client";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

const sections = [
  {
    heading: "I. Information We Collect",
    body: `When you visit Ghubor, we may collect the following information:

— Personal Identification: Name, email address, phone number, and delivery address when you place an order or create an account.
— Payment Information: We do not store card numbers. Payments are processed via secure third-party providers (Razorpay / Stripe). We receive only a transaction confirmation token.
— Device & Usage Data: IP address, browser type, pages visited, and time on site — collected through cookies and analytics tools for performance monitoring.
— Communications: Any message you send us via email or inquiry forms.`,
  },
  {
    heading: "II. How We Use Your Information",
    body: `Your information is used exclusively for the following purposes:

— To process and fulfill your orders, including shipping and tracking updates.
— To communicate with you about your order status, drop launches, and support queries.
— To improve our website experience and detect fraudulent activity.
— To comply with applicable legal obligations in India (including the Information Technology Act, 2000, and the Consumer Protection Act, 2019).

We do not sell, rent, or share your personal data with third parties for marketing purposes.`,
  },
  {
    heading: "III. Cookies",
    body: `We use cookies — small text files stored in your browser — to:

— Remember your cart, wishlist, and session preferences.
— Track site analytics (Google Analytics / Vercel Analytics) to understand how visitors use our platform.
— Maintain security tokens for authenticated sessions.

You may disable cookies in your browser settings; however, certain features (cart, wishlist, login) will not function correctly without them.`,
  },
  {
    heading: "IV. Data Sharing & Third Parties",
    body: `We share data only with trusted service providers essential to our operations:

— Shipping Partners: Delhivery, Shiprocket, or equivalent couriers — provided your delivery address and contact details to fulfill shipments.
— Payment Processors: Razorpay / Stripe — receive billing data to authorize transactions.
— Cloud Infrastructure: Firebase (Google) — hosts our database and authentication layer.
— Analytics: Vercel / Google Analytics — receives anonymised usage statistics.

All third parties are bound by their own GDPR/DPDP compliant privacy policies.`,
  },
  {
    heading: "V. Data Retention",
    body: `We retain your personal data only as long as necessary:

— Order records are kept for 7 years to comply with Indian tax regulations.
— Account data is retained until you request deletion.
— Analytics data is aggregated and anonymised within 26 months.

To request deletion of your account and associated data, email us at support@ghubor.com.`,
  },
  {
    heading: "VI. Your Rights",
    body: `Under the Digital Personal Data Protection Act (DPDP), 2023, you have the right to:

— Access the personal data we hold about you.
— Correct inaccurate or incomplete information.
— Erasure ("right to be forgotten") — subject to legal retention requirements.
— Withdraw consent for data processing at any time.
— Lodge a complaint with the Data Protection Board of India if you believe your rights have been violated.

To exercise any of these rights, contact: support@ghubor.com`,
  },
  {
    heading: "VII. Security",
    body: `We implement industry-standard measures to protect your data:

— All data transmission is encrypted via TLS 1.3 (HTTPS).
— Database access is restricted and access-controlled through Firebase Security Rules.
— Payment data never touches our servers — all handled by PCI-DSS compliant payment gateways.

Despite these measures, no internet transmission is 100% secure. We encourage you to use strong, unique passwords and report any suspicious activity.`,
  },
  {
    heading: "VIII. Children's Privacy",
    body: `Ghubor does not knowingly collect personal information from individuals under the age of 18. If you believe a minor has provided us with personal information, please contact us immediately at support@ghubor.com and we will take steps to remove that information.`,
  },
  {
    heading: "IX. Changes to This Policy",
    body: `We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. Continued use of the site after changes constitutes your acceptance of the revised policy. We recommend checking this page periodically.`,
  },
  {
    heading: "X. Contact",
    body: `For privacy-related queries, requests, or complaints:

Unite Fashion
Email: support@ghubor.com
Instagram: @ghubor.clothing
Response time: 24–48 hours on business days (Mon–Sat, 10am–6pm IST).`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-page text-text-page relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[15%] right-[-10%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] bg-red-900/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

        {/* Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-mono text-text-dim hover:text-primary uppercase tracking-widest transition-colors mb-12">
          <ArrowLeft className="w-3 h-3" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Legal Document</span>
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-text-page font-light leading-tight mb-4">
            Privacy Policy
          </h1>
          <div className="w-16 h-[1px] bg-primary/25 mb-6" />
          <p className="text-text-muted text-sm font-light leading-relaxed max-w-2xl">
            At Ghubor, your privacy is sacred — not a formality. This policy explains what data we collect, why we collect it, and how it is protected. Effective date: <span className="text-primary font-mono text-xs">June 1, 2026</span>
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <div key={i} className="bg-bg-card/50 border border-border-theme rounded-2xl p-6 sm:p-8 hover:border-primary/15 transition-all duration-300">
              <h2 className="text-xs sm:text-sm font-mono tracking-widest text-primary uppercase mb-4">{section.heading}</h2>
              <div className="space-y-2">
                {section.body.split("\n").map((line, j) => (
                  <p key={j} className={`text-[11px] sm:text-xs leading-relaxed ${line.startsWith("—") ? "text-text-muted pl-3 border-l border-border-theme" : line.trim() === "" ? "h-2" : "text-text-dim"}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Other policy links */}
        <div className="mt-16 bg-bg-card border border-border-theme rounded-2xl p-6 sm:p-8">
          <h3 className="text-[10px] font-mono text-primary uppercase tracking-widest mb-5">Other Legal Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Refund Policy", href: "/refund-policy" },
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
