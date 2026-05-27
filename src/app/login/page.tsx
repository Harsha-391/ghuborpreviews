"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../components/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp, user } = useAuth();
  const ease = [0.16, 1, 0.3, 1] as const;

  // Tabs: "signin" | "signup"
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // If already logged in, redirect to profile page
  if (user) {
    router.push("/profile");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "signin") {
        if (!email || !password) {
          throw new Error("Please fill in email and password fields.");
        }
        await signIn(email, password);
      } else {
        if (!name || !email || !phone || !password) {
          throw new Error("Please fill in all covenant registry specifications.");
        }
        // Basic phone validation (only digits/spaces/plus)
        const cleanPhone = phone.replace(/[^0-9+\s-]/g, "");
        if (cleanPhone.length < 8) {
          throw new Error("Please provide a valid contact number.");
        }
        await signUp(email, password, name, cleanPhone);
      }
      
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || "An authentication ritual failure occurred.";
      if (err.code === "auth/invalid-credential") {
        errorMsg = "The credentials entered do not match our covenant records.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMsg = "This email is already bound to an active covenant registry.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "The password provided is too weak. Must be at least 6 characters.";
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background elements */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex flex-col items-center">
        
        <div className="w-full max-w-md bg-black/60 border border-white/5 rounded-3xl p-6 sm:p-8 relative shadow-2xl backdrop-blur-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
              THE COVENANT
            </span>
            <h1 className="font-serif italic text-3xl text-[#E1E0CC] font-light tracking-wide leading-none">
              {activeTab === "signin" ? "Reclaim Covenant" : "Join the Covenant"}
            </h1>
            <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-4" />
          </div>

          {/* Toggle Tab */}
          <div className="flex border border-white/10 rounded-xl overflow-hidden text-center font-mono text-[9px] uppercase mb-6">
            <button
              onClick={() => {
                setActiveTab("signin");
                setError("");
              }}
              className={`flex-1 py-3.5 cursor-pointer transition-colors ${
                activeTab === "signin" ? "bg-[#5C0606]/20 text-primary border-r border-white/10" : "hover:bg-white/5 text-gray-500 border-r border-white/10"
              }`}
            >
              Reclaim Registry
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setError("");
              }}
              className={`flex-1 py-3.5 cursor-pointer transition-colors ${
                activeTab === "signup" ? "bg-[#5C0606]/20 text-primary" : "hover:bg-white/5 text-gray-500"
              }`}
            >
              Sign Oath
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-950/20 border border-red-900/40 text-[#ff8080] font-mono text-[10px] rounded-lg p-3.5 mb-6 uppercase tracking-wider leading-relaxed text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sign In / Sign Up Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {activeTab === "signup" && (
              <>
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-primary/60" />
                    <span>Warrior Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="GIBBOR DEVI"
                    className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary/60" />
                    <span>Contact Number (Outreach)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </>
            )}

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary/60" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="RITUAL@EMAIL.COM"
                className="bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary/60" />
                <span>Secret Passphrase</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-black/60 border border-white/10 rounded-lg p-3 pr-10 text-xs font-mono text-primary outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-0.5 cursor-pointer"
                  aria-label="Toggle Password Visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-[#D4D0BC] disabled:bg-primary/50 text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-lg hover:shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>FORGING CONNECTION...</span>
                </>
              ) : (
                <>
                  <span>{activeTab === "signin" ? "RECLAIM REGISTRY" : "BIND COVENANT"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security details */}
          <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 font-mono uppercase border-t border-white/5 pt-6 mt-6">
            <ShieldCheck className="w-4 h-4 text-[#5C0606]" />
            <span>CRYPTOGRAPHIC RITUAL ACTIVE</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
