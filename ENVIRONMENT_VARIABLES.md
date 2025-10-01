# 🔧 Environment Variables Configuration

## 📋 **Flight CRUD Subset - Environment Setup**

This document outlines all environment variables required for the Flight CRUD implementation of the Airline Management System.

---

## 🖥️ **Backend Environment Variables**

Create a `.env` file in the `backend/` directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://airline_user:postgres123@localhost:5432/airline_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=airline_db
DB_USER=airline_user
DB_PASSWORD=postgres123

# Application Security
SECRET_KEY=airline_secret_key_2025_dev_mode_only
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Development Settings
DEBUG=True
ENVIRONMENT=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# API Configuration
API_VERSION=v1
API_PREFIX=/api
```

---

## 🎨 **Frontend Environment Variables**

Create a `.env` file in the `frontend/` directory:

```bash
# Backend API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1

# Application Settings
REACT_APP_ENV=development
REACT_APP_DEBUG=true

# Build Configuration
GENERATE_SOURCEMAP=true
```

---

## 🐳 **Docker Environment Variables**

For Docker deployment, create a `.env` file in the root directory:

```bash
# Database Configuration (Docker)
POSTGRES_DB=airline_db
POSTGRES_USER=airline_user
POSTGRES_PASSWORD=postgres123
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Application URLs (Docker)
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Docker Compose Settings
COMPOSE_PROJECT_NAME=airline_management
```

---

## 🔒 **Security Considerations**

### **Development vs Production**

| Variable | Development | Production |
|----------|-------------|------------|
| `SECRET_KEY` | Fixed string for dev | Generate secure random key |
| `DEBUG` | `True` | `False` |
| `DATABASE_URL` | Local PostgreSQL | Secure cloud database |
| `ALLOWED_ORIGINS` | Localhost URLs | Production domain URLs |

### **Production Security Checklist**
- ✅ Generate strong, unique `SECRET_KEY`
- ✅ Use environment-specific database credentials
- ✅ Set `DEBUG=False` in production
- ✅ Configure proper CORS origins
- ✅ Use HTTPS URLs in production
- ✅ Store sensitive variables in secure vault (not in code)

---

## 🛠️ **Setup Instructions**

### **Method 1: Manual Setup**
1. Copy the appropriate `.env` template above
2. Replace placeholder values with your actual configuration
3. Save the file in the correct directory (`backend/` or `frontend/`)

### **Method 2: Quick Setup Script**
```bash
# Backend setup
cd backend
echo "DATABASE_URL=postgresql://airline_user:postgres123@localhost:5432/airline_db" > .env
echo "SECRET_KEY=airline_secret_key_2025_dev_mode_only" >> .env
echo "DEBUG=True" >> .env

# Frontend setup  
cd ../frontend
echo "REACT_APP_API_URL=http://localhost:8000" > .env
echo "REACT_APP_ENV=development" >> .env
```

---

## 🐛 **Common Issues & Solutions**

### **Database Connection Errors**
```bash
# Error: could not connect to server
# Solution: Verify PostgreSQL is running and credentials are correct
DATABASE_URL=postgresql://correct_user:correct_password@localhost:5432/correct_db
```

### **CORS Errors**
```bash
# Error: blocked by CORS policy
# Solution: Add frontend URL to backend CORS configuration
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=["http://localhost:5173"]
```

### **API Not Found**
```bash
# Error: API endpoint not found
# Solution: Verify backend URL and API version
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_VERSION=v1
```

---

## 📝 **Environment Variable Validation**

The application includes built-in validation for critical environment variables:

### **Backend Validation**
- `DATABASE_URL` - Must be valid PostgreSQL connection string
- `SECRET_KEY` - Must be at least 32 characters for security
- `FRONTEND_URL` - Must be valid URL format

### **Frontend Validation**
- `REACT_APP_API_URL` - Must be reachable backend URL
- Environment variables must start with `REACT_APP_` prefix

---

## 🔍 **Debugging Environment Issues**

### **Check Environment Loading**
```python
# Backend - Check if variables are loaded
import os
print("DATABASE_URL:", os.getenv("DATABASE_URL"))
print("SECRET_KEY:", "***" if os.getenv("SECRET_KEY") else "NOT SET")
```

```javascript
// Frontend - Check if variables are loaded
console.log("API URL:", process.env.REACT_APP_API_URL);
console.log("Environment:", process.env.REACT_APP_ENV);
```

### **Common Debugging Commands**
```bash
# Check if .env file exists
ls -la .env

# View environment variables (excluding sensitive data)
env | grep -E "(REACT_APP|DATABASE|DEBUG)" | grep -v PASSWORD

# Test database connection
python -c "import os; print('DB:', os.getenv('DATABASE_URL', 'NOT SET'))"
```

---

## 📚 **Additional Resources**

- **FastAPI Environment Documentation**: [https://fastapi.tiangolo.com/advanced/settings/](https://fastapi.tiangolo.com/advanced/settings/)
- **Create React App Environment Variables**: [https://create-react-app.dev/docs/adding-custom-environment-variables/](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- **PostgreSQL Connection Strings**: [https://www.postgresql.org/docs/current/libpq-connect.html](https://www.postgresql.org/docs/current/libpq-connect.html)

---

*This configuration supports the Flight CRUD implementation of the Airline Management System. Additional environment variables will be documented as the system expands with user authentication, booking management, and analytics features.*