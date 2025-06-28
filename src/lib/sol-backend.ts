// API service for communicating with Sol backend
export class SolBackendService {
  private baseUrl: string;

  constructor(backendUrl: string) {
    this.baseUrl = backendUrl; // e.g., "http://192.168.1.100:8000"
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout for faster failure detection
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Sol backend connection timeout - backend may be offline');
      }
      throw new Error(`Sol backend unreachable: ${error.message}`);
    }
  }

  async executeNumPy(code: string) {
    const response = await fetch(`${this.baseUrl}/execute/numpy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        operation_type: 'numpy'
      })
    });

    if (!response.ok) {
      throw new Error(`NumPy execution failed: ${response.status}`);
    }

    return response.json();
  }

  async executeCuPy(code: string) {
    const response = await fetch(`${this.baseUrl}/execute/cupy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        operation_type: 'cupy'
      })
    });

    if (!response.ok) {
      throw new Error(`CuPy execution failed: ${response.status}`);
    }

    return response.json();
  }

  async analyzeData(code: string) {
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        operation_type: 'analysis'
      })
    });

    if (!response.ok) {
      throw new Error(`Data analysis failed: ${response.status}`);
    }

    return response.json();
  }

  async queryRAG(query: string) {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: query
      })
    });

    if (!response.ok) {
      throw new Error(`Chat query failed: ${response.status}`);
    }

    return response.json();
  }

  async getPerformanceMetrics() {
    const response = await fetch(`${this.baseUrl}/performance`);
    if (!response.ok) {
      throw new Error(`Performance metrics failed: ${response.status}`);
    }
    return response.json();
  }

  async checkHealth() {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Usage in your components
const solBackend = new SolBackendService('http://YOUR_FRIEND_IP:8000');
