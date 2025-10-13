# Docker Setup Instructions for Recruiters

## Quick Start

1. **Clone the repository and switch to the fixed branch:**
   ```bash
   git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
   cd Airline-Management-System
   git checkout fix/docker-setup
   ```

2. **Run the application:**
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## What Was Fixed

- ✅ TypeScript compilation errors in DashboardLayout.tsx
- ✅ Import path resolution issues in BookingConfirmation.tsx
- ✅ Missing interface properties fixed
- ✅ Docker build process optimized
- ✅ Service dependencies and health checks added
- ✅ Production-ready configuration

## Services

- **Database:** PostgreSQL on port 5432
- **Backend:** FastAPI on port 8000  
- **Frontend:** React (Vite) on port 3000

## Architecture

```
Frontend (React/TypeScript) → Backend (FastAPI/Python) → Database (PostgreSQL)
     Port 3000                    Port 8000                 Port 5432
```

## Features Demonstrated

### Flight Management (CRUD)
- ✅ Create flights (Admin)
- ✅ Read/List flights (All users)
- ✅ Update flights (Admin)
- ✅ Delete flights (Admin)
- ✅ Search and filter flights

### User Interface
- ✅ Responsive design with Material-UI
- ✅ Admin and user dashboards
- ✅ Flight booking flow
- ✅ Real-time seat availability

### Backend API
- ✅ RESTful endpoints
- ✅ Data validation with Pydantic
- ✅ Database integration with SQLAlchemy
- ✅ Auto-generated API documentation

## Troubleshooting

If you encounter issues:

1. **Clean Docker cache:**
   ```bash
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

2. **Check service logs:**
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

3. **Verify services are running:**
   ```bash
   docker-compose ps
   ```

## Development Notes

- Built with GitHub Copilot assistance
- Follows modern development practices
- Containerized for easy deployment
- TypeScript for type safety
- Material-UI for consistent design

## Contact

For any questions about this project, please contact the developer.