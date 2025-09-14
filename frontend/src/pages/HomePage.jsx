// HomePage — landing page with URL form, hero title, metrics and marquee
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createArticle } from "../api/articles";
import Logo from "../components/Logo";
import FeaturesMarquee from "../components/FeaturesMarquee";
import MetricsSection from "../components/MetricsSection";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [autoRedirect, setAutoRedirect] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const navigate = useNavigate();

  // Handle form submit: create article and navigate or show success
  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!url) return setError("Please paste a URL");
    setLoading(true);
    try {
      const article = await createArticle(url);
      setUrl("");
      if (autoRedirect) {
        navigate(`/articles/${article.id}`);
      } else {
        setCreatedId(article.id);
        setSuccess("Article added successfully!");
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to analyze");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] text-slate-100 flex items-center">
      <div className="mx-auto max-w-4xl px-4 w-full">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight flex items-center justify-center gap-2 md:gap-3">
  {/* Logo replaces the first 'A' visually */}
            <span className="md:hidden inline-flex items-center align-[-0.25em]">
              <Logo height={125} />
            </span>
            <span className="hidden md:inline-flex items-center align-[-0.3em]">
              <Logo height={125} />
            </span>
            <span className="ml-[-35px]" >I-Powered Article Analyzer</span>
          </h1>

          <p className="text-slate-300 mt-3">Paste any article URL. We’ll fetch, summarize, extract entities, and analyze sentiment.</p>
        </div>

        <form onSubmit={onSubmit} className="mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <div className="relative flex-1">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/"
                className="w-full rounded-xl bg-slate-900/60 border border-slate-700/80 px-4 py-3 text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 ring-offset-0 focus:ring-sky-400 transition-shadow focus:shadow-[0_0_0_3px_rgba(59,130,246,0.25)]"
              />
              <div className="pointer-events-none absolute inset-0 rounded-xl blur opacity-25 bg-gradient-to-r from-blue-500 to-cyan-400 -z-10" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-5 py-3 font-semibold text-slate-900 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20 transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-slate-600 border-t-sky-400 rounded-full animate-spin" />
                  Analyzing…
                </span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
          <div className="mt-3 text-slate-300">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoRedirect}
                onChange={(e) => setAutoRedirect(e.target.checked)}
                className="sr-only peer"
              />
              <span className="relative inline-block h-6 w-10 rounded-full bg-slate-700 transition-colors peer-checked:bg-sky-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
              Auto-Redirect
            </label>
          </div>
          {error && <p className="mt-3 text-red-400">{error}</p>}
          {success && !autoRedirect && (
            <div className="mt-4 glass-card border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 p-4 flex items-start gap-3 animate-slide-up">
              <div className="shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-400">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm md:text-base">
                <span className="font-medium text-emerald-100">{success}</span>
                {createdId && (
                  <>
                    <span className="ml-2">You can</span>
                    <Link to={`/articles/${createdId}`} className="ml-1 text-sky-300 link-underline hover:text-sky-200">view it</Link>
                    <span> or </span>
                    <Link to="/articles" className="text-sky-300 link-underline hover:text-sky-200">see all</Link>.
                  </>
                )}
              </div>
            </div>
          )}
        </form>
        <FeaturesMarquee />
        <br />
        <MetricsSection />
      </div>
    </div>
  );
}
