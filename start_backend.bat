@echo off
echo Starting Airline Management Backend...
cd /d "C:\Users\RASHMI\Airline Management\backend"
set PYTHONPATH=%CD%

REM Kill any existing process using port 8000
netstat -ano | findstr :8000 > nul
if %errorlevel%==0 (
    echo Killing existing processes on port 8000...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /PID %%a /F > nul 2>&1
)

echo Starting FastAPI server on port 8000...
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
echo.
echo Backend server stopped. Press any key to close.
pause