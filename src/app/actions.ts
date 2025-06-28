'use server';

import { solRag } from '@/lib/sol-rag';
import { browserLLM } from '@/lib/browser-llm';

// Sol Backend Integration
const SOL_BACKEND_URL = process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://localhost:8000';

// Type definitions
export interface AnalyzePerformanceInput {
  numpyCode: string;
  cupyCode: string;
  numpyExecutionResult: string;
  cupyExecutionResult: string;
  gpuMetrics: string;
}

export interface MultiverseInput {
  pythonCode: string;
}

export interface MultiverseOutput {
  universes?: Array<{
    universeId: string;
    parameters: string;
    narrative: string;
    simulatedMetrics: any;
  }>;
  error?: string;
}

export interface LabChatInput {
  message: string;
  context: any;
  history: Array<{role: string; content: string}>;
}

export type LabChatOutput = string;

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
    // Try Sol's RAG system first
    console.log('🚀 Attempting Sol RAG analysis...');
    const solAnalysis = await solRag.getPerformanceAnalysis({
      numpyCode: input.numpyCode,
      cupyCode: input.cupyCode,
      numpyResult: input.numpyExecutionResult,
      cupyResult: input.cupyExecutionResult,
      gpuMetrics: input.gpuMetrics,
    });

    if (solAnalysis && !solAnalysis.includes('Sol RAG Unavailable')) {
      console.log('✅ Sol RAG analysis successful');
      return solAnalysis;
    }

    // Fallback to browser LLM analysis
    console.log('🔄 Falling back to browser LLM analysis...');
    try {
      const analysisPrompt = `Analyze the performance differences between NumPy (CPU) and CuPy (GPU) implementations:

NumPy Code:
${input.numpyCode}

CuPy Code:  
${input.cupyCode}

NumPy Results: ${input.numpyExecutionResult}
CuPy Results: ${input.cupyExecutionResult}
GPU Metrics: ${input.gpuMetrics}

Provide detailed analysis of GPU acceleration benefits and performance insights.`;

      const response = await browserLLM.answerQuestion(analysisPrompt);
      return response.content;
    } catch (browserError) {
      console.log('Browser LLM failed, using basic analysis...');
      return generateBasicAnalysis(input);
    }
  } catch (error: any) {
    console.error("AI analysis failed:", error);
    
    // Check if it's a model not found error
    if (error.message?.includes("Model") && error.message?.includes("not found")) {
      return `## AI Analysis Temporarily Unavailable

**Issue**: Local Ollama models are not available on this system.

**What happened**:
- ✅ Sol RAG connection attempted (timeout - normal if Sol backend is busy)
- ❌ Local Ollama fallback failed (models not installed)

**To fix this**, one of these solutions is needed:
1. **Install Ollama models**: Run \`ollama pull llama3.1\` or \`ollama pull llama2\`
2. **Start Sol's Ollama service**: Ensure Sol's backend has Ollama running
3. **Wait for Sol RAG**: Sol's backend may need the \`/rag/query\` endpoint implemented

**Results Summary**:
- NumPy (CPU): ${input.numpyExecutionResult}
- CuPy (GPU): ${input.cupyExecutionResult}

The code execution worked fine - only the AI analysis is temporarily unavailable.`;
    }
    
    // Final fallback - try Sol RAG one more time with simplified query
    try {
      const simplifiedAnalysis = await solRag.chat({
        message: `Compare NumPy vs CuPy performance: NumPy got ${input.numpyExecutionResult}, CuPy got ${input.cupyExecutionResult}. What are the main differences?`
      });
      
      if (simplifiedAnalysis?.response) {
        return simplifiedAnalysis.response;
      }
    } catch (fallbackError) {
      console.error("Sol fallback failed:", fallbackError);
    }

    const errorMessage = error.message || "An unknown error occurred";
    return `## Analysis Error

Unable to generate AI analysis at this time. Please check:

1. **Sol Backend Connection**: Ensure Sol's backend is running at ${SOL_BACKEND_URL}
2. **Ollama Models**: Install models with \`ollama pull llama3.1\` or \`ollama pull llama2\`
3. **Network Connectivity**: Check firewall and network settings

**Error Details**: ${errorMessage}

**Basic Performance Comparison**:
- NumPy (CPU): ${input.numpyExecutionResult}
- CuPy (GPU): ${input.cupyExecutionResult}

**Quick Analysis**: ${generateBasicAnalysis(input)}

Try refreshing the page or checking the Sol backend status.`;
  }
}

