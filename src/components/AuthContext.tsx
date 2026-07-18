"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

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

    if (!db) return;
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
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
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (!auth) {
      throw new Error("Sanctuary database keys are not configured yet in .env.local.");
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !db) {
      throw new Error("Sanctuary database keys are not configured yet in .env.local.");
    }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || "Warrior",
          email: user.email || "",
          phone: "", // Keep empty
          createdAt: new Date().toISOString(),
        };
        await setDoc(docRef, newProfile);
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
    if (!auth || !db) {
      throw new Error("Sanctuary database keys are not configured yet in .env.local.");
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = userCredential.user.uid;
      
      // Save profile doc to Firestore
      const newProfile: UserProfile = {
        uid,
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", uid), newProfile);
      setProfile(newProfile);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logOut = async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await signOut(auth);
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

    if (!db) return;
    try {
      const docRef = doc(db, "users", user.uid);
      // setDoc with merge: true is much safer than updateDoc because it creates the doc if missing
      await setDoc(docRef, data, { merge: true });
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
