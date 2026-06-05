import React from "react";
import { Home, Sun, Clock, Calendar, Map } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sot", label: "Sot", icon: Sun },
  { href: "/ore-per-ore", label: "Orë/orë", icon: Clock },
  { href: "/10-dite", label: "10 Ditë", icon: Calendar },
  { href: "/harta", label: "Harta", icon: Map },
];

export const MobileNav: React.FC = () => (
  <nav
    aria-label="Navigimi i poshtëm"
    className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-moti-navy-dark/95 backdrop-blur-xl border-t border-white/[0.09] shadow-nav"
  >
    <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
      {items.map(({ href, label, icon: Icon }) => (
        <a
          key={href}
          href={href}
          className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl text-white/45 hover:text-white transition-colors min-w-[52px]"
          aria-label={label}
        >
          <Icon className="w-5 h-5" />
          <span className="text-[10px] font-semibold leading-none">{label}</span>
        </a>
      ))}
    </div>
  </nav>
);
