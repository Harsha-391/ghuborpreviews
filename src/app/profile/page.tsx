"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Phone, MapPin, Mail, ShieldAlert, Edit3, Check, Loader2, Calendar, FileText } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../components/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase";

interface FirestoreOrder {
  id: string;
  orderNo: string;
  subtotal: number;
  total: number;
  status: string;
  shippingAddress: any;
  items: Array<{
    id: string;
    title: string;
    size: string;
    qty: number;
    price: string;
    image: string;
  }>;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading, logOut, updateProfileData } = useAuth();
  const ease = [0.16, 1, 0.3, 1] as const;

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editZip, setEditZip] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // Orders State
  const [orders, setOrders] = useState<FirestoreOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Sync edits state with profile when loaded
  useEffect(() => {
    if (profile) {
      setEditName(profile.name || "");
      setEditPhone(profile.phone || "");
      setEditAddress(profile.address || "");
      setEditCity(profile.city || "");
      setEditZip(profile.zip || "");
    }
  }, [profile]);

  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !db) {
        setOrdersLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, "orders"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const list: FirestoreOrder[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as FirestoreOrder);
        });
        setOrders(list);
      } catch (err) {
        console.error("Error fetching orders from Firestore:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);


  // Protect page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <h2 className="font-mono text-xs uppercase tracking-widest text-primary/80">Reading Covenant Registry...</h2>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError("");
    setUpdating(true);

    try {
      if (!editName || !editPhone) {
        throw new Error("Warrior name and contact outreach details are required.");
      }
      await updateProfileData({
        name: editName,
        phone: editPhone,
        address: editAddress,
        city: editCity,
        zip: editZip,
      });
      setIsEditing(false);
    } catch (err: any) {
      setUpdateError(err.message || "Failed to update profile record.");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-[#070202] text-[#E1E0CC] selection:bg-red-950 selection:text-primary relative overflow-x-hidden pb-24">
      <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <Navbar absolute={false} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
            ACQUISITION SANCTUARY
          </span>
          <h1 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#E1E0CC] font-light tracking-wide leading-none">
            The Covenant Record
          </h1>
          <div className="w-12 h-[1px] bg-primary/20 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* LEFT: User Profile details (Col 1-5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* profile stats box */}
            <div className="bg-black/60 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-6">
                <div>
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest block">COVENANT WARRIOR</span>
                  <h2 className="text-base sm:text-lg font-serif italic text-[#E1E0CC] mt-1 truncate max-w-[200px]">
                    {profile?.name}
                  </h2>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 border border-white/10 hover:border-primary/45 rounded-lg text-primary hover:text-white transition-all cursor-pointer"
                  aria-label="Edit Profile"
                >
                  {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                  {updateError && (
                    <div className="bg-red-950/20 border border-red-900/40 text-[#ff8080] font-mono text-[9px] rounded p-2 uppercase tracking-wide">
                      {updateError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-primary outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Phone Outreach</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-primary outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">Street Address</label>
                    <input
                      type="text"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-primary outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">City</label>
                      <input
                        type="text"
                        value={editCity}
                        onChange={(e) => setEditCity(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-primary outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">ZIP Code</label>
                      <input
                        type="text"
                        value={editZip}
                        onChange={(e) => setEditZip(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-lg p-2.5 text-xs font-mono text-primary outline-none focus:border-primary/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-primary hover:bg-[#D4D0BC] disabled:bg-primary/50 text-black font-mono font-medium text-[10px] tracking-widest py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center gap-1.5 uppercase font-semibold cursor-pointer"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>RECONCILING LEDGER...</span>
                      </>
                    ) : (
                      <span>UPDATE CREDENTIALS</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-4 font-mono text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary/60 shrink-0" />
                    <span className="truncate">{profile?.email}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                    <span>{profile?.phone || "No outreach number registered."}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {profile?.address ? (
                        <>
                          {profile.address}, <br />
                          {profile.city} - {profile.zip}
                        </>
                      ) : (
                        "No default sanctuary shipping address registered."
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 border-t border-white/5 pt-4 mt-2">
                    <Calendar className="w-4 h-4 text-primary/60 shrink-0" />
                    <span className="text-[10px]">COVENANT BOUND: {profile?.createdAt ? formatDate(profile.createdAt) : "Pending"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogoutClick}
              className="w-full bg-[#5C0606]/10 hover:bg-[#5C0606]/20 border border-[#5C0606]/30 hover:border-[#5C0606]/55 text-primary font-mono text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT OF THE SANCTUARY</span>
            </button>
          </div>

          {/* RIGHT: Order History Ledger (Col 6-12) */}
          <div className="lg:col-span-7 bg-black/60 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col gap-6">
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary/80 border-b border-white/5 pb-3">
              Order Ledger History
            </h2>

            {ordersLoading ? (
              <div className="py-20 text-center">
                <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto mb-4" />
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Loading Order Records...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="flex flex-col gap-6 max-h-[500px] overflow-y-auto pr-1">
                {orders.map((order) => (
                  <div key={order.id} className="border border-white/5 bg-[#090505] rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
                    {/* Order header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[8px] text-gray-500 font-mono uppercase tracking-widest block">ORDER REFERENCE</span>
                        <span className="text-xs text-primary font-mono font-medium">{order.orderNo}</span>
                      </div>
                      <div className="flex gap-4 text-left">
                        <div>
                          <span className="text-[8px] text-gray-500 font-mono uppercase tracking-widest block">DATE RECORDED</span>
                          <span className="text-[10px] text-gray-400 font-mono">{formatDate(order.createdAt)}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 font-mono uppercase tracking-widest block">VALUATION</span>
                          <span className="text-[10px] text-primary font-mono font-semibold">₹{order.total.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 font-mono uppercase tracking-widest block">STATUS</span>
                          <span className="text-[9px] text-[#ffdd77] font-mono uppercase font-semibold bg-[#ffb700]/10 border border-[#ffb700]/20 rounded px-1.5 py-0.5">{order.status || "preparing in dark"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="flex flex-col gap-3">
                      {order.items.map((item) => (
                        <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                          <div className="w-10 h-12 rounded bg-black border border-white/5 overflow-hidden shrink-0">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-[10px] font-semibold text-[#E1E0CC] truncate uppercase tracking-wider">{item.title}</h4>
                            <p className="text-[8px] text-gray-500 font-mono">SIZE: {item.size} / QTY: {item.qty}</p>
                          </div>
                          <span className="text-[10px] font-mono text-primary/80 shrink-0">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-black/40 border border-white/5 rounded-2xl">
                <FileText className="w-8 h-8 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xs text-primary uppercase font-mono tracking-widest mb-1">Ledger is Silent</h3>
                <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider max-w-xs mx-auto leading-relaxed">
                  No ritual acquisitions have been verified under this covenant link.
                </p>
              </div>
            )}

            <div className="flex items-start gap-2.5 bg-[#090505] border border-white/5 rounded-xl p-3.5 mt-2">
              <ShieldAlert className="w-4 h-4 text-primary/60 shrink-0 mt-0.5" />
              <div className="text-[9px] text-gray-500 leading-normal uppercase">
                Any discrepancies inside the inscription ledger must be reported via mail to ritual@ghubor.com.
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
