function ArticleDetail({ article }) {
  if (!article) {
    return <p>Select an article to view details.</p>;
  }

  const entities = [
    ...(article.entities?.companies || []),
    ...(article.entities?.persons || []),
    ...(article.entities?.areas || []),
  ];

  return (
    <div>
      <h2>{article.translated_title}</h2>
      <p><b>Summary:</b> {article.long_summary}</p>
      <p><b>Sentiment:</b> {article.sentiment}</p>
      <p><b>Entities:</b> {entities.length ? entities.join(", ") : "None"}</p>
    </div>
  );
}

export default ArticleDetail;
