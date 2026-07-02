import React from "react";
import { Mail, Facebook, Instagram, Twitter, MapPin, ExternalLink } from "lucide-react";

const FOOTER_LINKS = {
  parashikime: [
    { label: "Sot", href: "/sot" },
    { label: "Orë për orë", href: "/ore-per-ore" },
    { label: "10 Ditë", href: "/10-dite" },
    { label: "Fundjavë", href: "/fundJave" },
    { label: "Harta e motit", href: "/harta" },
  ],
  qytetet: [
    { label: "Tiranë", href: "/vendbanim/tirana" },
    { label: "Durrës", href: "/vendbanim/durres" },
    { label: "Vlorë", href: "/vendbanim/vlore" },
    { label: "Shkodër", href: "/vendbanim/shkoder" },
    { label: "Prishtinë", href: "/vendbanim/pristina" },
  ],
  kompania: [
    { label: "Rreth nesh", href: "/rreth-nesh" },
    { label: "Blog", href: "/blog" },
    { label: "Politika e privatësisë", href: "/privatesia" },
    { label: "Kushtet e përdorimit", href: "/kushtet" },
    { label: "Kontakt", href: "/kontakt" },
  ],
};

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-moti-navy-dark border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-28 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-moti-sky to-blue-400 flex items-center justify-center">
                <span className="text-lg" role="img" aria-label="weather icon">🌤️</span>
              </div>
              <span className="text-base font-display font-extrabold text-white tracking-tight">MOTI.COM.AL</span>
            </div>
            <p className="text-sm text-white/45 leading-relaxed max-w-xs mb-5">
              Platforma kryesore e motit për Shqipëri, Kosovë dhe Maqedoninë e Veriut. Parashikime orë-pas-ore dhe 10-ditore të bazuara mbi Yr/MET API.
            </p>
            <div className="flex items-center gap-1 mb-4">
              <MapPin className="w-3.5 h-3.5 text-white/30" />
              <span className="text-xs text-white/30">Tiranë, Shqipëri</span>
            </div>
            {/* Social */}
            <div className="flex items-center gap-2">
              {[
                { icon: Facebook, href: "https://facebook.com/moticomalsq", label: "Facebook" },
                { icon: Instagram, href: "https://instagram.com/moticomalsq", label: "Instagram" },
                { icon: Twitter, href: "https://twitter.com/moticomalsq", label: "Twitter/X" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/[0.09] flex items-center justify-center text-white/50 hover:text-white transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
              <a
                href="mailto:info@moti.com.al"
                className="flex items-center gap-1.5 ml-2 text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                info@moti.com.al
              </a>
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: "Parashikime", links: FOOTER_LINKS.parashikime },
            { title: "Qytetet kryesore", links: FOOTER_LINKS.qytetet },
            { title: "Kompania", links: FOOTER_LINKS.kompania },
          ].map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25 text-center md:text-left">
            © {year} Moti.com.al · Të gjitha të drejtat e rezervuara
          </p>
          <div className="flex items-center gap-1 text-xs text-white/20">
            Të dhënat meteorologjike nga{" "}
            <a
              href="https://api.met.no"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/35 hover:text-white/60 transition-colors inline-flex items-center gap-0.5"
            >
              Yr/MET Norway
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
