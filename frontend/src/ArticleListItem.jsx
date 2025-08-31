function ArticleListItem({ article, onSelect }) {
  return (
    <div className="article-item" onClick={() => onSelect(article)}>
      <h3>{article.translated_title}</h3>
      <p><b>Sentiment:</b> {article.sentiment}</p>
    </div>
  );
}

export default ArticleListItem;
