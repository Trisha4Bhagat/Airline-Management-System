from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookingBase(BaseModel):
    flight_id: int
    seat_number: str
    booking_status: str

class BookingCreate(BookingBase):
    user_id: int

class BookingUpdate(BaseModel):
    booking_status: str

class Booking(BookingBase):
    id: int
    user_id: int
    booking_reference: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
