@echo off
title Airline Management System - Full Stack Startup
echo.
echo ===================================================
echo   🚀 Airline Management System - Full Stack
echo   Starting Backend (FastAPI) + Frontend (React)
echo ===================================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "start_backend.bat"

echo Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "start_frontend.bat"

echo.
echo ===================================================
echo   ✅ Both servers are starting!
echo.
echo   Backend API: http://localhost:8000
echo   Swagger Docs: http://localhost:8000/docs
echo   Frontend App: http://localhost:5173
echo   Admin Panel: http://localhost:5173/admin
echo.
echo   📋 See DEPLOYMENT_GUIDE.md for full documentation
echo   🎥 Demo Video: [Add your YouTube link here]
echo ===================================================
echo.

echo Opening application in browser...
timeout /t 15 /nobreak > nul
start http://localhost:5173

echo.
echo Press any key to close this window...
pause > nul