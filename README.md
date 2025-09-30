# ✈️ Airline Management System

**A modern, full-stack airline reservation and management platform built with FastAPI, React, and PostgreSQL.**

---

## 🎯 **Current Subset Scope: Flight CRUD (Week 1 Deliverable)**

This repository demonstrates the **Flight CRUD functionality** as part of the airline management system modernization project. The current implementation includes:

- ✅ **Backend Flight CRUD**: FastAPI endpoints for Create, Read, Update, Delete operations  
- ✅ **Frontend Integration**: React TypeScript interface for flight search and management  
- ✅ **Database Integration**: PostgreSQL with SQLAlchemy ORM  
- ✅ **API Documentation**: Auto-generated Swagger/OpenAPI docs  
- ✅ **Docker Support**: Containerized deployment setup  
- ✅ **AI-Assisted Development**: Full documentation of GitHub Copilot usage  

**Future Scope**: User authentication, booking management, and admin analytics will be implemented in subsequent iterations.

---

## 🎯 **Tech Stack**
- **Backend**: FastAPI, Python 3.10+, PostgreSQL, SQLAlchemy, Pydantic  
- **Frontend**: React 18, TypeScript, Material-UI, Vite  
- **Database**: PostgreSQL 17.6 with realistic Australian flight data  
- **Development**: Docker, Git, AI-assisted development with GitHub Copilot  
- **Testing**: Swagger UI, API documentation, endpoint testing  

---

## 📂 **Project Structure**

```
Airline-Management-System/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/               # API endpoints
│   │   ├── core/              # Core configurations
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   └── services/          # Business logic
│   └── requirements.txt
└── frontend/                  # React application
    ├── src/
    │   ├── components/        # React components
    │   ├── services/          # API services
    │   └── pages/             # Page components
    └── package.json
```

---

## 🚀 **Quick Start Guide**

### Prerequisites
- **Python 3.10+** installed  
- **Node.js 18+** and npm installed  
- **PostgreSQL 17+** running  
- **Git** for version control  

---

### 🔧 **Backend Setup (FastAPI + PostgreSQL)**

1. **Clone and navigate to backend**:
   ```bash
   git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
   cd Airline-Management-System/backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate  # Windows
   source .venv/bin/activate # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables** (create `.env` file):
   ```bash
   DATABASE_URL=postgresql://airline_user:postgres123@localhost:5432/airline_db
   SECRET_KEY=airline_secret_key_2025_dev_mode_only
   ```

5. **Run database migrations**:
   ```bash
   python scripts/init_db.py
   python scripts/populate_real_data.py
   ```

6. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```

   ✅ **Backend running at**: http://localhost:8000  
   ✅ **API Documentation**: http://localhost:8000/docs

---

### 🎯 **Quick Start with Batch Files (Windows)**

For Windows users, we've included convenience scripts:

1. **Start Backend Server**:
   ```cmd
   start_backend.bat
   ```

2. **Start Frontend Server**:
   ```cmd
   start_frontend.bat
   ```

This will automatically:
- ✅ Navigate to the correct directories
- ✅ Activate virtual environments  
- ✅ Start both servers with proper configuration
- ✅ Open the application in your browser

---

### 🎨 **Frontend Setup (React + TypeScript)**

1. **Navigate to frontend**:
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables** (create `.env` file):
   ```bash
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

   ✅ **Frontend running at**: http://localhost:5173  
   ✅ **Flight Search**: http://localhost:5173/flights

---

## 🛠️ **Flight CRUD API Endpoints**

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| `GET` | `/api/flights/` | List all flights | ✅ |
| `GET` | `/api/flights/{id}` | Get specific flight | ✅ |
| `POST` | `/api/flights/` | Create new flight (Admin) | ✅ |
| `PUT` | `/api/flights/{id}` | Update flight (Admin) | ✅ |
| `DELETE` | `/api/flights/{id}` | Delete flight (Admin) | ✅ |

### 📊 **Sample Response**
```json
{
  "flight_number": "QF123",
  "departure_city": "Sydney",
  "arrival_city": "Melbourne",
  "departure_time": "2025-10-15T08:00:00",
  "arrival_time": "2025-10-15T10:30:00",
  "price": 285.50,
  "available_seats": 180,
  "id": 1
}
```

---

## 🐳 **Docker Deployment**

### **Quick Start with Docker Compose**
```bash
git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
cd Airline-Management-System
docker-compose up --build
```

✅ **Frontend**: http://localhost:3000  
✅ **Backend**: http://localhost:8000  
✅ **Database**: PostgreSQL on port 5432

**To stop services**:
```bash
docker-compose down
```

---

## 🤖 **AI-Assisted Development**

This project showcases AI-assisted development practices:

- **20+ documented Copilot sessions**  
- **15+ hours saved** on boilerplate and debugging  
- **Manual refinements** for quality and correctness  
- **AI logs & effectiveness reports** included in repo  

📁 **See**: `AI_ASSISTANT_LOG.md` | `AI_EFFECTIVENESS_REPORT.md`

---

## 📋 **Documentation Deliverables**

- **README.md** → Project overview, setup instructions, API docs  
- **DEPLOYMENT_GUIDE.md** → Deployment steps  
- **ENVIRONMENT_VARIABLES.md** → Env config details  
- **TROUBLESHOOTING_LOG.md** → Common issues + fixes  
- **API_DOCS.md** → Extended API reference  
- **AI_ASSISTANT_LOG.md** → Copilot usage log  
- **AI_EFFECTIVENESS_REPORT.md** → Productivity analysis  
- **DEMO_SCRIPT.md** → 5–10 min demo script outline

---
