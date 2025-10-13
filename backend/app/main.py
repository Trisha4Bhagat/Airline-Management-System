import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router
from app.api.endpoints import booking

app = FastAPI(title="Airline Reservation System")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router, prefix="/api")
app.include_router(booking.router, prefix="/bookings", tags=["bookings"])

@app.get("/")
async def root():
    return {"message": "Welcome to Airline Management System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "airline-backend"}