from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from datetime import date
from typing import List, Optional

from ..models.flight import Flight
from ..schemas.flight import FlightCreate, FlightUpdate

class FlightService:
    def __init__(self, db: Session):
        self.db = db

    def get_airlines(self) -> List[str]:
        """Get all unique airline codes from flights"""
        # Extract airline codes from flight_number (first 2 characters)
        result = self.db.query(
            func.distinct(func.substr(Flight.flight_number, 1, 2)).label('airline')
        ).all()
        return [row.airline for row in result if row.airline]

    def get_price_range(self, travelers: int = 1) -> dict:
        """Get min and max prices from all flights (always returns per-person prices)"""
        result = self.db.query(
            func.min(Flight.price).label('min_price'),
            func.max(Flight.price).label('max_price')
        ).first()
        
        # Get actual database range per person
        actual_min = result.min_price or 0
        actual_max = result.max_price or 1000  # Fallback if no flights
        
        # Dynamic extension based on number of travelers for better filtering flexibility
        if travelers <= 2:
            extension_factor = 1.5  # 50% extension
        elif travelers <= 5:
            extension_factor = 2.0  # 100% extension  
        elif travelers <= 8:
            extension_factor = 2.5  # 150% extension
        else:
            extension_factor = 3.0  # 200% extension
        
        # Apply extension to actual max price (no artificial minimum)
        final_max_price = int(actual_max * extension_factor)
        
        return {
            'min_price': int(actual_min),
            'max_price': final_max_price,
            'travelers': travelers  # Include for frontend reference
        }

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
        # Time filtering - implement proper PostgreSQL compatible time filtering
        if dep_time_start and dep_time_end:
            from sqlalchemy import text
            # Use PostgreSQL's EXTRACT function for time comparison
            query = query.filter(
                text("EXTRACT(hour FROM departure_time) * 60 + EXTRACT(minute FROM departure_time) BETWEEN :start_minutes AND :end_minutes")
                .params(
                    start_minutes=int(dep_time_start.split(':')[0]) * 60 + int(dep_time_start.split(':')[1]),
                    end_minutes=int(dep_time_end.split(':')[0]) * 60 + int(dep_time_end.split(':')[1])
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
        return False