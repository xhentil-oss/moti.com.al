import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Info, Mail } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Kryefaqja", icon: Home },
  { href: "/vendbanimet", label: "Vendbanimet", icon: MapPin },
  { href: "/rreth-nesh", label: "Rreth nesh", icon: Info },
  { href: "/kontakt", label: "Kontakt", icon: Mail },
];

interface DesktopNavProps {
  mobile?: boolean;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({ mobile = false }) => {
  const location = useLocation();

  if (mobile) {
    return (
      <nav aria-label="Navigimi kryesor" className="grid grid-cols-3 gap-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = location.pathname === href || (href !== "/" && location.pathname.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all font-medium ${
                active ? "text-white bg-white/[0.12]" : "text-white/70 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Navigimi kryesor" className="flex items-center gap-0.5">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = location.pathname === href || (href !== "/" && location.pathname.startsWith(href));
        return (
          <Link
            key={href}
            to={href}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all font-medium whitespace-nowrap ${
              active ? "text-white bg-white/[0.10]" : "text-white/65 hover:text-white hover:bg-white/[0.08]"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};
