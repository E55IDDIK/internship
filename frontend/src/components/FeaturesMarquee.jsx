// FeaturesMarquee — scrolling row of brand-colored feature pills.
import React from "react";

function Pill({ color, children, icon }) {
  // Keep the original per-item hues, just increase visibility
  const border = {
    sky: "border-sky-400/50",
    emerald: "border-emerald-400/50",
    cyan: "border-cyan-400/50",
    amber: "border-amber-400/50",
  }[color] || "border-slate-600/60";

  const bg = {
    sky: "bg-sky-500/20",
    emerald: "bg-emerald-500/20",
    cyan: "bg-cyan-500/20",
    amber: "bg-amber-500/20",
  }[color] || "bg-slate-800/50";

  const text = {
    sky: "text-sky-200",
    emerald: "text-emerald-200",
    cyan: "text-cyan-200",
    amber: "text-amber-200",
  }[color] || "text-slate-200";

  return (
    <div className={`inline-flex items-center gap-2.5 rounded-full ${bg} ${border} ${text} border px-5 py-2 whitespace-nowrap backdrop-blur-sm ring-1 ring-white/5`}> 
      <span className="inline-flex h-6 w-6 md:h-7 md:w-7 items-center justify-center">{icon}</span>
      <span className="text-base md:text-lg font-semibold tracking-tight">{children}</span>
    </div>
  );
}

export default function FeaturesMarquee() {
  const items = [
    {
      label: "Sentiment Analysis",
      color: "emerald",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <circle cx="12" cy="12" r="9" className="opacity-70" />
          <circle cx="9" cy="10" r=".8" />
          <circle cx="15" cy="10" r=".8" />
          <path d="M8.5 14c1.2 1.4 5.8 1.4 7 0" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Entity Extraction",
      color: "sky",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M4 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" strokeLinecap="round" />
          <circle cx="12" cy="8" r="3" />
        </svg>
      ),
    },
    {
      label: "Smart Summarization",
      color: "cyan",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 9h8M8 12h6M8 15h4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Suggestions",
      color: "amber",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    },
  ];
  // duplicate once → allows seamless scroll
  const loop = [...items, ...items];

  return (
    <section className="mt-12" aria-label="Powerful AI Analysis Features">
      <div className="mb-4 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">Powerful AI Analysis Features</h2>
      </div>
      <div className="relative overflow-hidden mask-left-right">
        <div className="flex gap-6 md:gap-8 py-2 animate-marquee">
          {loop.map((it, i) => (
            <Pill key={`${it.label}-${i}`} color={it.color} icon={it.icon}>
              {it.label}
            </Pill>
          ))}
        </div>
      </div>
    </section>
  );
}
