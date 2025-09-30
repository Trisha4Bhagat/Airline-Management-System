from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Create SQLAlchemy engine
    engine = create_engine(
        settings.DATABASE_URL,
        # Required for SQLite, should be removed for PostgreSQL
        connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {},
        pool_pre_ping=True,  # Verify connections before use
        pool_recycle=300     # Recycle connections every 5 minutes
    )
    
    # Test the connection
    with engine.connect() as connection:
        logger.info("Database connection successful")
        
except Exception as e:
    logger.error(f"Database connection failed: {e}")
    # Don't crash, let the app start but log the error
    engine = None

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

# Dependency
def get_db():
    if engine is None:
        logger.error("Database engine not available")
        raise Exception("Database connection not available")
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
