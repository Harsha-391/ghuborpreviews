"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, RefreshCw, Sparkles, Check, Image as ImageIcon,
  Sun, Moon, LayoutGrid, Package, BookOpen, Tag, Plus, Trash2,
  Globe, Lock, Search, X, Star, ToggleLeft, ToggleRight,
  Truck, TrendingUp, ShoppingBag, DollarSign, Users, Eye, EyeOff, Mail,
  BarChart2, AlertCircle, Upload, ChevronRight, Clock,
  ArrowUpRight, Layers, Settings, Filter, ExternalLink, Zap, Loader2,
  Warehouse, Sliders, Clipboard, Edit3, Printer, Download, CheckCircle
} from "lucide-react";
import { useImageConfig, DEFAULT_IMAGE_CONFIGS, ImageConfigs } from "../../components/ImageConfigContext";
import { useTheme } from "../../components/ThemeContext";
import {
  CMSProduct, CMSBlogPost, CMSCategory, CMSCoupon,
  fetchProducts, saveProduct, deleteProduct, createEmptyProduct,
  fetchBlogPosts, saveBlogPost, deleteBlogPost, createEmptyBlogPost,
  fetchCategories, saveCategory, deleteCategory, createEmptyCategory,
  fetchCoupons, saveCoupon, deleteCoupon
} from "../../utils/cms";
import {
  fetchAnalyticsSummary, fetchOrders, getTopProducts, getTopSearches,
  getLast7DaysViews, AnalyticsSummary
} from "../../utils/analytics";
import { uploadImage, createPreviewUrl, revokePreviewUrl, UploadFolder } from "../../utils/imageUpload";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type AdminTab = "overview" | "images" | "products" | "blog" | "categories" | "coupons" | "orders" | "shipping";

const PREMIUM_LIGHT_PRESETS: Record<string, string> = {
  hero: "/images/hero-light.png",
  struggle: "/images/pillars/struggle-light.png",
  faith: "/images/pillars/faith-light.png",
  transcendence: "/images/pillars/transcendence-light.png",
  glyph: "/images/details/glyph-light.png",
  tag: "/images/details/tag-light.png",
  scripture: "/images/details/scripture-light.png",
  "product-hoodie": "/images/products/hoodie-light.png",
  "product-jacket": "/images/products/jacket-light.png",
  "product-longsleeve": "/images/products/longsleeve-light.png",
  "product-pants": "/images/products/pants-light.png",
  "product-tshirt": "/images/products/tshirt-light.png",
  "product-cap": "/images/products/cap-light.png",
};

// ─── DRAG & DROP IMAGE UPLOADER ───────────────────────────────────────────────

function DragDropUploader({
  label, value, onChange, folder, theme: uploadTheme
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  theme: "dark" | "light";
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && !value.startsWith("blob:")) {
      setPreview(value);
    }
  }, [value]);

  const handleFile = useCallback(async (file: File) => {
    setError("");
    const previewUrl = createPreviewUrl(file);
    setPreview(previewUrl);
    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, folder, uploadTheme, (p) => {
        setProgress(p.percent);
        if (p.state === "error") {
          setError(p.error || "Upload failed");
          setUploading(false);
        }
      });
      onChange(url);
      setPreview(url);
      revokePreviewUrl(previewUrl);
    } catch (err: any) {
      setError(err.message || "Upload failed. Check Firebase Storage rules.");
      setPreview(value || "");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [folder, uploadTheme, onChange, value]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const isDark = uploadTheme === "dark";

  return (
    <div className="space-y-2">
      <label className={`text-[9px] font-mono tracking-wider uppercase inline-flex items-center gap-1 px-2 py-0.5 rounded border ${
        isDark
          ? "text-[#E1E0CC] bg-[#111] border-white/10"
          : "text-[#5C0606] bg-[#FFF0E8] border-[#5C0606]/20"
      }`}>
        {isDark ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
        {label}
      </label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative w-full rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group ${
          dragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : preview
              ? "border-border-theme hover:border-primary/40"
              : "border-border-theme hover:border-primary/50 hover:bg-primary/5"
        }`}
        style={{ minHeight: preview ? "160px" : "120px" }}
      >
        {/* Background preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setPreview("")}
          />
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all ${
          preview
            ? "bg-black/60 opacity-0 group-hover:opacity-100"
            : "bg-transparent opacity-100"
        }`}>
          {uploading ? (
            <>
              <div className="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center relative">
                <div
                  className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"
                  style={{ animationDuration: "0.8s" }}
                />
                <span className="text-[10px] font-mono text-primary">{progress}%</span>
              </div>
              <span className="text-[10px] font-mono text-text-muted">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className={`w-6 h-6 ${preview ? "text-white" : "text-text-dim"}`} />
              <div className="text-center px-4">
                <p className={`text-[11px] font-mono ${preview ? "text-white" : "text-text-muted"}`}>
                  {preview ? "Drop to replace" : "Drag & drop image here"}
                </p>
                <p className={`text-[10px] font-mono ${preview ? "text-white/60" : "text-text-dim"}`}>
                  or click to browse · JPG, PNG, WEBP · max 10MB
                </p>
              </div>
            </>
          )}
        </div>

        {/* Remove button when preview exists */}
        {preview && !uploading && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(""); setPreview(""); }}
            className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors z-10"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-red-400 font-mono">{error}</p>
        </div>
      )}
    </div>
  );
}

// Dual uploader (dark + light side by side)
function DualImageUploader({
  label, darkValue, lightValue, onDarkChange, onLightChange, folder
}: {
  label: string;
  darkValue: string;
  lightValue: string;
  onDarkChange: (url: string) => void;
  onLightChange: (url: string) => void;
  folder: UploadFolder;
}) {
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{label}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DragDropUploader label="Dark Theme Image" value={darkValue} onChange={onDarkChange} folder={folder} theme="dark" />
        <DragDropUploader label="Light Theme Image" value={lightValue} onChange={onLightChange} folder={folder} theme="light" />
      </div>
    </div>
  );
}

// ─── MINI COMPONENTS ──────────────────────────────────────────────────────────

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border ${
      published
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
    }`}>
      {published ? <Globe className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
      {published ? "Live" : "Draft"}
    </span>
  );
}

function FieldInput({
  label, value, onChange, placeholder, multiline = false, mono = false
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; mono?: boolean;
}) {
  const cls = `w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2.5 text-sm focus:border-primary focus:outline-none transition-colors resize-none ${mono ? "font-mono text-xs" : ""}`;
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{label}</label>
      {multiline
        ? <textarea rows={4} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border-theme last:border-0">
      <span className="text-xs font-mono text-text-muted uppercase tracking-wider">{label}</span>
      <button type="button" onClick={() => onChange(!value)}
        className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${value ? "text-emerald-400" : "text-text-dim"}`}>
        {value ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}

