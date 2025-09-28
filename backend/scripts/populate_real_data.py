import sys
from pathlib import Path

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal
from app.models.user import User
from app.models.flight import Flight
from datetime import datetime, timedelta
import bcrypt
from sqlalchemy.exc import IntegrityError

def add_real_airline_data():
    db = SessionLocal()
    try:
        print("Adding realistic airline data to PostgreSQL database...")
        
        # Add real admin users
        admin_password = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        customer_password = bcrypt.hashpw("customer123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        users = [
            User(
                email="admin@airline.com",
                username="admin",
                hashed_password=admin_password,
                full_name="System Administrator",
                is_active=True,
                is_admin=True
            ),
            User(
                email="john.doe@gmail.com",
                username="johndoe",
                hashed_password=customer_password,
                full_name="John Doe",
                is_active=True,
                is_admin=False
            ),
            User(
                email="jane.smith@yahoo.com",
                username="janesmith",
                hashed_password=customer_password,
                full_name="Jane Smith",
                is_active=True,
                is_admin=False
            ),
        ]
        
        # Add real flight data - Major Indian and International routes
        base_date = datetime.now()
        flights = [
            # Domestic India Routes
            Flight(
                flight_number="AI101",
                airline="Air India",
                departure_city="Mumbai",
                arrival_city="Delhi",
                departure_time=base_date + timedelta(days=1, hours=6),
                arrival_time=base_date + timedelta(days=1, hours=8, minutes=15),
                price=5500.00,
                available_seats=150
            ),
            Flight(
                flight_number="6E202",
                airline="IndiGo",
                departure_city="Bangalore",
                arrival_city="Chennai",
                departure_time=base_date + timedelta(days=1, hours=14),
                arrival_time=base_date + timedelta(days=1, hours=15, minutes=30),
                price=3200.00,
                available_seats=180
            ),
            Flight(
                flight_number="SG301",
                airline="SpiceJet",
                departure_city="Delhi",
                arrival_city="Goa",
                departure_time=base_date + timedelta(days=2, hours=8),
                arrival_time=base_date + timedelta(days=2, hours=10, minutes=45),
                price=4800.00,
                available_seats=189
            ),
            Flight(
                flight_number="UK401",
                airline="Vistara",
                departure_city="Mumbai",
                arrival_city="Bangalore",
                departure_time=base_date + timedelta(days=2, hours=16),
                arrival_time=base_date + timedelta(days=2, hours=17, minutes=30),
                price=4200.00,
                available_seats=158
            ),
            Flight(
                flight_number="G8501",
                airline="GoAir",
                departure_city="Kolkata",
                arrival_city="Mumbai",
                departure_time=base_date + timedelta(days=3, hours=11),
                arrival_time=base_date + timedelta(days=3, hours=13, minutes=20),
                price=3800.00,
                available_seats=144
            ),
            
            # International Routes
            Flight(
                flight_number="AI131",
                airline="Air India",
                departure_city="Delhi",
                arrival_city="London",
                departure_time=base_date + timedelta(days=5, hours=2),
                arrival_time=base_date + timedelta(days=5, hours=7, minutes=30),
                price=45000.00,
                available_seats=300
            ),
            Flight(
                flight_number="EK501",
                airline="Emirates",
                departure_city="Mumbai",
                arrival_city="Dubai",
                departure_time=base_date + timedelta(days=4, hours=3, minutes=30),
                arrival_time=base_date + timedelta(days=4, hours=6, minutes=45),
                price=25000.00,
                available_seeds=350
            ),
            Flight(
                flight_number="SQ601",
                airline="Singapore Airlines",
                departure_city="Bangalore",
                arrival_city="Singapore",
                departure_time=base_date + timedelta(days=6, hours=23, minutes=45),
                arrival_time=base_date + timedelta(days=7, hours=5, minutes=30),
                price=32000.00,
                available_seats=280
            ),
            Flight(
                flight_number="QR701",
                airline="Qatar Airways",
                departure_city="Delhi",
                arrival_city="Doha",
                departure_time=base_date + timedelta(days=7, hours=4, minutes=15),
                arrival_time=base_date + timedelta(days=7, hours=8, minutes=30),
                price=28000.00,
                available_seats=320
            ),
            Flight(
                flight_number="TG801",
                airline="Thai Airways",
                departure_city="Mumbai",
                arrival_city="Bangkok",
                departure_time=base_date + timedelta(days=8, hours=1, minutes=30),
                arrival_time=base_date + timedelta(days=8, hours=6, minutes=45),
                price=22000.00,
                available_seats=300
            ),
            
            # Return flights
            Flight(
                flight_number="AI102",
                airline="Air India",
                departure_city="Delhi",
                arrival_city="Mumbai",
                departure_time=base_date + timedelta(days=1, hours=20),
                arrival_time=base_date + timedelta(days=1, hours=22, minutes=15),
                price=5500.00,
                available_seats=150
            ),
            Flight(
                flight_number="6E203",
                airline="IndiGo",
                departure_city="Chennai",
                arrival_city="Bangalore",
                departure_time=base_date + timedelta(days=2, hours=9),
                arrival_time=base_date + timedelta(days=2, hours=10, minutes=30),
                price=3200.00,
                available_seats=180
            ),
        ]
        
        # Add users to database
        for user in users:
            try:
                db.add(user)
                db.commit()
                print(f"✓ Added user: {user.email}")
            except IntegrityError:
                print(f"⚠ User {user.email} already exists")
                db.rollback()
        
        # Add flights to database
        for flight in flights:
            try:
                db.add(flight)
                db.commit()
                print(f"✓ Added flight: {flight.flight_number} - {flight.departure_city} → {flight.arrival_city}")
            except IntegrityError:
                print(f"⚠ Flight {flight.flight_number} already exists")
                db.rollback()
        
        print("\n" + "="*60)
        print("✅ REAL AIRLINE DATA ADDED SUCCESSFULLY!")
        print("="*60)
        
        # Verify data
        user_count = db.query(User).count()
        flight_count = db.query(Flight).count()
        
        print(f"\n📊 Database Summary:")
        print(f"👥 Total Users: {user_count}")
        print(f"✈️  Total Flights: {flight_count}")
        
        print(f"\n🔐 Login Credentials:")
        print(f"Admin: admin@airline.com / admin123")
        print(f"Customer: john.doe@gmail.com / customer123")
        print(f"Customer: jane.smith@yahoo.com / customer123")
        
    except Exception as e:
        print(f"❌ Error adding data: {e}")
        db.rollback()
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    add_real_airline_data()