from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.booking import BookingCreateMulti, BookingMulti, Booking
from app.models.flight import Flight
from app.models.booking import Booking as BookingModel
from sqlalchemy.exc import IntegrityError
from typing import List

router = APIRouter()

@router.get("/flight/{flight_id}/seats", response_model=List[str])
def get_booked_seats(
    flight_id: int,
    db: Session = Depends(get_db)
):
    """Get all booked seat numbers for a specific flight"""
    # Check flight exists
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    
    # Get all confirmed bookings for this flight
    booked_seats = db.query(BookingModel.seat_number).filter(
        BookingModel.flight_id == flight_id,
        BookingModel.booking_status == "confirmed"
    ).all()
    
    return [seat[0] for seat in booked_seats]

@router.post("/", response_model=List[Booking], status_code=status.HTTP_201_CREATED)
def create_booking_multi(
    booking: BookingCreateMulti,
    db: Session = Depends(get_db)
):
    # Check flight exists
    flight = db.query(Flight).filter(Flight.id == booking.flight_id).first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
    if len(booking.seat_numbers) > flight.available_seats:
        raise HTTPException(status_code=400, detail="Not enough available seats")

    # Check for seat conflicts
    existing_seats = set(
        b.seat_number for b in db.query(BookingModel).filter(
            BookingModel.flight_id == booking.flight_id,
            BookingModel.seat_number.in_(booking.seat_numbers),
            BookingModel.booking_status == "confirmed"
        ).all()
    )
    conflict_seats = set(booking.seat_numbers) & existing_seats
    if conflict_seats:
        raise HTTPException(status_code=409, detail=f"Seats already booked: {', '.join(conflict_seats)}")

    # Create bookings for each seat
    bookings = []
    for seat in booking.seat_numbers:
        new_booking = BookingModel(
            user_id=booking.user_id,
            flight_id=booking.flight_id,
            booking_reference=booking.booking_reference,
            seat_number=seat,
            booking_status="confirmed"
        )
        db.add(new_booking)
        bookings.append(new_booking)
    flight.available_seats -= len(booking.seat_numbers)
    db.commit()
    for b in bookings:
        db.refresh(b)
    return bookings
