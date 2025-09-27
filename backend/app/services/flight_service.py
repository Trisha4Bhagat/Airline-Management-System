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
        return False