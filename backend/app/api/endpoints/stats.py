from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.flight import Flight
from app.models.booking import Booking

router = APIRouter()

@router.get("/", summary="Get admin dashboard stats")
def get_stats(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import func
        now = datetime.now()
        
        # Optimized single query to get all stats at once
        stats = db.query(
            func.count(Flight.id).label('total_flights'),
            func.sum(func.case([(Flight.departure_time > now, 1)], else_=0)).label('upcoming_flights')
        ).first()
        
        # Get bookings count separately (fast query)
        total_bookings = db.query(func.count(Booking.id)).scalar() or 0
        
        return {
            "total_flights": int(stats.total_flights or 0),
            "total_bookings": int(total_bookings),
            "upcoming_flights": int(stats.upcoming_flights or 0)
        }
    except Exception as e:
        # Fallback to simple queries if optimized version fails
        total_flights = db.query(Flight).count()
        total_bookings = db.query(Booking).count()
        upcoming_flights = db.query(Flight).filter(Flight.departure_time > now).count()
        return {
            "total_flights": total_flights,
            "total_bookings": total_bookings,
            "upcoming_flights": upcoming_flights
        }