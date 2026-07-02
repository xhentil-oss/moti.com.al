import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherProvider, useWeather } from "./context/WeatherContext";
import { Header } from "./sections/Header";
import { Main } from "./sections/Main";
import { Footer } from "./sections/Footer";
import { MobileNav } from "./components/MobileNav";
import { LocationPrompt } from "./components/LocationPrompt";
import { CityPage } from "./pages/CityPage";

// Ndarje kodi (code-splitting): këto faqe ngarkohen vetëm kur nevojiten,
// që bundle-i fillestar (kryefaqja + faqet e qyteteve) të jetë sa më i vogël.
const CitiesPage = lazy(() => import("./pages/CitiesPage").then((m) => ({ default: m.CitiesPage })));
const DayPage = lazy(() => import("./pages/DayPage").then((m) => ({ default: m.DayPage })));
const RegionPage = lazy(() => import("./pages/RegionPage").then((m) => ({ default: m.RegionPage })));
const InfoPage = lazy(() => import("./pages/InfoPage").then((m) => ({ default: m.InfoPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then((m) => ({ default: m.AdminPage })));

const RouteFallback = () => (
  <div className="flex items-center justify-center py-24 text-white/70 text-sm">Duke ngarkuar…</div>
);

const AppInner: React.FC = () => {
  const { theme } = useWeather();
  return (
    <div className={`min-h-screen font-sans antialiased transition-colors duration-300 ${
      theme === "dark"
        ? "bg-moti-navy text-white"
        : "bg-slate-50 text-slate-900"
    }`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-xl focus:bg-moti-sky focus:text-white focus:font-semibold">
        Kalo tek përmbajtja kryesore
      </a>
      <Header />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/vendbanimet" element={<CitiesPage />} />
          <Route path="/vendbanim/:id" element={<CityPage />} />
          <Route path="/vendbanim/:id/dita/:date" element={<DayPage />} />
          <Route path="/rajoni/:slug" element={<RegionPage />} />
          <Route path="/rreth-nesh" element={<InfoPage page="about" />} />
          <Route path="/kontakt" element={<InfoPage page="contact" />} />
          <Route path="/privatesia" element={<InfoPage page="privacy" />} />
          <Route path="/kushtet" element={<InfoPage page="terms" />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Fallback */}
          <Route path="*" element={<Main />} />
        </Routes>
      </Suspense>
      <Footer />
      <MobileNav />
      <LocationPrompt />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <WeatherProvider>
        <AppInner />
      </WeatherProvider>
    </BrowserRouter>
  );
};
