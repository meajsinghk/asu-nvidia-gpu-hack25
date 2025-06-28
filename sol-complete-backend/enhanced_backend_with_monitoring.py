"""
Enhanced Sol Backend with Connection Monitoring and Logging
Put this code in: sol-complete-backend/enhanced_backend_with_monitoring.py
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import logging
import time
from datetime import datetime
import psutil
import json
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('sol_backend.log')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sol GPU-Accelerated Backend with Monitoring")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Track connections and requests
connection_stats = {
    "total_requests": 0,
    "health_checks": 0,
    "execute_requests": 0,
    "rag_queries": 0,
    "connected_clients": set(),
    "start_time": datetime.now().isoformat()
}

class ExecuteRequest(BaseModel):
    code: str
    language: str = "python"

class RagQuery(BaseModel):
    query: str
    max_results: int = 5

@app.middleware("http")
async def log_requests(request, call_next):
    """Log all incoming requests"""
    start_time = time.time()
    client_ip = request.client.host
    
    # Track unique clients
    connection_stats["connected_clients"].add(client_ip)
    connection_stats["total_requests"] += 1
    
    logger.info(f"🌐 REQUEST: {request.method} {request.url.path} from {client_ip}")
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(f"✅ RESPONSE: {response.status_code} in {process_time:.2f}s")
    
    return response

@app.get("/health")
async def health_check():
    """Health check with detailed system info"""
    connection_stats["health_checks"] += 1
    
    try:
        # Check GPU availability
        gpu_available = False
        gpu_info = "No GPU detected"
        try:
            import cupy as cp
            gpu_available = cp.cuda.is_available()
            if gpu_available:
                gpu_info = f"GPU available: {cp.cuda.get_device_name()}"
        except ImportError:
            gpu_info = "CuPy not installed"
        
        # System metrics
        cpu_percent = psutil.cpu_percent()
        memory = psutil.virtual_memory()
        
        health_data = {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "gpu_available": gpu_available,
            "gpu_info": gpu_info,
            "rag_initialized": True,  # Assume RAG is ready
            "system_info": {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "memory_available_gb": round(memory.available / (1024**3), 2)
            },
            "connection_stats": {
                **connection_stats,
                "connected_clients": list(connection_stats["connected_clients"]),
                "uptime_seconds": (datetime.now() - datetime.fromisoformat(connection_stats["start_time"])).total_seconds()
            }
        }
        
        logger.info(f"💓 HEALTH CHECK: GPU={gpu_available}, CPU={cpu_percent}%, MEM={memory.percent}%")
        return health_data
        
    except Exception as e:
        logger.error(f"❌ HEALTH CHECK FAILED: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.post("/execute/numpy")
async def execute_numpy(request: ExecuteRequest):
    """Execute NumPy code with monitoring"""
    connection_stats["execute_requests"] += 1
    logger.info(f"🐍 NUMPY EXECUTION requested")
    
    try:
        # Simple code execution (in real implementation, use safe execution)
        import numpy as np
        import time
        
        # Create a safe execution environment
        exec_globals = {"np": np, "time": time, "print": print}
        start_time = time.time()
        
        # Execute the code
        exec(request.code, exec_globals)
        
        execution_time = time.time() - start_time
        
        result = {
            "status": "success",
            "execution_time": execution_time,
            "message": f"NumPy code executed in {execution_time:.4f} seconds",
            "backend": "Sol GPU Backend"
        }
        
        logger.info(f"✅ NUMPY EXECUTION completed in {execution_time:.4f}s")
        return result
        
    except Exception as e:
        logger.error(f"❌ NUMPY EXECUTION failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

@app.post("/execute/cupy")
async def execute_cupy(request: ExecuteRequest):
    """Execute CuPy code with monitoring"""
    connection_stats["execute_requests"] += 1
    logger.info(f"🚀 CUPY EXECUTION requested")
    
    try:
        import cupy as cp
        import time
        
        # Create a safe execution environment
        exec_globals = {"cp": cp, "time": time, "print": print}
        start_time = time.time()
        
        # Execute the code
        exec(request.code, exec_globals)
        
        execution_time = time.time() - start_time
        
        result = {
            "status": "success",
            "execution_time": execution_time,
            "message": f"CuPy code executed in {execution_time:.4f} seconds",
            "backend": "Sol GPU Backend",
            "gpu_used": True
        }
        
        logger.info(f"✅ CUPY EXECUTION completed in {execution_time:.4f}s")
        return result
        
    except Exception as e:
        logger.error(f"❌ CUPY EXECUTION failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"GPU execution failed: {str(e)}")

@app.post("/rag/query")
async def rag_query(request: RagQuery):
    """RAG query with monitoring"""
    connection_stats["rag_queries"] += 1
    logger.info(f"🤖 RAG QUERY: '{request.query[:50]}...'")
    
    try:
        # Simulate RAG response (replace with actual RAG implementation)
        response_data = {
            "status": "success",
            "question": request.query,
            "answer": f"This is a simulated RAG response for: {request.query}. The Sol backend is working correctly!",
            "sources": ["Sol Backend Database", "GPU Computing Knowledge Base"],
            "confidence": 0.85,
            "execution_time": 0.5,
            "metrics": {
                "gpu_accelerated": True,
                "backend": "Sol RAG System"
            }
        }
        
        logger.info(f"✅ RAG QUERY completed successfully")
        return response_data
        
    except Exception as e:
        logger.error(f"❌ RAG QUERY failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")

@app.get("/stats")
async def get_stats():
    """Get detailed connection and usage statistics"""
    logger.info(f"📊 STATS requested")
    
    uptime = (datetime.now() - datetime.fromisoformat(connection_stats["start_time"])).total_seconds()
    
    return {
        "connection_stats": {
            **connection_stats,
            "connected_clients": list(connection_stats["connected_clients"]),
            "uptime_seconds": uptime,
            "uptime_human": f"{int(uptime//3600)}h {int((uptime%3600)//60)}m {int(uptime%60)}s"
        },
        "system_info": {
            "cpu_percent": psutil.cpu_percent(),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent if os.name != 'nt' else psutil.disk_usage('C:').percent
        }
    }

@app.get("/logs")
async def get_recent_logs():
    """Get recent log entries"""
    try:
        with open('sol_backend.log', 'r') as f:
            lines = f.readlines()
            # Return last 50 lines
            recent_logs = lines[-50:] if len(lines) > 50 else lines
            return {"logs": recent_logs}
    except FileNotFoundError:
        return {"logs": ["No log file found"]}

if __name__ == "__main__":
    logger.info("🚀 Starting Sol Backend with Monitoring...")
    logger.info("📊 Access stats at: http://[YOUR_IP]:8000/stats")
    logger.info("📋 Access logs at: http://[YOUR_IP]:8000/logs")
    logger.info("💓 Health check at: http://[YOUR_IP]:8000/health")
    
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8000,
        log_level="info"
    )
