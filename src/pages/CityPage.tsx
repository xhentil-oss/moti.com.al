import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, ChevronRight, AlertCircle, ArrowLeft, Thermometer, Droplets, Wind, Eye, Gauge, Sun } from "lucide-react";
import { getCityById, ALBANIAN_CITIES } from "../lib/albanianCities";
import { fetchYrForecast, adaptYrResponse, generateMockWeather } from "../lib/yrApi";
import { formatTemp, getWindDirection } from "../lib/weatherSymbols";
import { WeatherIcon } from "../components/WeatherIcon";
import { HourlyForecast } from "../components/weather/HourlyForecast";
import { DailyForecast } from "../components/weather/DailyForecast";
import { StatTile } from "../components/weather/StatTile";
import { WeatherCardSkeleton, HourlyCardSkeleton } from "../components/ui/Skeleton";
import { useWeather } from "../context/WeatherContext";
import { WeatherScene } from "../components/WeatherScene";
import { useSeo } from "../lib/seo";
import { longDescription, faqs as cityFaqs, bestTime, climateType } from "../../shared/cityContent.js";
import type { LocationWeather, LocationInfo } from "../types/weather";

// ─── JSON-LD helpers ──────────────────────────────────────────────────────────

function buildJsonLd(city: ReturnType<typeof getCityById>, weather: LocationWeather | null) {
  const base = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Moti në ${city?.nameAl} — Parashikimi i motit`,
    "description": `Parashikimi i detajuar i motit për ${city?.nameAl}, ${city?.region}. Temperatura, reshjet, era dhe shumë të dhëna të tjera.`,
    "url": `https://moti.com.al/vendbanim/${city?.id}`,
    "inLanguage": "sq",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Kryefaqja", "item": "https://moti.com.al/" },
        { "@type": "ListItem", "position": 2, "name": "Vendbanimet", "item": "https://moti.com.al/vendbanimet" },
        { "@type": "ListItem", "position": 3, "name": city?.nameAl, "item": `https://moti.com.al/vendbanim/${city?.id}` },
      ],
    },
  };

  if (!weather) return JSON.stringify(base);

  const weatherOffer = {
    ...base,
    "about": {
      "@type": "Place",
      "name": city?.nameAl,
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": city?.lat,
        "longitude": city?.lon,
      },
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": city?.region,
        "containedInPlace": { "@type": "Country", "name": city?.country },
      },
    },
  };
  return JSON.stringify(weatherOffer);
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

function Breadcrumbs({ cityName }: { cityName: string }) {
  return (
    <nav aria-label="Shtegun navigimi" className="flex items-center gap-1 text-xs text-white/70 mb-5 flex-wrap">
      <Link to="/" className="hover:text-moti-sky transition-colors font-medium">Kryefaqja</Link>
      <ChevronRight className="w-3 h-3 flex-shrink-0" />
      <Link to="/vendbanimet" className="hover:text-moti-sky transition-colors font-medium">Vendbanimet</Link>
      <ChevronRight className="w-3 h-3 flex-shrink-0" />
      <span className="text-white/80 font-semibold">{cityName}</span>
    </nav>
  );
}

// ─── Nearby cities sidebar card ───────────────────────────────────────────────

