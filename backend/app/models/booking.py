from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
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
    flight = relationship("Flight", back_populates="bookings")