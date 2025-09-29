from sqlalchemy.orm import Session
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
        airline: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        dep_time_start: Optional[str] = None,
        dep_time_end: Optional[str] = None,
        skip: int = 0,
        limit: int = 1000
    ) -> List[Flight]:
        # Start with optimized query - order by departure_time for better performance
        query = self.db.query(Flight).order_by(Flight.departure_time)
        # Apply filters if provided
        if departure_city:
            query = query.filter(Flight.departure_city == departure_city)
        if arrival_city:
            query = query.filter(Flight.arrival_city == arrival_city)
        if date:
            from sqlalchemy import func
            from datetime import datetime, timedelta
            # Convert date to datetime for proper comparison
            start_of_day = datetime.combine(date, datetime.min.time())
            end_of_day = start_of_day + timedelta(days=1)
            query = query.filter(
                and_(
                    Flight.departure_time >= start_of_day,
                    Flight.departure_time < end_of_day
                )
            )
        if airline:
            # Extract airline code from flight_number (e.g., 'QF' from 'QF286')
            query = query.filter(Flight.flight_number.like(f"{airline}%"))
        if min_price is not None:
            query = query.filter(Flight.price >= min_price)
        if max_price is not None:
            query = query.filter(Flight.price <= max_price)
        if dep_time_start and dep_time_end:
            # Filter by departure time range (HH:MM)
            from sqlalchemy import func
            query = query.filter(
                func.strftime('%H:%M', Flight.departure_time) >= dep_time_start,
                func.strftime('%H:%M', Flight.departure_time) <= dep_time_end
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
        return False