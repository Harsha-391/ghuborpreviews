"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, RefreshCw, Sparkles, Check, Image as ImageIcon,
  Sun, Moon, LayoutGrid, Package, BookOpen, Tag, Plus, Trash2,
  Globe, Lock, Search, X, Star, ToggleLeft, ToggleRight,
  Truck, TrendingUp, ShoppingBag, DollarSign, Users, Eye,
  BarChart2, AlertCircle, Upload, ChevronRight, Clock,
  ArrowUpRight, Layers, Settings, Filter, ExternalLink, Zap
} from "lucide-react";
import { useImageConfig, DEFAULT_IMAGE_CONFIGS, ImageConfigs } from "../../components/ImageConfigContext";
import { useTheme } from "../../components/ThemeContext";
import {
  CMSProduct, CMSBlogPost, CMSCategory,
  fetchProducts, saveProduct, deleteProduct, createEmptyProduct,
  fetchBlogPosts, saveBlogPost, deleteBlogPost, createEmptyBlogPost,
  fetchCategories, saveCategory, deleteCategory, createEmptyCategory,
} from "../../utils/cms";
import {
  fetchAnalyticsSummary, fetchOrders, getTopProducts, getTopSearches,
  getLast7DaysViews, AnalyticsSummary
} from "../../utils/analytics";
import { uploadImage, createPreviewUrl, revokePreviewUrl, UploadFolder } from "../../utils/imageUpload";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type AdminTab = "overview" | "images" | "products" | "blog" | "categories" | "orders" | "shipping";

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
              <FieldInput label="Drop" value={editing.drop} onChange={v => update("drop", v)} placeholder="DROP 02" />
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

  useEffect(() => { fetchOrders().then(o => { setOrders(o); setLoading(false); }); }, []);

  const statuses = ["preparing in dark", "shipped", "delivered", "cancelled"];
  const statusColors: Record<string, string> = {
    "preparing in dark": "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "shipped": "text-sky-400 bg-sky-500/10 border-sky-500/20",
    "delivered": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "cancelled": "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    const { db } = await import("../../utils/firebase");
    const { doc, updateDoc } = await import("firebase/firestore");
    if (db) {
      try {
        await updateDoc(doc(db, "orders", orderId), { status });
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      } catch (e) {
        console.error("Status update failed:", e);
      }
    }
    setUpdating(null);
  };

  const pending = orders.filter(o => o.status === "preparing in dark");
  const shipped = orders.filter(o => o.status === "shipped");
  const delivered = orders.filter(o => o.status === "delivered");

  if (loading) return <div className="flex items-center justify-center h-64"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Pending" value={pending.length} icon={Clock} color="text-amber-400" />
        <StatCard label="Shipped" value={shipped.length} icon={Truck} color="text-sky-400" />
        <StatCard label="Delivered" value={delivered.length} icon={Check} color="text-emerald-400" />
      </div>

      <div className="bg-bg-card border border-border-theme rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border-theme flex items-center gap-3">
          <Truck className="w-4 h-4 text-primary" />
          <h4 className="font-serif italic text-base text-text-page">Shipping Management</h4>
          <span className="text-[10px] font-mono text-text-dim ml-auto">{orders.length} total orders</span>
        </div>
        <div className="divide-y divide-border-theme">
          {orders.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-4 text-center">
              <Truck className="w-10 h-10 text-text-dim" />
              <p className="text-sm text-text-muted">No orders to manage</p>
            </div>
          ) : orders.map((o: any) => (
            <div key={o.id} className="px-6 py-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-xs font-mono text-text-page">{o.orderNo}</p>
                  <span className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded-full border ${statusColors[o.status] || "text-text-dim bg-bg-page border-border-theme"}`}>{o.status}</span>
                </div>
                <p className="text-[11px] text-text-muted">{o.shippingAddress?.name || "Guest"} · {o.shippingAddress?.city}</p>
                <p className="text-[10px] text-text-dim font-mono">{new Date(o.createdAt).toLocaleDateString()} · ₹{(o.total || 0).toLocaleString("en-IN")}</p>
              </div>
              {/* Status selector */}
              <select
                value={o.status}
                onChange={e => updateStatus(o.id, e.target.value)}
                disabled={updating === o.id}
                className="bg-bg-page border border-border-theme text-text-muted font-mono text-[10px] uppercase tracking-widest px-3 py-2 rounded-lg focus:border-primary focus:outline-none transition-colors cursor-pointer disabled:opacity-50"
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ADMIN PAGE ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const { configs, saveAllConfigs, resetToDefault, loading: imgLoading } = useImageConfig();
  const { theme, toggleTheme } = useTheme();

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
    { id: "orders", label: "Orders", icon: ShoppingBag, desc: "All orders" },
    { id: "shipping", label: "Shipping", icon: Truck, desc: "Fulfillment" },
  ];

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
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "shipping" && <ShippingTab />}
      </main>
    </div>
  );
}
