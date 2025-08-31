import { useState } from "react";
import { articles } from "./data";
import ArticleList from "./ArticleList";
import ArticleDetail from "./ArticleDetail";
import "./App.css";

function App() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="app-container">
      {/* Left: List */}
      <div className="article-list">
        <ArticleList articles={articles} onSelect={setSelectedArticle} />
      </div>

      {/* Right: Detail */}
      <div className="article-detail">
        <ArticleDetail article={selectedArticle} />
      </div>
    </div>
  );
}

export default App;
