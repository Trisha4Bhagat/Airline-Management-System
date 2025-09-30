from fastapi import APIRouter
from app.api.endpoints import flights, stats

api_router = APIRouter()
api_router.include_router(flights.router, prefix="/flights", tags=["flights"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])