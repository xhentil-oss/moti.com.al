import React from "react";

interface StatTileProps {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export const StatTile: React.FC<StatTileProps> = ({ icon, label, value, sub, color = "text-white" }) => (
  <div className="bg-white/[0.05] border border-white/[0.07] rounded-xl p-3.5 flex flex-col gap-1.5 transition-all hover:bg-white/[0.08]">
    <div className="flex items-center gap-1.5">
      <span className="text-base">{icon}</span>
      <span className="text-xs text-white/70 font-medium uppercase tracking-wide">{label}</span>
    </div>
    <div className={`text-xl font-bold font-display ${color}`}>{value}</div>
    {sub && <div className="text-xs text-white/65">{sub}</div>}
  </div>
);
