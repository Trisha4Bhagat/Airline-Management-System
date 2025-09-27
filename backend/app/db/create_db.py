from app.core.database import Base, engine, SessionLocal
from app.models.flight import Flight

def main():
    # Create tables from SQLAlchemy models
    Base.metadata.create_all(bind=engine)

    # Optional: report current flight count
    db = SessionLocal()
    try:
        count = db.query(Flight).count()
        print(f"flights table row count: {count}")
    finally:
        db.close()

    print("Tables created (if not existing).")

if __name__ == '__main__':
    main()
