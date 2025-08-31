# 📰 AI-Powered Article Analyzer  

An end-to-end system that scrapes news articles, processes them with AI for summaries, sentiment, and entities, generates embeddings for semantic search, and provides a frontend UI for interaction.  

---

## 📌 Features  

### Backend (FastAPI + SQLite + SQLAlchemy)
- **Article storage** with URL, translated title, summary, sentiment, entities, and embeddings.  
- **Web scraping** with `requests` + `BeautifulSoup4`.  
- **AI analysis** using **DeepSeek via OpenRouter** (structured output for title, summary, sentiment, and entities).  
- **Embeddings** with HuggingFace MiniLM (local) for semantic similarity.  
- **API Endpoints**:
  - `POST /articles` → scrape + analyze + save new article.  
  - `GET /articles` → list all articles.  
  - `GET /articles/{id}` → fetch single article.  
  - `GET /articles/{id}/similar` → return top 3 most similar articles.  

### Frontend (React + Vite)
- **Static UI prototype** (Week 4):  
  - Article list (sidebar).  
  - Detail view (summary, sentiment, entities).  
- Uses **hardcoded data** (`data.js`) for now.  
- Simple **CSS styling** for a clean, card-based layout.  

---

## ⚙️ Tech Stack  

- **Backend:** FastAPI, SQLAlchemy, SQLite, BeautifulSoup4, LangChain, DeepSeek (via OpenRouter), HuggingFace Embeddings, NumPy  
- **Frontend:** React, Vite, CSS  
- **Tools:** uv (dependency management), Postman (API testing)  

---

## 🚀 Getting Started  

### 1. Clone the Repository  
```bash
git clone https://github.com/yourusername/article-analyzer.git
cd article-analyzer
