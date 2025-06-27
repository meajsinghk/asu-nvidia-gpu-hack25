import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import {ollama} from '@genkit-ai/ollama';

// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set. Please provide your API key in the .env file.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT


// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
/*
export const ai = genkit({
  plugins: [
    ollama({
      models: [
        {
          name: 'llama3', // Specify the local models you have
          type: 'generate',
        },
        {
          name: 'mistral',
          type: 'generate',
        }
      ],
      serverAddress: 'http://127.0.0.1:11434', // Default Ollama address
    }),
  ],
   telemetry: {
    instrumentor: 'open-telemetry',
    logger: 'open-telemetry',
  },
});
*/
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
