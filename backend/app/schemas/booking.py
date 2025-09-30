from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class BookingBase(BaseModel):
    user_id: int
    flight_id: int
    booking_date: datetime
    seat_number: str

class BookingCreate(BookingBase):
    pass

class BookingCreateMulti(BaseModel):
    user_id: int
    flight_id: int
    booking_reference: str
    seat_numbers: List[str]

class BookingUpdate(BaseModel):
    user_id: Optional[int] = None
    flight_id: Optional[int] = None
    booking_date: Optional[datetime] = None
    seat_number: Optional[str] = None

class Booking(BookingBase):
    id: int

    class Config:
        from_attributes = True

class BookingMulti(BaseModel):
    bookings: List[Booking]