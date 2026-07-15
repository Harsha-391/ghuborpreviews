"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Key, Smartphone } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../components/AuthContext";
import { auth, db } from "../../utils/firebase";
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  linkWithCredential,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
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

  // OTP States
  const [verificationStep, setVerificationStep] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [pendingPhone, setPendingPhone] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [resending, setResending] = useState(false);

  // Temporary storage for sign up fields
  const [pendingAuthData, setPendingAuthData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
  } | null>(null);

  // Setup recaptcha verifier on mount
  useEffect(() => {
    if (typeof window !== "undefined" && auth && !(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved
          },
          "expired-callback": () => {
            // Response expired
          }
        });
      } catch (err) {
        console.error("Error creating RecaptchaVerifier:", err);
      }
    }

    return () => {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = undefined;
        } catch (e) {
          // ignore
        }
      }
    };
  }, []);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // Redirect if logged in and not verifying OTP
  useEffect(() => {
    if (user && verificationStep !== "otp") {
      router.push("/profile");
    }
  }, [user, verificationStep, router]);

  const formatPhoneNumber = (rawPhone: string) => {
    const cleaned = rawPhone.replace(/\D/g, "");
    if (rawPhone.trim().startsWith("+")) {
      return rawPhone.trim().replace(/[\s-]/g, "");
    }
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith("91")) {
      return `+${cleaned}`;
    }
    return `+${cleaned}`;
  };

  const sendOtpSms = async (phoneNumber: string) => {
    if (!auth) {
      throw new Error("Sanctuary database keys are not configured yet.");
    }
    
    let verifier = (window as any).recaptchaVerifier;
    if (!verifier) {
      verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible"
      });
      (window as any).recaptchaVerifier = verifier;
    }

    const phoneProvider = new PhoneAuthProvider(auth);
    const verId = await phoneProvider.verifyPhoneNumber(phoneNumber, verifier);
    setVerificationId(verId);
    setOtpTimer(60);
  };

  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    setResending(true);
    setError("");
    try {
      const targetPhone = activeTab === "signup" ? (pendingAuthData?.phone || phone) : pendingPhone;
      await sendOtpSms(targetPhone);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to resend verification code.");
    } finally {
      setResending(false);
    }
  };

  const handleCancelOtp = async () => {
    setError("");
    setVerificationStep("form");
    setOtpCode("");
    if (activeTab === "signin" && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error("Sign out failed:", e);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "signin") {
        if (!email || !password) {
          throw new Error("Please fill in email and password fields.");
        }
        if (!auth || !db) {
          throw new Error("Sanctuary database keys are not configured yet.");
        }

        // 1. Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // 2. Fetch profile to check phone
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().phone) {
          const registeredPhone = formatPhoneNumber(docSnap.data().phone);
          setPendingPhone(registeredPhone);
          
          // Send OTP
          await sendOtpSms(registeredPhone);
          setVerificationStep("otp");
          setLoading(false);
        } else {
          // If no phone is on record, let them log in directly
          router.push("/profile");
        }

      } else {
        // Sign Up Flow
        if (!name || !email || !phone || !password) {
          throw new Error("Please fill in all covenant registry specifications.");
        }
        const cleanedPhone = formatPhoneNumber(phone);
        if (cleanedPhone.length < 8) {
          throw new Error("Please provide a valid contact number.");
        }

        // Save data to pending
        setPendingAuthData({ name, email, phone: cleanedPhone, password });

        // Send OTP
        await sendOtpSms(cleanedPhone);
        setVerificationStep("otp");
        setLoading(false);
      }
      
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      setLoading(false);
      return;
    }

    try {
      if (!auth || !db) {
        throw new Error("Sanctuary database keys are not configured yet.");
      }

      const credential = PhoneAuthProvider.credential(verificationId, otpCode);

      if (activeTab === "signup") {
        if (!pendingAuthData || !pendingAuthData.email || !pendingAuthData.password) {
          throw new Error("Covenant credentials lost. Please register again.");
        }

        // 1. Create email/password user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          pendingAuthData.email,
          pendingAuthData.password
        );
        const user = userCredential.user;

        // 2. Link phone number
        try {
          await linkWithCredential(user, credential);
        } catch (linkErr: any) {
          console.warn("Link phone credential skipped or failed:", linkErr);
        }

        // 3. Write Firestore user profile
        const uid = user.uid;
        const newProfile = {
          uid,
          name: pendingAuthData.name || "",
          email: pendingAuthData.email,
          phone: pendingAuthData.phone || "",
          createdAt: new Date().toISOString(),
        };

        await setDoc(doc(db, "users", uid), newProfile);
      } else {
        // Sign In
        if (!auth.currentUser) {
          throw new Error("Covenant connection lost. Please sign in again.");
        }

        try {
          await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (authErr: any) {
          if (authErr.code === "auth/provider-already-linked" || authErr.code === "auth/credential-already-in-use") {
            // ignore
          } else {
            console.log("Linking phone for legacy user...");
            await linkWithCredential(auth.currentUser, credential);
          }
        }
      }

      // Success, route to profile
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || "Verification code validation failed.";
      if (err.code === "auth/invalid-verification-code") {
        errorMsg = "The verification code entered is invalid or has expired.";
      }
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/profile");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page text-text-page selection:bg-accent selection:text-primary relative overflow-x-hidden pb-24">
      {/* Background elements */}
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex flex-col items-center">
        
        {/* Redesigned Premium Oxblood Red Login Card */}
        <div className="w-full max-w-md bg-[#5C0606] border border-[#781212] rounded-3xl p-6 sm:p-8 relative shadow-[0_20px_50px_rgba(92,6,6,0.3)] backdrop-blur-md text-white">
          
          {verificationStep === "otp" ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <span className="text-white/60 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3 animate-pulse">
                  SMS VERIFICATION
                </span>
                <h1 className="font-serif italic text-3xl text-white font-light tracking-wide leading-none">
                  Verify Outreach
                </h1>
                <div className="w-12 h-[1px] bg-white/20 mx-auto mt-4" />
              </div>

              {/* Subtext */}
              <p className="text-center text-xs text-white/70 font-mono uppercase tracking-wider mb-6 leading-relaxed">
                We sent a 6-digit confirmation key to<br/>
                <span className="text-white font-semibold">{activeTab === "signup" ? pendingAuthData?.phone : pendingPhone}</span>
              </p>

              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4 text-white">
                {/* OTP Input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-white/60" />
                    <span>Covenant Key (OTP)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="XXXXXX"
                    className="bg-black/30 border border-white/20 rounded-lg p-3 text-center tracking-[0.5em] text-sm font-mono text-white placeholder-white/30 outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Submit / Confirm Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white hover:bg-gray-100 disabled:bg-white/50 text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>VERIFYING RITUAL KEY...</span>
                    </>
                  ) : (
                    <>
                      <span>CONFIRM COVENANT</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Resend / Cancel Actions */}
                <div className="flex justify-between items-center mt-2 text-[10px] font-mono uppercase">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={otpTimer > 0 || resending}
                    className={`text-white/60 hover:text-white transition-colors cursor-pointer disabled:text-white/30`}
                  >
                    {resending ? "Sending..." : otpTimer > 0 ? `Resend Key (${otpTimer}s)` : "Resend Key"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelOtp}
                    className="text-red-300 hover:text-red-200 transition-colors cursor-pointer bg-transparent border-none outline-none"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <span className="text-white/60 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
                  THE COVENANT
                </span>
                <h1 className="font-serif italic text-3xl text-white font-light tracking-wide leading-none">
                  {activeTab === "signin" ? "Reclaim Covenant" : "Join the Covenant"}
                </h1>
                <div className="w-12 h-[1px] bg-white/20 mx-auto mt-4" />
              </div>

              {/* Toggle Tab */}
              <div className="flex border border-white/20 rounded-xl overflow-hidden text-center font-mono text-[9px] uppercase mb-6 bg-black/10">
                <button
                  onClick={() => {
                    setActiveTab("signin");
                    setError("");
                  }}
                  className={`flex-1 py-3.5 cursor-pointer transition-colors ${
                    activeTab === "signin" ? "bg-white text-black font-semibold border-r border-white/20" : "hover:bg-white/5 text-white/60 border-r border-white/20"
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
                    activeTab === "signup" ? "bg-white text-black font-semibold" : "hover:bg-white/5 text-white/60"
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
                    className="bg-black/30 border border-black/40 text-red-200 font-mono text-[10px] rounded-lg p-3.5 mb-6 uppercase tracking-wider leading-relaxed text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign In / Sign Up Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
                {activeTab === "signup" && (
                  <>
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-white/60" />
                        <span>Warrior Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="GIBBOR DEVI"
                        className="bg-black/30 border border-white/20 rounded-lg p-3 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/60 transition-colors"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-white/60" />
                        <span>Contact Number (Outreach)</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        className="bg-black/30 border border-white/20 rounded-lg p-3 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/60 transition-colors"
                      />
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-white/60" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="RITUAL@EMAIL.COM"
                    className="bg-black/30 border border-white/20 rounded-lg p-3 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/60 transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-white/60" />
                    <span>Secret Passphrase</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                      className="w-full bg-black/30 border border-white/20 rounded-lg p-3 pr-10 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/60 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-0.5 cursor-pointer bg-transparent border-none outline-none"
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
                  className="w-full bg-white hover:bg-gray-100 disabled:bg-white/50 text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-lg"
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

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink mx-4 text-[9px] font-mono text-white/40 uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-transparent hover:bg-white/5 disabled:opacity-50 text-white border border-white/20 font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer uppercase font-semibold shadow-lg"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.513 0-6.386-2.873-6.386-6.386 0-3.513 2.873-6.386 6.386-6.386 1.54 0 2.98.55 4.12 1.487l3.078-3.078C18.665 1.77 15.65 1 12.24 1 6.13 1 1.25 5.88 1.25 12s4.88 11 11 11c5.73 0 10.51-4.12 10.51-11 0-.685-.06-1.354-.18-2.029H12.24z"/>
                </svg>
                <span>RECLAIM VIA GOOGLE</span>
              </button>
            </>
          )}

          {/* Hidden Recaptcha Container required by Firebase */}
          <div id="recaptcha-container" className="hidden"></div>

          {/* Security details */}
          <div className="flex items-center justify-center gap-2 text-[9px] text-white/40 font-mono uppercase border-t border-white/10 pt-6 mt-6">
            <ShieldCheck className="w-4 h-4 text-white/50" />
            <span>CRYPTOGRAPHIC RITUAL ACTIVE</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
