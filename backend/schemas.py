from typing import List, Literal
from pydantic import BaseModel, HttpUrl


# ---------- Input schema ----------
class ArticleCreate(BaseModel):
    url: HttpUrl


# ---------- Common models ----------
class Entities(BaseModel):
    companies: List[str] = []
    persons: List[str] = []
    areas: List[str] = []


# ---------- Output schema for /articles and /articles/{id} ----------
class ArticleAnalysisResult(BaseModel):
    original_url: HttpUrl
    translated_title: str
    long_summary: str
    sentiment: Literal["Positive", "Neutral", "Negative"]
    entities: Entities
    embedding: List[float] = []


# ---------- Similarity response ----------
class SimilarArticle(BaseModel):
    id: int
    original_url: HttpUrl
    translated_title: str
    similarity_score: float


class SimilarityResponse(BaseModel):
    target_id: int
    similar_articles: List[SimilarArticle]
