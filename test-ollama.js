// Quick test to verify Ollama integration
const { genkit } = require('genkit');
const { ollama } = require('genkitx-ollama');

const SOL_BACKEND_URL = process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://localhost:8000';
const OLLAMA_BASE_URL = `${SOL_BACKEND_URL.replace(':8000', ':11434')}`;

console.log('Testing Ollama connection to:', OLLAMA_BASE_URL);

const ai = genkit({
  plugins: [
    ollama({
      models: [{ name: 'llama3' }, { name: 'qwen3:14b' }],
      serverAddress: OLLAMA_BASE_URL,
    }),
  ],
});

async function testOllama() {
  try {
    console.log('🧪 Testing Ollama integration...');
    
    const { text } = await ai.generate({
      prompt: 'Say hello in one sentence.',
      model: 'ollama/llama3',
    });
    
    console.log('✅ Ollama test successful!');
    console.log('Response:', text);
  } catch (error) {
    console.error('❌ Ollama test failed:', error.message);
  }
}

testOllama();
