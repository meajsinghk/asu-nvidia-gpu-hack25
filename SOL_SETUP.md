# 🚀 Sol Backend Setup for Your Friend

## Quick Instructions to Get Sol Backend Running

### Step 1: Navigate to Sol Backend Folder
```bash
cd sol-complete-backend
```

### Step 2: Run the Automated Setup
Choose based on your system:

**For Linux/Mac (Sol):**
```bash
chmod +x start_backend.sh
./start_backend.sh
```

**For Windows:**
```bash
start_backend.bat
```

### Step 3: Wait for Setup to Complete
The script will:
- Install all Python dependencies
- Download the NYC parking dataset
- Start the RAG AI system with Ollama
- Launch the FastAPI server

### Step 4: Find Your Host URL
After successful startup, you'll see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Your friend should provide you with:**
```
http://[SOL_IP_ADDRESS]:8000
```

Example: `http://192.168.1.100:8000` or `http://sol.example.com:8000`

### Step 5: Test the Backend
Visit: `http://[SOL_IP_ADDRESS]:8000/health`

You should see:
```json
{
  "status": "healthy",
  "gpu_available": true,
  "rag_initialized": true
}
```

## 🔧 If Something Goes Wrong

### Check CUDA/GPU
```bash
nvidia-smi
python -c "import cupy; print('GPU available:', cupy.cuda.is_available())"
```

### Check Port 8000
```bash
# Linux/Mac
sudo netstat -tlnp | grep :8000

# Windows
netstat -an | findstr :8000
```

### Manual Installation (if scripts fail)
```bash
# Install requirements
pip install -r requirements.txt

# Run Jupyter notebook
jupyter notebook complete_sol_backend.ipynb
# Execute all cells in order
```

## 📨 What to Send Back

Your friend should send you:

1. **Backend URL**: `http://[IP_ADDRESS]:8000`
2. **Health Check**: Screenshot or text of `/health` endpoint
3. **Any Error Messages**: If something doesn't work

## 🌐 Frontend Configuration

Once you get the URL, update your `.env.local`:
```env
NEXT_PUBLIC_SOL_BACKEND_URL=http://[FRIEND_SOL_IP]:8000
```

## 🎯 Expected Results

When working correctly:
- Health endpoint returns GPU and RAG status
- Frontend shows "🚀 Sol GPU Connected" instead of "Simulation Mode"
- AI responses come from Sol's RAG system instead of browser LLM
- Much more sophisticated AI analysis and code generation

## 📞 Need Help?

If your friend encounters issues:
1. Check the `DEPLOYMENT_GUIDE.md` for detailed troubleshooting
2. Look at logs in the terminal where the backend is running
3. Ensure firewall allows port 8000
4. Verify CUDA/GPU drivers are installed correctly
