from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

db_url = "sqlite:///./sqlite.db"

engine = create_engine(db_url)  # Create a new SQLAlchemy engine instance
SessionLocal = sessionmaker(bind=engine)  # SessionLocal class for creating database sessions
Base = declarative_base()  # Base class for declarative models
