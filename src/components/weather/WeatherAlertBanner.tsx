import React, { useState } from "react";
import type { WeatherAlert } from "../../types/weather";
import { AlertTriangle, X } from "lucide-react";

interface WeatherAlertBannerProps {
  alerts: WeatherAlert[];
}

const severityStyles = {
  EXTREME: "bg-red-500/20 border-red-500/40 text-red-200",
  SEVERE: "bg-orange-500/20 border-orange-500/40 text-orange-200",
  MODERATE: "bg-amber-500/20 border-amber-500/40 text-amber-200",
  MINOR: "bg-yellow-500/20 border-yellow-500/40 text-yellow-200",
};

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({ alerts }) => {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = alerts.filter((a) => !dismissed.includes(a.id));

  if (!visible.length) return null;

  return (
    <div className="space-y-2 animate-fade-up">
      {visible.map((alert) => (
        <div
          key={alert.id}
          role="alert"
          className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${severityStyles[alert.severity]}`}
        >
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{alert.title}</div>
            <div className="opacity-80 text-xs mt-0.5">{alert.description}</div>
          </div>
          <button
            onClick={() => setDismissed((p) => [...p, alert.id])}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Mbyll njoftimin"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
