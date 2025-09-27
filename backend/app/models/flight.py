from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
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
    bookings = relationship("Booking", back_populates="flight")