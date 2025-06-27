'use server';

import { analyzePerformanceDifferences } from '@/ai/flows/analyze-performance-differences';
import type { AnalyzePerformanceInput } from '@/ai/flows/analyze-performance-differences';
import { runInMultiverse } from '@/ai/flows/multiverse-flow';
import type { MultiverseInput, MultiverseOutput } from '@/ai/flows/multiverse-flow';
import { getLabChatResponse } from '@/ai/flows/lab-chat-flow';
import type { LabChatInput, LabChatOutput } from '@/ai/flows/lab-chat-flow';

// Sol Backend Integration
const SOL_BACKEND_URL = process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://localhost:8000';

export async function executeOnSol(code: string, type: 'numpy' | 'cupy') {
  try {
    const response = await fetch(`${SOL_BACKEND_URL}/execute/${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        operation_type: type
      }),
    });

    if (!response.ok) {
      throw new Error(`Sol backend error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Sol ${type} execution failed:`, error);
    return { error: error.message || "Failed to execute on Sol backend" };
  }
}

export async function getAiAnalysis(input: AnalyzePerformanceInput): Promise<string> {
  try {
    const result = await analyzePerformanceDifferences(input);
    return result.analysis;
  } catch (error: any) {
    console.error("AI analysis failed:", error);
    const errorMessage = error.message || "An unknown error occurred";
    return `An error occurred while generating the AI analysis: ${errorMessage}. The model may be unavailable or the input may be invalid. Please check the console for more details and try again.`;
  }
}

export async function getMultiverseAnalysis(input: MultiverseInput): Promise<MultiverseOutput | { error: string }> {
  try {
    const result = await runInMultiverse(input);
    return result;
  } catch (error: any) {
    console.error("Multiverse analysis failed:", error);
    const errorMessage = error.message || "An unknown error occurred";
    return { error: `An error occurred while running the multiverse simulation: ${errorMessage}. The model may be unavailable or the input may be invalid. Please check the console for more details and try again.` };
  }
}

export async function getLabChatResponseAction(input: LabChatInput): Promise<LabChatOutput> {
  try {
    const result = await getLabChatResponse(input);
    return result;
  } catch (error: any) {
    console.error("AI chat failed:", error);
    const errorMessage = error.message || "An unknown error occurred";
    return `An error occurred while communicating with the AI: ${errorMessage}. Please check the console and try again.`;
  }
}
