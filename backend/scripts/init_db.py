import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.core.database import engine, Base
from app.core.config import settings

def create_tables():
    print(f"Using database: {settings.DATABASE_URL}")
    print("Creating database tables...")
    
    try:
        # Import all models to register them with Base
        from app.models import user, flight, booking
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✓ Tables created successfully!")
        
        # Verify tables were created
        from app.core.database import SessionLocal
        db = SessionLocal()
        try:
            from app.models.user import User
            from app.models.flight import Flight
            from app.models.booking import Booking
            
            user_count = db.query(User).count()
            flight_count = db.query(Flight).count()
            booking_count = db.query(Booking).count()
            
            print(f"✓ Users table: {user_count} records")
            print(f"✓ Flights table: {flight_count} records") 
            print(f"✓ Bookings table: {booking_count} records")
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_tables()