import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, MapPin, Globe, Activity, Search, RefreshCw,
  ArrowLeft, Eye, TrendingUp, Database, Wifi, WifiOff, Shield,
  ChevronRight, Filter, Star, Users, BarChart3, Clock, AlertTriangle,
  Sun, CloudRain, Snowflake, Cloud, CheckCircle2, XCircle, LogOut,
  Menu, X, ExternalLink, Copy, Zap, Bell, Check
} from "lucide-react";
import { useQuery, useMutation } from "@animaapp/playground-react-sdk";
import type { Location } from "@animaapp/playground-react-sdk";
import { ALBANIAN_CITIES, POPULAR_CITIES } from "../lib/albanianCities";
import type { SearchResult } from "../types/weather";

// ─── Auth Gate ────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "moti2024admin";

// ─── Toast System ─────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info";
interface Toast { id: number; msg: string; type: ToastType; }

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-slide-down
            ${t.type === "success" ? "bg-emerald-900/90 border-emerald-500/30 text-emerald-300" : ""}
            ${t.type === "error" ? "bg-red-900/90 border-red-500/30 text-red-300" : ""}
            ${t.type === "info" ? "bg-moti-navy-mid border-moti-sky/30 text-moti-sky" : ""}
          `}
        >
          {t.type === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          {t.type === "error" && <XCircle className="w-4 h-4 flex-shrink-0" />}
          {t.type === "info" && <Bell className="w-4 h-4 flex-shrink-0" />}
          <span>{t.msg}</span>
          <button onClick={() => remove(t.id)} className="ml-1 opacity-60 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = useCallback((msg: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = useCallback((id: number) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.04] animate-pulse">
      <div className="w-3 h-3 rounded-full bg-white/10 flex-shrink-0" />
      <div className="h-4 bg-white/10 rounded w-28" />
      <div className="h-4 bg-white/10 rounded w-20 hidden sm:block" />
      <div className="h-5 bg-white/10 rounded-full w-12 ml-auto" />
      <div className="h-4 bg-white/10 rounded w-16 hidden md:block" />
    </div>
  );
}

function SkeletonStatCard() {
  return (
    <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 flex items-start gap-4 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-white/10 rounded w-20" />
        <div className="h-6 bg-white/10 rounded w-14" />
        <div className="h-3 bg-white/10 rounded w-24" />
      </div>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const attempt = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("moti-admin-auth", "1");
      onLogin();
    } else {
      setErr(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-moti-navy flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-moti-sky/20 border border-moti-sky/40 mb-4">
            <Shield className="w-8 h-8 text-moti-sky" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Moti.com.al — Panel Administrativ</p>
        </div>
        <div className={`bg-moti-navy-mid border border-white/10 rounded-2xl p-6 shadow-premium transition-all ${shake ? "animate-pulse border-red-500/60" : ""}`}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Fjalëkalimi</label>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(false); }}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="•••••••••••••"
            className="w-full bg-moti-navy border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-moti-sky/60 focus:ring-1 focus:ring-moti-sky/30 transition-all"
            autoFocus
          />
          {err && (
            <p className="flex items-center gap-1.5 text-red-400 text-xs mt-2">
              <XCircle className="w-3.5 h-3.5" /> Fjalëkalimi i gabuar
            </p>
          )}
          <button
            onClick={attempt}
            disabled={loading}
            className="w-full mt-4 bg-moti-sky hover:bg-moti-sky/80 disabled:opacity-60 text-white font-semibold rounded-xl py-3 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {loading ? "Duke verifikuar..." : "Hyr në Dashboard"}
          </button>
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">
          <Link to="/" className="hover:text-slate-400 transition-colors">← Kthehu në faqe</Link>
        </p>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = "sky", skeleton = false }: {
  icon?: React.ReactNode; label: string; value?: string | number; sub?: string;
  color?: string; skeleton?: boolean;
}) {
  if (skeleton) return <SkeletonStatCard />;
  const colors: Record<string, string> = {
    sky: "text-moti-sky bg-moti-sky/10 border-moti-sky/20",
    amber: "text-moti-amber bg-moti-amber/10 border-moti-amber/20",
    green: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20",
    purple: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return (
    <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-xl border ${colors[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-white text-2xl font-bold font-display leading-tight">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Country Badge ────────────────────────────────────────────────────────────
function CountryBadge({ country }: { country: string }) {
  const map: Record<string, { flag: string; cls: string }> = {
    Albania: { flag: "🇦🇱", cls: "bg-red-900/30 text-red-300 border-red-700/30" },
    Kosovo: { flag: "🇽🇰", cls: "bg-blue-900/30 text-blue-300 border-blue-700/30" },
    "Maqedonia e Veriut": { flag: "🇲🇰", cls: "bg-yellow-900/30 text-yellow-300 border-yellow-700/30" },
  };
  const c = map[country] || { flag: "🌍", cls: "bg-slate-800 text-slate-300 border-slate-600/30" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${c.cls}`}>
      {c.flag} {country === "Maqedonia e Veriut" ? "MK" : country === "Kosovo" ? "XK" : "AL"}
    </span>
  );
}

// ─── Cities Tab ───────────────────────────────────────────────────────────────
function CitiesTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "population" | "region">("population");

  // SDK query — merr lokacionet nga databaza me paginim
  const sdkFilters: any = useMemo(() => {
    const f: any = { orderBy: { population: "desc" }, limit: 200 };
    if (countryFilter !== "all") f.where = { country: { eq: countryFilter } };
    return f;
  }, [countryFilter]);

  const { data: sdkData, isPending: loading } = useQuery("Location", sdkFilters);
  const { remove: removeLocation, isPending: isMutating } = useMutation("Location");

  // Fallback: nëse SDK bosh, përdor statik
  const allCities: SearchResult[] = useMemo(() => {
    if (sdkData && (sdkData as Location[]).length > 0) {
      return (sdkData as Location[]).map((loc: Location) => ({
        id: loc.id,
        name: loc.name,
        nameAl: loc.nameAl,
        region: loc.region,
        country: loc.country,
        lat: loc.lat,
        lon: loc.lon,
        population: loc.population,
      }));
    }
    return ALBANIAN_CITIES;
  }, [sdkData]);

  const countries = ["all", "Albania", "Kosovo", "Maqedonia e Veriut"];
  const popularIds = new Set(POPULAR_CITIES.map(c => c.id));

  const filtered = useMemo(() => {
    let list = [...allCities];
    if (search.trim()) {
      const q = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      list = list.filter(c => {
        const n = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const r = c.region.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return n.includes(q) || r.includes(q);
      });
    }
    list.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "population") return (b.population ?? 0) - (a.population ?? 0);
      if (sortBy === "region") return a.region.localeCompare(b.region);
      return 0;
    });
    return list;
  }, [search, sortBy, allCities]);

  const byCountry = useMemo(() => ({
    Albania: allCities.filter(c => c.country === "Albania").length,
    Kosovo: allCities.filter(c => c.country === "Kosovo").length,
    MK: allCities.filter(c => c.country === "Maqedonia e Veriut").length,
  }), [allCities]);

  const copyId = (id: string) => {
    navigator.clipboard?.writeText(id).catch(() => {});
    toast(`ID u kopjua: ${id}`, "success");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Fshi lokacionin "${name}"?`)) return;
    try {
      await removeLocation(id);
      toast(`"${name}" u fshi me sukses`, "success");
    } catch {
      toast("Gabim gjatë fshirjes", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCard key={i} label="" skeleton />)
        ) : (
          <>
            <StatCard icon={<MapPin className="w-5 h-5" />} label="Gjithsej" value={allCities.length} sub="vendbanime" color="sky" />
            <StatCard icon={<span className="text-base">🇦🇱</span>} label="Shqipëri" value={byCountry.Albania} sub="qytete & fshatra" color="red" />
            <StatCard icon={<span className="text-base">🇽🇰</span>} label="Kosovë" value={byCountry.Kosovo} sub="vendbanime" color="amber" />
            <StatCard icon={<span className="text-base">🇲🇰</span>} label="Maqedonia" value={byCountry.MK} sub="vendbanime" color="purple" />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Kërko vendbanim ose rajon..."
            className="w-full bg-moti-navy border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-moti-sky/60 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {countries.map(c => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                countryFilter === c
                  ? "bg-moti-sky text-white border-moti-sky"
                  : "bg-moti-navy border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {c === "all" ? "Të gjitha" : c === "Maqedonia e Veriut" ? "Maqedonia" : c}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="bg-moti-navy border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-moti-sky/60"
        >
          <option value="population">Popullsia ↓</option>
          <option value="name">Emri A–Z</option>
          <option value="region">Rajoni</option>
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Duke shfaqur <span className="text-white font-semibold">{filtered.length}</span> vendbanime
        </p>
        <p className="text-xs text-slate-600">{POPULAR_CITIES.length} popullarë • {ALBANIAN_CITIES.length} gjithsej</p>
      </div>

      {/* Mobile card list  */}
      {!loading && (
        <div className="sm:hidden space-y-2">
          {filtered.slice(0, 60).map((city, i) => (
            <div key={city.id + i} className="bg-moti-navy-mid border border-white/[0.07] rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {popularIds.has(city.id) && <Star className="w-3 h-3 text-moti-amber flex-shrink-0" fill="currentColor" />}
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{city.name}</p>
                  <p className="text-slate-500 text-xs truncate">{city.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CountryBadge country={city.country} />
                <Link
                  to={`/vendbanim/${city.id}`}
                  className="p-1.5 rounded-lg bg-moti-sky/10 text-moti-sky hover:bg-moti-sky/20 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
          {filtered.length > 60 && (
            <p className="text-center text-xs text-slate-500 py-2">+{filtered.length - 60} vendbanime tjera — ngushtoni kërkimin</p>
          )}
        </div>
      )}

      {/* Desktop table */}
      {!loading ? (
        <div className="hidden sm:block bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Emri</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Rajoni</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Vendi</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Popullsia</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Koordinatat</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Veprime</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 150).map((city, i) => (
                  <tr key={city.id + i} className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {popularIds.has(city.id) && (
                          <Star className="w-3 h-3 text-moti-amber flex-shrink-0" fill="currentColor" />
                        )}
                        <span className="text-white font-medium">{city.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-400">{city.region}</span>
                    </td>
                    <td className="px-4 py-3">
                      <CountryBadge country={city.country} />
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className="text-slate-400">{city.population?.toLocaleString() ?? "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden xl:table-cell">
                      <span className="text-slate-600 font-mono text-xs">{city.lat.toFixed(3)}, {city.lon.toFixed(3)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/vendbanim/${city.id}`}
                          className="inline-flex items-center gap-1 text-moti-sky hover:text-white text-xs font-medium transition-colors px-2 py-1 rounded-lg bg-moti-sky/10 hover:bg-moti-sky/20"
                        >
                          <Eye className="w-3.5 h-3.5" /> Shiko
                        </Link>
                        <button
                          onClick={() => copyId(city.id)}
                          className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-xs transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
                          title="Kopjo ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > 150 && (
              <div className="px-4 py-3 border-t border-white/[0.07] text-center text-sm text-slate-500">
                Duke shfaqur 150 nga {filtered.length} rezultate — ngushtoni kërkimin
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden sm:block bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}
    </div>
  );
}

