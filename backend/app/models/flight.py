from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    flight_number = Column(String, unique=True, index=True)
    departure_city = Column(String, nullable=False, index=True)  # Index for faster city searches
    arrival_city = Column(String, nullable=False, index=True)    # Index for faster city searches
    departure_time = Column(DateTime, nullable=False, index=True)  # Index for faster time queries
    arrival_time = Column(DateTime, nullable=False)
    price = Column(Float, nullable=False, index=True)  # Index for faster price filtering
    available_seats = Column(Integer, nullable=False)
    
    # Relationships - add cascade delete
    bookings = relationship("Booking", back_populates="flight", cascade="all, delete-orphan")