import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api/articles";

// Renders one article card
function ArticleCard({ article }) {
  return (
    <li key={article.id} className="card">
      <div className="card-title">
        <Link to={`/articles/${article.id}`}>{article.translated_title}</Link>
      </div>
      <div className="card-meta">
        <span><b>Sentiment:</b> {article.sentiment}</span>
        {article.publication_date && (
          <span className="pill">
            {new Date(article.publication_date).toLocaleString()}
          </span>
        )}
      </div>
    </li>
  );
}

// Handles loading / error / empty states
function ArticlesState({ loading, error, articles }) {
  if (loading) return <p className="muted">Loading articles…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!articles.length) return <p className="muted">No articles yet. Try adding some from the backend.</p>;
  return null;
}

export default function ArticleListPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getArticles()
      .then(setArticles)
      .catch((e) => setError(e?.response?.data?.detail || e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    document.title = "Articles";
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Articles</h1>
      </header>

      <ArticlesState loading={loading} error={error} articles={articles} />

      {!!articles.length && (
        <ul className="list">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </ul>
      )}
    </div>
  );
}
