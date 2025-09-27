import os

def recreate_files():
    # Define the files to recreate with their content
    files = {
        'app/services/flight_service.py': '''from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date
from typing import List, Optional

from ..models.flight import Flight
from ..schemas.flight import FlightCreate, FlightUpdate

class FlightService:
    def __init__(self, db: Session):
        self.db = db

    def get_flights(
        self,
        departure_city: Optional[str] = None,
        arrival_city: Optional[str] = None,
        date: Optional[date] = None,
        skip: int = 0,
        limit: int = 10
    ) -> List[Flight]:
        query = self.db.query(Flight)
        
        # Apply filters if provided
        if departure_city:
            query = query.filter(Flight.departure_city == departure_city)
        if arrival_city:
            query = query.filter(Flight.arrival_city == arrival_city)
        if date:
            query = query.filter(
                and_(
                    Flight.departure_time >= date,
                    Flight.departure_time < date.replace(day=date.day + 1)
                )
            )
        
        return query.offset(skip).limit(limit).all()

    def get_flight(self, flight_id: int) -> Optional[Flight]:
        return self.db.query(Flight).filter(Flight.id == flight_id).first()

    def create_flight(self, flight: FlightCreate) -> Flight:
        db_flight = Flight(**flight.dict())
        self.db.add(db_flight)
        self.db.commit()
        self.db.refresh(db_flight)
        return db_flight
        
    def update_flight(self, flight_id: int, flight_data: FlightUpdate) -> Optional[Flight]:
        db_flight = self.get_flight(flight_id)
        if db_flight:
            update_data = flight_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_flight, key, value)
            self.db.commit()
            self.db.refresh(db_flight)
        return db_flight
    
    def delete_flight(self, flight_id: int) -> bool:
        db_flight = self.get_flight(flight_id)
        if db_flight:
            self.db.delete(db_flight)
            self.db.commit()
            return True
        return False''',
        
        'app/services/__init__.py': '# Import services',

        'app/models/flight.py': '''from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, unique=True, index=True)
    departure_city = Column(String, nullable=False)
    arrival_city = Column(String, nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False)
    available_seats = Column(Integer, nullable=False)
    
    # Relationships
    bookings = relationship("Booking", back_populates="flight")''',

        'app/models/booking.py': '''from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    flight_id = Column(Integer, ForeignKey("flights.id"))
    booking_reference = Column(String, unique=True, index=True)
    seat_number = Column(String)
    booking_status = Column(String)  # confirmed, cancelled, pending
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bookings")
    flight = relationship("Flight", back_populates="bookings")''',

        'app/models/__init__.py': '''# Import all models to make them available to SQLAlchemy
from .user import User
from .flight import Flight
from .booking import Booking'''
    }
    
    # Loop through the files and recreate them
    for file_path, content in files.items():
        try:
            print(f"Recreating {file_path}...")
            # Ensure the directory exists
            directory = os.path.dirname(file_path)
            if not os.path.exists(directory):
                os.makedirs(directory)
                
            # Write the content with UTF-8 encoding
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
                
            print(f"Successfully recreated {file_path}")
        except Exception as e:
            print(f"Error recreating {file_path}: {e}")

if __name__ == "__main__":
    recreate_files()
    print("All files recreated successfully!")