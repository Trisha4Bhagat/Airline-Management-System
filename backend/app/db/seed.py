from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.flight import Flight
from app.models.user import User
from app.core.security import get_password_hash

def seed_flights(db: Session):
    # Check if flights already exist
    existing_flights = db.query(Flight).first()
    if existing_flights:
        print('Flights already seeded, skipping...')
        return

    # Sample cities with realistic airport codes
    cities = [
        {'name': 'New York', 'code': 'JFK'},
        {'name': 'London', 'code': 'LHR'},
        {'name': 'Tokyo', 'code': 'NRT'},
        {'name': 'Paris', 'code': 'CDG'},
        {'name': 'Dubai', 'code': 'DXB'},
        {'name': 'Singapore', 'code': 'SIN'},
        {'name': 'Los Angeles', 'code': 'LAX'},
        {'name': 'Sydney', 'code': 'SYD'},
        {'name': 'Delhi', 'code': 'DEL'},
        {'name': 'Munich', 'code': 'MUC'}
    ]

    # Airlines
    airlines = ['AA', 'BA', 'UA', 'EK', 'SQ', 'AF', 'LH', 'QF', 'JL', 'DL']
    
    # Create sample flights with realistic data
    sample_flights = []
    
    # Generate flights for the next 30 days
    for day in range(30):
        # Base time starting at 6 AM for current day + day offset
        base_time = datetime.now().replace(hour=6, minute=0) + timedelta(days=day)
        
        # Create flights between different city pairs
        for i in range(len(cities)):
            for j in range(len(cities)):
                if i != j:  # Don't create flights from a city to itself
                    # Create 1-3 flights per day between major city pairs
                    if (i < 5 and j < 5) or (day % 3 == 0):  # More flights between major cities
                        # Randomize departure times throughout the day
                        for flight_time in range(0, 18, 6):  # Flights at 6am, 12pm, 6pm
                            departure_time = base_time + timedelta(hours=flight_time)
                            
                            # Flight duration based on distance (roughly)
                            # Longer flights for city pairs that are farther apart
                            duration_hours = 2 + ((i + j) % 10)  # Between 2-11 hours
                            
                            # Generate flight number using airline code and numbers
                            airline = airlines[(i + j) % len(airlines)]
                            flight_num = f'{airline}{100 + ((i * 10) + j)}'
                            
                            # Calculate price based on distance and add some randomization
                            base_price = 200 + (duration_hours * 100)  # Longer flights cost more
                            price_variation = (i + j + day) % 200  # Add some price variation
                            
                            # Create the flight
                            flight = Flight(
                                flight_number=flight_num,
                                departure_city=cities[i]['name'],
                                arrival_city=cities[j]['name'],
                                departure_time=departure_time,
                                arrival_time=departure_time + timedelta(hours=duration_hours),
                                price=base_price + price_variation,
                                available_seats=150 + ((i + j) % 100)  # Between 150-249 seats
                            )
                            sample_flights.append(flight)

    # Add flights to database
    db.add_all(sample_flights)
    db.commit()
    print(f'Flights seeded successfully! Added {len(sample_flights)} flights.')

def seed_users(db: Session):
    # Check if users already exist
    existing_user = db.query(User).first()
    if existing_user:
        print('Users already seeded, skipping...')
        return

    # Create admin user
    admin_user = User(
        email='admin@airline.com',
        username='admin',
        full_name='Admin User',
        hashed_password=get_password_hash('admin123'),
        is_admin=True
    )

    # Create regular user
    regular_user = User(
        email='user@airline.com',
        username='user',
        full_name='Regular User',
        hashed_password=get_password_hash('user123'),
        is_admin=False
    )

    # Add users to database
    db.add(admin_user)
    db.add(regular_user)
    db.commit()
    print('Users seeded successfully!')
