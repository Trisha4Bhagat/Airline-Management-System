import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal
from app.models.flight import Flight
from app.models.user import User
from sqlalchemy.exc import IntegrityError

def add_australian_flights():
    db = SessionLocal()
    
    try:
        print("🇦🇺 Adding Australian domestic flights from today to January...")
        
        # Australian cities
        australian_cities = [
            "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", 
            "Gold Coast", "Canberra", "Darwin", "Hobart", "Cairns",
            "Townsville", "Alice Springs"
        ]
        
        # Australian airlines
        airlines = [
            "Qantas", "Virgin Australia", "Jetstar Airways", "Rex Airlines",
            "Tiger Airways Australia", "Bonza"
        ]
        
        # Flight number prefixes for each airline
        airline_prefixes = {
            "Qantas": ["QF"],
            "Virgin Australia": ["VA"],
            "Jetstar Airways": ["JQ"], 
            "Rex Airlines": ["ZL"],
            "Tiger Airways Australia": ["TT"],
            "Bonza": ["AB"]
        }
        
        # Popular Australian routes
        popular_routes = [
            ("Sydney", "Melbourne"),
            ("Melbourne", "Sydney"),
            ("Sydney", "Brisbane"),
            ("Brisbane", "Sydney"),
            ("Melbourne", "Brisbane"),
            ("Brisbane", "Melbourne"),
            ("Sydney", "Perth"),
            ("Perth", "Sydney"),
            ("Melbourne", "Perth"),
            ("Perth", "Melbourne"),
            ("Sydney", "Adelaide"),
            ("Adelaide", "Sydney"),
            ("Melbourne", "Adelaide"),
            ("Adelaide", "Melbourne"),
            ("Brisbane", "Gold Coast"),
            ("Gold Coast", "Brisbane"),
            ("Sydney", "Canberra"),
            ("Canberra", "Sydney"),
            ("Melbourne", "Hobart"),
            ("Hobart", "Melbourne"),
            ("Brisbane", "Cairns"),
            ("Cairns", "Brisbane"),
            ("Sydney", "Darwin"),
            ("Darwin", "Sydney"),
            ("Perth", "Darwin"),
            ("Darwin", "Perth"),
            ("Adelaide", "Alice Springs"),
            ("Alice Springs", "Adelaide")
        ]
        
        flights_to_add = []
        flight_numbers_used = set()
        
        # Generate flights from today until end of January
        start_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = datetime(2026, 1, 31)  # End of January 2026
        
        current_date = start_date
        
        while current_date <= end_date:
            # Add 15-25 flights per day
            daily_flights = random.randint(15, 25)
            
            for _ in range(daily_flights):
                # Select random route
                departure_city, arrival_city = random.choice(popular_routes)
                
                # Select random airline
                airline = random.choice(airlines)
                
                # Generate unique flight number
                prefix = random.choice(airline_prefixes[airline])
                while True:
                    flight_num = f"{prefix}{random.randint(100, 999)}"
                    if flight_num not in flight_numbers_used:
                        flight_numbers_used.add(flight_num)
                        break
                
                # Random departure time (5 AM to 11 PM)
                departure_hour = random.randint(5, 23)
                departure_minute = random.choice([0, 15, 30, 45])
                
                departure_time = current_date + timedelta(hours=departure_hour, minutes=departure_minute)
                
                # Calculate flight duration based on route
                if departure_city == arrival_city:
                    continue  # Skip same city flights
                
                # Realistic flight durations for Australian routes (in hours)
                flight_durations = {
                    ("Sydney", "Melbourne"): 1.5,
                    ("Melbourne", "Sydney"): 1.5,
                    ("Sydney", "Brisbane"): 1.25,
                    ("Brisbane", "Sydney"): 1.25,
                    ("Melbourne", "Brisbane"): 2.0,
                    ("Brisbane", "Melbourne"): 2.0,
                    ("Sydney", "Perth"): 5.0,
                    ("Perth", "Sydney"): 5.0,
                    ("Melbourne", "Perth"): 3.5,
                    ("Perth", "Melbourne"): 3.5,
                    ("Sydney", "Adelaide"): 2.0,
                    ("Adelaide", "Sydney"): 2.0,
                    ("Melbourne", "Adelaide"): 1.25,
                    ("Adelaide", "Melbourne"): 1.25,
                    ("Brisbane", "Gold Coast"): 0.5,
                    ("Gold Coast", "Brisbane"): 0.5,
                    ("Sydney", "Canberra"): 0.75,
                    ("Canberra", "Sydney"): 0.75,
                    ("Melbourne", "Hobart"): 1.25,
                    ("Hobart", "Melbourne"): 1.25,
                    ("Brisbane", "Cairns"): 2.5,
                    ("Cairns", "Brisbane"): 2.5,
                    ("Sydney", "Darwin"): 4.0,
                    ("Darwin", "Sydney"): 4.0,
                    ("Perth", "Darwin"): 3.0,
                    ("Darwin", "Perth"): 3.0,
                    ("Adelaide", "Alice Springs"): 2.0,
                    ("Alice Springs", "Adelaide"): 2.0
                }
                
                # Get duration or default to 2 hours
                duration = flight_durations.get((departure_city, arrival_city), 2.0)
                arrival_time = departure_time + timedelta(hours=duration)
                
                # Calculate realistic prices (AUD)
                base_prices = {
                    ("Sydney", "Melbourne"): 150,
                    ("Melbourne", "Sydney"): 150,
                    ("Sydney", "Brisbane"): 180,
                    ("Brisbane", "Sydney"): 180,
                    ("Melbourne", "Brisbane"): 200,
                    ("Brisbane", "Melbourne"): 200,
                    ("Sydney", "Perth"): 450,
                    ("Perth", "Sydney"): 450,
                    ("Melbourne", "Perth"): 400,
                    ("Perth", "Melbourne"): 400,
                    ("Sydney", "Adelaide"): 220,
                    ("Adelaide", "Sydney"): 220,
                    ("Melbourne", "Adelaide"): 160,
                    ("Adelaide", "Melbourne"): 160,
                    ("Brisbane", "Gold Coast"): 80,
                    ("Gold Coast", "Brisbane"): 80,
                    ("Sydney", "Canberra"): 120,
                    ("Canberra", "Sydney"): 120,
                    ("Melbourne", "Hobart"): 180,
                    ("Hobart", "Melbourne"): 180,
                    ("Brisbane", "Cairns"): 280,
                    ("Cairns", "Brisbane"): 280,
                    ("Sydney", "Darwin"): 520,
                    ("Darwin", "Sydney"): 520,
                    ("Perth", "Darwin"): 480,
                    ("Darwin", "Perth"): 480,
                    ("Adelaide", "Alice Springs"): 300,
                    ("Alice Springs", "Adelaide"): 300
                }
                
                base_price = base_prices.get((departure_city, arrival_city), 250)
                # Add some price variation (+/- 30%)
                price_variation = random.uniform(0.7, 1.3)
                final_price = round(base_price * price_variation, 2)
                
                # Random available seats (50-300 depending on aircraft type)
                available_seats = random.choice([50, 70, 100, 120, 150, 180, 200, 250, 300])
                
                flight = Flight(
                    flight_number=flight_num,
                    departure_city=departure_city,
                    arrival_city=arrival_city,
                    departure_time=departure_time,
                    arrival_time=arrival_time,
                    price=final_price,
                    available_seats=available_seats
                )
                
                flights_to_add.append(flight)
            
            # Move to next day
            current_date += timedelta(days=1)
        
        # Add all flights to database in batches
        print(f"📊 Generated {len(flights_to_add)} Australian flights")
        print("💾 Adding flights to database...")
        
        batch_size = 100
        for i in range(0, len(flights_to_add), batch_size):
            batch = flights_to_add[i:i + batch_size]
            db.add_all(batch)
            db.commit()
            print(f"✓ Added batch {i//batch_size + 1}/{(len(flights_to_add) + batch_size - 1)//batch_size}")
        
        # Final verification
        total_flights = db.query(Flight).count()
        australian_flights = db.query(Flight).filter(
            Flight.departure_city.in_(australian_cities),
            Flight.arrival_city.in_(australian_cities)
        ).count()
        
        print(f"\n🎉 AUSTRALIAN FLIGHTS ADDED SUCCESSFULLY!")
        print(f"📊 Statistics:")
        print(f"   ✈️  Total flights in database: {total_flights}")
        print(f"   🇦🇺 Australian domestic flights: {australian_flights}")
        print(f"   📅 Date range: {start_date.strftime('%Y-%m-%d')} to {end_date.strftime('%Y-%m-%d')}")
        
        # Show sample flights
        sample_flights = db.query(Flight).filter(
            Flight.departure_city.in_(australian_cities)
        ).limit(5).all()
        
        print(f"\n📋 Sample flights added:")
        for flight in sample_flights:
            print(f"   {flight.flight_number}: {flight.departure_city} → {flight.arrival_city}")
            print(f"      Departure: {flight.departure_time.strftime('%Y-%m-%d %H:%M')}")
            print(f"      Price: ${flight.price} AUD, Seats: {flight.available_seats}")
        
    except Exception as e:
        print(f"❌ Error adding Australian flights: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_australian_flights()