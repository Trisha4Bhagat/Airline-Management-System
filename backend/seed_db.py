import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.flight import Flight
from app.models.booking import Booking
from datetime import datetime, timedelta
import bcrypt

def seed_database():
    db = SessionLocal()
    try:
        print("Seeding database with sample data...")
        
        # Check if data already exists
        existing_users = db.query(User).count()
        existing_flights = db.query(Flight).count()
        
        if existing_users > 0 or existing_flights > 0:
            print(f"Database already contains data: {existing_users} users, {existing_flights} flights")
            print("Skipping seed to avoid duplicates...")
            return
        
        # Add sample users
        print("Adding sample users...")
        hashed_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        admin_user = User(
            email="admin@airline.com",
            username="admin",
            hashed_password=hashed_password,
            full_name="System Administrator",
            is_active=True,
            is_admin=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        user_password = bcrypt.hashpw("user123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        regular_user = User(
            email="john.doe@email.com",
            username="johndoe",
            hashed_password=user_password,
            full_name="John Doe",
            is_active=True,
            is_admin=False,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # Add sample flights
        print("Adding sample flights...")
        sample_flights = [
            Flight(
                flight_number="AI101",
                airline="Air India",
                departure_city="Mumbai",
                arrival_city="Delhi",
                departure_time=datetime.now() + timedelta(days=1),
                arrival_time=datetime.now() + timedelta(days=1, hours=2),
                price=5500.00,
                available_seats=150,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Flight(
                flight_number="6E202",
                airline="IndiGo", 
                departure_city="Bangalore",
                arrival_city="Chennai",
                departure_time=datetime.now() + timedelta(days=2),
                arrival_time=datetime.now() + timedelta(days=2, hours=1, minutes=30),
                price=3200.00,
                available_seats=180,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Flight(
                flight_number="UK955",
                airline="Vistara",
                departure_city="Delhi",
                arrival_city="Mumbai",
                departure_time=datetime.now() + timedelta(days=3),
                arrival_time=datetime.now() + timedelta(days=3, hours=2, minutes=15),
                price=4800.00,
                available_seats=120,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Flight(
                flight_number="SG8123",
                airline="SpiceJet",
                departure_city="Pune",
                arrival_city="Hyderabad",
                departure_time=datetime.now() + timedelta(days=4),
                arrival_time=datetime.now() + timedelta(days=4, hours=1, minutes=45),
                price=2900.00,
                available_seats=189,
                created_at=datetime.now(),
                updated_at=datetime.now()
            ),
            Flight(
                flight_number="G8421",
                airline="GoAir",
                departure_city="Kolkata",
                arrival_city="Goa",
                departure_time=datetime.now() + timedelta(days=5),
                arrival_time=datetime.now() + timedelta(days=5, hours=2, minutes=30),
                price=4200.00,
                available_seats=174,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        ]
        
        # Add to database
        db.add(admin_user)
        db.add(regular_user)
        for flight in sample_flights:
            db.add(flight)
        
        # Commit all changes
        db.commit()
        print("✓ Database seeded successfully!")
        
        # Verify the data
        user_count = db.query(User).count()
        flight_count = db.query(Flight).count()
        
        print(f"✓ Added {user_count} users")
        print(f"✓ Added {flight_count} flights")
        
        print("\nSample Login Credentials:")
        print("Admin: admin@airline.com / admin123")
        print("User: john.doe@email.com / user123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()