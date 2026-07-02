import React from "react";
import { MapPin, X, Navigation } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

export const LocationPrompt: React.FC = () => {
  const { showLocationPrompt, dismissLocationPrompt, loadByCoords } = useWeather();

  if (!showLocationPrompt) return null;

  const handleAllow = () => {
    if (!navigator.geolocation) {
      dismissLocationPrompt();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => loadByCoords(pos.coords.latitude, pos.coords.longitude),
      () => dismissLocationPrompt(),
      { timeout: 8000 }
    );
  };

  return (
    <div
      role="dialog"
      aria-label="Lejo vendndodhjen"
      className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-50 w-[calc(100vw-32px)] md:w-[380px] animate-slide-down"
    >
      <div className="rounded-2xl bg-moti-navy-dark/95 backdrop-blur-xl border border-white/[0.12] shadow-premium p-4">
        {/* Dismiss */}
        <button
          onClick={dismissLocationPrompt}
          className="absolute top-3 right-3 p-1 rounded-lg text-white/65 hover:text-white hover:bg-white/8 transition-all"
          aria-label="Mbyll"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-4">
          <div className="w-9 h-9 rounded-xl bg-moti-sky/20 border border-moti-sky/30 flex items-center justify-center flex-shrink-0">
            <Navigation className="w-4 h-4 text-moti-sky" />
          </div>
          <div>
            <div className="text-sm font-bold text-white mb-0.5">Vendndodhja juaj</div>
            <div className="text-xs text-white/70 leading-relaxed mb-3">
              Lejo vendndodhjen për të parë <strong className="text-white/70">motin e qytetit tuaj</strong> automatikisht.
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-moti-sky hover:bg-moti-sky-light text-white text-xs font-semibold transition-all shadow-glow-sky"
              >
                <MapPin className="w-3.5 h-3.5" />
                Gjej pranë meje
              </button>
              <button
                onClick={dismissLocationPrompt}
                className="px-3.5 py-1.5 rounded-xl text-white/70 hover:text-white text-xs font-medium border border-white/12 hover:bg-white/6 transition-all"
              >
                Më vonë
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
