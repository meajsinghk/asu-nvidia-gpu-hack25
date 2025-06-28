/**
 * Browser-based LLM System using Transformers.js
 * 
 * This provides real LLM capabilities that run entirely in the browser,
 * without requiring any external services or local installations.
 */

import { pipeline, env } from '@xenova/transformers';

// Configure Transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface LLMResponse {
  content: string;
  confidence: number;
  modelUsed: string;
  processingTime: number;
}

class BrowserLLM {
  private textGenerator: any = null;
  private codeGenerator: any = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the browser-based LLM models
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private async _initialize(): Promise<void> {
    try {
      console.log('🤖 Initializing Browser LLM...');
      
      // Use a smaller, faster model for general text generation
      this.textGenerator = await pipeline(
        'text-generation', 
        'Xenova/distilgpt2',
        { 
          quantized: true,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`📥 Downloading model: ${progress.file} (${progress.progress}%)`);
            }
          }
        }
      );

      // Use CodeT5 for code generation tasks
      this.codeGenerator = await pipeline(
        'text2text-generation',
        'Xenova/codet5p-220m',
        { 
          quantized: true,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`📥 Downloading code model: ${progress.file} (${progress.progress}%)`);
            }
          }
        }
      );

      this.isInitialized = true;
      console.log('✅ Browser LLM initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Browser LLM:', error);
      throw error;
    }
  }

  /**
   * Generate text using the browser LLM
   */
  async generateText(prompt: string, maxLength: number = 200): Promise<LLMResponse> {
    await this.initialize();
    
    if (!this.textGenerator) {
      throw new Error('Text generator not initialized');
    }

    const startTime = Date.now();
    
    try {
      const result = await this.textGenerator(prompt, {
        max_length: maxLength,
        num_return_sequences: 1,
        temperature: 0.7,
        do_sample: true,
        pad_token_id: 50256 // GPT-2 EOS token
      });

      const processingTime = Date.now() - startTime;
      
      return {
        content: result[0].generated_text,
        confidence: 0.8,
        modelUsed: 'DistilGPT-2',
        processingTime
      };
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  }

  /**
   * Generate code using the specialized code model
   */
  async generateCode(description: string, language: string = 'python'): Promise<LLMResponse> {
    await this.initialize();
    
    if (!this.codeGenerator) {
      throw new Error('Code generator not initialized');
    }

    const startTime = Date.now();
    
    try {
      const prompt = `Generate ${language} code: ${description}`;
      
      const result = await this.codeGenerator(prompt, {
        max_length: 512,
        num_return_sequences: 1,
        temperature: 0.3, // Lower temperature for more precise code
        do_sample: true
      });

      const processingTime = Date.now() - startTime;
      
      return {
        content: result[0].generated_text,
        confidence: 0.75,
        modelUsed: 'CodeT5p-220M',
        processingTime
      };
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }

  /**
   * Answer questions about GPU computing, NumPy, and CuPy
   */
  async answerQuestion(question: string, context?: string): Promise<LLMResponse> {
    await this.initialize();

    const enhancedPrompt = this.buildEnhancedPrompt(question, context);
    
    // For code-related questions, use code generator
    if (this.isCodeQuestion(question)) {
      return this.generateCodeResponse(question);
    }
    
    // For general questions, use text generator
    return this.generateText(enhancedPrompt, 300);
  }

  /**
   * Build an enhanced prompt with context and expertise
   */
  private buildEnhancedPrompt(question: string, context?: string): string {
    let prompt = `As an expert in GPU computing, NumPy, and CuPy, I'll answer this question:

Question: ${question}`;

    if (context) {
      prompt += `\n\nContext: ${context}`;
    }

    prompt += `\n\nAnswer: `;
    
    return prompt;
  }

  /**
   * Check if the question is asking for code
   */
  private isCodeQuestion(question: string): boolean {
    const codeKeywords = [
      'code', 'implement', 'write', 'create', 'generate', 'example',
      'function', 'matrix', 'array', 'numpy', 'cupy', 'algorithm'
    ];
    
    const lowerQuestion = question.toLowerCase();
    return codeKeywords.some(keyword => lowerQuestion.includes(keyword));
  }

  /**
   * Generate a code response for code-related questions
   */
  private async generateCodeResponse(question: string): Promise<LLMResponse> {
    const codeDescription = this.extractCodeDescription(question);
    
    try {
      // Generate code using the code model
      const codeResult = await this.generateCode(codeDescription);
      
      // Enhance the response with NumPy/CuPy specific formatting
      const enhancedContent = this.enhanceCodeResponse(codeResult.content, question);
      
      return {
        ...codeResult,
        content: enhancedContent
      };
    } catch (error) {
      // Fallback to rule-based code generation if model fails
      return this.generateFallbackCode(question);
    }
  }

  /**
   * Extract code description from question
   */
  private extractCodeDescription(question: string): string {
    // Remove question words and extract the core request
    const cleaned = question
      .toLowerCase()
      .replace(/^(can you |could you |please |how do i |how to )/g, '')
      .replace(/\?+$/, '');
    
    return cleaned;
  }

  /**
   * Enhance code response with NumPy/CuPy specific formatting
   */
  private enhanceCodeResponse(generatedCode: string, originalQuestion: string): string {
    const isNumPyQuestion = originalQuestion.toLowerCase().includes('numpy');
    const isCuPyQuestion = originalQuestion.toLowerCase().includes('cupy');
    
    let response = `## Generated Code

${generatedCode}

`;

    if (isNumPyQuestion || isCuPyQuestion) {
      response += `
**Usage:**
- Use "Push to CPU" for NumPy implementations
- Use "Push to GPU" for CuPy implementations
- Compare performance between CPU and GPU versions

**Performance Tips:**
- Larger arrays will show more GPU advantage
- Monitor GPU metrics during CuPy execution
- Consider memory transfer overhead for small arrays
`;
    }

    return response;
  }

  /**
   * Fallback code generation when model fails
   */
  private generateFallbackCode(question: string): LLMResponse {
    const templates = this.getCodeTemplates();
    const lowerQuestion = question.toLowerCase();
    
    let code = '';
    let description = '';

    if (lowerQuestion.includes('matrix') || lowerQuestion.includes('multiplication')) {
      code = templates.matrixMultiplication;
      description = 'Matrix multiplication comparison';
    } else if (lowerQuestion.includes('array') || lowerQuestion.includes('basic')) {
      code = templates.basicArrays;
      description = 'Basic array operations';
    } else if (lowerQuestion.includes('linear') || lowerQuestion.includes('algebra')) {
      code = templates.linearAlgebra;
      description = 'Linear algebra operations';
    } else {
      code = templates.default;
      description = 'General GPU computing example';
    }

    return {
      content: `## ${description}

${code}

**Note:** This is a template-based response. For more sophisticated code generation, ensure the browser LLM models are fully loaded.`,
      confidence: 0.6,
      modelUsed: 'Template Fallback',
      processingTime: 50
    };
  }

  /**
   * Get code templates for fallback
   */
  private getCodeTemplates() {
    return {
      matrixMultiplication: `
**NumPy (CPU) Version:**
\`\`\`python
import numpy as np
import time

# Create large matrices
size = 1000
A = np.random.random((size, size))
B = np.random.random((size, size))

# Time the multiplication
start = time.time()
C = np.dot(A, B)
cpu_time = time.time() - start

print(f"Matrix shape: {C.shape}")
print(f"CPU time: {cpu_time*1000:.2f} ms")
\`\`\`

**CuPy (GPU) Version:**
\`\`\`python
import cupy as cp
import time

# Create large matrices on GPU
size = 1000
A = cp.random.random((size, size))
B = cp.random.random((size, size))

# Time the multiplication
start = time.time()
C = cp.dot(A, B)
cp.cuda.Stream.null.synchronize()
gpu_time = time.time() - start

print(f"Matrix shape: {C.shape}")
print(f"GPU time: {gpu_time*1000:.2f} ms")
\`\`\`
`,
      basicArrays: `
**NumPy (CPU) Version:**
\`\`\`python
import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4, 5])
b = np.ones((1000, 1000))
c = np.random.random((500, 500))

# Basic operations
result = np.sum(c)
mean_val = np.mean(c)
std_val = np.std(c)

print(f"Sum: {result}")
print(f"Mean: {mean_val}")
print(f"Std: {std_val}")
\`\`\`

**CuPy (GPU) Version:**
\`\`\`python
import cupy as cp

# Create arrays on GPU
a = cp.array([1, 2, 3, 4, 5])
b = cp.ones((1000, 1000))
c = cp.random.random((500, 500))

# Basic operations on GPU
result = cp.sum(c)
mean_val = cp.mean(c)
std_val = cp.std(c)

print(f"Sum: {result}")
print(f"Mean: {mean_val}")
print(f"Std: {std_val}")
\`\`\`
`,
      linearAlgebra: `
**NumPy (CPU) Version:**
\`\`\`python
import numpy as np

# Linear algebra operations
A = np.random.random((500, 500))
b = np.random.random(500)

# Solve linear system
x = np.linalg.solve(A, b)

# Eigendecomposition
eigenvals, eigenvecs = np.linalg.eig(A)

# SVD
U, s, Vt = np.linalg.svd(A)

print(f"Solution shape: {x.shape}")
print(f"Eigenvalues count: {len(eigenvals)}")
\`\`\`

**CuPy (GPU) Version:**
\`\`\`python
import cupy as cp

# Linear algebra operations on GPU
A = cp.random.random((500, 500))
b = cp.random.random(500)

# Solve linear system on GPU
x = cp.linalg.solve(A, b)

# Eigendecomposition on GPU
eigenvals, eigenvecs = cp.linalg.eig(A)

# SVD on GPU
U, s, Vt = cp.linalg.svd(A)

print(f"Solution shape: {x.shape}")
print(f"Eigenvalues count: {len(eigenvals)}")
\`\`\`
`,
      default: `
**NumPy (CPU) Version:**
\`\`\`python
import numpy as np
import time

# Create data
data = np.random.random((1000, 1000))

# Perform computation
start = time.time()
result = np.fft.fft2(data)
cpu_time = time.time() - start

print(f"Result shape: {result.shape}")
print(f"CPU time: {cpu_time*1000:.2f} ms")
\`\`\`

**CuPy (GPU) Version:**
\`\`\`python
import cupy as cp
import time

# Create data on GPU
data = cp.random.random((1000, 1000))

# Perform computation on GPU
start = time.time()
result = cp.fft.fft2(data)
cp.cuda.Stream.null.synchronize()
gpu_time = time.time() - start

print(f"Result shape: {result.shape}")
print(f"GPU time: {gpu_time*1000:.2f} ms")
\`\`\`
`
    };
  }

  /**
   * Check if the browser LLM is available and initialized
   */
  isAvailable(): boolean {
    return this.isInitialized && this.textGenerator !== null;
  }

  /**
   * Get model information
   */
  getModelInfo(): { textModel: string; codeModel: string; status: string } {
    return {
      textModel: 'DistilGPT-2 (quantized)',
      codeModel: 'CodeT5p-220M (quantized)',
      status: this.isInitialized ? 'Ready' : 'Initializing...'
    };
  }
}

// Export singleton instance
export const browserLLM = new BrowserLLM();
