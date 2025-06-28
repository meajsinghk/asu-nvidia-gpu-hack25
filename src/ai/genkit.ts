import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai';
import {ollama} from 'genkitx-ollama';

// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI

// Get Sol backend URL from environment
const SOL_BACKEND_URL = process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://localhost:8000';
const OLLAMA_BASE_URL = `${SOL_BACKEND_URL.replace(':8000', ':11434')}`;

export const ai = genkit({
  plugins: [
    ollama({
      models: [
        { name: 'llama3.1', type: 'generate' },
        { name: 'llama3', type: 'generate' }, 
        { name: 'llama2', type: 'generate' },
        { name: 'qwen2:7b', type: 'generate' },
        { name: 'gemma:7b', type: 'generate' }
      ],
      serverAddress: OLLAMA_BASE_URL,
    }),
  ],
});

// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI

