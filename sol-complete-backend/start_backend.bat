@echo off
echo 🔧 SOL ENVIRONMENT FIX - Python 3.12 Compatible
echo 📋 Checking system...

REM Check CUDA
nvidia-smi >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo ✅ CUDA detected
    set GPU_AVAILABLE=true
) else (
    echo ⚠️  CUDA not detected, using CPU mode
    set GPU_AVAILABLE=false
)

echo 🔄 Installing packages with compatibility fixes...

REM Upgrade pip first
pip install --user --upgrade pip setuptools wheel

REM Install compatible NumPy for Python 3.12
echo 📦 Installing NumPy Python 3.12 compatible...
pip install --user "numpy>=1.25.0"

REM Install core packages
echo 📦 Installing core packages...
pip install --user fastapi uvicorn[standard] pandas requests python-multipart pydantic

REM Try GPU packages if CUDA available
if "%GPU_AVAILABLE%"=="true" (
    echo 🚀 Attempting GPU packages...
    pip install --user cudf-cu11 cupy-cuda11x || echo ⚠️  GPU packages failed, continuing with CPU
)

echo 🌐 Starting Sol backend server...
echo 📡 Server will run on port 8000
echo 🔗 Share the URL with Amrit when ready!

python sol_backend_server.py

pause