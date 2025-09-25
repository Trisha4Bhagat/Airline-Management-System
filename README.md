# Airline Management System

A modern airline reservation system built with FastAPI and React.

## Project Structure

```
airline-management/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core configurations
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── services/    # Business logic
│   └── requirements.txt
└── frontend/            # React application
    ├── src/
    │   ├── components/  # React components
    │   ├── services/    # API services
    │   └── pages/       # Page components
    └── package.json
```

## Getting Started

### Backend Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate  # Windows
   source .venv/bin/activate # Linux/Mac
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at http://localhost:8000

### Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Features

- Flight search and booking
- User authentication
- Flight management
- Booking management

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc