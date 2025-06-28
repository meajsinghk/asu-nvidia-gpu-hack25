# Network Configuration Guide for Sol Backend

## Option 1: Local Network Access (Quick Setup)

### 1. Find Your Local IP Address
**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually something like 192.168.1.100)

**Linux/Mac:**
```bash
ifconfig
# or
hostname -I
```

### 2. Configure Firewall
**Windows:**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port "8000"
6. Allow the connection
7. Apply to all profiles
8. Name it "Sol Backend API"

**Linux:**
```bash
sudo ufw allow 8000
# or for specific IP
sudo ufw allow from YOUR_FRIEND_IP to any port 8000
```

### 3. Test Local Access
```bash
# Your friend runs this to test
curl http://localhost:8000/health

# You test from your computer
curl http://FRIEND_LOCAL_IP:8000/health
```

## Option 2: Cloud Deployment (Recommended for Production)

### Using Replit (Free Option)
1. Go to replit.com
2. Create new Python repl
3. Upload your `main.py` file
4. Install dependencies in Shell:
   ```bash
   pip install fastapi uvicorn cupy-cuda11x numpy pandas
   ```
5. Run your app:
   ```bash
   python main.py
   ```
6. Replit will provide a public URL like: `https://your-repl-name.your-username.repl.co`

### Using Google Colab (Free with GPU)
1. Open Google Colab
2. Enable GPU runtime: Runtime → Change runtime type → GPU
3. Install dependencies:
   ```python
   !pip install fastapi uvicorn pyngrok
   !pip install cupy-cuda11x numpy pandas
   ```
4. Create tunnel with ngrok:
   ```python
   from pyngrok import ngrok
   import uvicorn
   
   # Start ngrok tunnel
   public_url = ngrok.connect(8000)
   print(f"Public URL: {public_url}")
   
   # Start your FastAPI app
   uvicorn.run(app, host="0.0.0.0", port=8000)
   ```

### Using Railway (Easy Deployment)
1. Sign up at railway.app
2. Connect your GitHub repo with the backend code
3. Railway auto-deploys and provides a public URL
4. Add environment variables in Railway dashboard

## Option 3: Secure Tunnel (Recommended for Testing)

### Using ngrok (Free)
1. Download ngrok from ngrok.com
2. Start your backend:
   ```bash
   python main.py
   ```
3. In another terminal:
   ```bash
   ngrok http 8000
   ```
4. ngrok will provide a public URL like: `https://abc123.ngrok.io`
5. Share this URL with your friend

## Security Considerations

### For Production Use:
1. **API Authentication**: Add API keys
   ```python
   from fastapi.security import APIKeyHeader
   
   api_key_header = APIKeyHeader(name="X-API-Key")
   
   @app.post("/execute/cupy")
   async def execute_cupy(request: ComputeRequest, api_key: str = Depends(api_key_header)):
       if api_key != "your-secret-key":
           raise HTTPException(status_code=401, detail="Invalid API key")
       # ... rest of code
   ```

2. **CORS Configuration**: Restrict origins
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://your-firebase-app.web.app"],  # Specific domain
       allow_credentials=True,
       allow_methods=["POST", "GET"],
       allow_headers=["*"],
   )
   ```

3. **Rate Limiting**: Add request limits
   ```python
   from slowapi import Limiter
   
   limiter = Limiter(key_func=lambda: "global")
   
   @app.post("/execute/cupy")
   @limiter.limit("10/minute")
   async def execute_cupy(request: Request, compute_request: ComputeRequest):
       # ... code
   ```

## Testing the Complete Setup

### 1. Health Check
```bash
curl https://your-backend-url.com/health
```

### 2. NumPy Execution Test
```bash
curl -X POST "https://your-backend-url.com/execute/numpy" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import numpy as np; result = np.array([1,2,3]).sum(); print(f\"Result: {result}\")",
    "operation_type": "numpy"
  }'
```

### 3. CuPy Execution Test
```bash
curl -X POST "https://your-backend-url.com/execute/cupy" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import cupy as cp; result = cp.array([1,2,3]).sum(); print(f\"GPU Result: {result}\")",
    "operation_type": "cupy"
  }'
```

## What You Need to Share with Your Friend

1. **This setup guide**
2. **Your Firebase app URL** (when you deploy)
3. **Expected request format** (the JSON structure)
4. **Any API keys** (if you implement authentication)

## Ready Checklist for Your Friend

- [ ] Python environment set up
- [ ] FastAPI backend running
- [ ] Network access configured (firewall/port)
- [ ] Public URL obtained (local IP, cloud, or tunnel)
- [ ] Health endpoint responding
- [ ] Test execution endpoints working
- [ ] URL shared with you for frontend configuration
