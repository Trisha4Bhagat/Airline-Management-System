from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from ...core.database import get_db
from ...schemas.flight import Flight, FlightCreate
from ...services.flight_service import FlightService

router = APIRouter()

@router.get("/", response_model=List[Flight])
async def list_flights(
    departure_city: Optional[str] = None,
    arrival_city: Optional[str] = None,
    date: Optional[date] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    List all flights with optional filtering and pagination
    """
    flight_service = FlightService(db)
    return flight_service.get_flights(
        departure_city=departure_city,
        arrival_city=arrival_city,
        date=date,
        skip=skip,
        limit=limit
    )

@router.get("/{flight_id}", response_model=Flight)
async def get_flight(
    flight_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific flight by ID
    """
    flight_service = FlightService(db)
    flight = flight_service.get_flight(flight_id)
    if flight is None:
        raise HTTPException(status_code=404, detail="Flight not found")
    return flight

@router.post("/", response_model=Flight)
async def create_flight(
    flight: FlightCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new flight
    """
    flight_service = FlightService(db)
    return flight_service.create_flight(flight)