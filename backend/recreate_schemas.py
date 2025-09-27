import os

schema_files = {
    'token.py': '''from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None

class TokenData(BaseModel):
    username: Optional[str] = None''',
    
    'user.py': '''from pydantic import BaseModel, EmailStr
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int

    class Config:
        from_attributes = True''',
    
    'flight.py': '''from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FlightBase(BaseModel):
    flight_number: str
    departure_city: str
    arrival_city: str
    departure_time: datetime
    arrival_time: datetime
    price: float
    available_seats: int

class FlightCreate(FlightBase):
    pass

class FlightUpdate(BaseModel):
    flight_number: Optional[str] = None
    departure_city: Optional[str] = None
    arrival_city: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    price: Optional[float] = None
    available_seats: Optional[int] = None

class Flight(FlightBase):
    id: int

    class Config:
        from_attributes = True''',
    
    'booking.py': '''from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class BookingBase(BaseModel):
    user_id: int
    flight_id: int
    booking_date: datetime
    seat_number: str

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    user_id: Optional[int] = None
    flight_id: Optional[int] = None
    booking_date: Optional[datetime] = None
    seat_number: Optional[str] = None

class Booking(BookingBase):
    id: int

    class Config:
        from_attributes = True''',
    
    '__init__.py': '''from .flight import Flight, FlightCreate, FlightUpdate
from .booking import Booking, BookingCreate, BookingUpdate
from .user import User, UserCreate, UserUpdate
from .token import Token, TokenData, TokenPayload'''
}

# Create the schemas directory path
schemas_dir = 'app/schemas'

# Ensure the directory exists
if not os.path.exists(schemas_dir):
    os.makedirs(schemas_dir)

# Create each file
for filename, content in schema_files.items():
    file_path = os.path.join(schemas_dir, filename)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Created {file_path}')

print('All schema files created successfully.')