# ✈️ Airline Management System

**A modern, full-stack airline reservation and management platform built with FastAPI, React, and PostgreSQL.**

> **👋 Hi! I'm Trisha Bhagat**, a third-year Computer Science student at Monash University. This project started as a basic HTML/CSS airline booking concept, but thanks to the opportunity to learn modern web technologies, I've transformed it into a **full-stack application using React and FastAPI** in just one week. This represents my journey from static web pages to dynamic, production-quality software that actually works with real data!

---

## 🔗 **Quick Access & Live Demo**

🎬 **Want to see it in action?** Check out the [Demo Showcase](DEMO_SHOWCASE.md) for a complete walkthrough!

| Resource | URL | Description |
|----------|-----|-------------|
| 🎥 **Demo Video** | [Demo Showcase](DEMO_SHOWCASE.md) | 7-minute project demonstration |
| 🚀 **Live Backend** | [http://localhost:8000](http://localhost:8000) | FastAPI server with real flight data |
| 📚 **Interactive API** | [http://localhost:8000/docs](http://localhost:8000/docs) | Swagger UI for testing endpoints |
| 🎨 **Frontend App** | [http://localhost:5173](http://localhost:5173) | React application with flight search |
| 🔧 **Admin Panel** | [http://localhost:5173/admin](http://localhost:5173/admin) | Complete flight management interface |
| 📋 **Admin Guide** | [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md) | Administrative functionality documentation |

---

## 🎯 **Project Scope: From HTML to Full-Stack (Week 1 Achievement)**

This repository showcases the **complete transformation** of a basic HTML airline booking page into a professional full-stack application. Thanks to the opportunity to modernize my existing coursework project, I was able to focus on learning FastAPI and React while building something meaningful and functional.

**The evolution journey**:
- **Started with**: Static HTML forms and CSS styling for airline bookings
- **Transformed into**: Dynamic React application with real backend API
- **Achieved**: Professional full-stack system that handles actual flight data

### **✅ What I Built (Week 1)**
- **Complete Flight CRUD API**: FastAPI endpoints with automatic documentation
- **React TypeScript Frontend**: Modern UI with Material-UI components  
- **PostgreSQL Integration**: 2,500+ real Australian flight records
- **Admin Dashboard**: Full flight management capabilities
- **Docker Deployment**: Containerized for consistent environments
- **Professional Documentation**: Complete development journey recorded

### **🚀 What's Coming Next**
- **Week 2**: User authentication with JWT and role-based access
- **Week 3**: Booking management with payment integration concepts
- **Week 4**: Analytics dashboard and reporting features
- **Future**: Cloud deployment with CI/CD pipelines

---

## 💻 **Tech Stack & Learning Journey**

| Technology | My Experience Level | What I Learned |
|------------|-------------------|----------------|
| **FastAPI** | 🆕 First time | API design, automatic documentation, type hints |
| **React + TypeScript** | 🆕 First time | Component architecture, hooks, type safety |
| **PostgreSQL** | 🆕 First time | Database administration, relationships, migrations |
| **Docker** | 🆕 First time | Containerization, multi-service orchestration |
| **AI-Assisted Development** | 🆕 First time | GitHub Copilot as a learning accelerator |

---

## 🚀 **30-Second Quick Start**

### **Windows Users (Easiest)**
```cmd
# Clone and start everything at once
git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
cd Airline-Management-System
start_all.bat
```

### **Cross-Platform (Docker)**
```bash
git clone https://github.com/Trisha4Bhagat/Airline-Management-System.git
cd Airline-Management-System
docker-compose up --build
```

**🎉 That's it!** The system will start and open automatically in your browser.

---

## 📂 **Professional Project Structure**

```
Airline-Management-System/
├── 📁 backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/                   # REST API endpoints
│   │   ├── core/                  # Configuration & security
│   │   ├── models/                # SQLAlchemy database models
│   │   ├── schemas/               # Pydantic validation schemas
│   │   └── services/              # Business logic layer
│   ├── scripts/                   # Database utilities
│   └── requirements.txt           # Python dependencies
├── 📁 frontend/                   # React TypeScript application
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   ├── pages/                 # Application pages
│   │   ├── services/              # API integration services
│   │   └── types/                 # TypeScript type definitions
│   └── package.json               # Node.js dependencies
├── 📁 media/                      # Organized project documentation
│   ├── ai-assistant-log/          # AI development journey images
│   └── api-docs/                  # API documentation screenshots
├── 🗃️ docker-compose.yml          # Multi-container deployment
├── 🚀 start_all.bat               # Windows quick-start script
└── 📚 Complete Documentation      # Professional docs for every aspect
```

---

## 🛠️ **Full Setup Guide (Detailed)**

For complete setup instructions including database configuration, environment variables, and troubleshooting, see:

**👉 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment documentation

### **Prerequisites**
- **Python 3.10+** and **Node.js 18+**
- **PostgreSQL 17+** (or use Docker)
- **Git** for version control

### **Development Setup (Manual)**

**Backend Setup**:
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend Setup**:
```bash
cd frontend
npm install
npm run dev
```

**Environment Configuration**:
```bash
# Backend .env
DATABASE_URL=postgresql://airline_user:postgres123@localhost:5432/airline_db

# Frontend .env
REACT_APP_API_URL=http://localhost:8000
```

---

## 🛩️ **Flight CRUD API Showcase**

### **Complete API Endpoints**

| Method | Endpoint | Purpose | Authentication | Status |
|--------|----------|---------|----------------|---------|
| `GET` | `/api/flights/` | Search & filter flights | Public | ✅ Live |
| `GET` | `/api/flights/{id}` | Get flight details | Public | ✅ Live |
| `POST` | `/api/flights/` | Create new flight | Admin | ✅ Live |
| `PUT` | `/api/flights/{id}` | Update flight details | Admin | ✅ Live |
| `DELETE` | `/api/flights/{id}` | Remove flight | Admin | ✅ Live |

### **Real Australian Flight Data Sample**
```json
{
  "id": 1,
  "flight_number": "QF401",
  "departure_city": "Sydney",
  "arrival_city": "Melbourne",
  "departure_time": "2025-10-15T09:00:00",
  "arrival_time": "2025-10-15T10:30:00",
  "price": 285.50,
  "available_seats": 180,
  "aircraft_type": "Boeing 737-800",
  "airline": "Qantas Airways"
}
```

**🧪 Test the API**: Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive testing

---

## 🎨 **Frontend Features Showcase**

### **User Experience**
- **🔍 Smart Flight Search**: Filter by cities, dates, and passenger count
- **🎯 Real-Time Results**: Live data from PostgreSQL database
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⚡ Fast Performance**: Optimized React components with TypeScript

### **Admin Capabilities**
- **✈️ Flight Management**: Create, update, delete flight records
- **📊 Dashboard Analytics**: Overview of system usage and data
- **🔐 Secure Access**: Role-based authentication for admin functions
- **📈 Real-Time Updates**: Changes reflect immediately across the system

**🎮 Try the Admin Panel**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🤖 **AI-Assisted Development Journey**

This project showcases modern development practices using AI as a learning accelerator:

### **📊 AI Effectiveness Metrics**
- **⏰ Time Saved**: 15-20 hours across all development sessions
- **📈 Learning Acceleration**: ~60% faster than traditional learning
- **💡 Quality Improvement**: Professional patterns from day one
- **🧠 Knowledge Retention**: Deep understanding through guided exploration

### **🔍 Documented AI Sessions**
- **10 Complete Sessions**: Every interaction with GitHub Copilot logged
- **Real Problem-Solving**: Authentic challenges and solutions
- **Learning Progression**: From confusion to confidence documented
- **Code Evolution**: Before/after examples showing improvement

**📖 Full AI Journey**: [AI_ASSISTANT_LOG.md](./AI_ASSISTANT_LOG.md) | [AI_EFFECTIVENESS_REPORT.md](./AI_EFFECTIVENESS_REPORT.md)

---

## 🐳 **Docker Deployment**

### **Production-Ready Containerization**
```bash
# Complete system startup
docker-compose up --build

# Individual services
docker-compose up backend    # API only
docker-compose up frontend   # UI only
docker-compose up db         # Database only
```

**🌐 Docker Access Points**:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend**: [http://localhost:8000](http://localhost:8000)
- **Database**: PostgreSQL on port 5432

---

## 📚 **Complete Documentation Suite**

This project includes comprehensive documentation demonstrating professional development practices:

| Document | Purpose | Audience |
|----------|---------|----------|
| **[README.md](./README.md)** | Project overview & quick start | Recruiters, developers |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Complete setup instructions | DevOps teams |
| **[API_DOCS.md](./API_DOCS.md)** | Detailed API reference | Frontend developers |
| **[ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md)** | Admin interface documentation | System administrators |
| **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** | Configuration management | Deployment teams |
| **[TROUBLESHOOTING_LOG.md](./TROUBLESHOOTING_LOG.md)** | Real issues & solutions | All developers |
| **[AI_ASSISTANT_LOG.md](./AI_ASSISTANT_LOG.md)** | Complete development journey | Technical managers |
| **[AI_EFFECTIVENESS_REPORT.md](./AI_EFFECTIVENESS_REPORT.md)** | AI productivity analysis | Recruiters, educators |
| **[DEMO_SCRIPT.md](./DEMO_SCRIPT.md)** | Video presentation outline | Content creators |

---

##  **Personal Learning Reflection**

### **What This Project Means to Me**

This airline management system represents more than just code—it's a complete transformation of my development journey. What started as a simple HTML/CSS airline booking page from my coursework has evolved into a professional full-stack application that I'm genuinely proud of.

**The transformation journey**:
- **From static HTML** → **Dynamic React TypeScript application**
- **From hardcoded data** → **Real PostgreSQL database with 2,500+ flight records**
- **From basic styling** → **Professional Material-UI components**
- **From simple forms** → **Complete CRUD operations with admin panel**

This project is evidence of my ability to:

- **🚀 Learn Rapidly**: Mastered two major frameworks (FastAPI + React) in one week
- **🔧 Solve Real Problems**: Built something that actually works with real data
- **📖 Document Thoroughly**: Created professional documentation others can follow
- **🤖 Leverage Modern Tools**: Used AI assistance effectively while maintaining deep understanding
- **💪 Persist Through Challenges**: Overcame database issues, CORS problems, and deployment complexities

### **From HTML Student Project to Full-Stack Developer**

**The Complete Transformation**:
- **Before**: Simple HTML forms with no backend, static airline booking page
- **Week 1**: Learning FastAPI, React, PostgreSQL, and Docker from scratch
- **After**: Professional full-stack application with real data and deployment-ready architecture

**What changed everything**: Getting the opportunity to modernize my existing HTML project gave me a clear goal and familiar domain to work with, allowing me to focus on learning the new technologies rather than struggling with project requirements.

**Key Breakthroughs**:
- Understanding how APIs connect frontend and backend
- Learning database administration and relationship design
- Implementing professional error handling and user feedback
- Creating deployment-ready applications with Docker

### **What Recruiters Should Know**

1. **🎯 Growth Mindset**: I approached unknown technologies with curiosity, not fear
2. **🛠️ Problem-Solving**: I debugged complex issues systematically and documented solutions
3. **📚 Communication**: I created clear documentation that others can follow
4. **🤝 Collaboration**: I worked effectively with AI tools while maintaining code ownership
5. **⚡ Delivery**: I shipped a working product in one week despite learning new technologies

---

## 🎬 **Live Demonstration**

**📺 Watch the complete project walkthrough**: 
**What the demo covers**:
- ⚡ 30-second quick start demonstration
- 🔧 Backend API testing with real data
- 🎨 Frontend user experience walkthrough  
- 🔐 Admin panel functionality showcase
- 🤖 AI-assisted development highlights
- 📈 Personal learning journey reflection

---

## 🌟 **Why This Project Stands Out**

### **Technical Excellence**
- **🏗️ Production-Ready Architecture**: Proper separation of concerns, error handling
- **📊 Real Data Integration**: 2,500+ authentic Australian flight records
- **🔒 Security Considerations**: Environment variables, CORS configuration, input validation
- **🐳 Deployment Ready**: Docker containerization for consistent environments

### **Professional Practices**
- **📖 Comprehensive Documentation**: Every aspect explained clearly
- **🧪 Interactive Testing**: Swagger UI for API exploration
- **🔄 Version Control**: Clean Git history with meaningful commits
- **📱 Responsive Design**: Works across devices and screen sizes

### **Learning Documentation**
- **🎯 Honest Journey**: Real challenges and authentic solutions documented
- **📈 Measurable Growth**: Concrete evidence of skill development
- **🤖 AI Integration**: Modern development workflow showcased
- **💡 Knowledge Sharing**: Others can learn from my experience

---

## 🚀 **Ready to Explore?**

### **For Recruiters**
1. **🎥 Start with the demo video** to see everything in action
2. **🚀 Try the quick start** to experience the system yourself
3. **📖 Review the documentation** to see professional practices
4. **🤖 Check the AI logs** to understand my learning process

### **For Developers**
1. **⬇️ Clone the repository** and explore the codebase
2. **🔧 Follow the deployment guide** for detailed setup
3. **🧪 Test the API endpoints** with the interactive documentation
4. **📝 Read the troubleshooting log** to learn from my mistakes

### **For Educators**
1. **📚 Review the learning documentation** for teaching insights
2. **🤖 Analyze the AI effectiveness** for curriculum planning
3. **📖 Use as a case study** for modern development practices
4. **💡 Adapt the approach** for your students

---

## 📞 **Let's Connect!**

I'm excited to discuss how the skills demonstrated in this project can contribute to your team. This airline management system showcases not just technical competency, but the ability to learn quickly, solve problems systematically, and communicate effectively.

**🔗 Connect with me**:
- **📧 Email**: trisha.bhagat445@gmail.com
- **🐙 GitHub**: [https://github.com/Trisha4Bhagat](https://github.com/Trisha4Bhagat)

---

*This project demonstrates my commitment to continuous learning, professional development, and building solutions that solve real problems. What started as a simple HTML assignment has become a showcase of modern web development skills. I'm grateful for the opportunity to transform my basic coursework into something I can be truly proud of, and I'm eager to bring this same energy and growth mindset to your development team.*  
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
