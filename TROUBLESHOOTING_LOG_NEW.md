# 🚨 Troubleshooting Log - Flight CRUD Implementation

## Session 1: Initial Setup - 2025-09-28

### ❌ Issue 1: PostgreSQL Driver Installation Error
**Error Message**: 
```
ModuleNotFoundError: No module named 'psycopg2'
```
**Root Cause**: Missing PostgreSQL adapter for Python  
**Solution**: Installed binary version instead of source compilation
```bash
pip install psycopg2-binary
```
**Time to Resolve**: 5 minutes  
**Status**: ✅ Resolved

---

### ❌ Issue 2: Database Connection Timeout
**Error Message**: 
```
psycopg2.OperationalError: timeout expired
```
**Root Cause**: PostgreSQL service not running on system  
**Solution**: Started PostgreSQL service and verified connection
```bash
# Windows
net start postgresql-x64-17

# Linux/macOS  
sudo systemctl start postgresql
```
**Verification**: 
```bash
psql -h localhost -U postgres -c "SELECT version();"
```
**Time to Resolve**: 10 minutes  
**Status**: ✅ Resolved

---

### ❌ Issue 3: CORS Errors in Browser Console
**Error Message**: 
```
Access to XMLHttpRequest at 'http://localhost:8000/api/flights' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Root Cause**: FastAPI not configured for cross-origin requests  
**Solution**: Added CORS middleware to FastAPI application
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
**Time to Resolve**: 15 minutes  
**Status**: ✅ Resolved

---

### ❌ Issue 4: React Development Server Startup Error
**Error Message**: 
```
Error: Cannot find module 'react-scripts'
```
**Root Cause**: Dependencies not installed in frontend directory  
**Solution**: Installed npm dependencies
```bash
cd frontend
npm install
```
**Time to Resolve**: 5 minutes  
**Status**: ✅ Resolved

---

## Session 2: Database Setup - 2025-09-29

### ❌ Issue 5: Database Migration Failing
**Error Message**: 
```
sqlalchemy.exc.ProgrammingError: (psycopg2.errors.UndefinedTable) 
relation "flights" does not exist
```
**Root Cause**: Database tables not created before data operations  
**Solution**: Created proper database initialization script
```python
# backend/app/db/init_db.py
from app.core.database import engine
from app.models import Base

def create_tables():
    Base.metadata.create_all(bind=engine)
```
**Command**: `python -m app.db.init_db`  
**Time to Resolve**: 20 minutes  
**Status**: ✅ Resolved

---

### ❌ Issue 6: Flight Search Returning Empty Results
**Error Message**: No error, but API returns `[]` empty array  
**Root Cause**: Database tables exist but no seed data populated  
**Solution**: Created and executed seed data script
```python
# backend/app/db/seed.py
def populate_flights():
    # Add sample flight data
    flights = [...]
    db.add_all(flights)
    db.commit()
```
**Command**: `python -m app.db.seed`  
**Time to Resolve**: 10 minutes  
**Status**: ✅ Resolved

---

## Session 3: Price Logic Issues - 2025-09-30

### ❌ Issue 7: Inconsistent Price Calculations
**Error Message**: Frontend showing different prices than backend  
**Root Cause**: Frontend multiplying already-multiplied backend prices  
**Solution**: Implemented per-person pricing logic
```python
# Backend returns per-person price
flight.pricePerPerson = flight.price

# Frontend multiplies by traveler count
totalPrice = flight.pricePerPerson * numberOfTravelers
```
**Time to Resolve**: 45 minutes  
**Status**: ✅ Resolved

---

### ❌ Issue 8: TypeScript Compilation Error
**Error Message**: 
```
Type 'undefined' is not assignable to type 'number'
Property 'pricePerPerson' is possibly undefined
```
**Root Cause**: Optional property in TypeScript interface  
**Solution**: Added null safety check
```typescript
${(flight.pricePerPerson || flight.basePrice || flight.price / numberOfTravelers).toLocaleString()}
```
**Time to Resolve**: 10 minutes  
**Status**: ✅ Resolved

---

## Session 4: File Corruption Issues - 2025-10-01

### ❌ Issue 9: Backend Service Import Errors
**Error Message**: 
```
ImportError: cannot import name 'get_flights' from 'app.services.flight_service'
```
**Root Cause**: File corruption due to null bytes in Python files  
**Solution**: Recreated corrupted files and restored functionality
```python
# Restored flight_service.py with proper imports
from typing import List, Optional
from sqlalchemy.orm import Session
```
**Time to Resolve**: 30 minutes  
**Status**: ✅ Resolved

---

## Common Issues & Quick Fixes

### 🔧 Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Test connection
psql -h localhost -U airline_user -d airline_db -c "SELECT 1;"
```

### 🔧 Port Already in Use
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <process_id> /F

# Kill process (Linux/macOS)
sudo lsof -t -i:8000 | xargs kill -9
```

### 🔧 Environment Variables Not Loading
```bash
# Verify .env file exists
ls -la backend/.env

# Check environment variable loading
python -c "import os; print(os.getenv('DATABASE_URL'))"
```

### 🔧 Docker Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild containers
docker-compose down
docker-compose up --build

# Check container logs
docker-compose logs backend
docker-compose logs frontend
```

---

## 📊 Issue Resolution Summary

| Session | Issues Found | Total Time | Critical Issues | Status |
|---------|--------------|------------|-----------------|--------|
| Session 1 | 4 | 35 min | CORS, DB Connection | ✅ Resolved |
| Session 2 | 2 | 30 min | Database Setup | ✅ Resolved |
| Session 3 | 2 | 55 min | Price Logic | ✅ Resolved |
| Session 4 | 1 | 30 min | File Corruption | ✅ Resolved |
| **Total** | **9** | **150 min** | **3** | **✅ All Resolved** |

---

## 🎯 Lessons Learned

1. **Always use `psycopg2-binary`** for PostgreSQL connections in development
2. **Verify database service status** before debugging connection issues  
3. **Configure CORS early** in FastAPI development process
4. **Create proper initialization scripts** for database setup
5. **Implement null safety checks** in TypeScript for optional properties
6. **Regular file backups** prevent corruption-related data loss

---

**📝 Note**: This troubleshooting log covers issues encountered during Flight CRUD implementation. Additional issues for booking and payment features will be documented in future sessions.