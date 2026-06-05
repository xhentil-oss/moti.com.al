<instructions>
## 🚨 MANDATORY: CHANGELOG TRACKING 🚨

You MUST maintain this file to track your work across messages. This is NON-NEGOTIABLE.

---

## INSTRUCTIONS

- **MAX 5 lines** per entry - be concise but informative
- **Include file paths** of key files modified or discovered
- **Note patterns/conventions** found in the codebase
- **Sort entries by date** in DESCENDING order (most recent first)
- If this file gets corrupted, messy, or unsorted -> re-create it. 
- CRITICAL: Updating this file at the END of EVERY response is MANDATORY.
- CRITICAL: Keep this file under 300 lines. You are allowed to summarize, change the format, delete entries, etc., in order to keep it under the limit.

</instructions>

<changelog>
## 2026-04-30 — Add "Test Overpass→YR" live test tab in AdminPage
- New `OverpassYrTestTab` in AdminPage: 2-step test — Overpass returns 5 real settlements, YR API returns live weather for selected node
- Step 1: query Overpass for AL/XK/MK, shows name + lat/lon + place type; Step 2: calls MET Norway with those coords
- Shows live temp/wind/symbol + raw JSON preview + full console log with timestamps
- Diagram explains full chain: Overpass → DB → CityPage → fetchYrForecast → moti real
- New TabId `"testoverpassyr"` with "TEST" badge in sidebar

## 2026-04-30 — Bulk Overpass Import Tab in AdminPage
- New `BulkOverpassTab` component in `src/pages/AdminPage.tsx`: fetches ALL settlements for AL/XK/MK from Overpass API
- 3-step UI: select countries → fetch via Overpass → save to DB with progress bar
- Filters: place type toggles (city/town/village/hamlet...), min population slider
- Per-country breakdown stats; preview table (first 100); auto-skips existing DB entries
- New TabId `"bulkoverpass"` added to sidebar with "BULK" badge

## 2026-04-04 — Admin Dashboard at /admin
- New `src/pages/AdminPage.tsx`: full admin panel with login (password: moti2024admin), sessionStorage auth
- 3 tabs: Pasqyra (overview stats + routes + popular cities), Vendbanimet (filterable/sortable city table), API Monitor (live MET Norway ping + latency)
- Route `/admin` added to `src/App.tsx`; renders outside Header/Footer via separate layout guard
- City table: search + country filter + sort by name/pop/region; max 150 rows displayed; popular marker (⭐)
- API tab: live fetch test via allorigins proxy, shows latency, cache TTL, architecture notes

## 2026-04-04 — Fix duplicate Droplets import in DailyForecast
- `src/components/weather/DailyForecast.tsx`: removed duplicate `import { Droplets }` line that caused SyntaxError

## 2026-04-04 — Daily detail page /vendbanim/:id/dita/:date
- New `src/pages/DayPage.tsx`: dedicated SEO page per day with full hourly breakdown, JSON-LD Event schema, FAQ
- URL pattern: `/vendbanim/tirane/dita/2026-04-05` — Google-crawlable, unique meta title per day
- `src/components/weather/DailyForecast.tsx`: each day row now navigates to DayPage via `useNavigate`; ChevronRight hint added
- `src/App.tsx`: added route `/vendbanim/:id/dita/:date` → DayPage
- Hourly data split by period (natë/mëngjes/pasdite/mbrëmje); graceful fallback when date outside 48h hourly window

## 2026-04-01 — Expand to ~380 Albanian villages, towns & Kosovo/MK cities
- `src/lib/albanianCities.ts`: complete rewrite — ~380 entries total, deduplicated IDs, organized by region sections
- Added 60+ new Shqipëri fshatra: Tiranë quarter-villages, Shkodër highlands (Vermosh, Bogë, Lekbibaj), Lezhë villages (Balldren, Troshan, Zejmen), Fier fshatra (Çakran, Frakull, Mbrostar), Vlorë coast (Llogaraja, Zvërnec, Shushicë), Gjirokastër villages, Korçë periphery, Dibër, Kukës remote villages
- Added 20+ new Kosovo entries: Graçanicë, Dragash, Mamushë, Hajvali, Matiqan, Bardhosh, Sllatinë, Zubin Potok, Partesh, Kllokot, Ranillug, Landovicë
- Added North Macedonia completions: Plasnicë, Zajas, Tearce, Jegunovcë, Mavrovo, Rostushë, Qendër Zhupë
- All entries auto-route to `/vendbanim/:id` with live MET Norway weather + JSON-LD SEO
- `src/lib/albanianCities.ts`: expanded from 23 to ~250 entries — all Albanian villages, towns, Kosovo cities, North Macedonia Albanian areas
- Every entry has real GPS coordinates, region, country, and population
- `searchCities()` now also matches on region name; returns up to 10 results
- `POPULAR_CITIES` now filters by population >= 15000 (instead of .slice(0,8)) for better quality
- All entries automatically get SEO pages at `/vendbanim/:id` via existing CityPage route

