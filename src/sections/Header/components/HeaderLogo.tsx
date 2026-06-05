import React from "react";

export const HeaderLogo: React.FC = () => (
  <a
    href="/"
    aria-label="Moti.com.al — kthehu në faqen kryesore"
    className="flex items-center gap-2.5 flex-shrink-0 group"
  >
    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-moti-sky to-blue-400 flex items-center justify-center shadow-glow-sky">
      <span className="text-lg leading-none select-none" role="img" aria-hidden="true">🌤️</span>
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-base font-display font-extrabold text-white tracking-tight group-hover:text-moti-sky-light transition-colors">
        MOTI
      </span>
      <span className="text-[9px] font-semibold text-white/40 uppercase tracking-[0.15em]">com.al</span>
    </div>
  </a>
);
