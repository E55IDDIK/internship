from __future__ import annotations
import os
from typing import List, Literal

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langchain_openai import ChatOpenAI
from langchain_community.embeddings import HuggingFaceEmbeddings

# Load environment variables
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

if not API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not found in .env!")

# ---------- Pydantic Models ----------
class Entities(BaseModel):
    companies: List[str] = []
    persons: List[str] = []
    areas: List[str] = []

class ArticleAnalysis(BaseModel):
    translated_title: str = Field(
        ...,
        description="Translate ONLY the original title into English. Keep it short (max 20 words). Must be in English."
    )
    long_summary: str = Field(
        ...,
        description="Provide a 5–8 sentence detailed summary of the full article text. Must be in English."
    )
    sentiment: Literal["Positive", "Neutral", "Negative"]
    entities: Entities

# ---------- LLM Setup (DeepSeek via OpenRouter) ----------
_llm = ChatOpenAI(
    model="deepseek/deepseek-chat-v3-0324:free",
    api_key=API_KEY,
    base_url=BASE_URL,
    temperature=0,
)

# Force structured JSON output in English
_llm_structured = _llm.with_structured_output(ArticleAnalysis)

# ---------- Embeddings Setup ----------
_embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

# ---------- Public Functions ----------
def analyze_text_with_ai(data: dict) -> dict:
    """
    Analyze article text with DeepSeek V3 (OpenRouter).
    Input: {"title": "...", "text": "..."}
    Returns a dict matching ArticleAnalysis schema.
    """
    try:
        prompt = (
            "You are a professional news analysis assistant. "
            "Always respond in ENGLISH ONLY.\n\n"
            f"Original Title:\n{data['title']}\n\n"
            f"Full Article Text:\n{data['text']}\n\n"
            "Return JSON only, following the schema."
        )
        result: ArticleAnalysis = _llm_structured.invoke(prompt)
        return result.model_dump()
    except Exception as e:
        raise RuntimeError(f"AI analysis failed: {e}")

def embed_summary(summary: str) -> list[float]:
    #Generate a vector embedding for the summary.
    
    try:
        return _embeddings.embed_query(summary)
    except Exception as e:
        raise RuntimeError(f"Embedding generation failed: {e}")
