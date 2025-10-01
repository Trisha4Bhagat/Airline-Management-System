# 🚀 Deployment Guide - Airline Management System

## ✨ **About This Guide**
This document was prepared as part of my **first full-stack project** using **React (frontend)** and **FastAPI (backend)** with **PostgreSQL**. It reflects what I learned during my first week of exploring these technologies, and it is designed to help others easily deploy and troubleshoot the system.

I created it not only as documentation but also as a showcase of my ability to **learn quickly, adapt to new stacks, and present work professionally**.

---

## 🔗 **Quick Access Links**

## 🎥 **Demo Video**
For a complete walkthrough of the setup and features, see our [Demo Showcase](DEMO_SHOWCASE.md).

https://drive.google.com/file/d/1vToqWdH86QYYGFES5-XYGH2pV-ryWUsm/view?usp=sharing

| Resource | URL | Description |
|----------|-----|-------------|
| 📂 **GitHub Repository** | [Airline-Management-System](https://github.com/Trisha4Bhagat/Airline-Management-System) | Complete source code and documentation |
| 🚀 **Backend API** | [http://localhost:8000](http://localhost:8000) | FastAPI server with auto-generated docs |
| 📚 **Swagger UI** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive API documentation |
| 🎨 **Frontend App** | [http://localhost:5173](http://localhost:5173) | React application with flight search |
| 🔧 **Admin Panel** | [http://localhost:5173/admin](http://localhost:5173/admin) | Flight management interface |
| 🎥 **Demo Video** | [Demo Showcase](DEMO_SHOWCASE.md) | 5-10 minute project walkthrough |
| 📋 **Admin Guide** | [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md) | Complete admin functionality documentation |

---

## 📋 **Prerequisites**

Before deploying the Airline Management System, ensure you have:

- **Python 3.10+** installed
- **Node.js 18+** and npm installed  
- **PostgreSQL 17+** running
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Git** for version control

---

## 🏠 **Local Development Setup**

### **Step 1: Clone Repository**
```bash
git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
cd Airline-Management-System
```

### **Step 2: Backend Setup (FastAPI + PostgreSQL)**

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Create Virtual Environment
```bash
python -m venv .venv

# Windows
.\.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
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
FRONTEND_URL=http://localhost:5173
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
python scripts/init_db.py
python scripts/populate_real_data.py
```

#### 2.7 Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend API**: [http://localhost:8000](http://localhost:8000)  
✅ **Swagger Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)  
✅ **Alternative Docs**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### **Step 3: Frontend Setup (React + TypeScript)**

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

✅ **Frontend Application**: [http://localhost:5173](http://localhost:5173)  
✅ **Flight Search**: [http://localhost:5173/flights](http://localhost:5173/flights)  
✅ **Admin Panel**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🎯 **Quick Start with Batch Files (Windows)**

For Windows users, I've included convenience scripts in the root directory:

### **Option 1: Individual Servers**
```cmd
# Start Backend Server
start_backend.bat

# Start Frontend Server (in new terminal)
start_frontend.bat
```

### **Option 2: Both Servers at Once**
```cmd
# Start both backend and frontend simultaneously
start_all.bat
```

This will automatically:
- ✅ Navigate to the correct directories
- ✅ Activate virtual environments  
- ✅ Start both servers with proper configuration
- ✅ Open the application in your browser

---

## 🐳 **Docker Deployment**

### **Option 1: Docker Compose (Recommended)**

```bash
# Clone repository if not already done
git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
cd Airline-Management-System

# Start all services
docker-compose up --build
```

This will start:
- **PostgreSQL**: Port 5432 (internal)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Frontend**: [http://localhost:3000](http://localhost:3000) (Docker uses port 3000)

**Stop services**:
```bash
docker-compose down
```

**Reset database**:
```bash
docker-compose down -v
docker-compose up --build
```

### **Option 2: Individual Containers**

```bash
# Backend
cd backend
docker build -t airline-backend .
docker run -p 8000:8000 --env-file .env airline-backend

# Frontend
cd ../frontend
docker build -t airline-frontend .
docker run -p 3000:3000 airline-frontend
```

---

## ☁️ **Cloud Deployment Options**

### **AWS (Production-Ready)**
- **Backend**: EC2 with Docker + RDS for PostgreSQL
- **Frontend**: Vercel/Netlify linked to GitHub
- **Domain**: Custom domain with HTTPS

### **Railway (Beginner-Friendly)**
- Connect GitHub repo to Railway
- Add environment variables in Railway dashboard
- Railway auto-detects FastAPI backend
- Deploy frontend with `npm run build`

### **Heroku (Traditional)**
- Backend on Heroku with Heroku Postgres
- Frontend on Vercel/Netlify
- Use Heroku CLI for deployment

---

## 🔧 **Environment Variables Configuration**

### **Backend (.env)**
```bash
# Development
DATABASE_URL=postgresql://airline_user:postgres123@localhost:5432/airline_db
SECRET_KEY=airline_secret_key_2025_dev_mode_only
DEBUG=True
FRONTEND_URL=http://localhost:5173

# Production
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your-super-secure-secret-key-here
DEBUG=False
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_ORIGINS=["https://your-frontend-domain.com"]
```

### **Frontend (.env)**
```bash
# Development
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development

# Production
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_ENV=production
```

---

## 🧪 **Testing Your Deployment**

### **Backend Health Checks**
```bash
# Basic health check
curl http://localhost:8000/
# Expected: {"message": "Welcome to Airline Management API"}

# Test flights endpoint
curl http://localhost:8000/api/flights/
# Expected: Array of flight objects

# Test specific flight
curl http://localhost:8000/api/flights/1
# Expected: Single flight object
```

### **Frontend Verification**
Visit [http://localhost:5173](http://localhost:5173) and confirm:

✅ **Homepage loads** with flight search interface  
✅ **Search functionality** works with real data  
✅ **Flights display** correctly with Australian airlines  
✅ **Admin panel** accessible at [/admin](http://localhost:5173/admin)  
✅ **API integration** shows live PostgreSQL data

## 📊 **Production Deployment Checklist**

Before deploying to production:

- ✅ **Strong SECRET_KEY** (use `openssl rand -hex 32`)
- ✅ **DEBUG=False** in production environment
- ✅ **HTTPS enabled** with SSL certificates
- ✅ **Proper CORS origins** (no wildcards in production)
- ✅ **Database connection pooling** configured
- ✅ **Logging and monitoring** set up
- ✅ **Environment variables** secured (not in code)
- ✅ **Database backups** automated
- ✅ **Error tracking** (Sentry, Rollbar)
- ✅ **Load testing** completed

---

## 🔐 **Admin Panel Access**

For full admin functionality documentation, see: **[ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)**

**Quick Admin Access**:
- **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Login**: Use admin credentials (see admin guide)
- **Features**: Create, update, delete flights + user management

**Admin API Endpoints**:
- `POST /api/flights/` - Create new flight
- `PUT /api/flights/{id}` - Update existing flight
- `DELETE /api/flights/{id}` - Remove flight
- `GET /api/admin/dashboard` - Admin analytics

---

## 🎥 **Demo Video Walkthrough**

A **5–10 minute comprehensive walkthrough** showcasing:
- Complete setup process
- Live API testing with Swagger UI
- Frontend flight search functionality
- Admin panel demonstration
- Real-time data flow between components



---

## **Personal Reflection**

This project was my **first real experience with React and FastAPI**, and I was amazed at how quickly I was able to build, debug, and deploy something full-stack with the help of AI tools and systematic learning.

### **Challenges I Overcame**:
- **CORS configuration** between frontend and backend
- **PostgreSQL setup** and connection management  
- **Docker containerization** for consistent deployment
- **React TypeScript integration** with API calls
- **Environment variable management** across development and production

### **Key Learning Moments**:
- Understanding how **REST APIs** provide contracts between frontend and backend
- Learning **database administration** fundamentals with PostgreSQL
- Implementing **proper error handling** and user feedback
- Creating **professional documentation** for team collaboration

### **Development Philosophy**:
Working alongside AI felt like collaborating with a mentor: it guided me through complex setups and suggested best practices, but I still made my own improvements and learned deeply. This approach taught me to:

- **Break down complex problems** into manageable steps
- **Read documentation effectively** and understand underlying concepts
- **Test systematically** and debug methodically
- **Document thoroughly** for future reference and team collaboration

This journey has motivated me to keep building scalable projects, and I am excited to apply this **growth mindset and problem-solving approach** in a real-world development role.

---

## 📚 **Additional Documentation**

| Document | Purpose | Target Audience |
|----------|---------|-----------------|
| [README.md](./README.md) | Project overview and quick start | Developers, recruiters |
| [API_DOCS.md](./API_DOCS.md) | Complete API reference | Frontend developers, testers |
| [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md) | Admin interface documentation | System administrators |
| [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) | Configuration management | DevOps, deployment teams |
| [TROUBLESHOOTING_LOG.md](./TROUBLESHOOTING_LOG.md) | Common issues and solutions | All developers |
| [AI_ASSISTANT_LOG.md](./AI_ASSISTANT_LOG.md) | Development journey documentation | Technical leaders, educators |
| [AI_EFFECTIVENESS_REPORT.md](./AI_EFFECTIVENESS_REPORT.md) | AI-assisted development analysis | Recruiters, technical managers |

DEMO VIDEO
https://drive.google.com/file/d/1vToqWdH86QYYGFES5-XYGH2pV-ryWUsm/view?usp=sharing
---

*This deployment guide represents not just technical documentation, but evidence of systematic learning, professional development practices, and the ability to create maintainable solutions that others can easily deploy and extend.*

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