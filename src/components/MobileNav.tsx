import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, List, MapPin, Info } from "lucide-react";

const items = [
  { href: "/", label: "Kreu", icon: Home },
  { href: "/vendbanimet", label: "Qytetet", icon: List },
  { href: "/vendbanim/tirana", label: "Tiranë", icon: MapPin },
  { href: "/vendbanim/pristina", label: "Prishtinë", icon: MapPin },
  { href: "/rreth-nesh", label: "Rreth", icon: Info },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/vendbanimet") return pathname === "/vendbanimet";
  return pathname === href || pathname.startsWith(href + "/");
}

export const MobileNav: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navigimi i poshtëm"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-moti-navy-dark/95 backdrop-blur-xl border-t border-white/[0.09] shadow-nav"
    >
      <div className="flex items-center justify-around px-2 pt-2 safe-area-inset-bottom">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              to={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-colors min-w-[52px] ${
                active ? "text-moti-sky bg-moti-sky/10" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
