'use server';

/**
 * @fileOverview An AI agent for chatting about GPU performance analysis.
 */

import {ai} from '@/ai/genkit';
import {z, type Message} from 'genkit';

// Define the schema for a single chat message
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;


const LabChatContextSchema = z.object({
  numpyCode: z.string(),
  cupyCode: z.string(),
  numpyExecutionResult: z.string().nullable(),
  cupyExecutionResult: z.string().nullable(),
  gpuMetrics: z.string().nullable(),
  aiAnalysis: z.string().nullable(),
});

const LabChatInputSchema = z.object({
  history: z.array(ChatMessageSchema),
  message: z.string().describe('The latest message from the user.'),
  context: LabChatContextSchema,
});
export type LabChatInput = z.infer<typeof LabChatInputSchema>;

// The output is just a string, no need for a complex object
const LabChatOutputSchema = z.string();
export type LabChatOutput = z.infer<typeof LabChatOutputSchema>;


export async function getLabChatResponse(input: LabChatInput): Promise<LabChatOutput> {
  return labChatFlow(input);
}

// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
// THE CODE HERE FOR SIMULATION. COMMENT IT OUT
const model = 'googleai/gemini-1.5-flash-latest';
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
const model = 'llama3'; // or your preferred ollama model
*/
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND
// De-COMMENT IT OUT TO MAKE YOUR LOCAL LLM TO WORK ON YOUR CUSTOM FRONTEND

const labChatFlow = ai.defineFlow(
  {
    name: 'labChatFlow',
    inputSchema: LabChatInputSchema,
    outputSchema: LabChatOutputSchema,
  },
  async ({ history, message, context }) => {
    const systemPrompt = `You are an expert AI assistant embedded in a GPU performance analysis lab. Your purpose is to help users understand the provided code, results, and performance metrics.

You have access to the full context of the user's lab environment. Use this information to answer questions about the code, performance differences, GPU metrics, and the previous AI analysis.

Keep your answers brief and to the point, ideally 30 words or less, unless the user asks for a detailed explanation.

When asked to write or modify code, you MUST wrap the code in markdown code blocks (e.g., \`\`\`python ... \`\`\`). This is critical for the UI to render it correctly with "Push to CPU/GPU" buttons.

Be concise, helpful, and focus on GPU and CPU programming concepts.

Here is the context for the current lab session:
---
NumPy (CPU) Code:
\`\`\`python
${context.numpyCode}
\`\`\`

CuPy (GPU) Code:
\`\`\`python
${context.cupyCode}
\`\`\`

NumPy Execution Result:
\`\`\`
${context.numpyExecutionResult || 'Not yet executed.'}
\`\`\`

CuPy Execution Result:
\`\`\`
${context.cupyExecutionResult || 'Not yet executed.'}
\`\`\`

GPU Metrics:
\`\`\`json
${context.gpuMetrics || 'Not available.'}
\`\`\`

Previous AI Analysis:
${context.aiAnalysis || 'Not yet generated.'}
---
`;

    // Map the application's chat history to the format Genkit expects.
    // We remove the initial pre-canned assistant message from the history sent to the model.
    const genkitHistory: Message[] = history.slice(1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      content: [{text: msg.content}],
    }));
    
    const response = await ai.generate({
      model: model,
      history: genkitHistory,
      prompt: `${systemPrompt}\n\nBased on the context and history, answer the following user message:\n${message}`,
    });

    return response.text;
  }
);
