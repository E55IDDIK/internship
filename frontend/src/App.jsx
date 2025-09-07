import { Routes, Route, Navigate } from "react-router-dom";
import ArticleListPage from "./pages/ArticleListPage.jsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ArticleListPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}