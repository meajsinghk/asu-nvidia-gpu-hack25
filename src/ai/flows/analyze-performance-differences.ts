// src/ai/flows/analyze-performance-differences.ts
'use server';

/**
 * @fileOverview An AI agent for analyzing performance differences between NumPy and CuPy code.
 *
 * - analyzePerformanceDifferences - A function that handles the analysis of performance differences.
 * - AnalyzePerformanceInput - The input type for the analyzePerformanceDifferences function.
 * - AnalyzePerformanceOutput - The return type for the analyzePerformanceDifferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePerformanceInputSchema = z.object({
  numpyCode: z.string().describe('The NumPy code that was executed.'),
  cupyCode: z.string().describe('The CuPy code that was executed.'),
  numpyExecutionResult: z.string().describe('The execution result of the NumPy code.'),
  cupyExecutionResult: z.string().describe('The execution result of the CuPy code.'),
  gpuMetrics: z.string().describe('Real-time GPU metrics (utilization, memory usage, temperature) as a JSON string.'),
});
export type AnalyzePerformanceInput = z.infer<typeof AnalyzePerformanceInputSchema>;

const AnalyzePerformanceOutputSchema = z.object({
  analysis: z.string().describe('An AI-powered analysis of the performance differences between NumPy and CuPy code, considering the execution results and GPU metrics.'),
});
export type AnalyzePerformanceOutput = z.infer<typeof AnalyzePerformanceOutputSchema>;

export async function analyzePerformanceDifferences(input: AnalyzePerformanceInput): Promise<AnalyzePerformanceOutput> {
  return analyzePerformanceDifferencesFlow(input);
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

const prompt = ai.definePrompt({
  name: 'analyzePerformanceDifferencesPrompt',
  model: model,
  input: {schema: AnalyzePerformanceInputSchema},
  output: {schema: AnalyzePerformanceOutputSchema},
  prompt: `You are an AI performance analysis expert. You are analyzing the performance differences between NumPy (CPU) and CuPy (GPU) code execution.

Here is the NumPy code that was executed:
\`\`\`
{{numpyCode}}
\`\`\`

Here is the CuPy code that was executed:
\`\`\`
{{cupyCode}}
\`\`\`

Here is the execution result of the NumPy code:
\`\`\`
{{numpyExecutionResult}}
\`\`\`

Here is the execution result of the CuPy code:
\`\`\`
{{cupyExecutionResult}}
\`\`\`

Here are the real-time GPU metrics (utilization, memory usage, temperature):
\`\`\`
{{gpuMetrics}}
\`\`\`

Based on the above information, provide a detailed analysis of the performance differences between NumPy and CuPy code, explaining the impact of using GPU acceleration. Focus on:

*   Identifying performance bottlenecks in both codes.
*   Explaining how GPU metrics correlate with the observed performance differences.
*   Suggesting optimization strategies for both NumPy and CuPy codes.
*   Indicating the conditions when the CuPy will significantly outperform NumPy code.
`,
});

const analyzePerformanceDifferencesFlow = ai.defineFlow(
  {
    name: 'analyzePerformanceDifferencesFlow',
    inputSchema: AnalyzePerformanceInputSchema,
    outputSchema: AnalyzePerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
