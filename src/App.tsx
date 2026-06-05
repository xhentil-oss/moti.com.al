import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherProvider, useWeather } from "./context/WeatherContext";
import { Header } from "./sections/Header";
import { Main } from "./sections/Main";
import { Footer } from "./sections/Footer";
import { MobileNav } from "./components/MobileNav";
import { LocationPrompt } from "./components/LocationPrompt";
import { CityPage } from "./pages/CityPage";
import { CitiesPage } from "./pages/CitiesPage";
import { DayPage } from "./pages/DayPage";
import { AdminPage } from "./pages/AdminPage";

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
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/vendbanimet" element={<CitiesPage />} />
        <Route path="/vendbanim/:id" element={<CityPage />} />
        <Route path="/vendbanim/:id/dita/:date" element={<DayPage />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* Fallback */}
        <Route path="*" element={<Main />} />
      </Routes>
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
