import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Si funksionon parashikimi i motit në Shqipëri?",
    a: "Moti.com.al përdor të dhëna në kohë reale nga Yr/MET API — njëri nga burimet meteorologjike më të besueshme në Europë. Parashikimet përditësohen çdo orë për mbi 18,000 vendbanime në Shqipëri, Kosovë dhe Maqedoninë e Veriut."
  },
  {
    q: "Sa i saktë është parashikimi 10-ditor?",
    a: "Parashikimet 1-3 ditore kanë saktësi mbi 90%. Ato 7-10 ditore tregojnë tendencën e përgjithshme të motit dhe janë ideale për planifikim. Rekomandojmë kombinimin e tyre me parashikimet orë-pas-ore për vendime kritike."
  },
  {
    q: "A mund të marr njoftime për kushte ekstreme?",
    a: "Po. Platforma shfaq automatikisht banera alertuese për kushte ekstreme si stuhitë, bora e rëndë, ose valët e nxehtësisë. Këto të dhëna vijnë direkt nga sistemi europian i paralajmërimeve meteorologjike."
  },
  {
    q: "Si funksionon vendndodhja automatike?",
    a: "Me lejen tuaj, platforma përdor GPS të pajisjes suaj për të shfaqur motin e vendndodhjes suaj aktuale me precizitetin e plotë gjeografik. Koordinatat ruhen vetëm lokalisht dhe nuk ndahen me palë të treta."
  },
  {
    q: "A ka parashikime për zona rurale dhe alpine?",
    a: "Po. Moti.com.al mbuloh mbi 18,000 vendbanime duke përfshirë fshatrat, zonat alpine dhe bregdetin. Modeli meteorologjik merr parasysh lartësinë mbi nivelin e detit dhe efektet orografike lokale."
  },
];

const CONTENT_SECTIONS = [
  {
    title: "Moti sot në Shqipëri",
    body: "Shqipëria karakterizohet nga klima mesdhetare në bregdet dhe klima kontinentale në brendësi. Gjatë verës, temperaturat mund të arrijnë 35-40°C në Tiranë, Fier dhe Elbasan, ndërkohë që zona alpine si Alpet Shqiptare dhe Mali me Gropa ofrojnë freski natyrale. Dimrit, reshjet e borës janë të shpeshta mbi 500m lartësi, me zona si Korça dhe Peshkopia të njohura për dimra të ashpër.",
  },
  {
    title: "Parashikimi i motit për Tiranën",
    body: "Tirana — si kryeqyteti dhe qyteti më i madh — ka klimë mesdhetare me dimra të butë dhe verë të nxehtë e të thatë. Mesatarja e temperaturës në janar është rreth 7°C, ndërsa gushti sjell mesatare prej 25-28°C. Reshjet janë të përqendruara kryesisht në periudhën tetor-mars."
  },
];

export const SEOContent: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-8 pb-6">
      {/* Content sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CONTENT_SECTIONS.map((s, i) => (
          <article
            key={i}
            className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] p-5 animate-fade-up"
            style={{ animationDelay: `${0.5 + i * 0.1}s` }}
          >
            <h2 className="text-base font-display font-bold text-white mb-2.5">{s.title}</h2>
            <p className="text-sm text-white/55 leading-relaxed">{s.body}</p>
          </article>
        ))}
      </div>

      {/* FAQ */}
      <section aria-label="Pyetje të shpeshta" className="animate-fade-up" style={{ animationDelay: "0.6s" }}>
        <h2 className="text-base font-display font-bold text-white mb-4 flex items-center gap-2">
          <span className="text-lg">❓</span> Pyetje të shpeshta
        </h2>
        <div className="rounded-2xl bg-moti-navy-mid border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.04] transition-colors"
              >
                <h3 className="text-sm font-semibold text-white/85 leading-snug">{item.q}</h3>
                <ChevronDown className={`w-4 h-4 text-white/40 flex-shrink-0 mt-0.5 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-white/55 leading-relaxed animate-slide-down">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Trust signals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: "0.7s" }}>
        {[
          { emoji: "🌍", label: "18,000+ vendbanime", sub: "Shqipëri, Kosovë, MK" },
          { emoji: "⏱️", label: "Të dhëna live", sub: "Përditësohet çdo orë" },
          { emoji: "📡", label: "Yr/MET API", sub: "Burim europian i besueshëm" },
          { emoji: "📱", label: "Mobile-first", sub: "Optimizuar për telefon" },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3.5 text-center">
            <div className="text-2xl mb-1.5">{item.emoji}</div>
            <div className="text-xs font-bold text-white/80">{item.label}</div>
            <div className="text-xs text-white/35 mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
