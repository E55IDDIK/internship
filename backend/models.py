from sqlalchemy import Column, Integer, String, DateTime, Text
from database import Base
import datetime

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    original_url = Column(String)
    translated_title = Column(String)
    publication_date = Column(DateTime, default=datetime.datetime.utcnow)
    long_summary = Column(Text) 
    sentiment = Column(String)
    entities = Column(Text)  # JSON string Text is bigger then string
    embedding = Column(Text)  # JSON string
    