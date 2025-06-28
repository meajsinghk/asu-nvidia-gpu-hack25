@echo off
REM Enhanced startup script for Windows
REM File: sol-complete-backend/start_with_monitoring.bat

echo 🚀 Starting Sol Backend with Enhanced Monitoring...

REM Install requirements
echo 📦 Installing Python packages...
pip install fastapi uvicorn pandas numpy cupy-cuda11x psutil

REM Start the enhanced backend
echo 🌐 Starting backend on port 8000...
python enhanced_backend_with_monitoring.py

echo ✅ Backend started!
echo 📊 Monitor at: http://localhost:8000/stats
echo 💓 Health: http://localhost:8000/health
pause
