from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json
from typing import List
from database import SessionLocal, engine, Base
from models import Article
from schemas import ArticleCreate, ArticleCreateResponse, ArticleListItemOut, ArticleDetailOut ,SimilarityResponse
from scraping import fetch_and_parse
from ai_processor import analyze_text_with_ai, embed_summary
from similarity import calculate_cosine_similarity

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- Routes ----------
@app.post("/articles", response_model=ArticleCreateResponse)
def create_article(payload: ArticleCreate, db: Session = Depends(get_db)):
    # 1. Scrape article text
    try:
        scraped = fetch_and_parse(str(payload.url))
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Scraping failed: {e}")

    if not scraped.get("text"):
        raise HTTPException(status_code=422, detail="No article text found")

    # 2. Run AI analysis (pass both title + text)
    try:
        ai = analyze_text_with_ai({
            "title": scraped["title"],
            "text": scraped["text"]
        })
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {e}")

    # 3. Generate embeddings
    try:
        vector = embed_summary(ai["long_summary"])
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Embedding failed: {e}")

    # 4. Save to DB
    try:
        article = Article(
            original_url=str(payload.url),
            translated_title=ai["translated_title"],
            long_summary=ai["long_summary"],
            sentiment=ai["sentiment"],
            entities=json.dumps(ai["entities"]),
            embedding=json.dumps(vector),
        )
        db.add(article)
        db.commit()
        db.refresh(article)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB save failed: {e}")

    # 5. Return clean response
    return {
        "id": article.id,
        "original_url": article.original_url,
        "translated_title": article.translated_title,
        "publication_date": article.publication_date,  # add this line
        "long_summary": article.long_summary,
        "sentiment": article.sentiment,
        "entities": json.loads(article.entities),
        "embedding": json.loads(article.embedding),
}


@app.get("/articles", response_model=List[ArticleListItemOut])
def get_articles(db: Session = Depends(get_db)):
    # Return newest first so recently added articles appear on top
    rows = db.query(Article).order_by(Article.publication_date.desc()).all()
    return [
        {
            "id": row.id,
            "translated_title": row.translated_title or "",
            "publication_date": row.publication_date,
            "sentiment": row.sentiment or "Neutral",
        }
        for row in rows
    ]

@app.get("/articles/{id}", response_model=ArticleDetailOut)
def get_article(id: int, db: Session = Depends(get_db)):
    article = db.query(Article).filter(Article.id == id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return {
        "id": article.id,
        "original_url": article.original_url,
        "translated_title": article.translated_title or "",
        "publication_date": article.publication_date,
        "long_summary": article.long_summary or "",
        "sentiment": article.sentiment or "Neutral",
        "entities": json.loads(article.entities) if article.entities else {
            "companies": [], "persons": [], "areas": []
        },
    }



@app.get("/articles/{id}/similar", response_model=SimilarityResponse)
def get_similar_articles(id: int, db: Session = Depends(get_db)):
    target_article = db.query(Article).filter(Article.id == id).first()
    if not target_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    try:
        target_vec = json.loads(target_article.embedding)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to parse article embedding")

    similarities = []
    for article in db.query(Article).filter(Article.id != id).all():
        try:
            vec = json.loads(article.embedding)
            score = calculate_cosine_similarity(target_vec, vec)
            similarities.append({
                "id": article.id,
                "original_url": article.original_url,
                "translated_title": article.translated_title,
                "similarity_score": score
            })
        except Exception:
            continue

    # Sort by score descending, take top 3
    similarities = sorted(similarities, key=lambda x: x["similarity_score"], reverse=True)[:3]

    return {"target_id": target_article.id, "similar_articles": similarities}


