import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createArticle } from "../api/articles";

export default function NewArticleForm({ onArticleCreated }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [createdId, setCreatedId] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    setLoading(true);
    try {
      const article = await createArticle(url);
      setSuccess("");
      setUrl("");
      if (onArticleCreated) onArticleCreated(article);
      if (autoRedirect) {
        navigate(`/articles/${article.id}`);
      } else {
        setCreatedId(article.id);
        setSuccess("Article added successfully!");
      }
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || "Failed to add article");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card new-article-form">
      <label className="form-label">
        <b>Submit a new article URL</b>
        <input
          type="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="form-input"
          required
        />
      </label>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Analyzing…" : "Add Article"}
      </button>

      {/* Auto-Redirect Toggle (Tailwind switch) */}
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

      {error && <p className="error">{error}</p>}
      {success && !autoRedirect && (
        <p className="muted">
          {success} {createdId && (
            <>
              <Link to={`/articles/${createdId}`}>View it</Link>
              <span> or </span>
              <Link to="/articles">see all</Link>.
            </>
          )}
        </p>
      )}
    </form>
  );
}
