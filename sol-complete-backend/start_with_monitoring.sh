#!/bin/bash

# Enhanced startup script with monitoring
# File: sol-complete-backend/start_with_monitoring.sh

echo "🚀 Starting Sol Backend with Enhanced Monitoring..."

# Install requirements
echo "📦 Installing Python packages..."
pip install fastapi uvicorn pandas numpy cupy-cuda11x psutil

# Start the enhanced backend
echo "🌐 Starting backend on port 8000..."
python enhanced_backend_with_monitoring.py

echo "✅ Backend started!"
echo "📊 Monitor at: http://$(hostname -I | awk '{print $1}'):8000/stats"
echo "💓 Health: http://$(hostname -I | awk '{print $1}'):8000/health"