function TagListInput({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange([...value, input.trim()]);
      setInput("");
    }
  };
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{label}</label>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add item and press Enter"
          className="flex-1 bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none transition-colors" />
        <button type="button" onClick={add}
          className="bg-primary/10 border border-primary/30 text-primary px-3 py-2 rounded-lg text-xs hover:bg-primary/20 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 bg-bg-card border border-border-theme text-text-muted text-[10px] font-mono px-2 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="hover:text-red-400 transition-colors">
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ children, title, subtitle }: { children: React.ReactNode; title?: string; subtitle?: string }) {
  return (
    <div className="bg-bg-card border border-border-theme rounded-2xl overflow-hidden">
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-border-theme">
          {title && <h4 className="font-serif italic text-base text-text-page">{title}</h4>}
          {subtitle && <p className="text-[11px] text-text-dim mt-0.5">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// Mini stat card
function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) {
  return (
    <div className="bg-bg-card border border-border-theme rounded-2xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color.replace("text-", "bg-").replace("-400", "-500/10")}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-light text-text-page tabular-nums truncate">{value}</p>
        <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-text-dim mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// Sparkline-style bar chart
function MiniBarChart({ data }: { data: { date: string; views: number }[] }) {
  const max = Math.max(...data.map(d => d.views), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div
            className="w-full bg-primary/30 hover:bg-primary/60 rounded-sm transition-all cursor-default"
            style={{ height: `${Math.max((d.views / max) * 100, 4)}%` }}
          />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-bg-card border border-border-theme text-[8px] font-mono px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
            {d.views} views · {d.date.slice(5)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── OVERVIEW / DASHBOARD TAB ─────────────────────────────────────────────────

function OverviewTab({ products, blogPosts, categories, theme }: {
  products: CMSProduct[]; blogPosts: CMSBlogPost[]; categories: CMSCategory[]; theme: string;
}) {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalyticsSummary(), fetchOrders()]).then(([a, o]) => {
      setAnalytics(a);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-5 h-5 animate-spin text-primary" />
    </div>
  );

  const revenue = orders.reduce((acc: number, o: any) => acc + (o.total || 0), 0);
  const liveProducts = products.filter(p => p.published).length;
  const draftProducts = products.length - liveProducts;
  const topProducts = getTopProducts(analytics!, 5);
  const topSearches = getTopSearches(analytics!, 8);
  const chartData = getLast7DaysViews(analytics!);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusColor: Record<string, string> = {
    "preparing in dark": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "shipped": "text-sky-400 bg-sky-500/10 border-sky-500/20",
    "delivered": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "cancelled": "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Theme indicator banner */}
      <div className={`rounded-2xl p-5 border flex items-center gap-4 ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#0a0a0a] to-[#120b0b] border-[#DEDBC8]/10"
          : "bg-gradient-to-r from-[#FFF8F0] to-[#F2F1EA] border-[#5C0606]/15"
      }`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme === "dark" ? "bg-[#DEDBC8]/10" : "bg-[#5C0606]/10"}`}>
          {theme === "dark" ? <Moon className="w-5 h-5 text-[#DEDBC8]" /> : <Sun className="w-5 h-5 text-[#5C0606]" />}
        </div>
        <div>
          <h3 className="font-serif italic text-lg text-text-page">{theme === "dark" ? "Dark Mode Panel" : "Light Mode Panel"}</h3>
          <p className="text-[11px] text-text-muted">Toggle the header switch to manage the other theme&apos;s visuals.</p>
        </div>
        <div className="ml-auto text-[10px] font-mono text-text-dim uppercase tracking-widest hidden md:block">
          Last updated: {new Date(analytics?.updatedAt || Date.now()).toLocaleTimeString()}
        </div>
      </div>

      {/* Revenue + key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} icon={DollarSign} color="text-emerald-400" sub={`${orders.length} orders`} />
        <StatCard label="Live Products" value={liveProducts} icon={Package} color="text-sky-400" sub={`${draftProducts} drafts`} />
        <StatCard label="Site Traffic" value={analytics?.totalPageViews || 0} icon={TrendingUp} color="text-violet-400" sub={`${analytics?.uniqueVisitors || 0} unique`} />
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} color="text-amber-400" sub={`₹${revenue > 0 ? Math.round(revenue / Math.max(orders.length, 1)).toLocaleString("en-IN") : 0} avg`} />
      </div>

      {/* Charts + Top lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Traffic chart */}
        <div className="lg:col-span-2 bg-bg-card border border-border-theme rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif italic text-base text-text-page">Site Traffic</h4>
              <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Last 7 days</p>
            </div>
            <BarChart2 className="w-4 h-4 text-text-dim" />
          </div>
          <MiniBarChart data={chartData} />
          <div className="flex gap-4 pt-2 border-t border-border-theme">
            <div>
              <p className="text-lg font-light text-text-page tabular-nums">{analytics?.totalPageViews || 0}</p>
              <p className="text-[9px] font-mono text-text-dim uppercase">Total Views</p>
            </div>
            <div>
              <p className="text-lg font-light text-text-page tabular-nums">{analytics?.uniqueVisitors || 0}</p>
              <p className="text-[9px] font-mono text-text-dim uppercase">Unique Visitors</p>
            </div>
            <div>
              <p className="text-lg font-light text-text-page tabular-nums">{analytics?.totalSearches || 0}</p>
              <p className="text-[9px] font-mono text-text-dim uppercase">Searches</p>
            </div>
          </div>
        </div>

        {/* Most searched */}
        <div className="bg-bg-card border border-border-theme rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif italic text-base text-text-page">Top Searches</h4>
              <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Most searched</p>
            </div>
            <Search className="w-4 h-4 text-text-dim" />
          </div>
          <div className="space-y-2">
            {topSearches.length === 0 ? (
              <p className="text-xs text-text-dim text-center py-6">No searches recorded yet</p>
            ) : topSearches.map(({ term, count }, i) => (
              <div key={term} className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-text-dim w-4 tabular-nums">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs text-text-page truncate capitalize">{term}</span>
                    <span className="text-[10px] font-mono text-text-muted">{count}</span>
                  </div>
                  <div className="h-1 bg-bg-page rounded-full overflow-hidden">
                    <div className="h-full bg-primary/40 rounded-full" style={{ width: `${(count / (topSearches[0]?.count || 1)) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most visited products + recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Most visited products */}
        <div className="bg-bg-card border border-border-theme rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif italic text-base text-text-page">Most Visited</h4>
              <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Product page views</p>
            </div>
            <Eye className="w-4 h-4 text-text-dim" />
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-text-dim text-center py-6">No product views recorded yet</p>
            ) : topProducts.map(({ id, views }, i) => {
              const product = products.find(p => p.id === id);
              const name = product?.title || id;
              const img = product?.darkImage || product?.lightImage || "";
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-text-dim w-4 tabular-nums">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-bg-page border border-border-theme overflow-hidden shrink-0">
                    {img && <img src={img} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-page truncate">{name}</p>
                    <p className="text-[10px] font-mono text-text-dim">{views} views</p>
                  </div>
                  <div className="w-16 h-1.5 bg-bg-page rounded-full overflow-hidden">
                    <div className="h-full bg-violet-400/60 rounded-full" style={{ width: `${(views / (topProducts[0]?.views || 1)) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-bg-card border border-border-theme rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-serif italic text-base text-text-page">Recent Orders</h4>
              <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">Latest 5</p>
            </div>
            <ShoppingBag className="w-4 h-4 text-text-dim" />
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-text-dim text-center py-6">No orders yet</p>
            ) : recentOrders.map((o: any) => (
              <div key={o.id} className="flex items-center gap-3 border-b border-border-theme pb-3 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-text-page">{o.orderNo}</p>
                  <p className="text-[10px] text-text-dim truncate">{o.shippingAddress?.name || "Guest"} · {o.items?.length || 0} items</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-mono text-primary">₹{(o.total || 0).toLocaleString("en-IN")}</p>
                  <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${
                    statusColor[o.status] || "text-text-dim bg-bg-page border-border-theme"
                  }`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── IMAGES TAB ───────────────────────────────────────────────────────────────

function ImagesTab({ formState, setFormState, handleSave, handleLoadPresets, handleReset, saveSuccess, presetLoaded, resetSuccess }: {
  formState: ImageConfigs;
  setFormState: React.Dispatch<React.SetStateAction<ImageConfigs>>;
  handleSave: (e: React.FormEvent) => void;
  handleLoadPresets: () => void;
  handleReset: () => void;
  saveSuccess: boolean; presetLoaded: boolean; resetSuccess: boolean;
}) {
  const slotToFolder: Record<string, UploadFolder> = {
    hero: "hero",
    struggle: "pillars", faith: "pillars", transcendence: "pillars",
    glyph: "details", tag: "details", scripture: "details",
  };

  const getFolder = (id: string): UploadFolder => {
    if (slotToFolder[id]) return slotToFolder[id];
    if (id.startsWith("product-")) return "products";
    return "details";
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleLoadPresets}
          className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-mono text-[10px] tracking-widest px-4 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          {presetLoaded ? "PRESETS LOADED!" : "LOAD PREMIUM PRESETS"}
        </button>
        <button type="button" onClick={handleReset}
          className="bg-transparent hover:bg-bg-card-alt border border-border-theme text-text-muted hover:text-text-page font-mono text-[10px] tracking-widest px-4 py-2.5 rounded-full flex items-center gap-2 transition-all cursor-pointer uppercase">
          <RefreshCw className="w-3.5 h-3.5" />
          {resetSuccess ? "RESET DONE" : "RESET ALL"}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(formState).map(([id, config]) => (
          <div key={id} className="bg-bg-card border border-border-theme rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono text-primary/60 tracking-widest uppercase bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">{id}</span>
              <h4 className="font-serif italic text-base text-text-page">{config.label}</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DragDropUploader
                label="Dark Image"
                value={config.darkUrl}
                onChange={(url) => setFormState(prev => ({ ...prev, [id]: { ...prev[id], darkUrl: url } }))}
                folder={getFolder(id)}
                theme="dark"
              />
              <DragDropUploader
                label="Light Image"
                value={config.lightUrl}
                onChange={(url) => setFormState(prev => ({ ...prev, [id]: { ...prev[id], lightUrl: url } }))}
                folder={getFolder(id)}
                theme="light"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-6 bg-bg-nav/90 border border-border-theme backdrop-blur-md rounded-2xl p-4 flex items-center justify-between shadow-2xl z-30">
        <span className="text-xs font-mono text-text-muted hidden sm:flex items-center gap-2">
          {saveSuccess && <Check className="w-4 h-4 text-emerald-400" />}
          {saveSuccess ? <span className="text-emerald-400">Saved!</span> : "Upload images by dragging into the zones above"}
        </span>
        <button type="submit"
          className="bg-primary hover:bg-primary/95 text-bg-page font-mono font-semibold text-xs tracking-widest py-3 px-6 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-lg uppercase ml-auto">
          <Save className="w-4 h-4" />
          {saveSuccess ? "SAVED!" : "SAVE CONFIGS"}
        </button>
      </div>
    </form>
  );
}

// ─── COUPONS TAB ──────────────────────────────────────────────────────────────

function CouponsTab() {
  const [coupons, setCoupons] = useState<CMSCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CMSCoupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCoupons().then(d => {
      setCoupons(d);
      setLoading(false);
    });
  }, []);

  const filtered = coupons.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await saveCoupon(editing);
    setSaved(true);
    setCoupons(prev => {
      const idx = prev.findIndex(c => c.id === editing.id);
      if (idx > -1) {
        const n = [...prev];
        n[idx] = editing;
        return n;
      }
      return [editing, ...prev];
    });
    setTimeout(() => {
      setSaving(false);
      setSaved(false);
      setEditing(null);
    }, 1500);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon? This action is permanent.")) return;
    await deleteCoupon(id);
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const createNew = () => {
    setEditing({
      id: `coupon-${Date.now()}`,
      code: "",
      type: "percentage",
      value: 10,
      minAmount: 0,
      active: true,
      createdAt: Date.now()
    });
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-mono text-text-muted uppercase tracking-widest animate-pulse">
        Accessing Coupon Vault...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT: Coupons List */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search coupons..."
              className="w-full bg-bg-card border border-border-theme rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors uppercase"
            />
          </div>
          <button
            onClick={createNew}
            className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-bg-page font-mono font-semibold text-xs tracking-widest py-3 px-6 rounded-full flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-md uppercase"
          >
            <Plus className="w-4 h-4" />
            Create Coupon
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-theme rounded-2xl bg-bg-card/30">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest">No active coupons in database</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(coupon => (
              <div
                key={coupon.id}
                className="bg-bg-card border border-border-theme rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-all"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-text-page tracking-wider uppercase bg-bg-page border border-border-theme rounded px-2 py-0.5">
                      {coupon.code}
                    </span>
                    {!coupon.active && (
                      <span className="text-[8px] font-mono tracking-widest uppercase bg-red-950/20 text-red-400 border border-red-900/30 px-1.5 py-0.5 rounded">
                        DRAFT
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-text-muted mt-2 uppercase tracking-wide">
                    {coupon.type === "percentage" ? `${coupon.value}% Discount` : `₹${coupon.value} Off`} 
                    {coupon.minAmount > 0 && ` • Min Order: ₹${coupon.minAmount}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setEditing(coupon)}
                    className="p-2.5 rounded-lg border border-border-theme hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer bg-bg-card-alt"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2.5 rounded-lg border border-border-theme hover:border-red-500/20 text-text-muted hover:text-red-400 transition-colors cursor-pointer bg-bg-card-alt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: Editor Panel */}
      <div className="lg:col-span-5 bg-bg-card border border-border-theme rounded-2xl p-6 shadow-md relative">
        {editing ? (
          <form onSubmit={e => { e.preventDefault(); handleSave(); }} className="flex flex-col gap-5">
            <h3 className="font-serif italic text-lg text-primary border-b border-border-theme pb-3">
              Configure Coupon
            </h3>

            {/* Code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Coupon Code</label>
              <input
                type="text"
                required
                value={editing.code}
                onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "") })}
                placeholder="COVENANT20"
                className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors uppercase"
              />
            </div>

            {/* Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Type</label>
                <select
                  value={editing.type}
                  onChange={e => setEditing({ ...editing, type: e.target.value as "percentage" | "fixed" })}
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Value</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editing.value}
                  onChange={e => setEditing({ ...editing, value: parseInt(e.target.value, 10) || 0 })}
                  className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Min Amount */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Min order amount (₹)</label>
              <input
                type="number"
                min={0}
                value={editing.minAmount}
                onChange={e => setEditing({ ...editing, minAmount: parseInt(e.target.value, 10) || 0 })}
                className="bg-bg-page/40 border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 border border-border-theme rounded-xl bg-bg-page/20">
              <div>
                <span className="text-[10px] font-mono text-text-page uppercase tracking-wide block">Active Status</span>
                <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider">Turn off to temporarily disable</span>
              </div>
              <button
                type="button"
                onClick={() => setEditing({ ...editing, active: !editing.active })}
                className="text-primary hover:text-white transition-colors cursor-pointer bg-transparent border-none outline-none"
              >
                {editing.active ? (
                  <ToggleRight className="w-7 h-7 text-primary" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-text-dim" />
                )}
              </button>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex-1 bg-transparent hover:bg-bg-card-alt border border-border-theme text-text-muted font-mono text-xs py-3.5 rounded-full transition-colors cursor-pointer uppercase bg-transparent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-primary hover:bg-primary/95 text-bg-page font-mono font-semibold text-xs tracking-widest py-3.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md uppercase"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SAVING...</span>
                  </>
                ) : saved ? (
                  <span>SAVED!</span>
                ) : (
                  <span>SAVE COUPON</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-24 text-center">
            <Tag className="w-8 h-8 text-primary/40 mx-auto mb-4 animate-pulse" />
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest leading-relaxed">
              Select a coupon to edit or click<br/>
              <span className="text-primary font-bold">&quot;Create Coupon&quot;</span> to add new drop promotions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const [products, setProducts] = useState<CMSProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CMSProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchProducts().then(d => { setProducts(d); setLoading(false); }); }, []);

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await saveProduct(editing);
    setSaved(true);
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === editing.id);
      if (idx > -1) { const n = [...prev]; n[idx] = editing; return n; }
      return [editing, ...prev];
    });
    setTimeout(() => { setSaving(false); setSaved(false); }, 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? Cannot be undone.")) return;
    await deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const update = (field: keyof CMSProduct, value: any) => setEditing(prev => prev ? { ...prev, [field]: value } : null);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-200px)]">
      {/* List */}
      <div className={`flex flex-col gap-4 ${editing ? "w-80 hidden xl:flex shrink-0" : "w-full"}`}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full bg-bg-card border border-border-theme rounded-full pl-9 pr-4 py-2.5 text-xs font-mono focus:border-primary focus:outline-none transition-colors" />
          </div>
          <button onClick={() => setEditing(createEmptyProduct())}
            className="bg-primary text-bg-page font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <Package className="w-10 h-10 text-text-dim" />
              <p className="text-sm text-text-muted">No products yet</p>
              <button onClick={() => setEditing(createEmptyProduct())}
                className="bg-primary/10 border border-primary/30 text-primary font-mono text-xs px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                <Plus className="w-3.5 h-3.5 inline mr-1" />Create Product
              </button>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} onClick={() => setEditing(p)}
              className={`bg-bg-card border rounded-xl p-4 cursor-pointer group transition-all hover:border-primary/30 ${editing?.id === p.id ? "border-primary/50 bg-primary/5" : "border-border-theme"}`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-14 bg-bg-page rounded-lg overflow-hidden shrink-0 border border-border-theme">
                  {(p.darkImage || p.lightImage) && (
                    <img src={p.darkImage || p.lightImage} alt="" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLElement).style.opacity = "0"; }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge published={p.published} />
                    {p.featured && <Star className="w-3 h-3 text-amber-400" />}
                  </div>
                  <p className="text-sm font-serif italic text-text-page truncate">{p.title || "Untitled"}</p>
                  <p className="text-xs text-primary font-mono mt-0.5">{p.price}</p>
                  <p className="text-[10px] text-text-dim font-mono uppercase tracking-widest">{p.drop}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(p.id); }}
                  className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-red-400 transition-all p-1 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {editing && (
        <div className="flex-1 min-w-0 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setEditing(null)} className="xl:hidden text-text-muted hover:text-text-page">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h3 className="font-serif italic text-xl text-text-page">{editing.title || "New Product"}</h3>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(editing.id)} className="text-text-dim hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={handleSave} disabled={saving}
                className="bg-primary text-bg-page font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? "SAVED!" : saving ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>

          <SectionCard title="Basic Info">
            <FieldInput label="Product Title" value={editing.title} onChange={v => update("title", v)} placeholder="SACRED SHIELD HOODIE" />
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="Price" value={editing.price} onChange={v => update("price", v)} placeholder="₹6,800" />
              <FieldInput label="Category" value={editing.category} onChange={v => update("category", v)} placeholder="Tops / Bottoms" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="Drop" value={editing.drop} onChange={v => update("drop", v)} placeholder="DROP 01" />
              <FieldInput label="Order" value={String(editing.order)} onChange={v => update("order", parseInt(v) || 0)} placeholder="1" />
            </div>
            <FieldInput label="Short Description" value={editing.description} onChange={v => update("description", v)} multiline />
            <FieldInput label="Full Description" value={editing.fullDescription} onChange={v => update("fullDescription", v)} multiline />
          </SectionCard>

          <SectionCard title="Product Images" subtitle="Drag & drop images for dark and light themes — uploaded directly to Firebase Storage">
            <DualImageUploader
              label="Primary Product Image"
              darkValue={editing.darkImage}
              lightValue={editing.lightImage}
              onDarkChange={v => update("darkImage", v)}
              onLightChange={v => update("lightImage", v)}
              folder="products"
            />
          </SectionCard>

          <SectionCard title="Details & Care">
            <FieldInput label="Fabric" value={editing.fabric} onChange={v => update("fabric", v)} placeholder="100% Organic Cotton" />
            <FieldInput label="Weight / GSM" value={editing.weight} onChange={v => update("weight", v)} placeholder="480 GSM" />
            <TagListInput label="Specifications" value={editing.details} onChange={v => update("details", v)} />
            <TagListInput label="Care Instructions" value={editing.howToUse} onChange={v => update("howToUse", v)} />
          </SectionCard>

          <SectionCard title="Visibility">
            <ToggleField label="Published" value={editing.published} onChange={v => update("published", v)} />
            <ToggleField label="Featured" value={editing.featured} onChange={v => update("featured", v)} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}

// ─── BLOG TAB ─────────────────────────────────────────────────────────────────

function BlogTab() {
  const [posts, setPosts] = useState<CMSBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CMSBlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchBlogPosts().then(d => { setPosts(d); setLoading(false); }); }, []);

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await saveBlogPost(editing);
    setSaved(true);
    setPosts(prev => {
      const idx = prev.findIndex(p => p.id === editing.id);
      if (idx > -1) { const n = [...prev]; n[idx] = editing; return n; }
      return [editing, ...prev];
    });
    setTimeout(() => { setSaving(false); setSaved(false); }, 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await deleteBlogPost(id);
    setPosts(prev => prev.filter(p => p.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const update = (field: keyof CMSBlogPost, value: any) => setEditing(prev => prev ? { ...prev, [field]: value } : null);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-200px)]">
      <div className={`flex flex-col gap-4 ${editing ? "w-80 hidden xl:flex shrink-0" : "w-full"}`}>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
              className="w-full bg-bg-card border border-border-theme rounded-full pl-9 pr-4 py-2.5 text-xs font-mono focus:border-primary focus:outline-none transition-colors" />
          </div>
          <button onClick={() => setEditing(createEmptyBlogPost())}
            className="bg-primary text-bg-page font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <BookOpen className="w-10 h-10 text-text-dim" />
              <p className="text-sm text-text-muted">No blog posts yet</p>
            </div>
          ) : filtered.map(p => (
            <div key={p.id} onClick={() => setEditing(p)}
              className={`bg-bg-card border rounded-xl p-4 cursor-pointer group transition-all hover:border-primary/30 ${editing?.id === p.id ? "border-primary/50 bg-primary/5" : "border-border-theme"}`}>
              <div className="flex items-start gap-3">
                <div className="w-14 h-10 bg-bg-page rounded-lg overflow-hidden shrink-0 border border-border-theme">
                  {(p.darkCoverImage || p.lightCoverImage) && (
                    <img src={p.darkCoverImage || p.lightCoverImage} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <StatusBadge published={p.published} />
                  <p className="text-sm font-serif italic text-text-page truncate mt-1">{p.title || "Untitled"}</p>
                  <p className="text-[10px] text-text-dim font-mono">{p.author} · {p.category}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(p.id); }}
                  className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-red-400 transition-all p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="flex-1 min-w-0 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setEditing(null)} className="xl:hidden text-text-muted hover:text-text-page"><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="font-serif italic text-xl text-text-page">{editing.title || "New Post"}</h3>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(editing.id)} className="text-text-dim hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={handleSave} disabled={saving}
                className="bg-primary text-bg-page font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50">
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? "SAVED!" : saving ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>

          <SectionCard title="Post Info">
            <FieldInput label="Title" value={editing.title} onChange={v => update("title", v)} />
            <div className="grid grid-cols-2 gap-4">
              <FieldInput label="Slug" value={editing.slug} onChange={v => update("slug", v)} mono />
              <FieldInput label="Category" value={editing.category} onChange={v => update("category", v)} />
            </div>
            <FieldInput label="Author" value={editing.author} onChange={v => update("author", v)} />
            <FieldInput label="Excerpt" value={editing.excerpt} onChange={v => update("excerpt", v)} multiline />
          </SectionCard>

          <SectionCard title="Cover Images" subtitle="Drag & drop cover images for dark and light themes">
            <DualImageUploader
              label="Cover Image"
              darkValue={editing.darkCoverImage}
              lightValue={editing.lightCoverImage}
              onDarkChange={v => update("darkCoverImage", v)}
              onLightChange={v => update("lightCoverImage", v)}
              folder="blog"
            />
          </SectionCard>

          <SectionCard title="Content">
            <FieldInput label="Body (Markdown)" value={editing.body} onChange={v => update("body", v)} multiline />
          </SectionCard>

          <SectionCard title="Tags & Visibility">
            <TagListInput label="Tags" value={editing.tags} onChange={v => update("tags", v)} />
            <ToggleField label="Published" value={editing.published} onChange={v => update("published", v)} />
            <ToggleField label="Featured" value={editing.featured} onChange={v => update("featured", v)} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}

// ─── CATEGORIES TAB ───────────────────────────────────────────────────────────

function CategoriesTab() {
  const [cats, setCats] = useState<CMSCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CMSCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { fetchCategories().then(d => { setCats(d); setLoading(false); }); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await saveCategory(editing);
    setSaved(true);
    setCats(prev => {
      const idx = prev.findIndex(c => c.id === editing.id);
      if (idx > -1) { const n = [...prev]; n[idx] = editing; return n; }
      return [...prev, editing];
    });
    setTimeout(() => { setSaving(false); setSaved(false); }, 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    setCats(prev => prev.filter(c => c.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  const update = (field: keyof CMSCategory, value: any) => setEditing(prev => prev ? { ...prev, [field]: value } : null);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div className="flex gap-6 h-full min-h-[calc(100vh-200px)]">
      <div className={`flex flex-col gap-4 ${editing ? "w-80 hidden xl:flex shrink-0" : "w-full"}`}>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-mono text-text-muted uppercase tracking-widest">All Categories</h4>
          <button onClick={() => setEditing(createEmptyCategory())}
            className="bg-primary text-bg-page font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>
        <div className="space-y-2 overflow-y-auto flex-1">
          {cats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <Tag className="w-10 h-10 text-text-dim" />
              <p className="text-sm text-text-muted">No categories yet</p>
            </div>
          ) : cats.map(c => (
            <div key={c.id} onClick={() => setEditing(c)}
              className={`bg-bg-card border rounded-xl p-4 cursor-pointer group transition-all hover:border-primary/30 ${editing?.id === c.id ? "border-primary/50 bg-primary/5" : "border-border-theme"}`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-bg-page rounded-lg overflow-hidden shrink-0 border border-border-theme flex items-center justify-center">
                  {(c.darkPreviewImage || c.lightPreviewImage) ? (
                    <img src={c.darkPreviewImage || c.lightPreviewImage} alt="" className="w-full h-full object-cover" />
                  ) : <Tag className="w-4 h-4 text-text-dim" />}
                </div>
                <div className="flex-1 min-w-0">
                  <StatusBadge published={c.published} />
                  <p className="text-sm font-serif italic text-text-page truncate mt-1">{c.name || "Untitled"}</p>
                  <p className="text-[10px] text-text-dim font-mono">/{c.slug} · Order {c.order}</p>
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(c.id); }}
                  className="opacity-0 group-hover:opacity-100 text-text-dim hover:text-red-400 p-1 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="flex-1 min-w-0 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setEditing(null)} className="xl:hidden text-text-muted hover:text-text-page"><ArrowLeft className="w-4 h-4" /></button>
              <h3 className="font-serif italic text-xl text-text-page">{editing.name || "New Category"}</h3>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(editing.id)} className="text-text-dim hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={handleSave} disabled={saving}
                className="bg-primary text-bg-page font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50">
                {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                {saved ? "SAVED!" : saving ? "SAVING..." : "SAVE"}
              </button>
            </div>
          </div>

          <SectionCard title="Category Details">
            <FieldInput label="Name" value={editing.name} onChange={v => update("name", v)} />
            <FieldInput label="Slug" value={editing.slug} onChange={v => update("slug", v)} mono />
            <FieldInput label="Description" value={editing.description} onChange={v => update("description", v)} multiline />
            <FieldInput label="Order" value={String(editing.order)} onChange={v => update("order", parseInt(v) || 0)} />
          </SectionCard>

          <SectionCard title="Preview Images" subtitle="Drag & drop images shown in category listings">
            <DualImageUploader
              label="Category Preview"
              darkValue={editing.darkPreviewImage}
              lightValue={editing.lightPreviewImage}
              onDarkChange={v => update("darkPreviewImage", v)}
              onLightChange={v => update("lightPreviewImage", v)}
              folder="categories"
            />
          </SectionCard>

          <SectionCard title="Visibility">
            <ToggleField label="Published" value={editing.published} onChange={v => update("published", v)} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchOrders().then(o => { setOrders(o.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); setLoading(false); }); }, []);

  const statusColors: Record<string, string> = {
    "preparing in dark": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "shipped": "text-sky-400 bg-sky-500/10 border-sky-500/20",
    "delivered": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "cancelled": "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const filtered = orders.filter(o =>
    (o.orderNo || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.shippingAddress?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.shippingAddress?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const revenue = orders.reduce((a: number, o: any) => a + (o.total || 0), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} color="text-sky-400" />
        <StatCard label="Total Revenue" value={`₹${revenue.toLocaleString("en-IN")}`} icon={DollarSign} color="text-emerald-400" />
        <StatCard label="Preparing" value={orders.filter((o: any) => o.status === "preparing in dark").length} icon={Clock} color="text-amber-400" />
        <StatCard label="Delivered" value={orders.filter((o: any) => o.status === "delivered").length} icon={Check} color="text-emerald-400" />
      </div>

      <div className="flex gap-6">
        {/* Orders list */}
        <div className={`flex flex-col gap-4 ${selected ? "w-96 hidden xl:flex shrink-0" : "w-full"}`}>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders, names, emails..."
              className="w-full bg-bg-card border border-border-theme rounded-full pl-9 pr-4 py-2.5 text-xs font-mono focus:border-primary focus:outline-none" />
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                <ShoppingBag className="w-10 h-10 text-text-dim" />
                <p className="text-sm text-text-muted">No orders yet</p>
              </div>
            ) : filtered.map((o: any) => (
              <div key={o.id} onClick={() => setSelected(o)}
                className={`bg-bg-card border rounded-xl p-4 cursor-pointer group transition-all hover:border-primary/30 ${selected?.id === o.id ? "border-primary/50 bg-primary/5" : "border-border-theme"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-mono text-text-page">{o.orderNo}</p>
                      <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${statusColors[o.status] || "text-text-dim bg-bg-page border-border-theme"}`}>{o.status}</span>
                    </div>
                    <p className="text-[11px] text-text-muted truncate">{o.shippingAddress?.name || "Guest"} · {o.items?.length || 0} items</p>
                    <p className="text-[10px] text-text-dim font-mono">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono text-primary">₹{(o.total || 0).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order detail */}
        {selected && (
          <div className="flex-1 min-w-0 space-y-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelected(null)} className="xl:hidden text-text-muted hover:text-text-page"><ArrowLeft className="w-4 h-4" /></button>
                <h3 className="font-serif italic text-xl text-text-page">{selected.orderNo}</h3>
                <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full border ${statusColors[selected.status] || "text-text-dim bg-bg-page border-border-theme"}`}>{selected.status}</span>
              </div>
            </div>

            <SectionCard title="Customer">
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                {[
                  ["Name", selected.shippingAddress?.name],
                  ["Email", selected.shippingAddress?.email],
                  ["Phone", selected.shippingAddress?.phone],
                  ["City", selected.shippingAddress?.city],
                  ["ZIP", selected.shippingAddress?.zip],
                  ["Address", selected.shippingAddress?.address],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest">{label}</p>
                    <p className="text-xs text-text-page mt-0.5">{val || "—"}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Items">
              <div className="space-y-3">
                {(selected.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 border-b border-border-theme pb-3 last:border-0 last:pb-0">
                    <div className="w-10 h-12 bg-bg-page rounded border border-border-theme overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-page font-mono uppercase">{item.title}</p>
                      <p className="text-[10px] text-text-dim">Size: {item.size} · Qty: {item.qty}</p>
                    </div>
                    <p className="text-xs font-mono text-primary shrink-0">{item.price}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Summary">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-mono uppercase text-xs tracking-widest">Total</span>
                <span className="font-mono text-primary text-lg">₹{(selected.total || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="text-[10px] font-mono text-text-dim">
                Placed: {new Date(selected.createdAt).toLocaleString()}
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SHIPPING TAB ─────────────────────────────────────────────────────────────

function ShippingTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  // DHL & Warehouse settings
  const [shippingSubTab, setShippingSubTab] = useState<"fulfillment" | "shipped" | "warehouses" | "settings">("fulfillment");
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [shippingSettings, setShippingSettings] = useState<any>({
    dhlApiKey: "17dYBqixRaCqYT3EhghhrW42zOqAyr0p",
    dhlApiSecret: "nIBgozDWiA1qasNZ",
    dhlAccountNumber: "",
    isProduction: false,
    warehouses: []
  });

  // Fulfillment form states
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("");
  const [parcelWeight, setParcelWeight] = useState<string>("0.5");
  const [parcelLength, setParcelLength] = useState<string>("20");
  const [parcelWidth, setParcelWidth] = useState<string>("15");
  const [parcelHeight, setParcelHeight] = useState<string>("10");
  const [parcelTypeCode, setParcelTypeCode] = useState<string>("3BP");
  const [parcelDescription, setParcelDescription] = useState<string>("Apparel Shipment");
  const [customsDeclarable, setCustomsDeclarable] = useState<boolean>(false);
  const [declaredValue, setDeclaredValue] = useState<string>("10");
  const [declaredValueCurrency, setDeclaredValueCurrency] = useState<string>("INR");
  const [generatingAwb, setGeneratingAwb] = useState<boolean>(false);
  const [generatedAwbDetails, setGeneratedAwbDetails] = useState<any | null>(null);

  // Address manual overrides in fulfillment
  const [shipperDetails, setShipperDetails] = useState<any>({});
  const [receiverDetails, setReceiverDetails] = useState<any>({});

  // Warehouse CRUD states
  const [editingWarehouse, setEditingWarehouse] = useState<any | null>(null);
  const [warehouseForm, setWarehouseForm] = useState<any>({
    name: "", number: "", contactName: "", phone: "", email: "",
    street: "", city: "", state: "", postalCode: "", countryCode: "IN", isDefault: false
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<any>({
    dhlApiKey: "", dhlApiSecret: "", dhlAccountNumber: "", isProduction: false
  });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Tracking states
  const [activeTrackingAwb, setActiveTrackingAwb] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState<boolean>(false);
  const [trackingTimeline, setTrackingTimeline] = useState<any[]>([]);

  // Fetch orders
  const loadOrders = useCallback(() => {
    setLoading(true);
    fetchOrders().then(o => {
      setOrders(o.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Load Shipping Settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      const { db } = await import("../../utils/firebase");
      if (db) {
        const { doc, getDoc } = await import("firebase/firestore");
        try {
          const snap = await getDoc(doc(db, "settings", "shipping"));
          if (snap.exists()) {
            const data = snap.data();
            const loadedSettings = {
              dhlApiKey: data.dhlApiKey || "17dYBqixRaCqYT3EhghhrW42zOqAyr0p",
              dhlApiSecret: data.dhlApiSecret || "nIBgozDWiA1qasNZ",
              dhlAccountNumber: data.dhlAccountNumber || "",
              isProduction: !!data.isProduction,
              warehouses: data.warehouses || []
            };
            setShippingSettings(loadedSettings);
            setSettingsForm({
              dhlApiKey: loadedSettings.dhlApiKey,
              dhlApiSecret: loadedSettings.dhlApiSecret,
              dhlAccountNumber: loadedSettings.dhlAccountNumber,
              isProduction: loadedSettings.isProduction
            });
            // Auto-select default warehouse
            const defaultWh = loadedSettings.warehouses.find((w: any) => w.isDefault);
            if (defaultWh) {
              setSelectedWarehouseId(defaultWh.id);
            } else if (loadedSettings.warehouses.length > 0) {
              setSelectedWarehouseId(loadedSettings.warehouses[0].id);
            }
          } else {
            // Prepopulate form with defaults
            setSettingsForm({
              dhlApiKey: "17dYBqixRaCqYT3EhghhrW42zOqAyr0p",
              dhlApiSecret: "nIBgozDWiA1qasNZ",
              dhlAccountNumber: "",
              isProduction: false
            });
          }
        } catch (e) {
          console.error("Failed to load shipping settings:", e);
        }
      }
      setSettingsLoading(false);
    };
    loadSettings();
  }, []);

  // Update shipperDetails when warehouse selection changes
  useEffect(() => {
    if (selectedWarehouseId && shippingSettings.warehouses) {
      const wh = shippingSettings.warehouses.find((w: any) => w.id === selectedWarehouseId);
      if (wh) {
        setShipperDetails({ ...wh });
      }
    }
  }, [selectedWarehouseId, shippingSettings.warehouses]);

  // Set receiverDetails when order selection changes
  useEffect(() => {
    if (selectedOrder) {
      const sa = selectedOrder.shippingAddress || {};
      setReceiverDetails({
        name: sa.name || "",
        phone: sa.phone || "",
        email: sa.email || "",
        street: sa.address || "",
        city: sa.city || "",
        state: sa.state || "",
        postalCode: sa.zip || "",
        countryCode: sa.country || "IN"
      });
      // Try to estimate weight based on quantity
      const itemCount = (selectedOrder.items || []).reduce((acc: number, item: any) => acc + (item.qty || 1), 0);
      setParcelWeight(String(Math.max(0.5, itemCount * 0.4).toFixed(1)));
    }
  }, [selectedOrder]);

  // Save Settings to Firestore
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating("settings");
    const updated = {
      ...shippingSettings,
      ...settingsForm
    };
    const { db } = await import("../../utils/firebase");
    if (db) {
      const { doc, setDoc } = await import("firebase/firestore");
      try {
        await setDoc(doc(db, "settings", "shipping"), updated, { merge: true });
        setShippingSettings(updated);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (e) {
        console.error("Failed to save settings:", e);
        alert("Failed to save settings to Firestore.");
      }
    }
    setUpdating(null);
  };

  // Warehouse CRUD functions
  const handleOpenWarehouseForm = (wh: any = null) => {
    if (wh) {
      setEditingWarehouse(wh);
      setWarehouseForm({ ...wh });
    } else {
      setEditingWarehouse("new");
      setWarehouseForm({
        name: "", number: `WH-${Date.now().toString().slice(-4)}`, contactName: "", phone: "", email: "",
        street: "", city: "", state: "", postalCode: "", countryCode: "IN", isDefault: shippingSettings.warehouses.length === 0
      });
    }
  };

  const handleSaveWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating("warehouse");
    
    let updatedWarehouses = [...shippingSettings.warehouses];
    
    // If setting this one as default, reset others
    if (warehouseForm.isDefault) {
      updatedWarehouses = updatedWarehouses.map((w: any) => ({ ...w, isDefault: false }));
    }

    if (editingWarehouse === "new") {
      const newWh = { ...warehouseForm, id: `wh-${Date.now()}` };
      updatedWarehouses.push(newWh);
    } else {
      const idx = updatedWarehouses.findIndex((w: any) => w.id === editingWarehouse.id);
      if (idx > -1) {
        updatedWarehouses[idx] = { ...warehouseForm };
      }
    }

    // Force default on at least one if it's the only one
    if (updatedWarehouses.length === 1) {
      updatedWarehouses[0].isDefault = true;
    }

    const updatedSettings = {
      ...shippingSettings,
      warehouses: updatedWarehouses
    };

    const { db } = await import("../../utils/firebase");
    if (db) {
      const { doc, setDoc } = await import("firebase/firestore");
      try {
        await setDoc(doc(db, "settings", "shipping"), updatedSettings, { merge: true });
        setShippingSettings(updatedSettings);
        // Auto-select if none selected
        if (!selectedWarehouseId) {
          const defWh = updatedWarehouses.find((w: any) => w.isDefault) || updatedWarehouses[0];
          setSelectedWarehouseId(defWh.id);
        }
        setEditingWarehouse(null);
      } catch (e) {
        console.error("Failed to save warehouse:", e);
        alert("Failed to save warehouse to Firestore.");
      }
    }
    setUpdating(null);
  };

  const handleDeleteWarehouse = async (whId: string) => {
    if (!confirm("Are you sure you want to delete this warehouse?")) return;
    setUpdating("warehouse");
    
    const updatedWarehouses = shippingSettings.warehouses.filter((w: any) => w.id !== whId);
    
    // If we deleted the default, set first remaining as default
    if (updatedWarehouses.length > 0 && !updatedWarehouses.some((w: any) => w.isDefault)) {
      updatedWarehouses[0].isDefault = true;
    }

    const updatedSettings = {
      ...shippingSettings,
      warehouses: updatedWarehouses
    };

    const { db } = await import("../../utils/firebase");
    if (db) {
      const { doc, setDoc } = await import("firebase/firestore");
      try {
        await setDoc(doc(db, "settings", "shipping"), updatedSettings, { merge: true });
        setShippingSettings(updatedSettings);
        if (selectedWarehouseId === whId) {
          setSelectedWarehouseId(updatedWarehouses[0]?.id || "");
        }
      } catch (e) {
        console.error("Failed to delete warehouse:", e);
        alert("Failed to delete warehouse.");
      }
    }
    setUpdating(null);
  };

  // Generate DHL AWB
  const handleGenerateAwb = async (order: any) => {
    if (!selectedWarehouseId) {
      alert("Please select or configure a warehouse first.");
      return;
    }
    setGeneratingAwb(true);
    setGeneratedAwbDetails(null);

    try {
      const domestic = (receiverDetails.countryCode || "IN").toUpperCase() === (shipperDetails.countryCode || "IN").toUpperCase();
      const productCode = domestic ? "N" : "P"; // Domestic Express (N), Express Worldwide (P)

      const response = await fetch("/api/dhl/shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: shippingSettings.dhlApiKey,
          apiSecret: shippingSettings.dhlApiSecret,
          accountNumber: shippingSettings.dhlAccountNumber,
          isProduction: shippingSettings.isProduction,
          productCode,
          shipperDetails,
          receiverDetails,
          packageDetails: {
            weight: parseFloat(parcelWeight) || 0.5,
            length: parseInt(parcelLength) || 20,
            width: parseInt(parcelWidth) || 15,
            height: parseInt(parcelHeight) || 10,
            typeCode: parcelTypeCode,
            description: parcelDescription
          },
          customsDeclarable,
          declaredValue: parseFloat(declaredValue) || 10.0,
          declaredValueCurrency
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "DHL API error occurred.");
      }

      // Update Order Status in Firestore to "shipped" and attach AWB tracking
      const { db } = await import("../../utils/firebase");
      if (db) {
        const { doc, updateDoc } = await import("firebase/firestore");
        await updateDoc(doc(db, "orders", order.id), {
          status: "shipped",
          trackingNo: result.shipmentTrackingNumber,
          trackingUrl: result.trackingUrl,
          dhlLabel: result.labelPdfBase64 || "",
          shippedAt: Date.now(),
          shippingDetails: {
            warehouseNo: shipperDetails.number,
            warehouseName: shipperDetails.name,
            weight: parcelWeight,
            dimensions: `${parcelLength}x${parcelWidth}x${parcelHeight} cm`,
            packageType: parcelTypeCode,
            shippedVia: "DHL Express"
          }
        });
      }

      setGeneratedAwbDetails({
        awb: result.shipmentTrackingNumber,
        label: result.labelPdfBase64,
        trackingUrl: result.trackingUrl,
        orderNo: order.orderNo
      });

      // Reload orders list
      fetchOrders().then(setOrders);

    } catch (e: any) {
      console.error("AWB Generation Error:", e);
      alert(e.message || "Failed to generate DHL Air Waybill.");
    } finally {
      setGeneratingAwb(false);
    }
  };

  // Track DHL Shipment in Real Time
  const handleTrackShipment = async (trackingNo: string) => {
    setActiveTrackingAwb(trackingNo);
    setTrackingLoading(true);
    setTrackingTimeline([]);

    try {
      const queryParams = new URLSearchParams({
        trackingNumber: trackingNo,
        apiKey: shippingSettings.dhlApiKey,
        apiSecret: shippingSettings.dhlApiSecret,
        isProduction: String(shippingSettings.isProduction)
      });
      const response = await fetch(`/api/dhl/track?${queryParams.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch tracking data.");
      }

      const shipments = result.trackingData?.shipments;
      if (shipments && shipments.length > 0) {
        const events = shipments[0].events || [];
        setTrackingTimeline(events);
      } else {
        setTrackingTimeline([]);
      }

    } catch (e: any) {
      console.error("DHL Tracking Error:", e);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handlePrintLabel = (base64Pdf: string) => {
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>DHL Shipping Label</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f0f0; }
              embed { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <embed src="${dataUrl}" type="application/pdf"></embed>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const pendingOrders = orders.filter(o => o.status === "preparing in dark" || o.status === "preparing");
  const shippedOrders = orders.filter(o => o.status === "shipped");
  const deliveredOrders = orders.filter(o => o.status === "delivered");

  const subTabItems = [
    { id: "fulfillment", label: "Fulfillment", icon: Clock, count: pendingOrders.length },
    { id: "shipped", label: "Shipped Log", icon: Truck, count: shippedOrders.length },
    { id: "warehouses", label: "Warehouses", icon: Warehouse, count: shippingSettings.warehouses.length },
    { id: "settings", label: "DHL Settings", icon: Sliders },
  ];

  if (loading || settingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Accessing Shipping Logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Orders Pending" value={pendingOrders.length} icon={Clock} color="text-amber-400" />
        <StatCard label="Shipped Out" value={shippedOrders.length} icon={Truck} color="text-sky-400" />
        <StatCard label="Delivered" value={deliveredOrders.length} icon={CheckCircle} color="text-emerald-400" />
        <StatCard label="Warehouses" value={shippingSettings.warehouses.length} icon={Warehouse} color="text-violet-400" />
      </div>

      {/* Sub Tabs */}
      <div className="bg-bg-card border border-border-theme rounded-2xl overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border-theme">
        <div className="p-4 md:w-60 flex flex-col gap-1.5 shrink-0 bg-bg-card-alt/50">
          <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest px-3 mb-2">Shipping Control</p>
          {subTabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setShippingSubTab(tab.id as any);
                setSelectedOrder(null);
                setGeneratedAwbDetails(null);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-mono text-xs tracking-wider uppercase transition-all text-left cursor-pointer ${
                shippingSubTab === tab.id
                  ? "bg-primary text-bg-page font-semibold shadow-md"
                  : "text-text-muted hover:text-text-page hover:bg-bg-card-alt"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="flex-1">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                  shippingSubTab === tab.id ? "bg-bg-page/20 text-bg-page" : "bg-bg-page border border-border-theme text-text-dim"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 p-6 min-w-0">

          {/* 1. FULFILLMENT TAB */}
          {shippingSubTab === "fulfillment" && (
            <div className="space-y-6">
              {!selectedOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-theme pb-3">
                    <h3 className="font-serif italic text-lg text-text-page">Pending Shipments</h3>
                    <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">Select an order to dispatch via DHL</p>
                  </div>
                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-border-theme rounded-2xl bg-bg-card-alt/10">
                      <Clock className="w-10 h-10 text-text-dim mx-auto mb-3" />
                      <p className="text-xs font-mono text-text-muted uppercase tracking-widest">No pending orders awaiting shipment</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {pendingOrders.map((o: any) => (
                        <div
                          key={o.id}
                          onClick={() => setSelectedOrder(o)}
                          className="bg-bg-card border border-border-theme rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                              <Clock className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-mono font-bold text-text-page">{o.orderNo}</p>
                                <span className="text-[8px] font-mono bg-[#FFF0E8] text-[#5C0606] px-1.5 py-0.5 rounded border border-[#5C0606]/20">READY</span>
                              </div>
                              <p className="text-[11px] text-text-muted mt-0.5">{o.shippingAddress?.name || "Guest"} • {o.shippingAddress?.city}, {o.shippingAddress?.country || "IN"}</p>
                              <p className="text-[9px] text-text-dim font-mono">{new Date(o.createdAt).toLocaleString()} • {o.items?.length || 0} items</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <p className="text-xs font-mono text-primary font-semibold">₹{(o.total || 0).toLocaleString("en-IN")}</p>
                            <button className="bg-primary/10 group-hover:bg-primary text-primary group-hover:text-bg-page px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer">
                              Create AWB
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* AWB Generation Form */
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border-theme pb-4">
                    <button onClick={() => setSelectedOrder(null)} className="text-text-muted hover:text-text-page cursor-pointer bg-transparent border-0 outline-none">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                      <h3 className="font-serif italic text-lg text-text-page">Create DHL Shipment</h3>
                      <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">Configure shipment parameters for order: {selectedOrder.orderNo}</p>
                    </div>
                  </div>

                  {generatedAwbDetails ? (
                    /* SUCCESS SCREEN */
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-5">
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                      <div className="space-y-2">
                        <h4 className="font-serif italic text-xl text-text-page">Air Waybill Generated!</h4>
                        <p className="text-xs font-mono text-text-muted uppercase">Shipment created successfully for Order #{generatedAwbDetails.orderNo}</p>
                      </div>

                      <div className="bg-bg-page border border-border-theme rounded-xl p-4 max-w-sm mx-auto space-y-3">
                        <div>
                          <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest">DHL Tracking Number (AWB)</p>
                          <p className="text-lg font-mono font-bold text-primary select-all">{generatedAwbDetails.awb}</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                          <a
                            href={generatedAwbDetails.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1.5"
                          >
                            <Globe className="w-3.5 h-3.5" /> Track online
                          </a>
                          <button
                            onClick={() => handlePrintLabel(generatedAwbDetails.label)}
                            className="bg-primary text-bg-page text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-lg hover:bg-primary/95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" /> Print Label
                          </button>
                        </div>
                      </div>

                      {generatedAwbDetails.label && (
                        <div className="space-y-2 max-w-lg mx-auto">
                          <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">Waybill Label Preview</p>
                          <iframe
                            src={`data:application/pdf;base64,${generatedAwbDetails.label}`}
                            className="w-full h-80 border border-border-theme rounded-xl"
                          />
                        </div>
                      )}

                      <div className="pt-4">
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            setGeneratedAwbDetails(null);
                          }}
                          className="bg-transparent border border-border-theme hover:border-primary text-text-muted hover:text-text-page font-mono text-xs uppercase tracking-widest py-2.5 px-6 rounded-full transition-all cursor-pointer"
                        >
                          Fulfill More Orders
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* GENERATOR FORM */
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Shipping parameters */}
                      <div className="space-y-5">
                        <SectionCard title="1. Origin (Shipper Warehouse)">
                          {shippingSettings.warehouses.length === 0 ? (
                            <div className="p-4 border border-dashed border-red-500/20 rounded-xl bg-red-500/5 text-center">
                              <p className="text-xs font-mono text-red-400 uppercase tracking-wide">No warehouses configured</p>
                              <button
                                onClick={() => setShippingSubTab("warehouses")}
                                className="mt-2 text-[10px] font-mono uppercase tracking-wider text-primary underline cursor-pointer"
                              >
                                Setup Warehouse Now
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Select Origin Warehouse</label>
                                <select
                                  value={selectedWarehouseId}
                                  onChange={e => setSelectedWarehouseId(e.target.value)}
                                  className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2.5 text-xs font-mono focus:border-primary focus:outline-none transition-colors cursor-pointer"
                                >
                                  {shippingSettings.warehouses.map((w: any) => (
                                    <option key={w.id} value={w.id}>
                                      {w.name} ({w.number}) {w.isDefault ? "[Default]" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {shipperDetails.id && (
                                <div className="grid grid-cols-2 gap-3 text-xs bg-bg-page/40 p-3 rounded-lg border border-border-theme font-mono text-text-muted">
                                  <div>
                                    <span className="text-[8px] text-text-dim block uppercase">Warehouse Number</span>
                                    {shipperDetails.number}
                                  </div>
                                  <div>
                                    <span className="text-[8px] text-text-dim block uppercase">Contact Person</span>
                                    {shipperDetails.contactName}
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-[8px] text-text-dim block uppercase">Address</span>
                                    {shipperDetails.street}, {shipperDetails.city}, {shipperDetails.state} - {shipperDetails.postalCode}, {shipperDetails.countryCode}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </SectionCard>

                        <SectionCard title="2. Package Specifications">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Package Type</label>
                              <select
                                value={parcelTypeCode}
                                onChange={e => {
                                  setParcelTypeCode(e.target.value);
                                  // Pre-set standard dimensions if box selected
                                  if (e.target.value === "3BP") { setParcelLength("20"); setParcelWidth("15"); setParcelHeight("10"); }
                                  else if (e.target.value === "2BP") { setParcelLength("30"); setParcelWidth("20"); setParcelHeight("15"); }
                                  else if (e.target.value === "EE") { setParcelLength("15"); setParcelWidth("10"); setParcelHeight("1"); }
                                }}
                                className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2.5 text-xs font-mono focus:border-primary focus:outline-none transition-colors cursor-pointer"
                              >
                                <option value="3BP">DHL Cardboard Box (3BP)</option>
                                <option value="2BP">DHL Box 2 (2BP)</option>
                                <option value="EE">DHL Express Envelope (EE)</option>
                                <option value="3BX">DHL Box 3 (3BX)</option>
                                <option value="YOP">Your Own Package (YOP)</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Weight (kg)</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                required
                                value={parcelWeight}
                                onChange={e => setParcelWeight(e.target.value)}
                                className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2.5 text-xs font-mono focus:border-primary focus:outline-none transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-mono text-text-dim uppercase">Length (cm)</span>
                              <input
                                type="number"
                                value={parcelLength}
                                onChange={e => setParcelLength(e.target.value)}
                                className="w-full bg-bg-page border border-border-theme rounded-lg px-2.5 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-mono text-text-dim uppercase">Width (cm)</span>
                              <input
                                type="number"
                                value={parcelWidth}
                                onChange={e => setParcelWidth(e.target.value)}
                                className="w-full bg-bg-page border border-border-theme rounded-lg px-2.5 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-mono text-text-dim uppercase">Height (cm)</span>
                              <input
                                type="number"
                                value={parcelHeight}
                                onChange={e => setParcelHeight(e.target.value)}
                                className="w-full bg-bg-page border border-border-theme rounded-lg px-2.5 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">Content Description</label>
                            <input
                              type="text"
                              value={parcelDescription}
                              onChange={e => setParcelDescription(e.target.value)}
                              placeholder="Fitted Graphic Hoodies"
                              className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2.5 text-xs font-mono focus:border-primary focus:outline-none transition-colors"
                            />
                          </div>

                          {/* Customs options */}
                          <div className="border-t border-border-theme pt-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wide">Customs Declaration (International)</span>
                              <button
                                type="button"
                                onClick={() => setCustomsDeclarable(!customsDeclarable)}
                                className={`text-xs font-mono transition-colors cursor-pointer bg-transparent border-0 ${customsDeclarable ? "text-emerald-400 font-bold" : "text-text-dim"}`}
                              >
                                {customsDeclarable ? "ON" : "OFF"}
                              </button>
                            </div>

                            {customsDeclarable && (
                              <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1">
                                  <span className="text-[8px] font-mono text-text-dim uppercase">Declared Value</span>
                                  <input
                                    type="number"
                                    value={declaredValue}
                                    onChange={e => setDeclaredValue(e.target.value)}
                                    className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-[8px] font-mono text-text-dim uppercase">Currency</span>
                                  <select
                                    value={declaredValueCurrency}
                                    onChange={e => setDeclaredValueCurrency(e.target.value)}
                                    className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none cursor-pointer"
                                  >
                                    <option value="INR">INR (₹)</option>
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        </SectionCard>
                      </div>

                      {/* Right: Receiver parameters & submit */}
                      <div className="space-y-5">
                        <SectionCard title="3. Destination (Receiver Address)">
                          <div className="space-y-3.5">
                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-mono text-text-dim uppercase">Receiver Full Name</span>
                              <input
                                type="text"
                                required
                                value={receiverDetails.name}
                                onChange={e => setReceiverDetails({ ...receiverDetails, name: e.target.value })}
                                className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-mono text-text-dim uppercase">Phone Number</span>
                                <input
                                  type="text"
                                  required
                                  value={receiverDetails.phone}
                                  onChange={e => setReceiverDetails({ ...receiverDetails, phone: e.target.value })}
                                  className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-mono text-text-dim uppercase">Email Address</span>
                                <input
                                  type="email"
                                  required
                                  value={receiverDetails.email}
                                  onChange={e => setReceiverDetails({ ...receiverDetails, email: e.target.value })}
                                  className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="text-[8px] font-mono text-text-dim uppercase">Street Address</span>
                              <input
                                type="text"
                                required
                                value={receiverDetails.street}
                                onChange={e => setReceiverDetails({ ...receiverDetails, street: e.target.value })}
                                className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-mono text-text-dim uppercase">City</span>
                                <input
                                  type="text"
                                  required
                                  value={receiverDetails.city}
                                  onChange={e => setReceiverDetails({ ...receiverDetails, city: e.target.value })}
                                  className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-mono text-text-dim uppercase">State / Province</span>
                                <input
                                  type="text"
                                  required
                                  value={receiverDetails.state}
                                  onChange={e => setReceiverDetails({ ...receiverDetails, state: e.target.value })}
                                  className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-mono text-text-dim uppercase">Postal Code (ZIP)</span>
                                <input
                                  type="text"
                                  required
                                  value={receiverDetails.postalCode}
                                  onChange={e => setReceiverDetails({ ...receiverDetails, postalCode: e.target.value })}
                                  className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-mono text-text-dim uppercase">Country Code (ISO-2)</span>
                                <input
                                  type="text"
                                  required
                                  maxLength={2}
                                  value={receiverDetails.countryCode}
                                  onChange={e => setReceiverDetails({ ...receiverDetails, countryCode: e.target.value.toUpperCase() })}
                                  placeholder="IN"
                                  className="w-full bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none uppercase"
                                />
                              </div>
                            </div>
                          </div>
                        </SectionCard>

                        {/* Order Summary & Dispatch Trigger */}
                        <div className="bg-bg-card border border-border-theme rounded-2xl p-5 space-y-4 shadow-lg">
                          <h4 className="font-serif italic text-base text-text-page">Fulfillment Summary</h4>
                          <div className="text-xs font-mono text-text-muted space-y-2 border-b border-border-theme pb-3">
                            <div className="flex justify-between">
                              <span>Items Count:</span>
                              <span className="text-text-page">{(selectedOrder.items || []).length} items</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Payer Subtotal:</span>
                              <span className="text-primary font-bold">₹{(selectedOrder.total || 0).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping Channel:</span>
                              <span className="text-text-page">DHL Express (AWB Generation)</span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleGenerateAwb(selectedOrder)}
                            disabled={generatingAwb || !selectedWarehouseId || !shippingSettings.dhlAccountNumber}
                            className="w-full bg-primary hover:bg-primary/95 text-bg-page font-mono font-semibold text-xs tracking-widest py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg uppercase disabled:opacity-40"
                          >
                            {generatingAwb ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>CONTACTING DHL REST API...</span>
                              </>
                            ) : !shippingSettings.dhlAccountNumber ? (
                              <span>SET DHL ACCT NO TO DISPATCH</span>
                            ) : (
                              <>
                                <Truck className="w-4 h-4" />
                                <span>GENERATE DHL AIR WAYBILL</span>
                              </>
                            )}
                          </button>
                          {!shippingSettings.dhlAccountNumber && (
                            <p className="text-[9px] font-mono text-red-400 text-center uppercase tracking-wider">
                              Configure account number in DHL Settings tab before shipping
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 2. SHIPPED LOG TAB */}
          {shippingSubTab === "shipped" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border-theme pb-3">
                <h3 className="font-serif italic text-lg text-text-page">Dispatched Shipments</h3>
                <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">Track and reprint waybills for sent packages</p>
              </div>

              {shippedOrders.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-border-theme rounded-2xl bg-bg-card-alt/10">
                  <Truck className="w-10 h-10 text-text-dim mx-auto mb-3" />
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest">No dispatched shipments found in archives</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {shippedOrders.map((o: any) => (
                    <div
                      key={o.id}
                      className="bg-bg-card border border-border-theme rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-sky-500/10 border border-sky-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <Truck className="w-4 h-4 text-sky-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-mono font-bold text-text-page">{o.orderNo}</p>
                              <span className="text-[8px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded uppercase">Shipped</span>
                            </div>
                            <p className="text-[11px] text-text-muted mt-0.5">{o.shippingAddress?.name || "Guest"} • {o.shippingAddress?.city}</p>
                            {o.trackingNo && (
                              <p className="text-[10px] font-mono text-primary mt-1 flex items-center gap-1 select-all">
                                <Clipboard className="w-3.5 h-3.5 text-text-dim inline shrink-0" />
                                AWB: {o.trackingNo}
                                {o.shippingDetails?.warehouseNo && (
                                  <span className="text-text-dim font-mono text-[9px] uppercase ml-1">
                                    • WH: {o.shippingDetails.warehouseNo}
                                  </span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 md:justify-end">
                        {o.trackingNo && (
                          <button
                            onClick={() => handleTrackShipment(o.trackingNo)}
                            className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-lg transition-all cursor-pointer"
                          >
                            Track Status
                          </button>
                        )}
                        {o.dhlLabel && (
                          <button
                            onClick={() => handlePrintLabel(o.dhlLabel)}
                            className="bg-bg-page hover:bg-bg-card-alt border border-border-theme text-text-muted hover:text-text-page text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-text-dim" /> Print label
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. WAREHOUSES TAB */}
          {shippingSubTab === "warehouses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border-theme pb-3">
                <div>
                  <h3 className="font-serif italic text-lg text-text-page">Warehouse Configuration</h3>
                  <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">Setup dispatching centers and custom warehouse codes</p>
                </div>
                <button
                  onClick={() => handleOpenWarehouseForm()}
                  className="bg-primary text-bg-page font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/95 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Warehouse
                </button>
              </div>

              {editingWarehouse ? (
                /* Warehouse Create / Edit form */
                <form onSubmit={handleSaveWarehouse} className="bg-bg-card border border-border-theme rounded-2xl p-6 space-y-4">
                  <h4 className="font-serif italic text-base text-primary border-b border-border-theme pb-2.5">
                    {editingWarehouse === "new" ? "Add New Warehouse" : "Edit Warehouse Details"}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">Warehouse Name</span>
                      <input
                        type="text"
                        required
                        value={warehouseForm.name}
                        onChange={e => setWarehouseForm({ ...warehouseForm, name: e.target.value })}
                        placeholder="Main Delhi Dispatch"
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">Warehouse Number / Code</span>
                      <input
                        type="text"
                        required
                        value={warehouseForm.number}
                        onChange={e => setWarehouseForm({ ...warehouseForm, number: e.target.value.toUpperCase().replace(/\s+/g, "-") })}
                        placeholder="WH-DEL-01"
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary focus:outline-none uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">Contact Person</span>
                      <input
                        type="text"
                        required
                        value={warehouseForm.contactName}
                        onChange={e => setWarehouseForm({ ...warehouseForm, contactName: e.target.value })}
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">Phone</span>
                      <input
                        type="text"
                        required
                        value={warehouseForm.phone}
                        onChange={e => setWarehouseForm({ ...warehouseForm, phone: e.target.value })}
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">Email</span>
                      <input
                        type="email"
                        required
                        value={warehouseForm.email}
                        onChange={e => setWarehouseForm({ ...warehouseForm, email: e.target.value })}
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-text-muted uppercase">Street Address</span>
                    <input
                      type="text"
                      required
                      value={warehouseForm.street}
                      onChange={e => setWarehouseForm({ ...warehouseForm, street: e.target.value })}
                      className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">City</span>
                      <input
                        type="text"
                        required
                        value={warehouseForm.city}
                        onChange={e => setWarehouseForm({ ...warehouseForm, city: e.target.value })}
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">State</span>
                      <input
                        type="text"
                        required
                        value={warehouseForm.state}
                        onChange={e => setWarehouseForm({ ...warehouseForm, state: e.target.value })}
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">ZIP Code</span>
                      <input
                        type="text"
                        required
                        value={warehouseForm.postalCode}
                        onChange={e => setWarehouseForm({ ...warehouseForm, postalCode: e.target.value })}
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-muted uppercase">Country Code</span>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={warehouseForm.countryCode}
                        onChange={e => setWarehouseForm({ ...warehouseForm, countryCode: e.target.value.toUpperCase() })}
                        placeholder="IN"
                        className="bg-bg-page border border-border-theme rounded-lg px-3 py-2 text-xs font-mono focus:border-primary uppercase"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-border-theme rounded-xl bg-bg-page/20">
                    <div>
                      <span className="text-[10px] font-mono text-text-page uppercase tracking-wide block">Default Warehouse</span>
                      <span className="text-[8px] font-mono text-text-dim uppercase tracking-wider">Use this as primary origin for DHL dispatches</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setWarehouseForm({ ...warehouseForm, isDefault: !warehouseForm.isDefault })}
                      className="text-primary cursor-pointer bg-transparent border-none outline-none"
                    >
                      {warehouseForm.isDefault ? (
                        <ToggleRight className="w-7 h-7 text-primary" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-text-dim" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingWarehouse(null)}
                      className="flex-1 bg-transparent hover:bg-bg-card-alt border border-border-theme text-text-muted font-mono text-xs py-3 rounded-full uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating === "warehouse"}
                      className="flex-1 bg-primary hover:bg-primary/95 text-bg-page font-mono font-semibold text-xs tracking-widest py-3 rounded-full uppercase flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {updating === "warehouse" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      <span>Save Warehouse</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Warehouse List */
                <div className="space-y-4">
                  {shippingSettings.warehouses.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-border-theme rounded-2xl bg-bg-card-alt/10">
                      <Warehouse className="w-10 h-10 text-text-dim mx-auto mb-3" />
                      <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-2">No Warehouses configured yet</p>
                      <p className="text-[10px] text-text-dim max-w-xs mx-auto">You must register at least one dispatch center to auto-populate shipper addresses in DHL AWB requests.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {shippingSettings.warehouses.map((wh: any) => (
                        <div
                          key={wh.id}
                          className="bg-bg-card border border-border-theme rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-primary/20 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-text-page tracking-wider uppercase bg-bg-page border border-border-theme rounded px-2 py-0.5">
                                {wh.number}
                              </span>
                              <h4 className="text-sm font-serif italic text-text-page font-bold">{wh.name}</h4>
                              {wh.isDefault && (
                                <span className="text-[8px] font-mono tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-mono text-text-muted mt-2 uppercase tracking-wide">
                              Contact: {wh.contactName} • {wh.phone}
                            </p>
                            <p className="text-[10px] text-text-dim font-mono mt-0.5">
                              {wh.street}, {wh.city}, {wh.state} - {wh.postalCode}, {wh.countryCode}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenWarehouseForm(wh)}
                              className="p-2.5 rounded-lg border border-border-theme hover:border-primary text-text-muted hover:text-primary transition-colors cursor-pointer bg-bg-page"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteWarehouse(wh.id)}
                              className="p-2.5 rounded-lg border border-border-theme hover:border-red-500/20 text-text-muted hover:text-red-400 transition-colors cursor-pointer bg-bg-page"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4. DHL API CONFIG TAB */}
          {shippingSubTab === "settings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border-theme pb-3">
                <div>
                  <h3 className="font-serif italic text-lg text-text-page">DHL Integration Keys</h3>
                  <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">Configure client credentials for MyDHL Express API</p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-bg-card border border-border-theme rounded-2xl p-6 space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">DHL API Client ID (Key)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.dhlApiKey}
                    onChange={e => setSettingsForm({ ...settingsForm, dhlApiKey: e.target.value })}
                    placeholder="17dYBqixRaCqYT3EhghhrW42zOqAyr0p"
                    className="bg-bg-page border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">DHL API Client Secret</label>
                  <input
                    type="password"
                    required
                    value={settingsForm.dhlApiSecret}
                    onChange={e => setSettingsForm({ ...settingsForm, dhlApiSecret: e.target.value })}
                    placeholder="nIBgozDWiA1qasNZ"
                    className="bg-bg-page border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">DHL Shipper Account Number (9 digits)</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.dhlAccountNumber}
                    onChange={e => setSettingsForm({ ...settingsForm, dhlAccountNumber: e.target.value.replace(/[^0-9]/g, "") })}
                    placeholder="e.g. 842261947"
                    className="bg-bg-page border border-border-theme rounded-lg p-3 text-xs font-mono text-text-page focus:border-primary focus:outline-none"
                  />
                  <p className="text-[9px] font-mono text-text-dim uppercase tracking-wider">Required by MyDHL REST API to compute billing charges and labels.</p>
                </div>

                <div className="flex items-center justify-between p-3 border border-border-theme rounded-xl bg-bg-page/20">
                  <div>
                    <span className="text-[10px] font-mono text-text-page uppercase tracking-wide block">Environment Toggle</span>
                    <span className="text-[8px] font-mono text-text-dim uppercase tracking-wider">
                      {settingsForm.isProduction
                        ? "PRODUCTION: Billing charges will be generated"
                        : "SANDBOX: Safe testing environment (test.express.api)"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, isProduction: !settingsForm.isProduction })}
                    className="text-primary cursor-pointer bg-transparent border-none outline-none"
                  >
                    {settingsForm.isProduction ? (
                      <ToggleRight className="w-7 h-7 text-primary" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-text-dim" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-theme">
                  <span className="text-xs font-mono text-text-muted font-bold">
                    {saveSuccess && <Check className="w-4 h-4 text-emerald-400 inline mr-1" />}
                    {saveSuccess ? <span className="text-emerald-400 uppercase">Keys Synchronized!</span> : ""}
                  </span>
                  <button
                    type="submit"
                    disabled={updating === "settings"}
                    className="bg-primary hover:bg-primary/95 text-bg-page font-mono font-semibold text-xs tracking-widest py-3 px-6 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-md uppercase"
                  >
                    {updating === "settings" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{saveSuccess ? "Saved!" : "Save Keys"}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* TRACKING TIMELINE MODAL */}
      {activeTrackingAwb && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-card border border-border-theme rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-border-theme flex items-center justify-between">
              <div>
                <h4 className="font-serif italic text-base text-text-page">DHL Real-Time Tracker</h4>
                <p className="text-[9px] font-mono text-text-dim uppercase tracking-widest">AWB: {activeTrackingAwb}</p>
              </div>
              <button
                onClick={() => {
                  setActiveTrackingAwb(null);
                  setTrackingTimeline([]);
                }}
                className="w-7 h-7 rounded-full bg-bg-page border border-border-theme flex items-center justify-center hover:border-primary text-text-muted hover:text-text-page transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 max-h-96 overflow-y-auto">
              {trackingLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-[10px] font-mono text-text-dim uppercase">Fetching checkpoints from DHL...</span>
                </div>
              ) : trackingTimeline.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-8 h-8 text-text-dim mx-auto mb-2" />
                  <p className="text-xs font-mono text-text-muted uppercase">No tracking history reported yet</p>
                  <p className="text-[9px] text-text-dim mt-1 max-w-xs mx-auto">This happens if the shipment was just generated and has not been picked up or scanned by DHL couriers.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trackingTimeline.map((ev: any, idx: number) => (
                    <div key={idx} className="flex gap-4 relative">
                      {idx < trackingTimeline.length - 1 && (
                        <div className="absolute left-[7px] top-4 bottom-[-16px] w-[1px] bg-border-theme" />
                      )}
                      
                      <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-1.5 flex items-center justify-center ${
                        idx === 0
                          ? "bg-primary border-4 border-primary/20 ring-1 ring-primary"
                          : "bg-border-theme border-2 border-bg-card"
                      }`} />

                      <div className="min-w-0 flex-1">
                        <p className={`text-xs font-bold leading-tight ${idx === 0 ? "text-text-page font-serif italic text-sm" : "text-text-muted font-mono"}`}>
                          {ev.description || ev.status}
                        </p>
                        <p className="text-[9px] font-mono text-text-dim uppercase mt-0.5">
                          {ev.serviceArea?.[0]?.description || ev.location || "System Point"} 
                          {ev.timestamp && ` • ${new Date(ev.timestamp).toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-border-theme bg-bg-card-alt/50 flex justify-end">
              <button
                onClick={() => {
                  setActiveTrackingAwb(null);
                  setTrackingTimeline([]);
                }}
                className="bg-primary text-bg-page font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-primary/95 transition-all cursor-pointer font-bold"
              >
                Close Tracker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const { configs, saveAllConfigs, resetToDefault, loading: imgLoading } = useImageConfig();
  const { theme, toggleTheme } = useTheme();

  // Admin Authentication States
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthLoading, setAdminAuthLoading] = useState(true);
  const [adminError, setAdminError] = useState("");

  // Check auth state on mount
  useEffect(() => {
    const isAuth = sessionStorage.getItem("ghubor-admin-auth") === "true";
    setIsAdminAuthenticated(isAuth);
    setAdminAuthLoading(false);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    
    if (adminEmail === "ghuborsupport@gmail.com" && adminPassword === "VIKI@321") {
      sessionStorage.setItem("ghubor-admin-auth", "true");
      setIsAdminAuthenticated(true);
    } else {
      setAdminError("Invalid administrator credentials.");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("ghubor-admin-auth");
    setIsAdminAuthenticated(false);
    setAdminEmail("");
    setAdminPassword("");
  };

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [formState, setFormState] = useState<ImageConfigs>(() => configs);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [presetLoaded, setPresetLoaded] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [overviewProducts, setOverviewProducts] = useState<CMSProduct[]>([]);
  const [overviewPosts, setOverviewPosts] = useState<CMSBlogPost[]>([]);
  const [overviewCats, setOverviewCats] = useState<CMSCategory[]>([]);

  useEffect(() => { setFormState(configs); }, [configs]);
  useEffect(() => {
    fetchProducts().then(setOverviewProducts);
    fetchBlogPosts().then(setOverviewPosts);
    fetchCategories().then(setOverviewCats);
  }, []);

  const handleSaveImages = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    await saveAllConfigs(formState);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLoadPresets = () => {
    const updated = { ...formState };
    Object.keys(PREMIUM_LIGHT_PRESETS).forEach(key => {
      if (updated[key]) updated[key] = { ...updated[key], lightUrl: PREMIUM_LIGHT_PRESETS[key] };
    });
    setFormState(updated);
    setPresetLoaded(true);
    setTimeout(() => setPresetLoaded(false), 3000);
  };

  const handleReset = () => {
    resetToDefault();
    setFormState(DEFAULT_IMAGE_CONFIGS);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid, desc: "Dashboard" },
    { id: "images", label: "Images", icon: ImageIcon, desc: "Theme assets" },
    { id: "products", label: "Products", icon: Package, desc: "Manage drops" },
    { id: "blog", label: "Blog", icon: BookOpen, desc: "Journal posts" },
    { id: "categories", label: "Categories", icon: Tag, desc: "Organize" },
    { id: "coupons", label: "Coupons", icon: DollarSign, desc: "Discount promo codes" },
    { id: "orders", label: "Orders", icon: ShoppingBag, desc: "All orders" },
    { id: "shipping", label: "Shipping", icon: Truck, desc: "Fulfillment" },
  ];

  if (adminAuthLoading) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Loading archives...</span>
        </div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-page text-text-page relative overflow-hidden flex items-center justify-center p-4">
        <div className="bg-noise absolute inset-0 opacity-[0.08] pointer-events-none z-0" />
        <div className="absolute top-[20%] left-[-15%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="w-full max-w-md bg-[#5C0606] border border-[#781212] rounded-3xl p-6 sm:p-8 relative shadow-[0_20px_50px_rgba(92,6,6,0.3)] backdrop-blur-md text-white z-10">
          <div className="text-center mb-8">
            <span className="text-white/60 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase block mb-3">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="font-serif italic text-3xl text-white font-light tracking-wide leading-none">
              Unite Fashion Registry
            </h1>
            <div className="w-12 h-[1px] bg-white/20 mx-auto mt-4" />
          </div>

          {adminError && (
            <div className="bg-black/30 border border-black/40 text-red-200 font-mono text-[10px] rounded-lg p-3.5 mb-6 uppercase tracking-wider leading-relaxed text-center">
              {adminError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="flex flex-col gap-4 text-white">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white/60" />
                <span>Admin Email Address</span>
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="RITUAL@EMAIL.COM"
                className="bg-black/30 border border-white/20 rounded-lg p-3 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/60 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-white/70 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-white/60" />
                <span>Secret Passphrase</span>
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="******"
                  className="w-full bg-black/30 border border-white/20 rounded-lg p-3 pr-10 text-xs font-mono text-white placeholder-white/30 outline-none focus:border-white/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-0.5 cursor-pointer bg-transparent border-none outline-none"
                  aria-label="Toggle Password Visibility"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white hover:bg-gray-100 text-black font-mono font-medium text-xs tracking-widest py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer uppercase font-semibold mt-4 shadow-lg"
            >
              <span>ACCESS REGISTRY</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (imgLoading) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Loading archives...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page text-text-page transition-colors duration-300">

      {/* Header */}
      <header className="border-b border-border-theme bg-bg-nav/90 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-text-dim hover:text-primary uppercase transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </Link>
            <div className="h-4 w-px bg-border-theme" />
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="font-serif italic text-lg font-light text-text-page">Ghubor Admin</span>
              <span className="text-[9px] font-mono tracking-widest uppercase bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded hidden sm:inline">CMS</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden md:flex items-center gap-2 text-[10px] font-mono px-3 py-1.5 rounded-full border ${
              theme === "dark" ? "bg-[#DEDBC8]/5 border-[#DEDBC8]/20 text-[#DEDBC8]" : "bg-[#5C0606]/5 border-[#5C0606]/20 text-[#5C0606]"
            }`}>
              {theme === "dark" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              <span>{theme === "dark" ? "DARK PANEL" : "LIGHT PANEL"}</span>
            </div>
            <button onClick={toggleTheme}
              className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase border border-border-theme hover:border-primary px-3 py-2 rounded-full transition-all duration-300 cursor-pointer bg-bg-card/40">
              {theme === "dark"
                ? <><Sun className="w-3.5 h-3.5 text-amber-400" /><span className="hidden sm:inline">Light</span></>
                : <><Moon className="w-3.5 h-3.5 text-violet-400" /><span className="hidden sm:inline">Dark</span></>
              }
            </button>
            <button onClick={handleAdminLogout}
              className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase border border-red-900/50 hover:border-red-600 text-red-400 px-3 py-2 rounded-full transition-all duration-300 cursor-pointer bg-red-950/10 hover:bg-red-950/20">
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <nav className="px-4 sm:px-6 lg:px-8 flex gap-0.5 overflow-x-auto pb-0 scrollbar-none">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 text-[10px] sm:text-xs font-mono tracking-widest uppercase px-3 sm:px-4 py-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === id ? "border-primary text-primary" : "border-transparent text-text-dim hover:text-text-muted"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {navItems.filter(n => n.id === activeTab).map(n => (
            <div key={n.id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <n.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-serif italic text-2xl text-text-page">{n.label}</h2>
                <p className="text-[10px] font-mono text-text-dim uppercase tracking-widest">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {activeTab === "overview" && (
          <OverviewTab products={overviewProducts} blogPosts={overviewPosts} categories={overviewCats} theme={theme} />
        )}
        {activeTab === "images" && (
          <ImagesTab formState={formState} setFormState={setFormState} handleSave={handleSaveImages}
            handleLoadPresets={handleLoadPresets} handleReset={handleReset}
            saveSuccess={saveSuccess} presetLoaded={presetLoaded} resetSuccess={resetSuccess} />
        )}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "blog" && <BlogTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "coupons" && <CouponsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "shipping" && <ShippingTab />}
      </main>
    </div>
  );
}
