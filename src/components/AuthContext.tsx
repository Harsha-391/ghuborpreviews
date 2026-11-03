"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { loadFirebase, whenIdle } from "../utils/loadFirebase";

// Firebase is loaded on demand (see utils/loadFirebase) so it never weighs on
// the first paint. The session is restored as soon as the browser is idle, and
// every action below awaits the SDK, so behaviour is unchanged.

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zip?: string;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, pass: string, name: string, phone: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile details from Firestore
  const fetchProfile = async (uid: string) => {
    const localProfile = typeof window !== "undefined" ? localStorage.getItem(`ghubor-user-profile-${uid}`) : null;
    if (localProfile) {
      try {
        setProfile(JSON.parse(localProfile));
      } catch (e) {
        console.error("Failed to parse local profile:", e);
      }
    }

    const { fs, db } = await loadFirebase();
    if (!db) return;
    try {
      const docRef = fs.doc(db, "users", uid);
      const docSnap = await fs.getDoc(docRef);
      if (docSnap.exists()) {
        const profileData = docSnap.data() as UserProfile;
        setProfile(profileData);
        if (typeof window !== "undefined") {
          localStorage.setItem(`ghubor-user-profile-${uid}`, JSON.stringify(profileData));
        }
      } else {
        if (!localProfile) {
          setProfile(null);
        }
      }
    } catch (err) {
      console.error("Error loading user profile from Firestore:", err);
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      loadFirebase().then(({ authSdk, auth }) => {
        if (cancelled) return;
        if (!auth) {
          setLoading(false);
          return;
        }
        unsubscribe = authSdk.onAuthStateChanged(auth, async (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            await fetchProfile(currentUser.uid);
          } else {
            setProfile(null);
          }
          setLoading(false);
        });
      });
    });

    return () => {
      cancelled = true;
      cancelIdle();
      unsubscribe?.();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    const { authSdk, auth } = await loadFirebase();
    if (!auth) {
      throw new Error("Sanctuary database keys are not configured yet in .env.local.");
    }
    setLoading(true);
    try {
      await authSdk.signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    const { authSdk, fs, auth, db } = await loadFirebase();
    if (!auth || !db) {
      throw new Error("Sanctuary database keys are not configured yet in .env.local.");
    }
    setLoading(true);
    try {
      const provider = new authSdk.GoogleAuthProvider();
      const userCredential = await authSdk.signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      const docRef = fs.doc(db, "users", user.uid);
      const docSnap = await fs.getDoc(docRef);
      
      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || "Warrior",
          email: user.email || "",
          phone: "", // Keep empty
          createdAt: new Date().toISOString(),
        };
        await fs.setDoc(docRef, newProfile);
        setProfile(newProfile);
      } else {
        setProfile(docSnap.data() as UserProfile);
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, pass: string, name: string, phone: string) => {
    const { authSdk, fs, auth, db } = await loadFirebase();
    if (!auth || !db) {
      throw new Error("Sanctuary database keys are not configured yet in .env.local.");
    }
    setLoading(true);
    try {
      const userCredential = await authSdk.createUserWithEmailAndPassword(auth, email, pass);
      const uid = userCredential.user.uid;
      
      // Save profile doc to Firestore
      const newProfile: UserProfile = {
        uid,
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
      };

      await fs.setDoc(fs.doc(db, "users", uid), newProfile);
      setProfile(newProfile);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logOut = async () => {
    const { authSdk, auth } = await loadFirebase();
    if (!auth) return;
    setLoading(true);
    try {
      await authSdk.signOut(auth);
      setUser(null);
      setProfile(null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user) return;

    // Immediately update local state & localStorage to make the edit feel workable
    const updatedProfile = profile ? { ...profile, ...data } : {
      uid: user.uid,
      name: data.name || user.displayName || "Warrior",
      email: data.email || user.email || "",
      phone: data.phone || "",
      address: data.address || "",
      city: data.city || "",
      zip: data.zip || "",
      createdAt: new Date().toISOString(),
      ...data
    };
    
    setProfile(updatedProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem(`ghubor-user-profile-${user.uid}`, JSON.stringify(updatedProfile));
    }

    const { fs, db } = await loadFirebase();
    if (!db) return;
    try {
      const docRef = fs.doc(db, "users", user.uid);
      // setDoc with merge: true is much safer than updateDoc because it creates the doc if missing
      await fs.setDoc(docRef, data, { merge: true });
    } catch (err) {
      console.warn("Error updating user profile in Firestore (saved locally instead):", err);
      // Suppress the error so the user doesn't get blocked by permission issues
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signInWithGoogle,
        signUp,
        logOut,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