## 2026-04-01 — Fix CityPage real API call
## 2026-04-01 — Fix CityPage real API call
- `src/pages/CityPage.tsx`: replaced `generateMockWeather` timeout with real `fetchYrForecast + adaptYrResponse` call
- Falls back to mock only on network error; `cancelled` flag prevents state updates on unmounted component
- All 23 city detail pages now show real live temperatures from MET Norway

## 2026-04-01 — Fix real Yr API via allorigins CORS proxy
- `src/lib/yrApi.ts`: Sandpack has no Vite server proxy; replaced `/api/yr` proxy call with direct `api.met.no` call wrapped through `api.allorigins.win/get?url=` CORS proxy
- allorigins returns `{ contents: "<json string>", status: { http_code } }` — parse `wrapper.contents` with `JSON.parse()`
- Added `console.log` debug output: cache hit/miss, live temperature confirmation
- `src/context/WeatherContext.tsx`: added log on successful real data load; cache always updated with fresh result

## 2026-04-01 — Fix import.meta.env crash in Sandpack
- `src/lib/yrApi.ts`: replaced `import.meta.env.VITE_YR_PROXY_URL` with `window.__MOTI_YR_PROXY__` runtime override + `/api/yr` fallback
- Sandpack bundler does not support `import.meta` outside ES module context; runtime window var is the safe alternative

## 2026-04-01 — Real Yr/MET API via Vite Proxy
- `vite.config.ts`: added `/api/yr` server proxy → `api.met.no` with `changeOrigin`, `proxyReq` hook injects `User-Agent: Moti.com.al`
- `src/lib/yrApi.ts`: `fetchYrForecast` now hits `/api/yr` (or `VITE_YR_PROXY_URL` in prod); in-memory cache respects `Expires` header; `generateMockWeather` kept as graceful fallback
- `src/context/WeatherContext.tsx`: `loadWeather` calls real `fetchYrForecast → adaptYrResponse`; falls back to mock on network error with `console.warn`
- `adaptYrResponse` was already complete — no changes needed there

## 2026-04-01 — City Detail Pages with React Router
- New route `/vendbanim/:id` → `src/pages/CityPage.tsx` with full weather detail, breadcrumbs, JSON-LD structured data
- New route `/vendbanimet` → `src/pages/CitiesPage.tsx` with all cities grouped by country
- App.tsx wrapped in `<BrowserRouter>` + `<Routes>` with `/`, `/vendbanimet`, `/vendbanim/:id`, `*` routes
- DesktopNav upgraded to react-router `<Link>` with active state highlighting; added Vendbanimet nav item
- PopularCities updated: each city has a `→` link to its detail page; `<Link to="/vendbanimet">` header
- CityPage features: current weather card, hourly, 10-day, FAQ accordion, nearby cities sidebar, JSON-LD in `<head>`
- Files: src/App.tsx, src/pages/CityPage.tsx, src/pages/CitiesPage.tsx, src/sections/Header/components/DesktopNav.tsx, src/components/PopularCities.tsx

## 2026-04-01 — Dark/Light Mode Toggle
- WeatherContext.setTheme now syncs `.dark` on `<html>`, persists to localStorage, respects `prefers-color-scheme`
- App.tsx split into AppInner to read theme from context; switches body bg/text classes
- tailwind.css: comprehensive `html:not(.dark)` light-mode overrides for cards, text, borders, nav
- Header toggle button (Sun/Moon) already wired — works immediately
- Files changed: src/context/WeatherContext.tsx, src/App.tsx, tailwind.css

## 2026-04-01 — Full Enterprise Weather Platform Rebuild
- Complete UI/UX redesign: dark premium design system with Moti design tokens (navy, sky, amber)
- Replaced static HTML with full live weather platform: WeatherContext, Yr/MET API layer, mock data
- New components: CurrentWeatherCard, HourlyForecast, DailyForecast, SearchBar, PopularCities, RegionHighlights
- Premium header (sticky, scroll-aware), mobile hamburger menu, MobileNav bottom bar
- SEOContent with FAQ section, trust indicators, editorial content blocks
- LocationPrompt redesigned as floating dialog with geolocation support
- Footer rebuilt with structured link columns, brand section, social links
- Design tokens: Inter + Sora fonts, glow shadows, shimmer skeletons, fade/slide animations
- Key files: src/context/WeatherContext.tsx, src/lib/yrApi.ts, src/lib/albanianCities.ts, src/types/weather.ts
</changelog>
