import ArticleListItem from "./ArticleListItem";

function ArticleList({ articles, onSelect }) {
  return (
    <div>
      <h2>Articles</h2>
      {articles.map((article) => (
        <ArticleListItem
          key={article.id}
          article={article}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default ArticleList;
