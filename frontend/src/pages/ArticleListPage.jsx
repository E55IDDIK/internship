import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api/articles";

// Lists all articles as cards linking to the detail page.

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all articles on first render
    getArticles()
      .then(setArticles)
      .catch((e) => setError(e?.response?.data?.detail || e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  // Set page title
  useEffect(() => {
    document.title = "Articles";
  }, []);

  // Basic states: loading, error, and empty
  if (loading) return <p className="muted">Loading articles…</p>;
  if (error) return <p className="error">{error}</p>;

  if (!articles.length) return <p className="muted">No articles yet. Try adding some from the backend.</p>;

  return (
    <div className="container">
      {/* Page header */}
      <header className="header">
        <h1>Articles</h1>
      </header>

      {/* Responsive grid list of article cards */}
      <ul className="list">
        {articles.map((a) => (
          <li key={a.id} className="card">
            {/* Article summary card */}
            <div className="card-title">
              <Link to={`/articles/${a.id}`}>{a.translated_title}</Link>
            </div>
            <div className="card-meta">
              <span><b>Sentiment:</b> {a.sentiment}</span>
              {a.publication_date && (
                <span className="pill">{new Date(a.publication_date).toLocaleString()}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
