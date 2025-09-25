from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.flight import Flight

def seed_flights(db: Session):
    # Sample cities
    cities = ["New York", "London", "Tokyo", "Paris", "Dubai", "Singapore"]
    
    # Create sample flights
    sample_flights = []
    base_time = datetime.now().replace(hour=6, minute=0)  # Start at 6 AM today
    
    for i in range(len(cities)):
        for j in range(len(cities)):
            if i != j:  # Don't create flights from a city to itself
                departure_time = base_time + timedelta(hours=i*4)
                flight = Flight(
                    flight_number=f"FL{i}{j}00",
                    departure_city=cities[i],
                    arrival_city=cities[j],
                    departure_time=departure_time,
                    arrival_time=departure_time + timedelta(hours=8),
                    price=500.0 + (i+j)*50,
                    available_seats=180
                )
                sample_flights.append(flight)
    
    # Add flights to database
    db.add_all(sample_flights)
    db.commit()

if __name__ == "__main__":
    from app.core.database import SessionLocal
    db = SessionLocal()
    seed_flights(db)
    print("Database seeded with sample flights!")