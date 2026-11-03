"use client";

// Firebase (Auth + Firestore, ~110 kB gzipped) is loaded on demand instead of
// being bundled into every page's first load. All public-page code that needs
// it goes through here; the module instance is shared with any page that still
// imports ../utils/firebase directly, so there is only ever one Firebase app.
type FirebaseClient = typeof import("./firebaseClient");
type FirebaseBundle = {
  /** Auth functions (onAuthStateChanged, signInWithPopup, ...). */
  authSdk: FirebaseClient;
  /** Firestore functions (doc, getDoc, setDoc). */
  fs: FirebaseClient;
  auth: FirebaseClient["auth"];
  db: FirebaseClient["db"];
};

let pending: Promise<FirebaseBundle> | null = null;

export function loadFirebase(): Promise<FirebaseBundle> {
  if (!pending) {
    pending = import("./firebaseClient").then((m) => ({ authSdk: m, fs: m, auth: m.auth, db: m.db }));
  }
  return pending;
}

/** Run `fn` once the browser is idle (or after `timeout` ms at the latest). */
export function whenIdle(fn: () => void, timeout = 1500): () => void {
  if (typeof window === "undefined") return () => {};
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 1);
  return () => clearTimeout(id);
}
