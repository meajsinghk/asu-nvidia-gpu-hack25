#!/bin/bash
# Sol Backend Startup Script

echo "🚀 Starting Sol GPU-Accelerated Backend..."
echo "📋 Checking CUDA availability..."

python3 -c "import cupy; print(f'✅ CUDA available: {cupy.cuda.is_available()}')" 2>/dev/null || echo "⚠️ CuPy not installed yet"

echo "🔄 Installing requirements..."
pip install -r requirements.txt

echo "🌐 Starting backend from Jupyter notebook..."
echo "📡 Server will be available at http://localhost:8000"
echo "📖 API docs at http://localhost:8000/docs"
echo "🛑 Press Ctrl+C to stop"

# Run the notebook
jupyter nbconvert --to script complete_sol_backend.ipynb --execute
