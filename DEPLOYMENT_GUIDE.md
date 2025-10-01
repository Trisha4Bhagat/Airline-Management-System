# 🚀 Deployment Guide - Airline Management System

## 📋 Prerequisites

Before deploying the Airline Management System, ensure you have:

- **Python 3.10+** installed
- **Node.js 18+** and npm installed  
- **PostgreSQL 17+** running
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Git** for version control

---

## 🏠 Local Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
cd Airline-Management-System
```

### Step 2: Backend Setup (FastAPI + PostgreSQL)

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### 2.3 Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2.4 Set Up Environment Variables
Create a `.env` file in the backend directory:
```bash
DATABASE_URL=postgresql://airline_user:postgres123@localhost:5432/airline_db
SECRET_KEY=airline_secret_key_2025_dev_mode_only
DEBUG=True
```

#### 2.5 Set Up PostgreSQL Database
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE airline_db;
CREATE USER airline_user WITH PASSWORD 'postgres123';
GRANT ALL PRIVILEGES ON DATABASE airline_db TO airline_user;
```

#### 2.6 Run Database Migrations
```bash
python -m app.db.init_db
python -m app.db.seed
```

#### 2.7 Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at**: http://localhost:8000
**API Documentation**: http://localhost:8000/docs

---

### Step 3: Frontend Setup (React + TypeScript)

#### 3.1 Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Set Up Environment Variables
Create a `.env` file in the frontend directory:
```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

#### 3.4 Start Frontend Server
```bash
npm run dev
```

**Frontend will be available at**: http://localhost:5173

---

## 🐳 Docker Deployment

### Option 1: Docker Compose (Recommended)

#### 1.1 Start All Services
```bash
docker-compose up --build
```

This will start:
- **PostgreSQL**: Port 5432
- **Backend API**: Port 8000  
- **Frontend**: Port 5173

#### 1.2 Stop Services
```bash
docker-compose down
```

#### 1.3 Reset Database
```bash
docker-compose down -v
docker-compose up --build
```

### Option 2: Individual Docker Containers

#### 2.1 Backend Container
```bash
cd backend
docker build -t airline-backend .
docker run -p 8000:8000 --env-file .env airline-backend
```

#### 2.2 Frontend Container  
```bash
cd frontend
docker build -t airline-frontend .
docker run -p 5173:5173 airline-frontend
```

---

## ☁️ Cloud Deployment

### AWS Deployment

#### Backend (AWS EC2 + RDS)
1. **Create RDS PostgreSQL Instance**
2. **Launch EC2 Instance** (Ubuntu 20.04+)
3. **Install Docker on EC2**:
   ```bash
   sudo apt update
   sudo apt install docker.io docker-compose
   ```
4. **Deploy Backend**:
   ```bash
   git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
   cd Airline-Management-System
   # Update .env with RDS connection string
   docker-compose up -d backend
   ```

#### Frontend (Vercel/Netlify)
1. **Connect GitHub Repository** to Vercel
2. **Set Build Command**: `npm run build`
3. **Set Environment Variables**:
   - `REACT_APP_API_URL=https://your-backend-url.com`

### Railway Deployment

#### Backend
1. **Connect GitHub Repository** to Railway
2. **Add Environment Variables**:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=your-production-secret
   ```
3. **Deploy** - Railway auto-detects FastAPI

#### Frontend  
1. **Connect Repository** to Railway
2. **Set Build Command**: `npm run build`
3. **Set Start Command**: `npm run preview`

---

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Security
SECRET_KEY=your-secret-key-here
DEBUG=False

# CORS (for production)
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=https://your-backend-url.com

# Environment
REACT_APP_ENV=production
```

---

## 🧪 Testing Deployment

### 1. Health Check Backend
```bash
curl http://localhost:8000/
# Expected: {"message":"Welcome to Airline"}
```

### 2. Test API Endpoints
```bash
curl http://localhost:8000/api/flights/
# Expected: JSON array of flights
```

### 3. Test Frontend
Visit: http://localhost:5173
- ✅ Flight search page loads
- ✅ Search functionality works  
- ✅ Flight results display

---

## 🚨 Common Deployment Issues

### Database Connection Errors
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U airline_user -d airline_db
```

### Port Already in Use
```bash
# Kill process on port 8000
sudo lsof -t -i:8000 | xargs kill -9

# Kill process on port 5173  
sudo lsof -t -i:5173 | xargs kill -9
```

### Docker Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### CORS Errors
Update backend `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📊 Production Checklist

### Security
- [ ] Use strong SECRET_KEY
- [ ] Set DEBUG=False
- [ ] Configure HTTPS
- [ ] Set up proper CORS origins
- [ ] Use environment variables for secrets

### Performance  
- [ ] Enable database connection pooling
- [ ] Set up Redis for caching
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression

### Monitoring
- [ ] Set up application logging
- [ ] Configure error tracking (Sentry)
- [ ] Set up health check endpoints
- [ ] Monitor database performance

---

## 🎯 Quick Start Scripts

Use the provided batch files for Windows:

### Backend
```bash
# Windows
start_backend.bat

# macOS/Linux  
chmod +x start_backend.sh
./start_backend.sh
```

### Frontend
```bash
# Windows
start_frontend.bat

# macOS/Linux
chmod +x start_frontend.sh  
./start_frontend.sh
```

---

**📝 Note**: This deployment guide covers the Flight CRUD subset. Additional deployment configurations for booking and payment systems will be added in future iterations.