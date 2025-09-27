from app.core.database import Base, engine
from app.core.database import SessionLocal
from app.db.seed import seed_flights, seed_users

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    try:
        # Seed the database
        seed_flights(db)
        seed_users(db)
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating database tables...")
    init_db()
    print("Database initialized successfully!")