// ─── API Monitor Tab ──────────────────────────────────────────────────────────
function ApiTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [latency, setLatency] = useState<number | null>(null);
  const [corsStatus, setCorsStatus] = useState<"checking" | "ok" | "error">("checking");
  const [lastChecked, setLastChecked] = useState<string>("");
  const [initialLoading, setInitialLoading] = useState(true);

  // ── Multi-proxy fallback (same chain as yrApi.ts) ──────────────────────────
  const tryFetchWithProxies = async (targetUrl: string): Promise<string> => {
    const proxies = [
      { name: "corsproxy.io", url: `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`, parse: async (r: Response) => r.text() },
      { name: "allorigins.win", url: `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, parse: async (r: Response) => { const j = await r.json(); if (j?.status?.http_code && j.status.http_code !== 200) throw new Error(`upstream ${j.status.http_code}`); return j.contents; } },
      { name: "thingproxy", url: `https://thingproxy.freeboard.io/fetch/${targetUrl}`, parse: async (r: Response) => r.text() },
    ];
    for (const p of proxies) {
      try {
        const res = await fetch(p.url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await p.parse(res);
      } catch (err: any) {
        console.warn(`[Moti Admin] proxy ${p.name} failed: ${err.message}`);
      }
    }
    throw new Error("All proxies failed");
  };

  const checkApi = async () => {
    setApiStatus("checking");
    setCorsStatus("checking");
    const start = Date.now();
    try {
      const testUrl = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=41.33&lon=19.82";
      const text = await tryFetchWithProxies(testUrl);
      const elapsed = Date.now() - start;
      setLatency(elapsed);
      // Validate it looks like a YR response
      const data = JSON.parse(text);
      if (data?.properties?.timeseries) {
        setApiStatus("online");
        setCorsStatus("ok");
        toast("API online — " + elapsed + "ms latency", "success");
      } else {
        setApiStatus("offline");
        setCorsStatus("error");
        toast("API u kthye me format të gabuar", "error");
      }
    } catch {
      setApiStatus("offline");
      setCorsStatus("error");
      setLatency(Date.now() - start);
      toast("Lidhja me API dështoi — të gjitha proxiet", "error");
    }
    setLastChecked(new Date().toLocaleTimeString("sq-AL"));
    setInitialLoading(false);
  };

  useEffect(() => { checkApi(); }, []);

  const endpoints = [
    { name: "MET Norway API", url: "api.met.no/weatherapi/locationforecast/2.0", status: apiStatus },
    { name: "allorigins CORS proxy", url: "api.allorigins.win", status: corsStatus === "checking" ? "checking" : corsStatus === "ok" ? "online" : "offline" },
    { name: "MetAlerts (warnings)", url: "api.met.no/weatherapi/metalerts/2.0", status: "advisory" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {initialLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCard key={i} label="" skeleton />)
        ) : (
          <>
            <StatCard
              icon={apiStatus === "online" ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              label="API Status"
              value={apiStatus === "checking" ? "..." : apiStatus === "online" ? "Online" : "Offline"}
              sub="MET Norway"
              color={apiStatus === "online" ? "green" : apiStatus === "offline" ? "red" : "amber"}
            />
            <StatCard
              icon={<Activity className="w-5 h-5" />}
              label="Latency"
              value={latency ? `${latency}ms` : "—"}
              sub="via allorigins proxy"
              color={latency && latency < 1000 ? "green" : latency && latency < 3000 ? "amber" : "red"}
            />
            <StatCard icon={<Database className="w-5 h-5" />} label="Cache TTL" value="30 min" sub="session in-memory" color="purple" />
            <StatCard icon={<Clock className="w-5 h-5" />} label="Kontrolluar" value={lastChecked || "—"} sub="herët e fundit" color="sky" />
          </>
        )}
      </div>

      {/* Endpoints */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-moti-sky" /> Endpoints API
          </h3>
          <button
            onClick={checkApi}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 bg-white/[0.05] rounded-lg hover:bg-white/[0.1]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Kontrollo
          </button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {endpoints.map(ep => (
            <div key={ep.name} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-medium text-sm">{ep.name}</p>
                <p className="text-slate-500 text-xs font-mono mt-0.5 truncate">{ep.url}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {ep.status === "checking" && (
                  <span className="flex items-center gap-1.5 text-xs text-moti-amber">
                    <span className="w-2 h-2 rounded-full bg-moti-amber animate-pulse" /> Duke kontrolluar...
                  </span>
                )}
                {ep.status === "online" && (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" /> Online
                  </span>
                )}
                {ep.status === "offline" && (
                  <span className="flex items-center gap-1.5 text-xs text-red-400">
                    <XCircle className="w-4 h-4" /> Offline
                  </span>
                )}
                {ep.status === "advisory" && (
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <AlertTriangle className="w-4 h-4" /> Opsional
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture notes */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-moti-sky" /> Arkitektura e të Dhënave
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: "Burimi i të dhënave", value: "MET Norway (api.met.no) — falas" },
            { label: "CORS proxy", value: "allorigins.win (sandpack) → /api/yr (prod)" },
            { label: "Cache strategjia", value: "In-memory session • 30 min TTL" },
            { label: "Fallback", value: "generateMockWeather() nëse API dështon" },
            { label: "Vlerat e erës", value: "m/s → km/h (×3.6) gjatë adaptimit" },
            { label: "SEO", value: "JSON-LD structured data në çdo CityPage" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-4 py-2 border-b border-white/[0.05] last:border-0">
              <span className="text-slate-400 flex-shrink-0">{label}</span>
              <span className="text-white text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  // SDK — numërim dinamik i lokacioneve nga databaza
  const { data: allLocData, isPending: loading } = useQuery("Location", { limit: 10000 } as any);
  const { data: popularData } = useQuery("Location", { where: { isPopular: true }, orderBy: { population: "desc" }, limit: 8 } as any);

  const allLocs: SearchResult[] = useMemo(() => {
    if (allLocData && (allLocData as Location[]).length > 0) {
      return (allLocData as Location[]).map((loc: Location) => ({
        id: loc.id,
        name: loc.name,
        nameAl: loc.nameAl,
        region: loc.region,
        country: loc.country,
        lat: loc.lat,
        lon: loc.lon,
        population: loc.population,
      }));
    }
    return ALBANIAN_CITIES;
  }, [allLocData]);

  const popularList: SearchResult[] = useMemo(() => {
    if (popularData && (popularData as Location[]).length > 0) {
      return (popularData as Location[]).map((loc: Location) => ({
        id: loc.id,
        name: loc.name,
        nameAl: loc.nameAl,
        region: loc.region,
        country: loc.country,
        lat: loc.lat,
        lon: loc.lon,
        population: loc.population,
      }));
    }
    return POPULAR_CITIES;
  }, [popularData]);

  const alCount = allLocs.filter(c => c.country === "Albania").length;
  const xkCount = allLocs.filter(c => c.country === "Kosovo").length;
  const mkCount = allLocs.filter(c => c.country === "Maqedonia e Veriut").length;

  const regions = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of allLocs) {
      map.set(c.region, (map.get(c.region) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [allLocs]);

  const routes = [
    { path: "/", label: "Kryefaqja", desc: "Hero search + popullarët + SEO" },
    { path: "/vendbanimet", label: "Vendbanimet", desc: "Lista gjithë qyteteve sipas vendit" },
    { path: "/vendbanim/:id", label: "Faqja e Qytetit", desc: "Moti live + orari + 10-ditore + JSON-LD" },
    { path: "/vendbanim/:id/dita/:date", label: "Faqja Ditore", desc: "Orët 24h + FAQ + Event schema" },
    { path: "/admin", label: "Admin Dashboard", desc: "Ky panel" },
  ];

  // Quick action: copy site URL
  const copySiteUrl = () => {
    navigator.clipboard?.writeText(window.location.origin).catch(() => {});
    toast("URL e faqes u kopjua!", "success");
  };

  return (
    <div className="space-y-6">
      {/* Quick actions bar */}
      <div className="bg-gradient-to-r from-moti-sky/10 to-moti-sky/5 border border-moti-sky/20 rounded-2xl p-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-moti-amber" /> Veprime të Shpejta
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/vendbanim/tirane" className="flex items-center gap-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white rounded-xl px-3 py-2 transition-all font-medium">
            <MapPin className="w-3.5 h-3.5 text-moti-sky" /> Tiranë
          </Link>
          <Link to="/vendbanim/shkoder" className="flex items-center gap-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white rounded-xl px-3 py-2 transition-all font-medium">
            <MapPin className="w-3.5 h-3.5 text-moti-sky" /> Shkodër
          </Link>
          <Link to="/vendbanim/durres" className="flex items-center gap-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white rounded-xl px-3 py-2 transition-all font-medium">
            <MapPin className="w-3.5 h-3.5 text-moti-sky" /> Durrës
          </Link>
          <Link to="/vendbanim/vlore" className="flex items-center gap-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white rounded-xl px-3 py-2 transition-all font-medium">
            <MapPin className="w-3.5 h-3.5 text-moti-sky" /> Vlorë
          </Link>
          <Link to="/vendbanim/prishtine" className="flex items-center gap-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white rounded-xl px-3 py-2 transition-all font-medium">
            <MapPin className="w-3.5 h-3.5 text-moti-amber" /> Prishtinë
          </Link>
          <Link to="/vendbanimet" className="flex items-center gap-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-slate-300 rounded-xl px-3 py-2 transition-all">
            <Globe className="w-3.5 h-3.5" /> Të gjitha qytetet
          </Link>
          <button onClick={copySiteUrl} className="flex items-center gap-1.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-slate-300 rounded-xl px-3 py-2 transition-all">
            <Copy className="w-3.5 h-3.5" /> Kopjo URL
          </button>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCard key={i} label="" skeleton />)
        ) : (
          <>
            <StatCard icon={<MapPin className="w-5 h-5" />} label="Gjithsej Qytete" value={allLocs.length} sub="me koordinata GPS" color="sky" />
            <StatCard icon={<Star className="w-5 h-5" />} label="Popullarë" value={popularList.length} sub="≥15k banorë" color="amber" />
            <StatCard icon={<Globe className="w-5 h-5" />} label="Shtete" value={3} sub="AL · XK · MK" color="green" />
            <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Rrugë SEO" value={routes.length} sub="faqe të indeksueshme" color="purple" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Routes */}
        <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-moti-sky" /> Rrugët e Aplikacionit
            </h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {routes.map(r => (
              <div key={r.path} className="px-5 py-3 flex items-center justify-between gap-3 group">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium">{r.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{r.desc}</p>
                </div>
                <code className="text-xs text-moti-sky font-mono bg-moti-sky/10 px-2 py-1 rounded-lg flex-shrink-0 max-w-[140px] truncate">{r.path}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Top regions */}
        <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.07]">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-moti-sky" /> Rrethet/Rajonet (top 8)
            </h3>
          </div>
          <div className="px-5 py-3 space-y-2">
            {regions.map(([region, count]) => (
              <div key={region} className="flex items-center gap-3">
                <span className="text-slate-300 text-sm w-28 truncate flex-shrink-0">{region}</span>
                <div className="flex-1 bg-white/[0.05] rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-moti-sky to-moti-sky/60 rounded-full h-1.5 transition-all"
                    style={{ width: `${(count / regions[0][1]) * 100}%` }}
                  />
                </div>
                <span className="text-slate-400 text-xs w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular cities */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.07]">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-moti-amber" /> Qytetet Popullarë (faqja kryesore)
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
          {popularList.map(city => (
            <Link
              key={city.id}
              to={`/vendbanim/${city.id}`}
              className="px-5 py-4 hover:bg-white/[0.03] transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-semibold group-hover:text-moti-sky transition-colors">{city.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{city.region}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-moti-sky transition-colors mt-0.5" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <CountryBadge country={city.country} />
                <span className="text-slate-600 text-xs">{city.population?.toLocaleString()}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Manual Add Tab ───────────────────────────────────────────────────────────
function ManualAddTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  const { create, isPending } = useMutation("Location");

  const [form, setForm] = useState({
    name: "", nameAl: "", region: "", country: "Albania",
    lat: "", lon: "", population: "", isPopular: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geocoding, setGeocoding] = useState(false);

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const geocodeAddress = async () => {
    if (!form.name && !form.nameAl) return;
    setGeocoding(true);
    try {
      const q = encodeURIComponent((form.nameAl || form.name) + ", " + form.country);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1&addressdetails=1`;
      // Try direct first (Nominatim allows CORS), then proxy fallback
      let text: string;
      try {
        const direct = await fetch(url, { headers: { "Accept": "application/json" } });
        text = await direct.text();
      } catch {
        const wrapped = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const res = await fetch(wrapped);
        text = await res.text();
      }
      const results = JSON.parse(text);
      if (results && results.length > 0) {
        const r = results[0];
        set("lat", parseFloat(r.lat).toFixed(5));
        set("lon", parseFloat(r.lon).toFixed(5));
        toast(`Koordinatat u gjetën: ${parseFloat(r.lat).toFixed(4)}, ${parseFloat(r.lon).toFixed(4)}`, "success");
      } else {
        toast("Nuk u gjetën koordinata — shkruaj manualisht", "error");
      }
    } catch {
      toast("Gabim gjatë gjeokodimit", "error");
    }
    setGeocoding(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Emri është i detyrueshëm";
    if (!form.nameAl.trim()) e.nameAl = "Emri shqip është i detyrueshëm";
    if (!form.region.trim()) e.region = "Rajoni është i detyrueshëm";
    if (!form.lat || isNaN(Number(form.lat))) e.lat = "Latitude e pavlefshme";
    if (!form.lon || isNaN(Number(form.lon))) e.lon = "Longitude e pavlefshme";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await create({
        name: form.name.trim(),
        nameAl: form.nameAl.trim(),
        region: form.region.trim(),
        country: form.country,
        lat: parseFloat(form.lat),
        lon: parseFloat(form.lon),
        population: form.population ? parseInt(form.population) : 0,
        isPopular: form.isPopular || parseInt(form.population || "0") >= 15000,
      });
      toast(`"${form.name}" u shtua me sukses! ✅`, "success");
      setForm({ name: "", nameAl: "", region: "", country: "Albania", lat: "", lon: "", population: "", isPopular: false });
      setErrors({});
    } catch {
      toast("Gabim gjatë ruajtjes", "error");
    }
  };

  const Field = ({ label, field, placeholder, type = "text", half = false }: {
    label: string; field: string; placeholder?: string; type?: string; half?: boolean;
  }) => (
    <div className={half ? "flex-1 min-w-0" : "w-full"}>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        type={type}
        value={(form as any)[field]}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-moti-navy border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all
          ${errors[field] ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20" : "border-white/10 focus:border-moti-sky/60 focus:ring-moti-sky/20"}`}
      />
      {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-white">Shto Lokacion Manual</h3>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Shto çdo vendbanim direkt në databazë. Mund të gjeokodon automatikisht koordinatat nga Nominatim/OpenStreetMap.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-6 space-y-5">
        {/* Emri + Emri shqip */}
        <div className="flex gap-3">
          <Field label="Emri (standard)" field="name" placeholder="p.sh. Tirana" half />
          <Field label="Emri shqip" field="nameAl" placeholder="p.sh. Tiranë" half />
        </div>

        {/* Rajoni + Vendi */}
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Rajoni</label>
            <input
              value={form.region}
              onChange={e => set("region", e.target.value)}
              placeholder="p.sh. Tiranë"
              className={`w-full bg-moti-navy border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all
                ${errors.region ? "border-red-500/60 focus:ring-red-500/20" : "border-white/10 focus:border-moti-sky/60 focus:ring-moti-sky/20"}`}
            />
            {errors.region && <p className="text-red-400 text-xs mt-1">{errors.region}</p>}
          </div>
          <div className="w-40 flex-shrink-0">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Shteti</label>
            <select
              value={form.country}
              onChange={e => set("country", e.target.value)}
              className="w-full bg-moti-navy border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-moti-sky/60 focus:ring-1 focus:ring-moti-sky/20 transition-all"
            >
              <option value="Albania">🇦🇱 Albania</option>
              <option value="Kosovo">🇽🇰 Kosovo</option>
              <option value="Maqedonia e Veriut">🇲🇰 Maqedonia</option>
            </select>
          </div>
        </div>

        {/* Koordinatat + Geocode */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Koordinatat GPS</label>
          <div className="flex gap-3 items-start">
            <div className="flex-1">
              <input
                value={form.lat}
                onChange={e => set("lat", e.target.value)}
                placeholder="Latitude  p.sh. 41.3275"
                className={`w-full bg-moti-navy border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 transition-all
                  ${errors.lat ? "border-red-500/60 focus:ring-red-500/20" : "border-white/10 focus:border-moti-sky/60 focus:ring-moti-sky/20"}`}
              />
              {errors.lat && <p className="text-red-400 text-xs mt-1">{errors.lat}</p>}
            </div>
            <div className="flex-1">
              <input
                value={form.lon}
                onChange={e => set("lon", e.target.value)}
                placeholder="Longitude  p.sh. 19.8187"
                className={`w-full bg-moti-navy border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 font-mono focus:outline-none focus:ring-1 transition-all
                  ${errors.lon ? "border-red-500/60 focus:ring-red-500/20" : "border-white/10 focus:border-moti-sky/60 focus:ring-moti-sky/20"}`}
              />
              {errors.lon && <p className="text-red-400 text-xs mt-1">{errors.lon}</p>}
            </div>
            <button
              type="button"
              onClick={geocodeAddress}
              disabled={geocoding || (!form.name && !form.nameAl)}
              title="Gjeo-kodo automatikisht nga Nominatim"
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 bg-moti-sky/15 hover:bg-moti-sky/25 disabled:opacity-40 border border-moti-sky/30 rounded-xl text-moti-sky text-xs font-medium transition-all whitespace-nowrap"
            >
              {geocoding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              {geocoding ? "..." : "Auto GPS"}
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-1.5">Kliko "Auto GPS" për të marrë koordinatat automatikisht nga OpenStreetMap</p>
        </div>

        {/* Popullsia + isPopular */}
        <div className="flex gap-3 items-start">
          <Field label="Popullsia (opsionale)" field="population" placeholder="p.sh. 50000" type="number" half />
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Popular (faqja kryesore)</label>
            <button
              type="button"
              onClick={() => set("isPopular", !form.isPopular)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all w-full
                ${form.isPopular
                  ? "bg-moti-amber/15 border-moti-amber/40 text-moti-amber"
                  : "bg-moti-navy border-white/10 text-slate-400 hover:text-white"
                }`}
            >
              <Star className={`w-4 h-4 ${form.isPopular ? "fill-current" : ""}`} />
              {form.isPopular ? "Po — shfaq në Popular" : "Jo — mos shfaq"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 border-t border-white/[0.07] flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl px-6 py-2.5 transition-all active:scale-95"
          >
            {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isPending ? "Duke ruajtur..." : "Ruaj Lokacionin"}
          </button>
          <button
            type="button"
            onClick={() => { setForm({ name: "", nameAl: "", region: "", country: "Albania", lat: "", lon: "", population: "", isPopular: false }); setErrors({}); }}
            className="text-slate-400 hover:text-white text-sm px-4 py-2.5 transition-colors"
          >
            Pastro
          </button>
        </div>
      </form>

      {/* Help */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-moti-sky" /> Si të gjesh koordinatat
        </h4>
        <div className="space-y-2 text-sm text-slate-400">
          <p>1. <strong className="text-white">Auto GPS</strong>: Shkruaj emrin dhe kliko "Auto GPS" — Nominatim i gjen automatikisht</p>
          <p>2. <strong className="text-white">Google Maps</strong>: Kliko me të djathtën mbi vendbanim → sheh lat, lon</p>
          <p>3. <strong className="text-white">OpenStreetMap</strong>: <code className="text-moti-sky bg-moti-sky/10 px-1 rounded text-xs">openstreetmap.org</code> → kërko → URL përmban koordinatat</p>
        </div>
      </div>
    </div>
  );
}

// ─── API Import Tab ────────────────────────────────────────────────────────────
function ApiImportTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  const { create, isPending: isSaving } = useMutation("Location");
  const { data: existingData } = useQuery("Location", { limit: 10000 } as any);

  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState("Albania");
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(0);

  const existingNames = useMemo(() => {
    if (!existingData) return new Set<string>();
    return new Set((existingData as any[]).map((l: any) => l.name.toLowerCase().trim()));
  }, [existingData]);

  // Country code per Nominatim
  const countryCodes: Record<string, string> = {
    "Albania": "al",
    "Kosovo": "xk",
    "Maqedonia e Veriut": "mk",
  };

  const searchNominatim = async () => {
    if (!searchQuery.trim()) {
      toast("Shkruaj një kërkim — qyteti, rajoni ose zoni", "info");
      return;
    }
    setSearching(true);
    setApiResults([]);
    setSelected(new Set());
    try {
      const cc = countryCodes[country] || "al";
      const q = encodeURIComponent(searchQuery + ", " + country);
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${q}&countrycodes=${cc}&limit=40&addressdetails=1&featuretype=city&featuretype=town&featuretype=village&featuretype=hamlet`;
      let text: string;
      try {
        const direct = await fetch(url, { headers: { "Accept": "application/json" } });
        text = await direct.text();
      } catch {
        const wrapped = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        const res = await fetch(wrapped);
        text = await res.text();
      }
      const results: any[] = JSON.parse(text);
      const filtered = results.filter((r: any) => {
        const t = r.type;
        return ["city", "town", "village", "hamlet", "suburb", "municipality", "administrative"].includes(t);
      });
      setApiResults(filtered);
      if (filtered.length === 0) {
        toast("Nuk u gjetën vendbanime — provo terma tjera", "info");
      } else {
        toast(`U gjetën ${filtered.length} vendbanime nga Nominatim`, "success");
      }
    } catch {
      toast("Gabim gjatë lidhjes me Nominatim API", "error");
    }
    setSearching(false);
  };

  const toggleSelect = (idx: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  const selectAll = () => {
    const newItems = apiResults.reduce((acc, r, i) => {
      if (!existingNames.has(r.display_name?.split(",")[0]?.toLowerCase().trim())) acc.add(i);
      return acc;
    }, new Set<number>());
    setSelected(newItems);
  };

  const importSelected = async () => {
    if (selected.size === 0) { toast("Zgjidh së paku një lokacion", "info"); return; }
    setImporting(true);
    setImportDone(0);
    let count = 0;

    for (const idx of Array.from(selected)) {
      const r = apiResults[idx];
      const nameParts = r.display_name.split(",");
      const name = nameParts[0]?.trim() || r.name;
      const region = r.address?.state || r.address?.county || r.address?.region || nameParts[1]?.trim() || "";

      try {
        await create({
          name,
          nameAl: name,
          region,
          country,
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          population: 0,
          isPopular: false,
        });
        count++;
        setImportDone(count);
        await new Promise(resolve => setTimeout(resolve, 60));
      } catch {
        // skip duplicates
      }
    }

    setImporting(false);
    toast(`✅ ${count} lokacione u shtuan në databazë!`, "success");
    setSelected(new Set());
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-moti-sky/10 to-transparent border border-moti-sky/20 rounded-2xl p-5 flex items-start gap-3">
        <Globe className="w-5 h-5 text-moti-sky flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-white">Import nga Nominatim API (OpenStreetMap)</h3>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Kërko vendbanime reale nga <strong className="text-white">OpenStreetMap/Nominatim</strong> (pa API key, falas).
            Zgjidh ato që dëshiron dhe i ruan direkt në databazë.
          </p>
        </div>
      </div>

      {/* Search controls */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 space-y-4">
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchNominatim()}
              placeholder="p.sh. Shkodër, Elbasan, Prishtinë, Vlorë..."
              className="w-full bg-moti-navy border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-moti-sky/60 focus:ring-1 focus:ring-moti-sky/20 transition-all"
            />
          </div>
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            className="bg-moti-navy border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-moti-sky/60 transition-all flex-shrink-0"
          >
            <option value="Albania">🇦🇱 Albania</option>
            <option value="Kosovo">🇽🇰 Kosovo</option>
            <option value="Maqedonia e Veriut">🇲🇰 Maqedonia</option>
          </select>
          <button
            onClick={searchNominatim}
            disabled={searching}
            className="flex items-center gap-2 bg-moti-sky hover:bg-moti-sky/80 disabled:opacity-50 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all active:scale-95 flex-shrink-0"
          >
            {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Kërko
          </button>
        </div>
        <p className="text-slate-600 text-xs">
          💡 Provo: "Tiranë", "qytetet e Korçës", "fshatrat e Shkodrës", "Prizren", "Gostivar"
        </p>
      </div>

      {/* Results */}
      {apiResults.length > 0 && (
        <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold text-sm">{apiResults.length} rezultate nga OSM</span>
              <span className="text-slate-500 text-xs">{selected.size} të zgjedhura</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={selectAll}
                className="text-xs text-moti-sky hover:text-white transition-colors px-3 py-1.5 bg-moti-sky/10 rounded-lg"
              >
                Zgjidh të gjitha
              </button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 bg-white/[0.05] rounded-lg"
              >
                Pastro
              </button>
              <button
                onClick={importSelected}
                disabled={importing || isSaving || selected.size === 0}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold rounded-xl px-4 py-1.5 text-xs transition-all"
              >
                {importing
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> {importDone}/{selected.size}</>
                  : <><Database className="w-3.5 h-3.5" /> Importo {selected.size}</>
                }
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
            {apiResults.map((r, i) => {
              const name = r.display_name?.split(",")[0]?.trim() || r.name;
              const region = r.address?.state || r.address?.county || r.address?.region || "—";
              const alreadyIn = existingNames.has(name.toLowerCase().trim());
              const isSelected = selected.has(i);

              return (
                <div
                  key={i}
                  onClick={() => !alreadyIn && toggleSelect(i)}
                  className={`px-5 py-3.5 flex items-center gap-4 transition-colors cursor-pointer
                    ${alreadyIn ? "opacity-40 cursor-not-allowed" : ""}
                    ${isSelected ? "bg-emerald-500/10 border-l-2 border-emerald-500" : "hover:bg-white/[0.03]"}
                  `}
                >
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all
                    ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-white/20"}`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{name}</p>
                    <p className="text-slate-500 text-xs truncate">{region} • {r.type}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-slate-600 text-xs font-mono">{parseFloat(r.lat).toFixed(3)}, {parseFloat(r.lon).toFixed(3)}</span>
                    {alreadyIn && (
                      <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Në DB
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Overpass Bulk Import Tab ─────────────────────────────────────────────────
type OverpassNode = {
  id: number;
  lat: number;
  lon: number;
  tags: { name?: string; "name:sq"?: string; place?: string; population?: string; };
};

type BulkCountryConfig = {
  code: string;
  label: string;
  flag: string;
  country: string;
  region: string;
};

const BULK_COUNTRIES: BulkCountryConfig[] = [
  { code: "AL", label: "Shqipëri", flag: "🇦🇱", country: "Albania", region: "Shqipëri" },
  { code: "XK", label: "Kosovë",   flag: "🇽🇰", country: "Kosovo",  region: "Kosovë"  },
  { code: "MK", label: "Maqedonia",flag: "🇲🇰", country: "Maqedonia e Veriut", region: "Maqedoni" },
];

async function fetchWithProxyChain(targetUrl: string, signal?: AbortSignal): Promise<string> {
  const proxies = [
    { name: "corsproxy.io", build: (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`, parse: async (r: Response) => r.text() },
    { name: "allorigins.win", build: (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`, parse: async (r: Response) => { const j = await r.json(); if (j?.status?.http_code && j.status.http_code !== 200) throw new Error(`upstream ${j.status.http_code}`); return j.contents as string; } },
    { name: "thingproxy", build: (u: string) => `https://thingproxy.freeboard.io/fetch/${u}`, parse: async (r: Response) => r.text() },
  ];
  let lastErr: Error = new Error("All proxies failed");
  for (const p of proxies) {
    try {
      console.log(`[Moti] fetchViaProxy ${p.name} → ${targetUrl.slice(0, 60)}...`);
      const res = await fetch(p.build(targetUrl), { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await p.parse(res);
      console.log(`[Moti] ✅ ${p.name} OK`);
      return text;
    } catch (err: any) {
      console.warn(`[Moti] ⚠️ ${p.name} failed: ${err.message}`);
      lastErr = err;
    }
  }
  throw lastErr;
}

async function fetchOverpassCountry(isoCode: string, signal?: AbortSignal): Promise<OverpassNode[]> {
  const query = `[out:json][timeout:60];area["ISO3166-1"="${isoCode}"][admin_level=2]->.a;(node["place"~"^(city|town|village|hamlet|suburb|municipality)$"](area.a););out body;`;
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  const text = await fetchWithProxyChain(url, signal);
  const parsed = JSON.parse(text);
  return (parsed.elements || []).filter((el: any) => el.type === "node") as OverpassNode[];
}

function BulkOverpassTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  const { create } = useMutation("Location");
  const { data: existingData } = useQuery("Location", { limit: 20000 } as any);

  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set(["AL", "XK", "MK"]));
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchedNodes, setFetchedNodes] = useState<(OverpassNode & { country: string; regionDefault: string })[]>([]);
  const [fetchProgress, setFetchProgress] = useState<Record<string, "idle" | "loading" | "done" | "error">>({});
  const [saveProgress, setSaveProgress] = useState(0);
  const [saveTotal, setSaveTotal] = useState(0);
  const [saveDone, setSaveDone] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [minPop, setMinPop] = useState(0);
  const [placeTypes, setPlaceTypes] = useState<Set<string>>(new Set(["city","town","village","hamlet","suburb","municipality"]));

  const existingNames = useMemo(() => {
    if (!existingData) return new Set<string>();
    return new Set((existingData as Location[]).map((l: Location) => l.name.toLowerCase().trim()));
  }, [existingData]);

  const toggleCountry = (code: string) =>
    setSelectedCountries(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });

  const togglePlace = (type: string) =>
    setPlaceTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });

  const fetchAll = async () => {
    if (selectedCountries.size === 0) { toast("Zgjidh së paku një vend", "info"); return; }
    setFetching(true);
    setFetchedNodes([]);
    setSaveDone(false);

    const initial: Record<string, "idle" | "loading" | "done" | "error"> = {};
    BULK_COUNTRIES.forEach(c => { initial[c.code] = selectedCountries.has(c.code) ? "loading" : "idle"; });
    setFetchProgress(initial);

    const allNodes: (OverpassNode & { country: string; regionDefault: string })[] = [];

    for (const cfg of BULK_COUNTRIES.filter(c => selectedCountries.has(c.code))) {
      try {
        toast(`Duke marrë vendbanime të ${cfg.label}...`, "info");
        const nodes = await fetchOverpassCountry(cfg.code);
        const tagged = nodes.map(n => ({ ...n, country: cfg.country, regionDefault: cfg.region }));
        allNodes.push(...tagged);
        setFetchProgress(prev => ({ ...prev, [cfg.code]: "done" }));
        toast(`${cfg.flag} ${cfg.label}: ${nodes.length} vendbanime`, "success");
      } catch {
        setFetchProgress(prev => ({ ...prev, [cfg.code]: "error" }));
        toast(`Gabim gjatë marrjes të ${cfg.label}`, "error");
      }
      await new Promise(r => setTimeout(r, 800)); // respekt rate-limit
    }

    setFetchedNodes(allNodes);
    setFetching(false);
    toast(`✅ Gjithsej ${allNodes.length} vendbanime u morën!`, "success");
  };

  const filteredNodes = useMemo(() => {
    return fetchedNodes.filter(n => {
      const place = n.tags.place || "";
      if (!placeTypes.has(place)) return false;
      const pop = parseInt(n.tags.population || "0") || 0;
      if (pop > 0 && pop < minPop) return false;
      const name = n.tags["name:sq"] || n.tags.name || "";
      if (!name.trim()) return false;
      return true;
    });
  }, [fetchedNodes, placeTypes, minPop]);

  const newNodes = useMemo(
    () => filteredNodes.filter(n => {
      const name = n.tags["name:sq"] || n.tags.name || "";
      return !existingNames.has(name.toLowerCase().trim());
    }),
    [filteredNodes, existingNames]
  );

  const saveAll = async () => {
    if (newNodes.length === 0) { toast("Asnjë vendbanim i ri për import", "info"); return; }
    setSaving(true);
    setSaveDone(false);
    setSaveProgress(0);
    setSavedCount(0);
    setSkippedCount(0);
    setSaveTotal(newNodes.length);

    let saved = 0;
    let skipped = 0;
    const BATCH = 8;

    for (let i = 0; i < newNodes.length; i += BATCH) {
      const batch = newNodes.slice(i, i + BATCH);
      await Promise.all(batch.map(async (n) => {
        const nameAl = n.tags["name:sq"] || n.tags.name || "";
        const name   = n.tags.name || nameAl;
        const pop    = parseInt(n.tags.population || "0") || 0;
        const place  = n.tags.place || "";
        const cfg    = BULK_COUNTRIES.find(c => c.country === n.country)!;
        try {
          await create({
            name,
            nameAl,
            region: cfg.region,
            country: n.country,
            lat: n.lat,
            lon: n.lon,
            population: pop,
            isPopular: pop >= 15000 || place === "city" || place === "town",
          });
          saved++;
        } catch { skipped++; }
      }));
      setSaveProgress(Math.min(i + BATCH, newNodes.length));
      setSavedCount(saved);
      setSkippedCount(skipped);
      await new Promise(r => setTimeout(r, 50));
    }

    setSaving(false);
    setSaveDone(true);
    toast(`✅ ${saved} vendbanime u ruajtën! (${skipped} skip)`, saved > 0 ? "success" : "error");
  };

  const savePercent = saveTotal > 0 ? Math.round((saveProgress / saveTotal) * 100) : 0;

  const placeTypeOptions = ["city","town","village","hamlet","suburb","municipality"];

  // Count by place type
  const typeCount = useMemo(() => {
    const m: Record<string, number> = {};
    fetchedNodes.forEach(n => { const t = n.tags.place || "other"; m[t] = (m[t] || 0) + 1; });
    return m;
  }, [fetchedNodes]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-5 flex items-start gap-3">
        <Globe className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-white">Import Bulk nga Overpass / OpenStreetMap</h3>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Merr <strong className="text-white">çdo vendbanim</strong> që ekziston në Shqipëri, Kosovë dhe Maqedoni
            nga <strong className="text-white">Overpass API</strong> (OpenStreetMap) — pa API key, falas.
            Pritet <strong className="text-white">2,000-3,500+</strong> vendbanime me koordinata GPS reale.
          </p>
        </div>
      </div>

      {/* Step 1 — Konfiguro */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 space-y-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-5 h-5 bg-moti-sky text-white text-xs rounded-full flex items-center justify-center font-bold">1</span>
          Zgjidh shtetet
        </h3>
        <div className="flex flex-wrap gap-2">
          {BULK_COUNTRIES.map(cfg => {
            const status = fetchProgress[cfg.code];
            return (
              <button
                key={cfg.code}
                onClick={() => !fetching && toggleCountry(cfg.code)}
                disabled={fetching}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                  ${selectedCountries.has(cfg.code)
                    ? "bg-moti-sky/15 border-moti-sky/40 text-white"
                    : "bg-moti-navy border-white/10 text-slate-400 hover:text-white"
                  } ${fetching ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <span className="text-base">{cfg.flag}</span>
                {cfg.label}
                {status === "loading" && <RefreshCw className="w-3.5 h-3.5 animate-spin text-moti-amber" />}
                {status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                {status === "error" && <XCircle className="w-3.5 h-3.5 text-red-400" />}
              </button>
            );
          })}
        </div>

        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className="w-5 h-5 bg-moti-sky text-white text-xs rounded-full flex items-center justify-center font-bold">2</span>
          Llojet e vendbanimit
        </h3>
        <div className="flex flex-wrap gap-2">
          {placeTypeOptions.map(type => (
            <button
              key={type}
              onClick={() => togglePlace(type)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all
                ${placeTypes.has(type)
                  ? "bg-moti-sky/15 border-moti-sky/30 text-moti-sky"
                  : "bg-moti-navy border-white/10 text-slate-500 hover:text-white"
                }`}
            >
              {type}
              {typeCount[type] ? <span className="ml-1.5 opacity-60">{typeCount[type]}</span> : null}
            </button>
          ))}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">
            Popullsia minimale (0 = merr të gjitha)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0} max={5000} step={100}
              value={minPop}
              onChange={e => setMinPop(+e.target.value)}
              className="flex-1 accent-moti-sky"
            />
            <span className="text-white text-sm font-mono w-16 text-right">
              {minPop === 0 ? "Pa limit" : `≥${minPop.toLocaleString()}`}
            </span>
          </div>
        </div>

        <button
          onClick={fetchAll}
          disabled={fetching || selectedCountries.size === 0}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 text-sm transition-all active:scale-95"
        >
          {fetching
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Duke marrë nga Overpass...</>
            : <><Globe className="w-4 h-4" /> Merr Vendbanime nga Overpass</>
          }
        </button>
        {fetching && (
          <p className="text-slate-500 text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-moti-amber" />
            Overpass mund të marrë 10-30s për çdo vend — mos mbyll faqen
          </p>
        )}
      </div>

      {/* Step 2 — Preview & Ruaj */}
      {fetchedNodes.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={<Globe className="w-5 h-5" />} label="Gjithsej OSM" value={fetchedNodes.length} sub="vendbanime të marra" color="purple" />
            <StatCard icon={<Filter className="w-5 h-5" />} label="Pas filtrit" value={filteredNodes.length} sub="vendbanime" color="sky" />
            <StatCard icon={<Database className="w-5 h-5" />} label="Të reja (DB)" value={newNodes.length} sub="nuk janë në databazë" color="green" />
            <StatCard icon={<CheckCircle2 className="w-5 h-5" />} label="Tashmë në DB" value={filteredNodes.length - newNodes.length} sub="do skipërohen" color="amber" />
          </div>

          {/* By country breakdown */}
          <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-moti-sky" /> Ndarja sipas vendit
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {BULK_COUNTRIES.map(cfg => {
                const countFetched = fetchedNodes.filter(n => n.country === cfg.country).length;
                const countNew = newNodes.filter(n => n.country === cfg.country).length;
                if (countFetched === 0) return null;
                return (
                  <div key={cfg.code} className="bg-moti-navy rounded-xl p-4 border border-white/[0.07]">
                    <p className="text-base mb-1">{cfg.flag} <span className="text-white font-semibold text-sm">{cfg.label}</span></p>
                    <p className="text-2xl font-bold font-display text-white">{countFetched.toLocaleString()}</p>
                    <p className="text-emerald-400 text-xs mt-0.5">{countNew} të reja</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save button + progress */}
          <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center font-bold">3</span>
              Ruaj në Databazë
            </h3>
            <p className="text-slate-400 text-sm">
              Do ruhen <strong className="text-white">{newNodes.length}</strong> vendbanime të reja.
              Vendbanime që tashmë janë në databazë skipërohen automatikisht.
            </p>

            {(saving || saveDone) && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white font-medium">
                    {saveDone ? "✅ Ruajtja u përfundua!" : `${saveProgress}/${saveTotal} vendbanime...`}
                  </span>
                  <span className="text-slate-400">{savePercent}%</span>
                </div>
                <div className="w-full bg-white/[0.07] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-emerald-400 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${savePercent}%` }}
                  />
                </div>
                {saveDone && (
                  <div className="flex items-center gap-4 text-sm pt-1">
                    <span className="text-emerald-400 flex items-center gap-1.5"><Check className="w-4 h-4" /> {savedCount} u ruajtën</span>
                    {skippedCount > 0 && <span className="text-slate-500 flex items-center gap-1.5"><XCircle className="w-4 h-4" /> {skippedCount} gabime</span>}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={saveAll}
              disabled={saving || newNodes.length === 0}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 text-sm transition-all active:scale-95"
            >
              {saving
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Duke ruajtur {saveProgress}/{saveTotal}...</>
                : <><Database className="w-4 h-4" /> Ruaj {newNodes.length.toLocaleString()} Vendbanime</>
              }
            </button>
          </div>

          {/* Preview table (first 100) */}
          <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Preview (100 të parat nga {filteredNodes.length})</span>
              <span className="text-xs text-slate-500">🟢 = i ri • ⬜ = tashmë në DB</span>
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-moti-navy-mid">
                  <tr className="border-b border-white/[0.07]">
                    <th className="text-left text-slate-500 px-4 py-2">Emri</th>
                    <th className="text-left text-slate-500 px-4 py-2 hidden sm:table-cell">Lloji</th>
                    <th className="text-left text-slate-500 px-4 py-2">Shteti</th>
                    <th className="text-right text-slate-500 px-4 py-2 hidden md:table-cell">Lat/Lon</th>
                    <th className="text-center text-slate-500 px-4 py-2">Statusi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNodes.slice(0, 100).map((n, i) => {
                    const nameAl = n.tags["name:sq"] || n.tags.name || "";
                    const isNew = !existingNames.has(nameAl.toLowerCase().trim());
                    return (
                      <tr key={n.id} className={`border-b border-white/[0.04] ${isNew ? "" : "opacity-40"}`}>
                        <td className="px-4 py-2 text-white font-medium">{nameAl}</td>
                        <td className="px-4 py-2 text-slate-500 hidden sm:table-cell">{n.tags.place}</td>
                        <td className="px-4 py-2"><CountryBadge country={n.country} /></td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500 hidden md:table-cell">{n.lat.toFixed(3)}, {n.lon.toFixed(3)}</td>
                        <td className="px-4 py-2 text-center">
                          {isNew
                            ? <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="I ri" />
                            : <span className="text-slate-600 text-xs">Në DB</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Overpass + YR Live Test Tab ─────────────────────────────────────────────
type TestPhase = "idle" | "overpass_fetching" | "overpass_done" | "yr_fetching" | "yr_done" | "error";

interface OverpassTestResult {
  name: string;
  lat: number;
  lon: number;
  place: string;
  country: string;
}

interface YrTestResult {
  temp: number;
  windSpeed: number;
  symbol: string;
  time: string;
}

function OverpassYrTestTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [selectedCountry, setSelectedCountry] = useState<"AL" | "XK" | "MK">("AL");
  const [overpassResults, setOverpassResults] = useState<OverpassTestResult[]>([]);
  const [selectedNode, setSelectedNode] = useState<OverpassTestResult | null>(null);
  const [yrResult, setYrResult] = useState<YrTestResult | null>(null);
  const [yrRaw, setYrRaw] = useState<string>("");
  const [overpassMs, setOverpassMs] = useState<number>(0);
  const [yrMs, setYrMs] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, `[${new Date().toLocaleTimeString("sq-AL")}] ${msg}`]);

  const countryLabels: Record<string, string> = { AL: "🇦🇱 Shqipëri", XK: "🇽🇰 Kosovë", MK: "🇲🇰 Maqedoni" };

  // ── Step 1: Fetch 5 vendbanime nga Overpass ──────────────────────────────────
  const runOverpassTest = async () => {
    setPhase("overpass_fetching");
    setOverpassResults([]);
    setSelectedNode(null);
    setYrResult(null);
    setYrRaw("");
    setErrorMsg("");
    setLog([]);
    addLog(`Dërgoj query Overpass për ${countryLabels[selectedCountry]}...`);

    const query = `[out:json][timeout:30];area["ISO3166-1"="${selectedCountry}"][admin_level=2]->.a;(node["place"~"^(city|town|village)$"](area.a););out body 5;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const start = Date.now();
    try {
      addLog(`GET → overpass-api.de (provoj 3 proxy)`);
      const text = await fetchWithProxyChain(url);
      const parsed = JSON.parse(text);
      const nodes: OverpassTestResult[] = (parsed.elements || [])
        .filter((el: any) => el.type === "node")
        .map((el: any) => ({
          name: el.tags?.["name:sq"] || el.tags?.name || `Node ${el.id}`,
          lat: el.lat,
          lon: el.lon,
          place: el.tags?.place || "unknown",
          country: selectedCountry,
        }));
      const elapsed = Date.now() - start;
      setOverpassMs(elapsed);
      if (nodes.length === 0) throw new Error("Overpass ktheu 0 vendbanime");
      setOverpassResults(nodes);
      setSelectedNode(nodes[0]);
      setPhase("overpass_done");
      addLog(`✅ Overpass ktheu ${nodes.length} vendbanime në ${elapsed}ms`);
      nodes.forEach(n => addLog(`  → ${n.name} (${n.place}) — lat:${n.lat.toFixed(4)} lon:${n.lon.toFixed(4)}`));
      toast(`Overpass OK — ${nodes.length} vendbanime në ${elapsed}ms`, "success");
    } catch (err: any) {
      setPhase("error");
      setErrorMsg(err.message || "Gabim i panjohur");
      addLog(`❌ GABIM: ${err.message}`);
      toast(`Gabim Overpass: ${err.message}`, "error");
    }
  };

  // ── Step 2: Test YR API me koordinatat e vendbanimit të zgjedhur ─────────────
  const runYrTest = async () => {
    if (!selectedNode) return;
    setPhase("yr_fetching");
    setYrResult(null);
    setYrRaw("");
    addLog(`\nDërgoj kërkesë YR API për "${selectedNode.name}" (lat=${selectedNode.lat.toFixed(4)}, lon=${selectedNode.lon.toFixed(4)})...`);

    const yrUrl = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${selectedNode.lat.toFixed(4)}&lon=${selectedNode.lon.toFixed(4)}`;
    addLog(`GET → api.met.no (provoj 3 proxy)`);
    addLog(`URL: ${yrUrl}`);

    const start = Date.now();
    try {
      const text = await fetchWithProxyChain(yrUrl);
      const data = JSON.parse(text);
      const elapsed = Date.now() - start;
      setYrMs(elapsed);

      // Merr të dhënat e para nga timeseries
      const first = data?.properties?.timeseries?.[0];
      if (!first) throw new Error("Nuk ka timeseries në përgjigje");
      const instant = first?.data?.instant?.details;
      const next1h  = first?.data?.next_1_hours?.summary;

      const result: YrTestResult = {
        temp: instant?.air_temperature ?? 0,
        windSpeed: instant?.wind_speed ? Math.round(instant.wind_speed * 3.6) : 0,
        symbol: next1h?.symbol_code || "clearsky_day",
        time: first.time,
      };
      setYrResult(result);
      // Preview i raw JSON (300 chars)
      setYrRaw(JSON.stringify(data?.properties?.meta || {}, null, 2).slice(0, 300));
      setPhase("yr_done");
      addLog(`✅ YR API OK në ${elapsed}ms`);
      addLog(`  → Temperatura: ${result.temp}°C`);
      addLog(`  → Era: ${result.windSpeed} km/h`);
      addLog(`  → Simboli: ${result.symbol}`);
      addLog(`  → Koha: ${result.time}`);
      addLog(`\n✅ LIDHJA FUNKSIONON: Overpass (koordinata) → YR (moti) ✅`);
      toast(`YR OK — ${result.temp}°C në ${selectedNode.name}`, "success");
    } catch (err: any) {
      setPhase("error");
      setErrorMsg(err.message || "Gabim i panjohur");
      addLog(`❌ GABIM YR: ${err.message}`);
      toast(`Gabim YR: ${err.message}`, "error");
    }
  };

  const reset = () => {
    setPhase("idle");
    setOverpassResults([]);
    setSelectedNode(null);
    setYrResult(null);
    setYrRaw("");
    setErrorMsg("");
    setLog([]);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-moti-amber/10 to-transparent border border-moti-amber/20 rounded-2xl p-5 flex items-start gap-3">
        <Zap className="w-5 h-5 text-moti-amber flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-white">Test i Plotë: Overpass → YR API</h3>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            Teston zinxhirin e plotë: <strong className="text-white">Overpass</strong> kthen vendbanime reale me koordinata GPS,
            pastaj <strong className="text-white">YR/MET Norway</strong> kthen motin për ato koordinata.
            Kjo është saktësisht se si do punojë sistemi me 2000+ vendbanime.
          </p>
        </div>
      </div>

      {/* Step 1 */}
      <div className={`bg-moti-navy-mid border rounded-2xl p-5 space-y-4 transition-all ${phase === "overpass_done" || phase === "yr_fetching" || phase === "yr_done" ? "border-emerald-500/30" : "border-white/[0.07]"}`}>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className={`w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold transition-colors ${phase === "overpass_done" || phase === "yr_done" ? "bg-emerald-500 text-white" : "bg-moti-sky text-white"}`}>1</span>
          Hapi 1: Merr vendbanime nga Overpass API
          {(phase === "overpass_done" || phase === "yr_done") && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        </h3>

        <div className="flex gap-2 flex-wrap">
          {(["AL", "XK", "MK"] as const).map(code => (
            <button
              key={code}
              onClick={() => !["overpass_fetching","yr_fetching"].includes(phase) && setSelectedCountry(code)}
              disabled={["overpass_fetching","yr_fetching"].includes(phase)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                selectedCountry === code
                  ? "bg-moti-sky/15 border-moti-sky/40 text-white"
                  : "bg-moti-navy border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {countryLabels[code]}
            </button>
          ))}
        </div>

        <button
          onClick={runOverpassTest}
          disabled={["overpass_fetching","yr_fetching"].includes(phase)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all active:scale-95"
        >
          {phase === "overpass_fetching"
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Duke pyetur Overpass...</>
            : <><Globe className="w-4 h-4" /> Testo Overpass (5 vendbanime)</>
          }
        </button>

        {/* Rezultatet e Overpass */}
        {overpassResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              {overpassResults.length} vendbanime u morën — zgjidh një për testin YR:
            </p>
            {overpassResults.map((node, i) => (
              <button
                key={i}
                onClick={() => setSelectedNode(node)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  selectedNode?.name === node.name
                    ? "bg-moti-sky/10 border-moti-sky/40"
                    : "bg-moti-navy border-white/[0.07] hover:border-white/20"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${selectedNode?.name === node.name ? "bg-moti-sky border-moti-sky" : "border-white/20"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm">{node.name}</p>
                  <p className="text-slate-500 text-xs">{node.place} · {node.country}</p>
                </div>
                <code className="text-slate-600 text-xs font-mono flex-shrink-0">
                  {node.lat.toFixed(4)}, {node.lon.toFixed(4)}
                </code>
              </button>
            ))}
            <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
              <Activity className="w-3.5 h-3.5 text-moti-amber" />
              Overpass latency: <strong className="text-moti-amber">{overpassMs}ms</strong>
            </p>
          </div>
        )}
      </div>

      {/* Step 2 */}
      <div className={`bg-moti-navy-mid border rounded-2xl p-5 space-y-4 transition-all ${phase === "yr_done" ? "border-emerald-500/30" : phase === "overpass_done" || phase === "yr_fetching" ? "border-moti-sky/20" : "border-white/[0.07] opacity-50"}`}>
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <span className={`w-5 h-5 text-xs rounded-full flex items-center justify-center font-bold ${phase === "yr_done" ? "bg-emerald-500" : "bg-moti-sky"} text-white`}>2</span>
          Hapi 2: Testo YR API me koordinatat e Overpass
          {phase === "yr_done" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        </h3>

        {selectedNode && (
          <div className="bg-moti-navy rounded-xl px-4 py-3 border border-white/[0.07] flex items-center gap-3">
            <MapPin className="w-4 h-4 text-moti-sky flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">{selectedNode.name}</p>
              <p className="text-slate-500 text-xs font-mono">lat={selectedNode.lat.toFixed(5)}, lon={selectedNode.lon.toFixed(5)}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 mx-1" />
            <div className="text-slate-400 text-xs">
              <p>api.met.no</p>
              <p className="font-mono text-slate-600">locationforecast/2.0/compact</p>
            </div>
          </div>
        )}

        <button
          onClick={runYrTest}
          disabled={!selectedNode || phase === "overpass_fetching" || phase === "yr_fetching" || phase === "idle"}
          className="flex items-center gap-2 bg-moti-sky hover:bg-moti-sky/80 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-all active:scale-95"
        >
          {phase === "yr_fetching"
            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Duke pyetur YR API...</>
            : <><Activity className="w-4 h-4" /> Testo YR API</>
          }
        </button>

        {/* Rezultati YR */}
        {yrResult && phase === "yr_done" && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-moti-navy border border-emerald-500/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold font-display text-white">{yrResult.temp}°C</p>
                <p className="text-slate-400 text-xs mt-1">Temperatura</p>
              </div>
              <div className="bg-moti-navy border border-moti-sky/20 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold font-display text-white">{yrResult.windSpeed}</p>
                <p className="text-slate-400 text-xs mt-1">Era (km/h)</p>
              </div>
              <div className="bg-moti-navy border border-white/[0.07] rounded-xl p-4 text-center">
                <p className="text-xs font-mono text-moti-sky truncate mt-2">{yrResult.symbol}</p>
                <p className="text-slate-400 text-xs mt-1">Simboli</p>
              </div>
            </div>
            <div className="bg-moti-navy rounded-xl px-4 py-3 border border-white/[0.07]">
              <p className="text-xs text-slate-500 mb-1">YR API metadata (raw JSON preview):</p>
              <pre className="text-xs text-moti-sky font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">{yrRaw}</pre>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-moti-sky" />
              YR API latency: <strong className="text-moti-sky">{yrMs}ms</strong> (via allorigins CORS proxy)
            </p>
          </div>
        )}
      </div>

      {/* Step 3: Lidhja — si funksionon */}
      {phase === "yr_done" && (
        <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Lidhja Funksionon Plotësisht!
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Zinxhiri i plotë u testua me sukses:
          </p>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="bg-purple-600/20 border border-purple-500/30 text-purple-300 px-3 py-1.5 rounded-xl font-medium">
              Overpass API → {overpassResults.length} vendbanime
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="bg-moti-sky/20 border border-moti-sky/30 text-moti-sky px-3 py-1.5 rounded-xl font-medium">
              lat/lon → YR API
            </span>
            <ChevronRight className="w-4 h-4 text-slate-600" />
            <span className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl font-medium">
              {yrResult?.temp}°C në {selectedNode?.name}
            </span>
          </div>
          <div className="bg-moti-navy rounded-xl p-4 border border-white/[0.07] text-xs text-slate-400 space-y-1.5 mt-2">
            <p className="font-semibold text-white text-sm mb-2">Si do funksionojë me 2000+ vendbanime:</p>
            <p>① <strong className="text-white">BulkOverpassTab</strong> merr çdo vendbanim nga OSM (me lat/lon reale)</p>
            <p>② Vendbanim ruhet në <strong className="text-white">databazën Location</strong> me koordinatat GPS</p>
            <p>③ <strong className="text-white">CityPage</strong> lexon <code className="text-moti-sky bg-moti-sky/10 px-1 rounded">loc.lat, loc.lon</code> nga DB</p>
            <p>④ <strong className="text-white">fetchYrForecast(lat, lon)</strong> → MET Norway kthen moti real</p>
            <p>⑤ Rezultati shfaqet automatikisht — <strong className="text-emerald-400">pa asnjë ndryshim kodi shtesë!</strong></p>
          </div>
        </div>
      )}

      {/* Error state */}
      {phase === "error" && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-5 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Gabim gjatë testit</p>
            <p className="text-slate-400 text-sm mt-1">{errorMsg}</p>
            <button onClick={reset} className="mt-3 text-xs text-moti-sky hover:text-white transition-colors flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Provo sërisht
            </button>
          </div>
        </div>
      )}

      {/* Console log */}
      {log.length > 0 && (
        <div className="bg-[#030d1a] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.07] flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Log i Testit
            </span>
            <button onClick={reset} className="text-xs text-slate-600 hover:text-slate-300 transition-colors flex items-center gap-1">
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className={`text-xs font-mono leading-relaxed ${entry.includes("❌") ? "text-red-400" : entry.includes("✅") ? "text-emerald-400" : entry.startsWith("  →") ? "text-moti-sky ml-4" : "text-slate-400"}`}>
                {entry}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Import Tab ───────────────────────────────────────────────────────────────
// ─── Import Tab ───────────────────────────────────────────────────────────────
function ImportTab({ toast }: { toast: (msg: string, type?: ToastType) => void }) {
  const { create, isPending: isSaving } = useMutation("Location");
  const { data: existingData } = useQuery("Location", { limit: 10000 } as any);

  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(0);
  const [saved, setSaved] = useState(0);
  const [countryFilter, setCountryFilter] = useState<"all" | "Albania" | "Kosovo" | "Maqedonia e Veriut">("all");
  const [onlyPopular, setOnlyPopular] = useState(false);
  const [preview, setPreview] = useState(false);

  const existingIds = useMemo(() => {
    if (!existingData) return new Set<string>();
    return new Set((existingData as Location[]).map((l: Location) => l.name.toLowerCase()));
  }, [existingData]);

  const citiesToImport = useMemo(() => {
    let list = [...ALBANIAN_CITIES];
    if (countryFilter !== "all") list = list.filter(c => c.country === countryFilter);
    if (onlyPopular) list = list.filter(c => (c.population ?? 0) >= 15000);
    return list;
  }, [countryFilter, onlyPopular]);

  const alreadyInDb = useMemo(
    () => citiesToImport.filter(c => existingIds.has(c.name.toLowerCase())).length,
    [citiesToImport, existingIds]
  );
  const toImport = citiesToImport.length - alreadyInDb;

  const popularIdSet = useMemo(() => new Set(POPULAR_CITIES.map(c => c.id)), []);

  const runImport = async () => {
    if (toImport === 0) { toast("Të gjitha lokacionet janë tashmë në databazë", "info"); return; }
    setImporting(true);
    setDone(false);
    setProgress(0);
    setSaved(0);
    setSkipped(0);

    const newCities = citiesToImport.filter(c => !existingIds.has(c.name.toLowerCase()));
    setTotal(newCities.length);

    let savedCount = 0;
    let skippedCount = 0;
    const BATCH = 5;

    for (let i = 0; i < newCities.length; i += BATCH) {
      const batch = newCities.slice(i, i + BATCH);
      await Promise.all(
        batch.map(async (city) => {
          try {
            await create({
              name: city.name,
              nameAl: city.nameAl,
              region: city.region,
              country: city.country,
              lat: city.lat,
              lon: city.lon,
              population: city.population ?? 0,
              isPopular: popularIdSet.has(city.id) || (city.population ?? 0) >= 15000,
            });
            savedCount++;
          } catch {
            skippedCount++;
          }
        })
      );
      setProgress(Math.min(i + BATCH, newCities.length));
      setSaved(savedCount);
      setSkipped(skippedCount);
      // small delay to avoid rate limit
      await new Promise(r => setTimeout(r, 80));
    }

    setImporting(false);
    setDone(true);
    toast(`✅ U ruajtën ${savedCount} lokacione! (${skippedCount} gabime)`, savedCount > 0 ? "success" : "error");
  };

  const percent = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Info banner */}
      <div className="bg-gradient-to-r from-moti-sky/10 to-transparent border border-moti-sky/20 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-moti-sky flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white">Importo Lokacione në Databazë</h3>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              Merr lokacionet nga lista statike <code className="text-moti-sky bg-moti-sky/10 px-1 rounded">albanianCities.ts</code> dhe
              i ruan si <code className="text-moti-sky bg-moti-sky/10 px-1 rounded">Location</code> entity në databazë.
              Pasi të importohen, <strong className="text-white">SearchBar dhe faqja kryesore</strong> do i lexojnë
              direkt nga SDK — gati për 10,000+ lokacione.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 space-y-4">
        <h3 className="font-semibold text-white text-sm">Filtro lokacionet për import</h3>
        <div className="flex flex-wrap gap-2">
          {(["all", "Albania", "Kosovo", "Maqedonia e Veriut"] as const).map(c => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                countryFilter === c
                  ? "bg-moti-sky text-white border-moti-sky"
                  : "bg-moti-navy border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {c === "all" ? "🌍 Të gjitha" : c === "Albania" ? "🇦🇱 Shqipëri" : c === "Kosovo" ? "🇽🇰 Kosovë" : "🇲🇰 Maqedonia"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setOnlyPopular(p => !p)}
            className={`w-10 h-5 rounded-full relative transition-colors flex-shrink-0 ${onlyPopular ? "bg-moti-sky" : "bg-white/10"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${onlyPopular ? "left-5" : "left-0.5"}`} />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Vetëm popullarët (≥15,000 banorë)</p>
            <p className="text-slate-500 text-xs">Kufizo importin vetëm tek qytetet e mëdha me vlerë SEO të lartë</p>
          </div>
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-display text-white">{citiesToImport.length}</p>
          <p className="text-slate-400 text-xs mt-0.5">Totali i zgjedhur</p>
        </div>
        <div className="bg-moti-navy-mid border border-emerald-500/20 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-display text-emerald-400">{toImport}</p>
          <p className="text-slate-400 text-xs mt-0.5">Do importohen</p>
        </div>
        <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold font-display text-slate-500">{alreadyInDb}</p>
          <p className="text-slate-400 text-xs mt-0.5">Tashmë në DB</p>
        </div>
      </div>

      {/* Progress bar */}
      {(importing || done) && (
        <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white font-medium">
              {done ? "✅ Import i përfunduar!" : `Duke importuar… ${progress}/${total}`}
            </span>
            <span className="text-slate-400">{percent}%</span>
          </div>
          <div className="w-full bg-white/[0.07] rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-moti-sky to-emerald-400 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          {done && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> {saved} u ruajtën
              </span>
              {skipped > 0 && (
                <span className="text-red-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> {skipped} gabime
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preview toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={runImport}
          disabled={importing || isSaving || toImport === 0}
          className="flex items-center gap-2 bg-moti-sky hover:bg-moti-sky/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3 transition-all active:scale-95"
        >
          {importing ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Duke importuar...</>
          ) : (
            <><Database className="w-4 h-4" /> Importo {toImport} Lokacione</>
          )}
        </button>
        <button
          onClick={() => setPreview(p => !p)}
          className="flex items-center gap-2 bg-white/[0.07] hover:bg-white/[0.1] border border-white/10 text-slate-300 rounded-xl px-4 py-3 text-sm transition-all"
        >
          <Eye className="w-4 h-4" /> {preview ? "Fshih" : "Preview"} listën
        </button>
      </div>

      {/* Preview table */}
      {preview && (
        <div className="bg-moti-navy-mid border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between">
            <span className="text-sm font-medium text-white">Preview: {citiesToImport.slice(0, 50).length} lokacione (max 50)</span>
            <span className="text-xs text-slate-500">⭐ = isPopular: true</span>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-moti-navy-mid">
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left text-slate-500 px-4 py-2 font-medium">Emri</th>
                  <th className="text-left text-slate-500 px-4 py-2 font-medium">Rajoni</th>
                  <th className="text-left text-slate-500 px-4 py-2 font-medium">Shteti</th>
                  <th className="text-right text-slate-500 px-4 py-2 font-medium">Lat/Lon</th>
                  <th className="text-center text-slate-500 px-4 py-2 font-medium">Popular</th>
                </tr>
              </thead>
              <tbody>
                {citiesToImport.slice(0, 50).map((city, i) => {
                  const inDb = existingIds.has(city.name.toLowerCase());
                  return (
                    <tr key={city.id + i} className={`border-b border-white/[0.04] ${inDb ? "opacity-40" : ""}`}>
                      <td className="px-4 py-2 text-white font-medium">
                        {inDb ? <span className="line-through text-slate-500">{city.name}</span> : city.name}
                      </td>
                      <td className="px-4 py-2 text-slate-400">{city.region}</td>
                      <td className="px-4 py-2"><CountryBadge country={city.country} /></td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">{city.lat.toFixed(3)}, {city.lon.toFixed(3)}</td>
                      <td className="px-4 py-2 text-center">
                        {popularIdSet.has(city.id) || (city.population ?? 0) >= 15000
                          ? <Star className="w-3 h-3 text-moti-amber inline" fill="currentColor" />
                          : <span className="text-slate-700">—</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar Nav ──────────────────────────────────────────────────────────────
type TabId = "overview" | "cities" | "api" | "import" | "apiimport" | "manualadd" | "bulkoverpass" | "testoverpassyr";

const SIDEBAR_ITEMS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: "overview", label: "Pasqyra", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "cities", label: "Vendbanimet", icon: <MapPin className="w-5 h-5" /> },
  { id: "api", label: "API Monitor", icon: <Activity className="w-5 h-5" /> },
  { id: "testoverpassyr", label: "Test Overpass→YR", icon: <Zap className="w-5 h-5" />, badge: "TEST" },
  { id: "import", label: "Importo nga Lista", icon: <Database className="w-5 h-5" />, badge: "SEO" },
  { id: "apiimport", label: "Importo nga API", icon: <Globe className="w-5 h-5" />, badge: "OSM" },
  { id: "bulkoverpass", label: "Bulk Overpass", icon: <Globe className="w-5 h-5" />, badge: "BULK" },
  { id: "manualadd", label: "Shto Manual", icon: <MapPin className="w-5 h-5" /> },
];

function Sidebar({ tab, setTab, logout, mobileOpen, setMobileOpen }: {
  tab: TabId; setTab: (t: TabId) => void; logout: () => void;
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#071529] border-r border-white/[0.07] z-50 flex flex-col
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:flex
      `}>
        {/* Brand header */}
        <div className="px-5 py-5 border-b border-white/[0.07] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-moti-sky/20 border border-moti-sky/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-moti-sky" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Admin Panel</p>
              <p className="text-slate-500 text-xs">moti.com.al</p>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setMobileOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User badge */}
        <div className="px-4 py-3 mx-4 my-3 bg-white/[0.04] rounded-xl border border-white/[0.07] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-moti-sky to-moti-sky/40 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">Administrator</p>
            <p className="text-slate-500 text-xs truncate">moti.com.al</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-2 py-1.5 mt-1">Navigim</p>
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setMobileOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                tab === item.id
                  ? "bg-moti-sky/15 text-white border border-moti-sky/25"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span className={tab === item.id ? "text-moti-sky" : "text-slate-500 group-hover:text-slate-300"}>
                {item.icon}
              </span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                  tab === item.id ? "bg-moti-sky/20 text-moti-sky" : "bg-white/[0.07] text-slate-500"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="border-t border-white/[0.07] my-3" />
          <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-2 py-1.5">Lidhje</p>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-500" />
            Kryefaqja
          </Link>
          <Link
            to="/vendbanimet"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
          >
            <Globe className="w-5 h-5 text-slate-500" />
            Vendbanimet
            <ExternalLink className="w-3.5 h-3.5 ml-auto text-slate-600" />
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/[0.07]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Dil nga paneli
          </button>
        </div>
      </aside>
    </>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("moti-admin-auth") === "1");
  const [tab, setTab] = useState<TabId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toasts, add: addToast, remove } = useToast();

  const logout = () => {
    sessionStorage.removeItem("moti-admin-auth");
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabLabels: Record<TabId, string> = {
    overview: "Pasqyra",
    cities: "Vendbanimet",
    api: "API Monitor",
    import: "Importo nga Lista",
    apiimport: "Importo nga API",
    manualadd: "Shto Manual",
    bulkoverpass: "Bulk Overpass",
    testoverpassyr: "Test Overpass→YR",
  };

  return (
    <div className="min-h-screen bg-moti-navy text-white flex">
      {/* Sidebar */}
      <Sidebar tab={tab} setTab={setTab} logout={logout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main area */}
      <div className="flex-1 min-w-0 flex flex-col lg:ml-0">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-[#071529] border-b border-white/[0.07] sticky top-0 z-30 px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.07] transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-moti-sky" />
            <span className="font-semibold text-sm">{tabLabels[tab]}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop page header */}
        <div className="hidden lg:flex items-center justify-between px-8 pt-8 pb-2">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">{tabLabels[tab]}</h1>
            <p className="text-slate-500 text-sm mt-0.5">Moti.com.al — Panel Administrativ</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Panel aktiv
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-6">
          {tab === "overview" && <OverviewTab toast={addToast} />}
          {tab === "cities" && <CitiesTab toast={addToast} />}
          {tab === "api" && <ApiTab toast={addToast} />}
          {tab === "import" && <ImportTab toast={addToast} />}
          {tab === "apiimport" && <ApiImportTab toast={addToast} />}
          {tab === "manualadd" && <ManualAddTab toast={addToast} />}
          {tab === "bulkoverpass" && <BulkOverpassTab toast={addToast} />}
          {tab === "testoverpassyr" && <OverpassYrTestTab toast={addToast} />}
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} remove={remove} />
    </div>
  );
}
