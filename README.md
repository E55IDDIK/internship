# 📰 AI-Powered Article Analyzer  

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)  
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)  
[![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)  
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)  
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  

An **end-to-end AI-powered web application** that fetches, analyzes, and visualizes news articles using **FastAPI**, **React**, and **NLP models**.  

---

## 🚀 Features  

- 🔎 **Scraping & Parsing** — Extracts title & body text from a given article URL  
- 🧠 **AI Analysis** — Translated title, long summary, sentiment analysis, entity extraction (companies, people, locations)  
- 📊 **Embeddings & Similarity** — Semantic embeddings & cosine similarity search  
- 🗂 **Article Database** — SQLite + SQLAlchemy ORM  
- 🌐 **Frontend UI** —  
  - List of articles  
  - Detail page with summary & entities  
  - Similar articles recommendations  
- ⚡ **Modern Stack** — FastAPI backend + React (Vite) frontend + SQLite  

---

## 🛠️ Tech Stack  

**Backend** 🖥️  
- ⚡ FastAPI  
- 🗄️ SQLite (Turso-ready)  
- 🧾 SQLAlchemy ORM  
- 🤖 Deepseek v3-0324 + HuggingFace MiniLM  
- 📐 Cosine Similarity  

**Frontend** 🎨  
- ⚛️ React + Vite  
- 🔀 React Router  
- 📡 Axios API client  
- 💅 Custom CSS styling  

---

## 📂 Project Structure  

```
/backend
  ├── main.py              # FastAPI entrypoint & routes
  ├── schemas.py           # Pydantic models
  ├── models.py            # SQLAlchemy models
  ├── scraping.py          # Fetch & parse article text
  ├── ai_processor.py      # AI analysis
  ├── similarity.py        # Cosine similarity
  └── database.py          # DB setup

/frontend
  ├── src/
  │   ├── api/             # Axios API client
  │   ├── pages/           # List + Detail pages
  │   ├── App.jsx          # Router setup
  │   ├── main.jsx         # React entrypoint
  │   └── styles.css       # Global styles
```

---

## ⚙️ Installation  

### 1️⃣ Backend (FastAPI)  

```bash
cd backend
python -m venv venv
source venv/bin/activate   # (Linux/macOS)
venv\Scripts\activate      # (Windows)

pip install -r requirements.txt
uvicorn main:app --reload
```

👉 Runs at: **http://127.0.0.1:8000**  

### 2️⃣ Frontend (React + Vite)  

```bash
cd frontend
npm install
npm run dev
```

👉 Runs at: **http://127.0.0.1:5173**  

---

## 🔗 API Endpoints  

- `POST /articles` → Add new article by URL  
- `GET /articles` → List all articles  
- `GET /articles/{id}` → Get article details  
- `GET /articles/{id}/similar` → Get top-3 similar articles  

---


## 📊 Future Improvements  

- 🌍 Multi-language support  
- 🔎 Advanced search & filters  
- ☁️ Cloud deployment with Docker + Turso + Vercel  

---

## 👨‍💻 Author  

**Essiddik Kharbouch**  
🎓 Licence in Data Science & Cybersecurity  
💻 Passionate about AI, Web Development & Cybersecurity  

---

✨ Built with ❤️ using **FastAPI, React, and AI**  
