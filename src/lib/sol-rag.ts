/**
 * Sol RAG Integration Service
 * 
 * This service handles communication with Sol's backend
 * for AI-powered analysis and chat functionality.
 * Includes intelligent fallback to browser-based LLM with code generation.
 */

import { browserLLM } from './browser-llm';

const SOL_BACKEND_URL = process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://localhost:8000';

export interface SolRagQuery {
  query: string;
  max_results?: number;
  context?: string;
}

export interface SolRagResponse {
  status: string;
  question: string;
  answer: string;
  sources: string[];
  confidence: number;
  execution_time: number;
  metrics: any;
}

export interface SolChatRequest {
  message: string;
  context?: string;
}

export interface SolChatResponse {
  status: string;
  message: string;
  response: string;
  context: string;
  gpu_accelerated: boolean;
  dataset_info: any;
}

class SolRagService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = SOL_BACKEND_URL;
  }

  /**
   * Check if Sol's RAG system is available
   */
  async checkRagAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const health = await response.json();
        return health.rag_initialized || false;
      }
      return false;
    } catch (error) {
      console.log('Sol RAG availability check failed:', error);
      return false;
    }
  }

  /**
   * Query Sol's RAG system for intelligent analysis
   */
  async ragQuery(query: SolRagQuery): Promise<SolRagResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/rag/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.query,
          max_results: query.max_results || 5,
        }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Sol RAG query failed:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Sol RAG query error:', error);
      return null;
    }
  }

  /**
   * Chat with Sol's AI system about parking data
   */
  async chat(request: SolChatRequest): Promise<SolChatResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: request.message,
        }),
      });

      if (response.ok) {
        return await response.json();
      } else {
        console.error('Sol chat failed:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Sol chat error:', error);
      return null;
    }
  }

  /**
   * Get analysis from Sol's RAG system for GPU performance analysis
   */
  async getPerformanceAnalysis(params: {
    numpyCode: string;
    cupyCode: string;
    numpyResult: string;
    cupyResult: string;
    gpuMetrics: string;
  }): Promise<string> {
    try {
      // First try the RAG endpoint if available
      const ragQuery = `Analyze the performance differences between this NumPy and CuPy code:
      
NumPy Code:
${params.numpyCode}

CuPy Code:
${params.cupyCode}

NumPy Results:
${params.numpyResult}

CuPy Results:
${params.cupyResult}

GPU Metrics:
${params.gpuMetrics}

Please provide a detailed analysis of the performance differences and explain the GPU acceleration benefits.`;

      const ragResponse = await this.ragQuery({ query: ragQuery });
      
      if (ragResponse && ragResponse.answer) {
        return ragResponse.answer;
      }

      // Fallback to chat endpoint
      const chatResponse = await this.chat({
        message: `Analyze performance differences between NumPy (${params.numpyResult}) and CuPy (${params.cupyResult}) with GPU metrics: ${params.gpuMetrics}`,
      });

      if (chatResponse && chatResponse.response) {
        return chatResponse.response;
      }

      // Use browser-based LLM for intelligent analysis
      console.log('🔄 Using browser LLM for performance analysis...');
      try {
        const analysisPrompt = `Analyze the performance differences between NumPy (CPU) and CuPy (GPU) implementations:

NumPy Results: ${params.numpyResult}
CuPy Results: ${params.cupyResult}
GPU Metrics: ${params.gpuMetrics}

Provide detailed analysis of GPU acceleration benefits and performance insights.`;

        const response = await browserLLM.answerQuestion(analysisPrompt);
        return response.content;
      } catch (error) {
        console.log('Browser LLM failed, using template analysis...');
        return this.generateTemplateAnalysis(params);
      }
    } catch (error) {
      console.error('Sol performance analysis failed:', error);
      
      // Use browser LLM on any error
      console.log('🔄 Falling back to browser LLM...');
      try {
        const analysisPrompt = `Analyze the performance differences between NumPy (CPU) and CuPy (GPU) implementations:

NumPy Results: ${params.numpyResult}
CuPy Results: ${params.cupyResult}
GPU Metrics: ${params.gpuMetrics}

Provide detailed analysis of GPU acceleration benefits and performance insights.`;

        const response = await browserLLM.answerQuestion(analysisPrompt);
        return response.content;
      } catch (error) {
        console.log('Browser LLM failed, using template analysis...');
        return this.generateTemplateAnalysis(params);
      }
    }
  }

  /**
   * Get multiverse analysis from Sol's RAG system
   */
  async getMultiverseAnalysis(pythonCode: string): Promise<any> {
    try {
      const ragQuery = `Simulate the execution of this GPU code across multiple parallel universes with different GPU parameters:

${pythonCode}

For each universe, vary parameters like clock speeds, memory allocation, warp sizes, and cache behavior. Explain the performance outcomes and why they occurred.`;

      const ragResponse = await this.ragQuery({ query: ragQuery });
      
      if (ragResponse && ragResponse.answer) {
        // Try to parse the response as structured data
        try {
          return JSON.parse(ragResponse.answer);
        } catch {
          // If not JSON, return as narrative
          return {
            universes: [
              {
                universeId: "Universe 1",
                parameters: "Standard Configuration",
                narrative: ragResponse.answer,
                simulatedMetrics: {
                  executionTime: "0.15s",
                  warpOccupancy: "85%",
                  threadDivergence: "Low"
                }
              }
            ]
          };
        }
      }

      return { error: "Sol RAG system unavailable for multiverse analysis" };
    } catch (error) {
      console.error('Sol multiverse analysis failed:', error);
      
      // Use browser LLM for multiverse simulation
      console.log('🔄 Using browser LLM for multiverse analysis...');
      try {
        const response = await browserLLM.answerQuestion(
          `Simulate GPU code execution across multiple parallel universes with different parameters: ${pythonCode}`,
          'multiverse simulation with varying GPU configurations'
        );
        
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
          ],
          metadata: {
            source: `Browser LLM (${response.modelUsed})`,
            confidence: response.confidence,
            canGenerateCode: true
          }
        };
      } catch (error) {
        console.log('Browser LLM failed, using template multiverse...');
        return this.generateTemplateMultiverse(pythonCode);
      }
    }
  }

  /**
   * Get chat response from Sol's RAG system
   */
  async getChatResponse(params: {
    message: string;
    context: any;
    history: any[];
  }): Promise<string> {
    try {
      // First try RAG endpoint for more intelligent responses
      const ragQuery = `Context: ${JSON.stringify(params.context)}
      
Previous conversation: ${params.history.map(h => `${h.role}: ${h.content}`).join('\n')}

User question: ${params.message}

Please provide a helpful response about GPU programming and performance analysis.`;

      const ragResponse = await this.ragQuery({ query: ragQuery });
      
      if (ragResponse && ragResponse.answer) {
        return ragResponse.answer;
      }

      // Fallback to chat endpoint
      const chatResponse = await this.chat({ message: params.message });
      
      if (chatResponse && chatResponse.response) {
        return chatResponse.response;
      }

      // Use browser LLM for chat
      console.log('🔄 Using browser LLM for chat response...');
      try {
        const response = await browserLLM.answerQuestion(params.message, 
          `Context: ${JSON.stringify(params.context)}`);
        return response.content;
      } catch (error) {
        console.log('Browser LLM failed, using template response...');
        return this.generateTemplateResponse(params.message);
      }
      
    } catch (error) {
      console.error('Sol chat response failed:', error);
      
      // Use browser LLM on error
      console.log('🔄 Falling back to browser LLM for chat...');
      try {
        const response = await browserLLM.answerQuestion(params.message);
        return response.content;
      } catch (error) {
        console.log('Browser LLM failed, using template response...');
        return this.generateTemplateResponse(params.message);
      }
    }
  }

  /**
   * Generate template-based performance analysis when LLM is unavailable
   */
  private generateTemplateAnalysis(params: {
    numpyCode: string;
    cupyCode: string;
    numpyResult: string;
    cupyResult: string;
    gpuMetrics?: string;
  }): string {
    const numpyTime = this.extractExecutionTime(params.numpyResult);
    const cupyTime = this.extractExecutionTime(params.cupyResult);
    
    let performanceInsight = "";
    if (numpyTime && cupyTime) {
      if (cupyTime < numpyTime) {
        const speedup = (numpyTime / cupyTime).toFixed(2);
        performanceInsight = `🚀 **GPU Acceleration Success:** CuPy achieved ${speedup}x speedup over NumPy!`;
      } else if (numpyTime < cupyTime) {
        const slowdown = (cupyTime / numpyTime).toFixed(2);
        performanceInsight = `⚠️ **CPU Performance:** NumPy was ${slowdown}x faster. Consider larger datasets for GPU benefits.`;
      } else {
        performanceInsight = `📊 **Similar Performance:** Both implementations performed comparably.`;
      }
    } else {
      performanceInsight = `📈 **Analysis Complete:** Both implementations executed successfully.`;
    }

    return `## Performance Analysis (Template Mode)

${performanceInsight}

**NumPy (CPU) Results:**
${params.numpyResult}

**CuPy (GPU) Results:** 
${params.cupyResult}

**Key Insights:**
- GPU acceleration effectiveness depends on data size and operation complexity
- Memory transfer overhead can impact small dataset performance
- Parallel operations typically show the greatest GPU advantages

**Recommendations:**
- Test with larger datasets for more pronounced GPU benefits
- Monitor GPU utilization during CuPy execution
- Consider the CPU-GPU memory transfer costs

*Note: This is a template-based analysis. For more sophisticated insights, ensure the browser LLM is loaded.*`;
  }

  /**
   * Generate template multiverse analysis
   */
  private generateTemplateMultiverse(pythonCode: string): any {
    return {
      universes: [
        {
          universeId: "Universe Alpha",
          parameters: "High-Performance Configuration",
          narrative: "In this universe, GPU operates with optimal clock speeds and maximum memory bandwidth. The code executes with minimal thread divergence and high warp occupancy.",
          simulatedMetrics: {
            executionTime: "0.12s",
            warpOccupancy: "95%",
            threadDivergence: "Minimal",
            memoryBandwidth: "95%"
          }
        },
        {
          universeId: "Universe Beta",
          parameters: "Balanced Configuration", 
          narrative: "A balanced universe where GPU resources are moderately allocated. Performance is steady with good throughput and reasonable power consumption.",
          simulatedMetrics: {
            executionTime: "0.18s",
            warpOccupancy: "78%",
            threadDivergence: "Low",
            memoryBandwidth: "82%"
          }
        },
        {
          universeId: "Universe Gamma",
          parameters: "Resource-Constrained Configuration",
          narrative: "In this constrained universe, limited GPU resources affect performance. Higher thread divergence and lower occupancy impact execution speed.",
          simulatedMetrics: {
            executionTime: "0.25s", 
            warpOccupancy: "65%",
            threadDivergence: "Moderate",
            memoryBandwidth: "70%"
          }
        }
      ],
      metadata: {
        source: "Template Multiverse Generator",
        confidence: 0.6,
        canGenerateCode: true
      }
    };
  }

  /**
   * Generate template chat response
   */
  private generateTemplateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('code') || lowerMessage.includes('generate') || lowerMessage.includes('example')) {
      return `## Code Generation Request

I can help you generate NumPy and CuPy code examples. Here's a basic template:

**NumPy (CPU) Example:**
\`\`\`python
import numpy as np
import time

# Your NumPy implementation here
data = np.random.random((1000, 1000))
start = time.time()
result = np.dot(data, data.T)
cpu_time = time.time() - start
print(f"CPU time: {cpu_time*1000:.2f} ms")
\`\`\`

**CuPy (GPU) Example:**
\`\`\`python
import cupy as cp
import time

# Your CuPy implementation here  
data = cp.random.random((1000, 1000))
start = time.time()
result = cp.dot(data, data.T)
cp.cuda.Stream.null.synchronize()
gpu_time = time.time() - start
print(f"GPU time: {gpu_time*1000:.2f} ms")
\`\`\`

For more sophisticated code generation, please ensure the browser LLM is loaded.`;
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('gpu') || lowerMessage.includes('speed')) {
      return `## GPU Performance Insights

**Key Performance Factors:**
- **Data Size**: Larger datasets typically show greater GPU advantages
- **Operation Type**: Parallel operations (matrix multiplication, element-wise) benefit most
- **Memory Access**: Coalesced memory access patterns improve performance
- **Transfer Overhead**: CPU-GPU data transfers can impact small dataset performance

**Optimization Tips:**
- Use appropriate data types (float32 vs float64)
- Minimize CPU-GPU memory transfers
- Leverage GPU-optimized libraries (cuBLAS, cuFFT)
- Monitor GPU utilization and memory usage

For detailed analysis of your specific code, please run your implementations and I'll analyze the results.`;
    }
    
    return `## GPU Computing Assistant

I can help you with:
- **Code Generation**: NumPy and CuPy implementations
- **Performance Analysis**: CPU vs GPU comparison
- **Optimization Tips**: GPU programming best practices
- **Troubleshooting**: Common GPU computing issues

**Current Status**: Template mode (Browser LLM initializing...)

What specific aspect of GPU computing would you like help with?`;
  }

  /**
   * Extract execution time from result string
   */
  private extractExecutionTime(result: string): number | null {
    const timeMatch = result.match(/(\d+(?:\.\d+)?)\s*(?:ms|milliseconds)/i);
    return timeMatch ? parseFloat(timeMatch[1]) : null;
  }
}

export const solRag = new SolRagService();
