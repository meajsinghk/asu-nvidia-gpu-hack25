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

// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
const model = 'llama3'; // Sol's Ollama model
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI
// USING SOL'S OLLAMA RAG INSTEAD OF GOOGLE GEMINI


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

Based on the context and conversation history, answer the following user message: ${message}`;

    // Convert chat history to a simple conversation string for context
    const conversationHistory = history.slice(1).map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n');

    const fullPrompt = conversationHistory 
      ? `Previous conversation:\n${conversationHistory}\n\n${systemPrompt}`
      : systemPrompt;

    const response = await ai.generate({
      model: model,
      prompt: fullPrompt,
    });

    return response.text;
  }
);
