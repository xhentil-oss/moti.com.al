import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapPin, X, Navigation, Loader2 } from "lucide-react";
import { useWeather } from "../context/WeatherContext";

const GEO_ERRORS: Record<number, string> = {
  1: "Leja për vendndodhjen u refuzua. Mund ta aktivizoni nga cilësimet e shfletuesit.",
  2: "Vendndodhja nuk u gjet. Provoni përsëri ose kërkoni qytetin.",
  3: "Kërkimi i vendndodhjes zgjati shumë. Provoni përsëri.",
};

export const LocationPrompt: React.FC = () => {
  const { showLocationPrompt, dismissLocationPrompt, loadByCoords } = useWeather();
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  if (!showLocationPrompt) return null;

  const handleAllow = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Shfletuesi juaj nuk e mbështet vendndodhjen.");
      return;
    }
    setBusy(true);
    setErrorMsg(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await loadByCoords(pos.coords.latitude, pos.coords.longitude);
        setBusy(false);
        // Moti i vendndodhjes shfaqet te kryefaqja.
        if (location.pathname !== "/") navigate("/");
      },
      (err) => {
        setBusy(false);
        setErrorMsg(GEO_ERRORS[err.code] || "Vendndodhja nuk u mor dot.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <div
      role="dialog"
      aria-label="Lejo vendndodhjen"
      // Në mobile qëndron mbi navigimin e poshtëm (~4.5rem + zona e sigurt e iPhone).
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-5 right-4 md:right-5 z-[45] w-[calc(100vw-32px)] md:w-[380px] animate-slide-down"
    >
      <div className="relative rounded-2xl bg-moti-navy-dark/95 backdrop-blur-xl border border-white/[0.12] shadow-premium p-4">
        <button
          onClick={dismissLocationPrompt}
          className="absolute top-3 right-3 p-1 rounded-lg text-white/65 hover:text-white hover:bg-white/[0.08] transition-all"
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
              Lejo vendndodhjen për të parë <strong className="text-white">motin e qytetit tuaj</strong> automatikisht.
            </div>
            {errorMsg && (
              <div role="alert" className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-2.5 py-1.5 mb-3">
                {errorMsg}
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleAllow}
                disabled={busy}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-moti-sky hover:bg-moti-sky-light disabled:opacity-70 text-white text-xs font-semibold transition-all shadow-glow-sky"
              >
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                {busy ? "Duke kërkuar…" : errorMsg ? "Provo përsëri" : "Gjej pranë meje"}
              </button>
              <button
                onClick={dismissLocationPrompt}
                className="px-3.5 py-1.5 rounded-xl text-white/70 hover:text-white text-xs font-medium border border-white/[0.12] hover:bg-white/[0.06] transition-all"
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
