// Create this file to centralize your API endpoints

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const apiEndpoints = {
  health: `${API_BASE_URL}/health`,
  executeNumpy: `${API_BASE_URL}/execute/numpy`,
  executeCupy: `${API_BASE_URL}/execute/cupy`,
  analyze: `${API_BASE_URL}/analyze`,
  chat: `${API_BASE_URL}/chat`,
  performance: `${API_BASE_URL}/performance`
};

export default API_BASE_URL;