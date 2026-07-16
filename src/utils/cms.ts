/**
 * Ghubor CMS Utilities — Firestore CRUD for Products, Blog Posts, and Categories
 * All entities support dual-theme image fields (lightImage / darkImage).
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { CMSProductImage } from "../data/products";

// ─── TYPE DEFINITIONS ────────────────────────────────────────────────────────

export interface CMSProduct {
  id: string;
  title: string;
  price: string;
  mrp?: string;
  description: string;
  fullDescription: string;
  fabric: string;
  weight: string;
  drop: string;
  category: string;
  darkImage: string;
  lightImage: string;
  galleryDark: string[];
  galleryLight: string[];
  details: string[];
  howToUse: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: number;
  updatedAt: number;
  imagesDark?: CMSProductImage[];
  imagesLight?: CMSProductImage[];
}

export interface CMSBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  darkCoverImage: string;
  lightCoverImage: string;
  category: string;
  tags: string[];
  author: string;
  published: boolean;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  darkPreviewImage: string;
  lightPreviewImage: string;
  order: number;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

// ─── HELPER ──────────────────────────────────────────────────────────────────

function now() {
  return Date.now();
}

function generateId(prefix: string = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── PRODUCTS ────────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<CMSProduct[]> {
  if (!db) return getLocalProducts();
  try {
    const q = query(collection(db, "cms-products"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CMSProduct));
    setLocalProducts(items);
    return items;
  } catch (err) {
    console.warn("fetchProducts: Firestore failed, using local.", err);
    return getLocalProducts();
  }
}

export async function saveProduct(product: CMSProduct): Promise<void> {
  const updated = { ...product, updatedAt: now() };
  if (!db) {
    upsertLocalItem("ghubor-cms-products", updated);
    return;
  }
  try {
    const ref = doc(db, "cms-products", product.id);
    await setDoc(ref, updated);
    upsertLocalItem("ghubor-cms-products", updated);
  } catch (err) {
    console.error("saveProduct failed:", err);
    upsertLocalItem("ghubor-cms-products", updated);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!db) {
    deleteLocalItem("ghubor-cms-products", id);
    return;
  }
  try {
    await deleteDoc(doc(db, "cms-products", id));
    deleteLocalItem("ghubor-cms-products", id);
  } catch (err) {
    console.error("deleteProduct failed:", err);
    deleteLocalItem("ghubor-cms-products", id);
  }
}

export function createEmptyProduct(): CMSProduct {
  return {
    id: generateId("product"),
    title: "",
    price: "",
    description: "",
    fullDescription: "",
    fabric: "",
    weight: "",
    drop: "DROP 01",
    category: "",
    darkImage: "",
    lightImage: "",
    galleryDark: [],
    galleryLight: [],
    details: [],
    howToUse: [],
    featured: false,
    published: false,
    order: 99,
    createdAt: now(),
    updatedAt: now(),
    imagesDark: [],
    imagesLight: [],
  };
}

// ─── BLOG POSTS ──────────────────────────────────────────────────────────────

export async function fetchBlogPosts(): Promise<CMSBlogPost[]> {
  if (!db) return getLocalBlogs();
  try {
    const q = query(collection(db, "cms-blog"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CMSBlogPost));
    setLocalBlogs(items);
    return items;
  } catch (err) {
    console.warn("fetchBlogPosts: Firestore failed, using local.", err);
    return getLocalBlogs();
  }
}

export async function saveBlogPost(post: CMSBlogPost): Promise<void> {
  const updated = { ...post, updatedAt: now() };
  if (!db) {
    upsertLocalItem("ghubor-cms-blog", updated);
    return;
  }
  try {
    const ref = doc(db, "cms-blog", post.id);
    await setDoc(ref, updated);
    upsertLocalItem("ghubor-cms-blog", updated);
  } catch (err) {
    console.error("saveBlogPost failed:", err);
    upsertLocalItem("ghubor-cms-blog", updated);
  }
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (!db) {
    deleteLocalItem("ghubor-cms-blog", id);
    return;
  }
  try {
    await deleteDoc(doc(db, "cms-blog", id));
    deleteLocalItem("ghubor-cms-blog", id);
  } catch (err) {
    console.error("deleteBlogPost failed:", err);
    deleteLocalItem("ghubor-cms-blog", id);
  }
}

export function createEmptyBlogPost(): CMSBlogPost {
  return {
    id: generateId("blog"),
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    darkCoverImage: "",
    lightCoverImage: "",
    category: "",
    tags: [],
    author: "Ghubor",
    published: false,
    featured: false,
    createdAt: now(),
    updatedAt: now(),
  };
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<CMSCategory[]> {
  if (!db) return getLocalCategories();
  try {
    const q = query(collection(db, "cms-categories"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CMSCategory));
    setLocalCategories(items);
    return items;
  } catch (err) {
    console.warn("fetchCategories: Firestore failed, using local.", err);
    return getLocalCategories();
  }
}

export async function saveCategory(cat: CMSCategory): Promise<void> {
  const updated = { ...cat, updatedAt: now() };
  if (!db) {
    upsertLocalItem("ghubor-cms-categories", updated);
    return;
  }
  try {
    const ref = doc(db, "cms-categories", cat.id);
    await setDoc(ref, updated);
    upsertLocalItem("ghubor-cms-categories", updated);
  } catch (err) {
    console.error("saveCategory failed:", err);
    upsertLocalItem("ghubor-cms-categories", updated);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  if (!db) {
    deleteLocalItem("ghubor-cms-categories", id);
    return;
  }
  try {
    await deleteDoc(doc(db, "cms-categories", id));
    deleteLocalItem("ghubor-cms-categories", id);
  } catch (err) {
    console.error("deleteCategory failed:", err);
    deleteLocalItem("ghubor-cms-categories", id);
  }
}

export function createEmptyCategory(): CMSCategory {
  return {
    id: generateId("cat"),
    name: "",
    slug: "",
    description: "",
    darkPreviewImage: "",
    lightPreviewImage: "",
    order: 99,
    published: false,
    createdAt: now(),
    updatedAt: now(),
  };
}

// ─── LOCALSTORAGE FALLBACK ────────────────────────────────────────────────────

function getLocalProducts(): CMSProduct[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem("ghubor-cms-products");
  return s ? JSON.parse(s) : [];
}
function setLocalProducts(items: CMSProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ghubor-cms-products", JSON.stringify(items));
}

function getLocalBlogs(): CMSBlogPost[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem("ghubor-cms-blog");
  return s ? JSON.parse(s) : [];
}
function setLocalBlogs(items: CMSBlogPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ghubor-cms-blog", JSON.stringify(items));
}

function getLocalCategories(): CMSCategory[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem("ghubor-cms-categories");
  return s ? JSON.parse(s) : [];
}
function setLocalCategories(items: CMSCategory[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ghubor-cms-categories", JSON.stringify(items));
}

function upsertLocalItem(key: string, item: { id: string }) {
  if (typeof window === "undefined") return;
  const s = localStorage.getItem(key);
  const list: any[] = s ? JSON.parse(s) : [];
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx > -1) list[idx] = item;
  else list.push(item);
  localStorage.setItem(key, JSON.stringify(list));
}

function deleteLocalItem(key: string, id: string) {
  if (typeof window === "undefined") return;
  const s = localStorage.getItem(key);
  const list: any[] = s ? JSON.parse(s) : [];
  localStorage.setItem(key, JSON.stringify(list.filter((x) => x.id !== id)));
}

// ─── COUPONS ──────────────────────────────────────────────────────────────────

export interface CMSCoupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount: number;
  active: boolean;
  createdAt: number;
}

export async function fetchCoupons(): Promise<CMSCoupon[]> {
  if (!db) return getLocalCoupons();
  try {
    const q = query(collection(db, "cms-coupons"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() } as CMSCoupon));
    setLocalCoupons(items);
    return items;
  } catch (err) {
    console.warn("fetchCoupons: Firestore failed, using local.", err);
    return getLocalCoupons();
  }
}

export async function saveCoupon(coupon: CMSCoupon): Promise<void> {
  if (!db) {
    upsertLocalItem("ghubor-cms-coupons", coupon);
    return;
  }
  try {
    const ref = doc(db, "cms-coupons", coupon.id);
    await setDoc(ref, coupon);
    upsertLocalItem("ghubor-cms-coupons", coupon);
  } catch (err) {
    console.error("saveCoupon failed:", err);
    upsertLocalItem("ghubor-cms-coupons", coupon);
  }
}

export async function deleteCoupon(id: string): Promise<void> {
  if (!db) {
    deleteLocalItem("ghubor-cms-coupons", id);
    return;
  }
  try {
    await deleteDoc(doc(db, "cms-coupons", id));
    deleteLocalItem("ghubor-cms-coupons", id);
  } catch (err) {
    console.error("deleteCoupon failed:", err);
    deleteLocalItem("ghubor-cms-coupons", id);
  }
}

function getLocalCoupons(): CMSCoupon[] {
  if (typeof window === "undefined") return [];
  const s = localStorage.getItem("ghubor-cms-coupons");
  return s ? JSON.parse(s) : [];
}

function setLocalCoupons(items: CMSCoupon[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ghubor-cms-coupons", JSON.stringify(items));
}

