from fastapi import APIRouter

from .endpoints import flights

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(flights.router, prefix="/flights", tags=["flights"])