/**
 * Ghubor Analytics — lightweight tracking for page views, product views, and searches.
 * Stores event data in Firestore `analytics` collection and summarises in `analytics/summary`.
 */

import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  totalSearches: number;
  productViews: Record<string, number>; // productId → view count
  searchTerms: Record<string, number>;  // term → count
  dailyViews: Record<string, number>;   // YYYY-MM-DD → count
  updatedAt: number;
}

// ─── SESSION HELPERS ──────────────────────────────────────────────────────────

function getVisitorId(): string {
  if (typeof window === "undefined") return "ssr";
  let vid = localStorage.getItem("ghubor-vid");
  if (!vid) {
    vid = `v-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem("ghubor-vid", vid);
  }
  return vid;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function isNewVisitorToday(): boolean {
  if (typeof window === "undefined") return false;
  const key = `ghubor-visit-${todayKey()}`;
  const seen = sessionStorage.getItem(key);
  if (!seen) {
    sessionStorage.setItem(key, "1");
    return true;
  }
  return false;
}

// ─── CORE TRACKING ────────────────────────────────────────────────────────────

export async function trackPageView(path: string): Promise<void> {
  if (typeof window === "undefined") return;
  const today = todayKey();
  const isNew = isNewVisitorToday();

  // Local cache for immediate dashboard display
  const local = getLocalSummary();
  local.totalPageViews = (local.totalPageViews || 0) + 1;
  if (isNew) local.uniqueVisitors = (local.uniqueVisitors || 0) + 1;
  local.dailyViews = local.dailyViews || {};
  local.dailyViews[today] = (local.dailyViews[today] || 0) + 1;
  local.updatedAt = Date.now();
  setLocalSummary(local);

  if (!db) return;
  try {
    const ref = doc(db, "analytics", "summary");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, {
        totalPageViews: increment(1),
        ...(isNew ? { uniqueVisitors: increment(1) } : {}),
        [`dailyViews.${today}`]: increment(1),
        updatedAt: Date.now(),
      });
    } else {
      await setDoc(ref, {
        totalPageViews: 1,
        uniqueVisitors: isNew ? 1 : 0,
        totalSearches: 0,
        productViews: {},
        searchTerms: {},
        dailyViews: { [today]: 1 },
        updatedAt: Date.now(),
      });
    }
  } catch (e) {
    // Silently ignore — analytics must never block the UI
  }
}

export async function trackProductView(productId: string): Promise<void> {
  if (typeof window === "undefined") return;

  const local = getLocalSummary();
  local.productViews = local.productViews || {};
  local.productViews[productId] = (local.productViews[productId] || 0) + 1;
  setLocalSummary(local);

  if (!db) return;
  try {
    const ref = doc(db, "analytics", "summary");
    await updateDoc(ref, {
      [`productViews.${productId}`]: increment(1),
      updatedAt: Date.now(),
    }).catch(() => setDoc(ref, {
      totalPageViews: 0, uniqueVisitors: 0, totalSearches: 0,
      productViews: { [productId]: 1 }, searchTerms: {}, dailyViews: {}, updatedAt: Date.now(),
    }));
  } catch (e) { /* silent */ }
}

export async function trackSearch(term: string): Promise<void> {
  if (typeof window === "undefined" || !term.trim()) return;
  const key = term.trim().toLowerCase();

  const local = getLocalSummary();
  local.searchTerms = local.searchTerms || {};
  local.searchTerms[key] = (local.searchTerms[key] || 0) + 1;
  local.totalSearches = (local.totalSearches || 0) + 1;
  setLocalSummary(local);

  if (!db) return;
  try {
    const ref = doc(db, "analytics", "summary");
    await updateDoc(ref, {
      [`searchTerms.${key}`]: increment(1),
      totalSearches: increment(1),
      updatedAt: Date.now(),
    }).catch(() => { /* doc may not exist yet */ });
  } catch (e) { /* silent */ }
}

// ─── FETCH FOR DASHBOARD ──────────────────────────────────────────────────────

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const fallback = getLocalSummary();
  if (!db) return fallback;
  try {
    const ref = doc(db, "analytics", "summary");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as AnalyticsSummary;
      setLocalSummary(data);
      return data;
    }
    return fallback;
  } catch (e) {
    return fallback;
  }
}

export async function fetchOrders() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "orders"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];
  } catch (e) {
    return [];
  }
}

// ─── LOCAL FALLBACK ───────────────────────────────────────────────────────────

function getLocalSummary(): AnalyticsSummary {
  if (typeof window === "undefined") return emptyAnalytics();
  const s = localStorage.getItem("ghubor-analytics");
  return s ? JSON.parse(s) : emptyAnalytics();
}

function setLocalSummary(data: AnalyticsSummary) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ghubor-analytics", JSON.stringify(data));
}

function emptyAnalytics(): AnalyticsSummary {
  return {
    totalPageViews: 0,
    uniqueVisitors: 0,
    totalSearches: 0,
    productViews: {},
    searchTerms: {},
    dailyViews: {},
    updatedAt: Date.now(),
  };
}

// ─── HELPERS FOR DASHBOARD ────────────────────────────────────────────────────

export function getTopProducts(summary: AnalyticsSummary, n = 5) {
  return Object.entries(summary.productViews || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, views]) => ({ id, views }));
}

export function getTopSearches(summary: AnalyticsSummary, n = 8) {
  return Object.entries(summary.searchTerms || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([term, count]) => ({ term, count }));
}

export function getLast7DaysViews(summary: AnalyticsSummary): { date: string; views: number }[] {
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, views: summary.dailyViews?.[key] || 0 });
  }
  return result;
}
