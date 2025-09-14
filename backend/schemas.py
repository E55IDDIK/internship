from typing import List, Literal,Optional
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime

# ---------- Input schema ----------
class ArticleCreate(BaseModel):
    url: HttpUrl


# ---------- Common models ----------
class Entities(BaseModel):
    companies: List[str] = []
    persons: List[str] = []
    areas: List[str] = []
    
# ---------- Output schemas for Week 5 ----------

# Used by: GET /articles  (list page)
class ArticleListItemOut(BaseModel):
    id: int
    translated_title: str
    publication_date: Optional[datetime] = None
    sentiment: Literal["Positive", "Neutral", "Negative"] = "Neutral"

# Used by: GET /articles/{id}  (detail page)
class ArticleDetailOut(BaseModel):
    id: int
    original_url: HttpUrl
    translated_title: str
    publication_date: Optional[datetime] = None
    long_summary: str
    sentiment: Literal["Positive", "Neutral", "Negative"]
    entities: Entities

# Used by: POST /articles  (creation response)
class ArticleCreateResponse(BaseModel):
    id: int
    original_url: HttpUrl
    translated_title: str
    publication_date: Optional[datetime] = None
    long_summary: str
    sentiment: Literal["Positive", "Neutral", "Negative"]
    entities: Entities
    embedding: List[float] = Field(default_factory=list)

# ---------- Similarity response ----------
class SimilarArticle(BaseModel):
    id: int
    original_url: HttpUrl
    translated_title: str
    similarity_score: float


class SimilarityResponse(BaseModel):
    target_id: int
    similar_articles: List[SimilarArticle]
