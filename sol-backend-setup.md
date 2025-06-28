# Sol Backend Setup Guide

## Step 1: Install Python Environment
```bash
# Create virtual environment
python -m venv gpu-backend
source gpu-backend/bin/activate  # On Windows: gpu-backend\Scripts\activate

# Install required packages
pip install fastapi uvicorn
pip install cupy-cuda11x  # or appropriate CUDA version
pip install numpy pandas
pip install torch torchvision  # if using PyTorch
pip install transformers sentence-transformers  # for RAG
pip install chromadb  # vector database for RAG
```

## Step 2: Create API Server
Create `main.py`:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cupy as cp
import numpy as np
import time
from typing import Dict, Any
import json

app = FastAPI(title="GPU Compute Backend")

# Enable CORS for Firebase frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Firebase domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ComputeRequest(BaseModel):
    code: str
    operation_type: str  # "numpy", "cupy", "rag"
    parameters: Dict[str, Any] = {}

@app.post("/execute/numpy")
async def execute_numpy(request: ComputeRequest):
    try:
        # Execute NumPy code
        start_time = time.perf_counter()
        
        # Create execution namespace
        namespace = {"np": np, "time": time}
        exec(request.code, namespace)
        
        end_time = time.perf_counter()
        
        return {
            "status": "success",
            "execution_time": end_time - start_time,
            "results": "NumPy execution completed",
            "metrics": {
                "cpu_usage": "85%",  # Mock data - implement real monitoring
                "memory_usage": "2.3GB"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/execute/cupy")
async def execute_cupy(request: ComputeRequest):
    try:
        # Execute CuPy code
        start_time = time.perf_counter()
        
        # Create execution namespace
        namespace = {"cp": cp, "np": np, "time": time}
        exec(request.code, namespace)
        
        # Synchronize GPU
        cp.cuda.Device().synchronize()
        end_time = time.perf_counter()
        
        return {
            "status": "success",
            "execution_time": end_time - start_time,
            "results": "CuPy execution completed",
            "metrics": {
                "gpu_utilization": "92%",  # Mock data
                "gpu_memory": "4.2GB",
                "gpu_temp": "68°C"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/rag/query")
async def rag_query(request: ComputeRequest):
    try:
        # RAG processing
        query = request.parameters.get("query", "")
        
        # Mock RAG response - implement your RAG logic here
        response = {
            "status": "success",
            "answer": f"RAG response for: {query}",
            "sources": ["doc1.pdf", "doc2.pdf"],
            "confidence": 0.89
        }
        
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "gpu_available": cp.cuda.is_available(),
        "gpu_count": cp.cuda.runtime.getDeviceCount(),
        "timestamp": time.time()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Step 3: Start the Server
```bash
python main.py
```

## Step 4: Configure Network Access

### Option A: Local Network
1. Find your local IP address:
   ```bash
   ipconfig  # Windows
   ifconfig  # Linux/Mac
   ```
2. Share this IP with your friend
3. Ensure firewall allows port 8000

### Option B: Cloud Deployment (Recommended)
1. Deploy to cloud service (AWS, Google Cloud, etc.)
2. Get public endpoint URL
3. Share URL with your friend

## Step 5: Test the Setup
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test execution endpoint
curl -X POST "http://localhost:8000/execute/numpy" \
  -H "Content-Type: application/json" \
  -d '{"code": "import numpy as np; print(np.array([1,2,3]))", "operation_type": "numpy"}'
```
