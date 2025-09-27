from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FlightBase(BaseModel):
    flight_number: str
    departure_city: str
    arrival_city: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    available_seats: int

class FlightCreate(FlightBase):
    pass

class FlightUpdate(BaseModel):
    flight_number: Optional[str] = None
    departure_city: Optional[str] = None
    arrival_city: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    price: Optional[float] = None
    available_seats: Optional[int] = None

class Flight(FlightBase):
    id: int

    class Config:
        from_attributes = True