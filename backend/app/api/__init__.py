from fastapi import APIRouter

from .endpoints import flights, auth, users

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(flights.router, prefix="/flights", tags=["flights"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])