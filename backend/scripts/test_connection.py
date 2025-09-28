import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.core.config import settings
from sqlalchemy import create_engine, text

def test_connection():
    print(f"Testing connection with: {settings.DATABASE_URL}")
    
    try:
        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT current_database(), current_user, version();"))
            row = result.fetchone()
            print(f"✓ Successfully connected to database: {row[0]}")
            print(f"✓ Connected as user: {row[1]}")
            print(f"✓ PostgreSQL version: {row[2]}")
    except Exception as e:
        print(f"❌ Connection failed: {e}")

if __name__ == "__main__":
    test_connection()