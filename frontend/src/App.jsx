import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArticleListPage from "./pages/ArticleListPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import Navbar from "./components/Navbar";
import AnimatedBackground from "./components/AnimatedBackground";
export default function App() {
  return (
    <div className="min-h-screen text-slate-100 font-sans antialiased pt-14 relative">
      <AnimatedBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles" element={<ArticleListPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
