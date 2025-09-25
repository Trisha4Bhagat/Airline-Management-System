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

class FlightUpdate(FlightBase):
    pass

class Flight(FlightBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