function NearbyCities({ currentId }: { currentId: string }) {
  const nearby = ALBANIAN_CITIES.filter((c) => c.id !== currentId).slice(0, 8);
  return (
    <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] p-4 shadow-card">
      <h3 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">Qytete të tjera</h3>
      <div className="space-y-1">
        {nearby.map((city) => (
          <Link
            key={city.id}
            to={`/vendbanim/${city.id}`}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/[0.07] transition-all group"
          >
            <MapPin className="w-3.5 h-3.5 text-moti-sky/70 group-hover:text-moti-sky flex-shrink-0" />
            <span className="font-medium">{city.nameAl}</span>
            <span className="ml-auto text-white/65 text-xs">{city.country === "Albania" ? "AL" : city.country === "Kosovo" ? "XK" : "MK"}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── SEO editorial block per city ────────────────────────────────────────────

function CitySEOBlock({ city }: { city: NonNullable<ReturnType<typeof getCityById>> }) {
  const countryLabel = city.country === "Albania" ? "Shqipëri" : city.country === "Kosovo" ? "Kosovë" : "Maqedoni e Veriut";
  const regionInfo: Record<string, string> = {
    tirana: "Tirana është kryeqyteti dhe qyteti më i madh i Shqipërisë, me klimë mesdhetare kontinentale. Verët janë të nxehta dhe të thata, ndërsa dimrat janë të butë dhe me reshje.",
    durres: "Durrësi është porti kryesor i Shqipërisë dhe qyteti i dytë më i madh. Gjendet buzë detit Adriatik, me klimë mesdhetare dhe verë të gjata të nxehta.",
    vlore: "Vlora është qytet bregdetar në jug-perëndim të Shqipërisë, ku Deti Adriatik takohet me Detin Jon. Klima është mesdhetare subtropikale me verë shumë të nxehta.",
    shkoder: "Shkodra është qyteti i katërt më i madh i Shqipërisë dhe qendra historike e veriut. Gjendet pranë Liqenit të Shkodrës dhe lumit Buna, me klimë mesdhetare.",
    sarande: "Saranda është qytet turistik bregdetar me ujëra shumë të pastra. Klima e butë mesdhetare e bën atë destinacion të preferuar gjatë gjithë vitit.",
    gjirokaster: "Gjirokastra është qytet-muze i listuar si Trashëgimi Botërore e UNESCO-s. Gjendet në lartësi malore me klimë kontinentale mesdhetare.",
    pristina: "Prishtina është kryeqyteti i Kosovës, me klimë kontinentale. Verët janë të nxehta dhe dimrat të ftohtë me dëborë të mundshme.",
  };
  const description = regionInfo[city.id] || longDescription(city);

  return (
    <section aria-labelledby="city-seo-title" className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] p-5 md:p-6 shadow-card mt-5">
      <h2 id="city-seo-title" className="text-lg font-display font-bold text-white mb-3">
        Moti në {city.nameAl} — Informacion i detajuar
      </h2>
      <p className="text-white/60 text-sm leading-relaxed mb-4">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-moti-sky font-semibold min-w-[80px]">Rajoni:</span>
          <span className="text-white/70">{city.region}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-moti-sky font-semibold min-w-[80px]">Shteti:</span>
          <span className="text-white/70">{countryLabel}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-moti-sky font-semibold min-w-[80px]">Klima:</span>
          <span className="text-white/70">{climateType(city)}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-moti-sky font-semibold min-w-[80px]">Gjerësia:</span>
          <span className="text-white/70">{city.lat.toFixed(4)}° V</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-moti-sky font-semibold min-w-[80px]">Gjatësia:</span>
          <span className="text-white/70">{city.lon.toFixed(4)}° L</span>
        </div>
        {city.population && (
          <div className="flex items-start gap-2">
            <span className="text-moti-sky font-semibold min-w-[80px]">Popullsia:</span>
            <span className="text-white/70">~{city.population.toLocaleString("sq-AL")} banorë</span>
          </div>
        )}
      </div>

      {/* Kur të vizitosh */}
      <p className="text-white/60 text-sm leading-relaxed mt-4">{bestTime(city)}</p>

      {/* FAQ (unike per qytet nga gjeografia) */}
      <div className="mt-5 space-y-3">
        <h3 className="text-base font-semibold text-white/80">Pyetje të shpeshta</h3>
        {cityFaqs(city).map((f, i) => (
          <details key={i} className="group rounded-xl border border-white/[0.06] p-3 cursor-pointer">
            <summary className="text-sm font-medium text-white/70 group-open:text-white list-none flex items-center justify-between">
              {f.q}
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90 flex-shrink-0 ml-2" />
            </summary>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ─── Main CityPage ─────────────────────────────────────────────────────────────

export const CityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { unit } = useWeather();
  const [weather, setWeather] = useState<LocationWeather | null>(null);
  const [loading, setLoading] = useState(true);

  // Qyteti nga lista statike (i shpejtë) ose, po s'u gjet, nga DB përmes API-t.
  const staticCity = id ? getCityById(id) : undefined;
  const [dbCity, setDbCity] = useState<ReturnType<typeof getCityById>>(undefined);
  const [resolving, setResolving] = useState<boolean>(!staticCity && !!id);
  const city = staticCity || dbCity;

  useEffect(() => {
    if (staticCity || !id) {
      setResolving(false);
      return;
    }
    let cancelled = false;
    setResolving(true);
    setDbCity(undefined);
    const API_BASE = (import.meta as any).env?.VITE_API_BASE || "/api";
    fetch(`${API_BASE}/locations/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((loc) => {
        if (!cancelled) {
          setDbCity(loc || undefined);
          setResolving(false);
        }
      })
      .catch(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, staticCity]);

  // SEO per-faqe (titull, meta, canonical, OG, JSON-LD)
  useSeo(
    city
      ? {
          title: `Moti në ${city.nameAl} — Parashikimi 10-ditor & orar | Moti.com.al`,
          description: `Parashikimi i motit për ${city.nameAl}, ${city.region}: temperatura, reshjet, era, orë-pas-ore dhe 10-ditor. Të dhëna live nga MET/Yr.`,
          canonical: `/vendbanim/${city.id}`,
          type: "article",
          jsonLd: JSON.parse(buildJsonLd(city, weather)),
        }
      : {
          title: "Vendbanimi nuk u gjet | Moti.com.al",
          description: "Vendbanimi që kërkuat nuk ekziston në bazën tonë.",
          noindex: true,
        }
  );

  // Load weather data
  useEffect(() => {
    if (!city) return;
    setLoading(true);
    const locInfo: LocationInfo = {
      name: city.name,
      nameAl: city.nameAl,
      region: city.region,
      country: city.country,
      countryCode: city.country === "Albania" ? "AL" : city.country === "Kosovo" ? "XK" : "MK",
      lat: city.lat,
      lon: city.lon,
      timezone: "Europe/Tirane",
      population: city.population,
    };
    let cancelled = false;
    (async () => {
      try {
        const yrData = await fetchYrForecast(city.lat, city.lon);
        if (!cancelled) setWeather(adaptYrResponse(yrData, locInfo));
      } catch (err) {
        console.warn("[Moti] CityPage: real API failed, using mock:", err);
        if (!cancelled) setWeather(generateMockWeather(locInfo));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [city]);

  if (!city) {
    if (resolving) {
      return (
        <div className="min-h-screen flex items-center justify-center text-white/60 text-sm">
          Duke ngarkuar vendbanimin…
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h1 className="text-2xl font-display font-bold text-white">Qyteti nuk u gjet</h1>
        <p className="text-white/70">Vendbanimi që kërkuat nuk ekziston në bazën tonë të të dhënave.</p>
        <Link to="/" className="mt-2 px-5 py-2.5 rounded-xl bg-moti-sky text-white font-semibold text-sm hover:bg-moti-sky-light transition-colors">
          Kthehu në kryefaqe
        </Link>
      </div>
    );
  }

  return (
    <main id="main-content" aria-label={`Moti në ${city.nameAl}`} className="max-w-7xl mx-auto px-4 md:px-6 pb-28 md:pb-12 pt-6">

      {/* Breadcrumbs */}
      <Breadcrumbs cityName={city.nameAl} />

      {/* Back button (mobile) */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-4 transition-colors md:hidden"
        aria-label="Kthehu mbrapa"
      >
        <ArrowLeft className="w-4 h-4" />
        Kthehu
      </button>

      {/* Page heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-moti-sky text-sm font-medium mb-1">
          <MapPin className="w-4 h-4" />
          <span>{city.region}, {city.country}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
          Moti në {city.nameAl}
        </h1>
        <p className="text-white/70 mt-1 text-sm">
          Parashikimi i detajuar 10-ditor • Orë për orë • Të dhëna të plota meteorologjike
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
        {/* LEFT: main content */}
        <div className="space-y-5 min-w-0">

          {/* Current weather hero */}
          {loading ? (
            <WeatherCardSkeleton />
          ) : weather ? (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-moti-navy-mid via-moti-navy to-moti-navy-dark border border-white/[0.08] shadow-premium animate-fade-up">
              {/* ✨ Weather scene animation layer */}
              <WeatherScene
                symbolCode={weather.current.symbol.code}
                className="absolute inset-0 rounded-3xl overflow-hidden z-0"
              />
              <div className="absolute inset-0 pointer-events-none z-[1]">
                <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-moti-sky/10 blur-3xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-moti-amber/8 blur-2xl" />
              </div>
              <div className="relative p-5 md:p-7 z-[2]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[68px] md:text-[84px] font-display font-bold text-white leading-none tracking-tight">
                      {formatTemp(weather.current.temperature, unit)}
                    </div>
                    <div className="text-white/60 text-base mt-1 font-medium">{weather.current.symbol.label}</div>
                    <div className="text-white/65 text-sm mt-0.5">Ndjehet si {formatTemp(weather.current.feelsLike, unit)}</div>
                  </div>
                  <WeatherIcon emoji={weather.current.symbol.emoji} size="2xl" animated />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <StatTile icon="💧" label="Lagështia" value={`${weather.current.humidity}%`} sub={`Pikë vese ${weather.current.dewPoint}°`} />
                  <StatTile icon="💨" label="Era" value={`${weather.current.windSpeed} km/h`} sub={getWindDirection(weather.current.windDirection)} />
                  <StatTile icon="🌡️" label="Presioni" value={`${weather.current.pressure} hPa`} />
                  <StatTile
                    icon="☀️"
                    label="Indeksi UV"
                    value={`${weather.current.uvIndex}`}
                    sub={weather.current.uvIndex <= 2 ? "I ulët" : weather.current.uvIndex <= 5 ? "Mesatar" : "I lartë"}
                    color={weather.current.uvIndex <= 2 ? "text-emerald-400" : weather.current.uvIndex <= 5 ? "text-yellow-400" : "text-orange-400"}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Hourly */}
          {loading ? <HourlyCardSkeleton /> : weather ? <HourlyForecast hourly={weather.hourly} unit={unit} /> : null}

          {/* Daily */}
          {weather && <DailyForecast daily={weather.daily} unit={unit} cityId={city.id} />}

          {/* SEO editorial content */}
          {city && <CitySEOBlock city={city} />}
        </div>

        {/* RIGHT: sidebar */}
        <aside aria-label="Sidebar vendbanimi" className="space-y-5 min-w-0">
          {/* Quick stats card */}
          {weather && (
            <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] p-4 shadow-card animate-fade-up">
              <h3 className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">Të dhëna tani</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Thermometer className="w-3.5 h-3.5" />, label: "Temperatura", value: formatTemp(weather.current.temperature, unit) },
                  { icon: <Droplets className="w-3.5 h-3.5" />, label: "Lagështia", value: `${weather.current.humidity}%` },
                  { icon: <Wind className="w-3.5 h-3.5" />, label: "Era", value: `${weather.current.windSpeed} km/h` },
                  { icon: <Eye className="w-3.5 h-3.5" />, label: "Dukshmëria", value: `${weather.current.visibility} km` },
                  { icon: <Gauge className="w-3.5 h-3.5" />, label: "Presioni", value: `${weather.current.pressure}` },
                  { icon: <Sun className="w-3.5 h-3.5" />, label: "UV", value: String(weather.current.uvIndex) },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5 px-2.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.05]">
                    <div className="flex items-center gap-1 text-moti-sky">{icon}<span className="text-[10px] text-white/65 uppercase tracking-wide">{label}</span></div>
                    <span className="text-sm font-bold text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby cities */}
          <NearbyCities currentId={city.id} />
        </aside>
      </div>
    </main>
  );
};