// Simple rule-based analysis when AI is unavailable
function generateBasicAnalysis(input: AnalyzePerformanceInput): string {
  const numpyResult = input.numpyExecutionResult;
  const cupyResult = input.cupyExecutionResult;
  
  // Try to extract timing information
  const numpyTime = extractExecutionTime(numpyResult);
  const cupyTime = extractExecutionTime(cupyResult);
  
  if (numpyTime && cupyTime && numpyTime > cupyTime) {
    const speedup = (numpyTime / cupyTime).toFixed(2);
    return `CuPy appears to be ${speedup}x faster than NumPy. GPU acceleration is providing significant performance benefits for this operation.`;
  } else if (numpyTime && cupyTime && cupyTime > numpyTime) {
    return `NumPy appears faster for this operation. This may be due to small data sizes where GPU overhead exceeds benefits, or the operation may not be well-suited for GPU acceleration.`;
  } else {
    return `Both implementations completed successfully. For detailed performance analysis, ensure AI models are available.`;
  }
}

// Helper function to extract timing from execution results
function extractExecutionTime(result: string): number | null {
  const timeMatch = result.match(/(\d+(?:\.\d+)?)\s*(?:ms|milliseconds|s|seconds)/i);
  if (timeMatch) {
    const value = parseFloat(timeMatch[1]);
    const unit = timeMatch[2]?.toLowerCase();
    return unit?.startsWith('s') ? value * 1000 : value; // Convert to ms
  }
  return null;
}

export async function getMultiverseAnalysis(input: MultiverseInput): Promise<MultiverseOutput | { error: string }> {
  try {
    // Try Sol's RAG system first
    console.log('🌌 Attempting Sol RAG multiverse analysis...');
    const solResult = await solRag.getMultiverseAnalysis(input.pythonCode);
    
    if (solResult && !solResult.error) {
      console.log('✅ Sol RAG multiverse analysis successful');
      return solResult;
    }

    // Fallback to browser LLM multiverse analysis
    console.log('🔄 Falling back to browser LLM multiverse analysis...');
    try {
      const multiversePrompt = `Simulate GPU code execution across multiple parallel universes with different parameters:

Code:
${input.pythonCode}

Generate 3 different universe scenarios with varying GPU configurations and performance outcomes.`;

      const response = await browserLLM.answerQuestion(multiversePrompt);
      
      return {
        universes: [
          {
            universeId: "Universe Alpha",
            parameters: "High-Performance Configuration",
            narrative: response.content,
            simulatedMetrics: {
              executionTime: "0.12s",
              warpOccupancy: "95%",
              threadDivergence: "Minimal"
            }
          },
          {
            universeId: "Universe Beta", 
            parameters: "Balanced Configuration",
            narrative: "Alternative GPU configuration with moderate performance characteristics.",
            simulatedMetrics: {
              executionTime: "0.18s",
              warpOccupancy: "78%",
              threadDivergence: "Low"
            }
          }
        ]
      };
    } catch (browserError) {
      console.log('Browser LLM failed, using template multiverse...');
      return {
        universes: [
          {
            universeId: "Universe Template",
            parameters: "Default Configuration",
            narrative: "Template multiverse analysis - browser LLM unavailable.",
            simulatedMetrics: {
              executionTime: "0.15s",
              warpOccupancy: "80%",
              threadDivergence: "Moderate"
            }
          }
        ]
      };
    }
  } catch (error: any) {
    console.error("Multiverse analysis failed:", error);
    const errorMessage = error.message || "An unknown error occurred";
    return { 
      error: `Multiverse simulation failed: ${errorMessage}. Sol's RAG system may be unavailable. Check Sol backend connection and try again.`
    };
  }
}

export async function getLabChatResponseAction(input: LabChatInput): Promise<LabChatOutput> {
  try {
    // Try Sol's RAG system first
    const solResponse = await solRag.getChatResponse({
      message: input.message,
      context: input.context,
      history: input.history,
    });

    if (solResponse && !solResponse.includes('having trouble connecting')) {
      return solResponse;
    }

    // Fallback to browser LLM chat
    console.log('🔄 Falling back to browser LLM chat...');
    try {
      const response = await browserLLM.answerQuestion(input.message, JSON.stringify(input.context));
      return response.content;
    } catch (browserError) {
      console.log('Browser LLM failed, using template response...');
      return `I'm having trouble connecting to both Sol's RAG system and the browser LLM. Here's a basic response about GPU computing:

**Your Question**: ${input.message}

**General GPU Computing Guidance**:
- GPUs excel at parallel processing of large datasets
- Consider data size, memory transfers, and operation complexity
- Monitor GPU metrics like utilization and memory usage
- CuPy typically outperforms NumPy for large arrays and parallel operations

For more detailed analysis, please ensure the Sol backend is running or try refreshing to load the browser LLM models.`;
    }
  } catch (error: any) {
    console.error("AI chat failed:", error);
    const errorMessage = error.message || "An unknown error occurred";
    return `Error: Unable to get response from AI system. Sol's RAG may be unavailable. ${errorMessage}`;
  }
}
