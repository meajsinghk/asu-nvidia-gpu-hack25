// API service for communicating with Sol backend
export class SolBackendService {
  private baseUrl: string;

  constructor(backendUrl: string) {
    this.baseUrl = backendUrl; // e.g., "http://192.168.1.100:8000" or cloud URL
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
      throw new Error(`HTTP error! status: ${response.status}`);
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async queryRAG(query: string) {
    const response = await fetch(`${this.baseUrl}/rag/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: '',
        operation_type: 'rag',
        parameters: { query }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
