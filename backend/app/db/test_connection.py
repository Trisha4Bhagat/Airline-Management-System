from app.core.config import settings
from sqlalchemy import create_engine, text

def main():
    engine = create_engine(settings.DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version();"))
        print("Connected to:", result.scalar())

if __name__ == '__main__':
    main()
