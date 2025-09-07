import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticle, getSimilar } from "../api/articles";

// Shows a single article with metadata, summary, entities, and similar articles.

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    // Fetch article details and similar items in parallel
    (async () => {
      try {
        const [a, s] = await Promise.all([getArticle(id), getSimilar(id)]);
        if (!mounted) return;
        setArticle(a);
        setSimilar(s?.similar_articles || []);
      } catch (e) {
        setError(e?.response?.data?.detail || e.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  // Update the document title based on the article
  useEffect(() => {
    if (loading) {
      document.title = "Loading article…";
      return;
    }
    if (error) {
      document.title = "Error | Articles";
      return;
    }
    if (article?.translated_title) {
      document.title = `${article.translated_title} | Articles`;
    } else {
      document.title = "Article | Articles";
    }
  }, [loading, error, article]);

  if (loading) return <p className="muted">Loading article…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!article) return <p className="muted">Article not found.</p>;

  // convert entities to a single list for display
  const entities = [
    ...(article.entities?.companies || []),
    ...(article.entities?.persons || []),
    ...(article.entities?.areas || []),
  ];

  return (
    <div className="container">
      {/* Back link to the listing */}
      <p><Link to="/">← Back to list</Link></p>

      <h1>{article.translated_title}</h1>
      {/* Meta row: date badge, sentiment, and source */}
      <div className="meta">
        {article.publication_date && (
          <span className="pill">{new Date(article.publication_date).toLocaleString()}</span>
        )}
        <span><b>Sentiment:</b> {article.sentiment}</span>
        <a href={article.original_url} target="_blank" rel="noreferrer">Source ↗</a>
      </div>

      <section className="section">
        {/* AI or precomputed summary text */}
        <h2>Summary</h2>
        <p>{article.long_summary}</p>
      </section>

      <section className="section">
        {/* Combined entities extracted from the article */}
        <h2>Entities</h2>
        <p>{entities.length ? entities.join(", ") : "None"}</p>
      </section>

      <section className="section">
        <h2>Similar Articles</h2>
        {!similar.length && <p className="muted">No similar articles (need at least a few in the DataBase).</p>}
        <ul className="list">
          {similar.map((s) => (
            <li key={s.id} className="card">
              <div className="card-title">
                <Link to={`/articles/${s.id}`}>{s.translated_title}</Link>
              </div>
              <div className="card-meta">
                {/* similarity score badge */}
                {typeof s.similarity_score === "number" && (
                  <span className="pill">similarity: {s.similarity_score.toFixed(3)}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
