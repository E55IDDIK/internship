import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api/articles";

function SentimentBadge({ value }) {
  const base = "px-2 py-0.5 text-xs rounded-full border";
  const tone = value === "Positive"
    ? "border-emerald-600 text-emerald-300 bg-emerald-900/20"
    : value === "Negative"
    ? "border-red-600 text-red-300 bg-red-900/20"
    : "border-slate-600 text-slate-300 bg-slate-800/50";
  return <span className={`${base} ${tone}`}>{value}</span>;
}

function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group block h-full min-h-40 rounded-2xl p-[1px] bg-gradient-to-r from-blue-500/25 via-cyan-400/25 to-blue-500/25 hover:from-blue-500/40 hover:to-cyan-400/40 transition"
    >
      <div className="rounded-2xl glass-card border border-sky-500/10 p-4 h-full flex flex-col">
        <div className="text-slate-100 font-semibold group-hover:underline underline-offset-4 line-clamp-3 flex-1">
          {article.translated_title || "Untitled"}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <SentimentBadge value={article.sentiment} />
          {article.publication_date && (
            <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300 bg-slate-800/50">
              {new Date(article.publication_date).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sentiment, setSentiment] = useState("All");

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .catch((e) => setError(e?.response?.data?.detail || e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = "Articles";
  }, []);

  const visible = articles.filter((a) => {
    const t = (a.translated_title || "").toLowerCase();
    const matchesQuery = !query || t.includes(query.toLowerCase());
    const matchesSentiment = sentiment === "All" || a.sentiment === sentiment;
    return matchesQuery && matchesSentiment;
  });

  return (
    <div className="min-h-[calc(100vh-56px)] text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">Articles</h1>

        {/* Search + Filters */}
        <div className="mt-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 px-4 py-2.5 pr-10 text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 ring-offset-0 focus:ring-sky-400 transition-shadow focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {(["All", "Positive", "Negative", "Neutral"]).map((s) => {
              const active = sentiment === s;
              return (
                <button
                  key={s}
                  onClick={() => setSentiment(s)}
                  className={
                    active
                      ? "rounded-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500/30 via-sky-500/30 to-blue-500/30 border border-cyan-400/60 ring-1 ring-cyan-400/40 shadow-[0_0_20px_rgba(56,189,248,0.25)] backdrop-blur"
                      : "rounded-full px-4 py-2 text-sm font-medium text-slate-200 border border-slate-500/60 bg-slate-900/40 hover:text-white hover:border-cyan-400/60 hover:bg-slate-800/60 transition-colors"
                  }
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="block h-full min-h-40 rounded-2xl p-[1px] bg-gradient-to-r from-blue-500/25 via-cyan-400/25 to-blue-500/25">
                <div className="rounded-2xl border border-sky-500/10 bg-slate-900/75 backdrop-blur p-4 h-full">
                  <div className="h-4 w-3/4 mb-3 rounded bg-slate-700/60 animate-pulse" />
                  <div className="h-3 w-1/2 mb-2 rounded bg-slate-700/60 animate-pulse" />
                  <div className="h-3 w-2/3 rounded bg-slate-700/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && !articles.length && (
          <p className="text-slate-400">No articles yet. Try adding some from the Home page.</p>
        )}

        {!!articles.length && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
            {visible.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
