import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticle, getSimilar } from "../api/articles";

// Loading / error / not found states
function ArticleState({ loading, error, article }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-2/3 rounded bg-slate-700/60 animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-slate-700/60 animate-pulse" />
        <div className="h-24 w-full rounded bg-slate-700/60 animate-pulse" />
      </div>
    );
  }
  if (error) return <p className="text-red-400">{error}</p>;
  if (!article) return <p className="text-slate-400">Article not found.</p>;
  return null;
}

// Metadata row: date, sentiment, source
function SentimentBadge({ value }) {
  const base = "px-2 py-0.5 text-xs rounded-full border";
  const tone = value === "Positive"
    ? "border-emerald-600 text-emerald-300 bg-emerald-900/20"
    : value === "Negative"
    ? "border-red-600 text-red-300 bg-red-900/20"
    : "border-slate-600 text-slate-300 bg-slate-800/50";
  return <span className={`${base} ${tone}`}>{value}</span>;
}

function ArticleMeta({ article }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-300">
      {article.publication_date && (
        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-300 bg-slate-800/50">
          {new Date(article.publication_date).toLocaleString()}
        </span>
      )}
      <SentimentBadge value={article.sentiment} />
      <a className="text-sky-400 underline hover:no-underline" href={article.original_url} target="_blank" rel="noreferrer">Source</a>
    </div>
  );
}

// Summary section
function ArticleSummary({ article }) {
  return (
    <section className="mt-8 glass-card border border-sky-500/15 p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="h-5 w-1 rounded bg-gradient-to-b from-sky-400 to-cyan-400" />
        <h2 className="text-xl md:text-2xl font-semibold">Summary</h2>
      </div>
      <p className="text-slate-200 text-base md:text-lg leading-relaxed md:leading-8">
        {article.long_summary}
      </p>
    </section>
  );
}

// Entities section
function ArticleEntities({ entities }) {
  return (
    <section className="mt-6 glass-card border border-sky-500/15 p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="h-5 w-1 rounded bg-gradient-to-b from-emerald-400 to-teal-400" />
        <h2 className="text-xl md:text-2xl font-semibold">Entities</h2>
      </div>
      {entities.length ? (
        <div className="flex flex-wrap gap-2">
          {entities.map((e, idx) => (
            <span
              key={`${e}-${idx}`}
              className="rounded-full border border-slate-700/70 px-2.5 py-1 text-xs text-slate-200 bg-slate-800/60"
            >
              {e}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-400">None</p>
      )}
    </section>
  );
}

// Similar articles section
function SimilarArticles({ similar }) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="h-5 w-1 rounded bg-gradient-to-b from-violet-400 to-fuchsia-400" />
        <h2 className="text-xl md:text-2xl font-semibold">Similar Articles</h2>
      </div>
      {!similar.length && (
        <p className="text-slate-400">No similar articles (need at least a few in the database).</p>
      )}
      {!!similar.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {similar.map((s) => (
            <Link
              key={s.id}
              to={`/articles/${s.id}`}
              className="group glass-card border border-sky-500/15 p-4 transition hover:-translate-y-0.5"
            >
              <div className="font-medium text-slate-100 group-hover:underline underline-offset-4">
                {s.translated_title}
              </div>
              <div className="mt-2 text-sm text-slate-400">
                {typeof s.similarity_score === "number" && (
                  <span className="rounded-full border border-slate-700/70 px-2 py-0.5 text-xs text-slate-300 bg-slate-800/60">
                    similarity: {s.similarity_score.toFixed(3)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
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

  useEffect(() => {
    if (loading) {
      document.title = "Loading article…";
    } else if (error) {
      document.title = "Error | Articles";
    } else if (article?.translated_title) {
      document.title = `${article.translated_title} | Articles`;
    } else {
      document.title = "Article | Articles";
    }
  }, [loading, error, article]);

  const entities = [
    ...(article?.entities?.companies || []),
    ...(article?.entities?.persons || []),
    ...(article?.entities?.areas || []),
  ];

  return (
    <div className="min-h-[calc(100vh-56px)] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 md:px-8 py-8">
        <p className="mb-4"><Link className="text-sky-400 underline hover:no-underline" to="/articles">← Back</Link></p>

        <ArticleState loading={loading} error={error} article={article} />

        {article && (
          <>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight">{article.translated_title}</h1>
            <ArticleMeta article={article} />
            <ArticleSummary article={article} />
            <ArticleEntities entities={entities} />
            <SimilarArticles similar={similar} />
          </>
        )}
      </div>
    </div>
  );
}
