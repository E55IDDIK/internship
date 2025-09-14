// MetricsSection — responsive 3-up metrics with count-up animation.
// - Articles Processed counts live from the backend (getArticles length)
// - Other metrics are static examples; update as needed
import React, { useEffect, useRef, useState } from "react";
import { getArticles } from "../api/articles";

// Hook: observe when an element enters the viewport
function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);
  return [ref, inView];
}

// Easing function for smoother count-up motion
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Compact number formatter: 12000 -> 12K, keeps decimals when provided
function shortNumber(n, decimals = 0) {
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(decimals) + "B";
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(decimals) + "M";
  if (abs >= 1_000) return (n / 1_000).toFixed(decimals) + "K";
  return n.toFixed(decimals);
}

// CountUp: animates 0 -> to when the value scrolls into view
function CountUp({ to = 0, duration = 1200, decimals = 0, trail = "" }) {
  const [ref, inView] = useInView();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(p);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{shortNumber(val, decimals)}{trail}</span>;
}

// MetricsSection: displays three key project metrics
export default function MetricsSection() {
  const brand = "#00E5FF";
  const [articleCount, setArticleCount] = useState(null);

  // Fetch live articles list once to compute the processed count
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getArticles();
        if (!cancelled) setArticleCount(Array.isArray(data) ? data.length : 0);
      } catch {
        if (!cancelled) setArticleCount(0);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Render list for grid — add/remove items to change metrics
  const items = [
    { label: "Articles Processed", to: articleCount ?? 0, trail: "+", decimals: 0, dynamic: true },
    { label: "Accuracy Rate", to: 99.2, trail: "%", decimals: 1 },
    { label: "Avg Processing Time", to: 2.3, trail: "s", decimals: 1 },
  ];
  return (
    <section className="mt-10 animate-fade-in">
      <div className="rounded-2xl bg-gradient-to-b from-[#0A0F1F] to-[#111827] p-5 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m) => (
            <div key={m.label} className="rounded-xl glass-card border border-sky-500/10 p-5 text-center transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="text-3xl md:text-4xl font-extrabold" style={{ color: brand }}>
                <CountUp key={`${m.label}-${m.to}`} to={m.to} trail={m.trail} decimals={m.decimals} />
              </div>
              <div className="mt-1 text-slate-300 text-sm md:text-base">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
