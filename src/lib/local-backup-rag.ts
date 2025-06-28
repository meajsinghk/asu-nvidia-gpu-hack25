/**
 * Local Backup RAG System
 * 
 * A lightweight, local RAG implementation that works without external dependencies.
 * Provides intelligent responses about GPU computing, NumPy vs CuPy, and performance analysis.
 */

interface LocalRagDocument {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  category: 'gpu' | 'numpy' | 'cupy' | 'performance' | 'optimization' | 'general';
}

interface LocalRagResponse {
  answer: string;
  sources: string[];
  confidence: number;
  context_used: string[];
}

class LocalBackupRag {
  private documents: LocalRagDocument[];

  constructor() {
    this.documents = this.initializeKnowledgeBase();
  }

  /**
   * Initialize the local knowledge base with GPU computing and performance analysis content
   */
  private initializeKnowledgeBase(): LocalRagDocument[] {
    return [
      {
        id: 'gpu-basics',
        title: 'GPU Computing Fundamentals',
        content: `GPUs (Graphics Processing Units) are highly parallel processors designed for handling thousands of threads simultaneously. Unlike CPUs which have fewer cores optimized for sequential processing, GPUs have thousands of smaller cores that excel at parallel computations. This makes them ideal for mathematical operations on large datasets, machine learning, and scientific computing.`,
        keywords: ['gpu', 'parallel', 'computing', 'cores', 'threads'],
        category: 'gpu'
      },
      {
        id: 'numpy-performance',
        title: 'NumPy Performance Characteristics',
        content: `NumPy is a powerful library for numerical computing in Python that runs on CPU. It uses optimized C and Fortran libraries (BLAS, LAPACK) for mathematical operations. NumPy is excellent for small to medium datasets and operations that don't parallelize well. It has low memory overhead and fast startup times.`,
        keywords: ['numpy', 'cpu', 'blas', 'lapack', 'memory', 'performance'],
        category: 'numpy'
      },
      {
        id: 'cupy-advantages',
        title: 'CuPy GPU Acceleration',
        content: `CuPy is a NumPy-compatible library that runs on NVIDIA GPUs using CUDA. It provides massive speedups for large array operations, linear algebra, and mathematical functions. CuPy shines with large datasets (>1MB) and operations that can be parallelized. It has higher memory bandwidth and can handle much larger datasets than CPU-only solutions.`,
        keywords: ['cupy', 'gpu', 'cuda', 'nvidia', 'speedup', 'parallel'],
        category: 'cupy'
      },
      {
        id: 'performance-comparison',
        title: 'NumPy vs CuPy Performance Guidelines',
        content: `CuPy typically outperforms NumPy when: 1) Working with large arrays (>10K elements), 2) Performing element-wise operations, 3) Matrix multiplications, 4) FFTs and convolutions. NumPy may be faster for: 1) Small arrays due to GPU overhead, 2) Complex control flow, 3) Operations requiring frequent CPU-GPU transfers. The crossover point is usually around 1-10K elements depending on the operation.`,
        keywords: ['performance', 'comparison', 'overhead', 'crossover', 'optimization'],
        category: 'performance'
      },
      {
        id: 'gpu-memory',
        title: 'GPU Memory Management',
        content: `GPU memory management is crucial for performance. Key concepts: 1) GPU memory bandwidth is much higher than CPU (up to 1TB/s vs 100GB/s), 2) Memory transfers between CPU and GPU are expensive, 3) Coalesced memory access patterns improve performance, 4) Shared memory can reduce global memory access. Monitor GPU memory usage to avoid out-of-memory errors.`,
        keywords: ['memory', 'bandwidth', 'transfer', 'coalesced', 'shared'],
        category: 'gpu'
      },
      {
        id: 'optimization-strategies',
        title: 'Performance Optimization Strategies',
        content: `Key optimization strategies: 1) Minimize CPU-GPU transfers, 2) Use appropriate data types (float32 vs float64), 3) Leverage broadcasting instead of loops, 4) Use in-place operations when possible, 5) Consider memory layout (row-major vs column-major), 6) Profile your code to identify bottlenecks, 7) Use GPU-specific libraries (cuBLAS, cuFFT) for specialized operations.`,
        keywords: ['optimization', 'transfer', 'broadcasting', 'profiling', 'cublas'],
        category: 'optimization'
      },
      {
        id: 'when-use-gpu',
        title: 'When to Use GPU Computing',
        content: `Use GPU computing when: 1) Processing large datasets (>1MB), 2) Performing parallel operations, 3) Doing linear algebra operations, 4) Working with deep learning models, 5) Processing images or signals. Stick with CPU when: 1) Working with small datasets, 2) Complex control flow, 3) Frequent small operations, 4) Limited GPU memory, 5) Development/debugging phase.`,
        keywords: ['decision', 'criteria', 'dataset', 'size', 'control', 'flow'],
        category: 'general'
      },
      {
        id: 'gpu-metrics',
        title: 'Understanding GPU Metrics',
        content: `Important GPU metrics: 1) Utilization (% of time GPU is active), 2) Memory usage (GB used/total), 3) Memory bandwidth utilization, 4) Temperature (should stay under 85°C), 5) Power consumption, 6) Clock speeds. High utilization (>80%) indicates good GPU usage. Low utilization may suggest CPU bottlenecks or inefficient code.`,
        keywords: ['metrics', 'utilization', 'temperature', 'bandwidth', 'bottleneck'],
        category: 'gpu'
      }
    ];
  }

  /**
   * Calculate relevance score between query and document
   */
  private calculateRelevance(query: string, document: LocalRagDocument): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const docText = (document.title + ' ' + document.content + ' ' + document.keywords.join(' ')).toLowerCase();
    
    let score = 0;
    let matchedWords = 0;

    for (const word of queryWords) {
      if (word.length < 3) continue; // Skip short words
      
      // Exact word match
      if (docText.includes(word)) {
        score += 2;
        matchedWords++;
      }
      
      // Keyword match (higher weight)
      if (document.keywords.some(keyword => keyword.includes(word) || word.includes(keyword))) {
        score += 3;
      }
      
      // Partial match
      const regex = new RegExp(word, 'i');
      if (regex.test(docText)) {
        score += 1;
      }
    }

    // Boost score based on percentage of query words matched
    if (queryWords.length > 0) {
      score *= (matchedWords / queryWords.length);
    }

    return score;
  }

  /**
   * Find relevant documents for a query
   */
  private findRelevantDocuments(query: string, maxResults: number = 3): LocalRagDocument[] {
    const scoredDocs = this.documents
      .map(doc => ({
        doc,
        score: this.calculateRelevance(query, doc)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.doc);

    return scoredDocs;
  }

  /**
   * Generate a response based on query and relevant documents
   */
  private generateResponse(query: string, relevantDocs: LocalRagDocument[]): string {
    if (relevantDocs.length === 0) {
      return this.getGenericResponse(query);
    }

    const context = relevantDocs.map(doc => doc.content).join(' ');
    
    // Simple response generation based on query type
    if (this.isPerformanceQuery(query)) {
      return this.generatePerformanceResponse(query, relevantDocs);
    } else if (this.isComparisonQuery(query)) {
      return this.generateComparisonResponse(query, relevantDocs);
    } else if (this.isOptimizationQuery(query)) {
      return this.generateOptimizationResponse(query, relevantDocs);
    } else {
      return this.generateGeneralResponse(query, relevantDocs);
    }
  }

  private isPerformanceQuery(query: string): boolean {
    return /performance|speed|fast|slow|time|benchmark/i.test(query);
  }

  private isComparisonQuery(query: string): boolean {
    return /compare|vs|versus|difference|better|numpy.*cupy|cupy.*numpy/i.test(query);
  }

  private isOptimizationQuery(query: string): boolean {
    return /optimize|improve|faster|efficient|memory/i.test(query);
  }

  private generatePerformanceResponse(query: string, docs: LocalRagDocument[]): string {
    const perfDoc = docs.find(d => d.category === 'performance');
    const gpuDoc = docs.find(d => d.category === 'gpu');
    
    return `## Performance Analysis
Based on your query about performance, here are key insights:
**GPU vs CPU Performance:**
${gpuDoc ? gpuDoc.content.substring(0, 200) + '...' : 'GPUs excel at parallel processing while CPUs are optimized for sequential tasks.'}
**Performance Guidelines:**
${perfDoc ? perfDoc.content : 'Performance depends on data size, operation type, and memory access patterns.'}
**Key Factors:**
- Data size (GPU advantage increases with larger datasets)
- Operation type (parallel operations favor GPU)  
- Memory transfer overhead (minimize CPU-GPU transfers)
- Algorithm complexity (simple operations parallelize better)`;
  }

  private generateComparisonResponse(query: string, docs: LocalRagDocument[]): string {
    const numpyDoc = docs.find(d => d.category === 'numpy');
    const cupyDoc = docs.find(d => d.category === 'cupy');
    
    return `## NumPy vs CuPy Comparison
**NumPy (CPU Processing):**
${numpyDoc ? numpyDoc.content.substring(0, 150) + '...' : 'Optimized for CPU with excellent performance for small to medium datasets.'}
**CuPy (GPU Processing):**
${cupyDoc ? cupyDoc.content.substring(0, 150) + '...' : 'GPU-accelerated NumPy-compatible library for massive parallel processing.'}
**When to Use Each:**
- **NumPy**: Small datasets, complex control flow, debugging
- **CuPy**: Large datasets (>1MB), parallel operations, linear algebra
**Performance Crossover:** Typically around 1-10K elements depending on operation complexity.`;
  }

  private generateOptimizationResponse(query: string, docs: LocalRagDocument[]): string {
    const optDoc = docs.find(d => d.category === 'optimization');
    
    return `## Optimization Recommendations
${optDoc ? optDoc.content : 'Focus on minimizing memory transfers and leveraging parallel operations.'}
**Quick Optimization Checklist:**
- ✅ Use appropriate data types (float32 vs float64)
- ✅ Minimize CPU-GPU memory transfers  
- ✅ Leverage broadcasting operations
- ✅ Profile your code to identify bottlenecks
- ✅ Use GPU-specific optimized libraries
**Memory Considerations:**
- Monitor GPU memory usage
- Use in-place operations when possible
- Consider memory access patterns`;
  }

  private generateGeneralResponse(query: string, docs: LocalRagDocument[]): string {
    const mainDoc = docs[0];
    
    return `## ${mainDoc.title}
${mainDoc.content}
**Related Information:**
${docs.slice(1).map(doc => `- **${doc.title}**: ${doc.content.substring(0, 100)}...`).join('\n')}
This information is from our local knowledge base about GPU computing and performance optimization.`;
  }

  private getGenericResponse(query: string): string {
    return `## Response to: "${query}"
I don't have specific information about that topic in my local knowledge base, but here are some general guidelines:
**For GPU Computing Questions:**
- GPUs excel at parallel processing of large datasets
- Consider data size, memory transfers, and operation complexity
- Monitor GPU metrics like utilization and memory usage
**For Performance Analysis:**
- Profile your code to identify bottlenecks
- Compare execution times between CPU and GPU implementations
- Consider the overhead of data transfers
**For Code Optimization:**
- Use appropriate data types and memory access patterns
- Leverage built-in optimized functions when possible
- Minimize unnecessary data movement
This is a basic response from our backup RAG system. For more detailed analysis, ensure the primary RAG system is available.`;
  }

  /**
   * Main query interface
   */
  async query(question: string, context?: string): Promise<LocalRagResponse> {
    const enhancedQuery = context ? `${context} ${question}` : question;
    const relevantDocs = this.findRelevantDocuments(enhancedQuery);
    const answer = this.generateResponse(enhancedQuery, relevantDocs);
    
    return {
      answer,
      sources: relevantDocs.map(doc => doc.title),
      confidence: relevantDocs.length > 0 ? Math.min(0.8, relevantDocs.length * 0.3) : 0.3,
      context_used: relevantDocs.map(doc => doc.id)
    };
  }

  /**
   * Analyze performance differences (specific to our use case)
   */
  async analyzePerformance(data: {
    numpyCode: string;
    cupyCode: string;
    numpyResult: string;
    cupyResult: string;
    gpuMetrics?: string;
  }): Promise<string> {
    const query = `Compare NumPy vs CuPy performance analysis for code execution results`;
    const context = `NumPy result: ${data.numpyResult}, CuPy result: ${data.cupyResult}`;
    
    const response = await this.query(query, context);
    
    // Enhance with specific result analysis
    const enhancedAnalysis = `${response.answer}
## Specific Results Analysis
**NumPy (CPU) Result:** 
${data.numpyResult}
**CuPy (GPU) Result:** 
${data.cupyResult}
${this.analyzeSpecificResults(data.numpyResult, data.cupyResult)}
**Confidence Level:** ${(response.confidence * 100).toFixed(0)}% (Local Backup RAG)
**Sources:** ${response.sources.join(', ')}`;

    return enhancedAnalysis;
  }

  private analyzeSpecificResults(numpyResult: string, cupyResult: string): string {
    // Try to extract timing information
    const numpyTime = this.extractExecutionTime(numpyResult);
    const cupyTime = this.extractExecutionTime(cupyResult);
    
    if (numpyTime && cupyTime) {
      if (cupyTime < numpyTime) {
        const speedup = (numpyTime / cupyTime).toFixed(2);
        return `**Performance Insight:** 
CuPy achieved a ${speedup}x speedup over NumPy, demonstrating effective GPU acceleration for this operation.`;
      } else if (numpyTime < cupyTime) {
        const slowdown = (cupyTime / numpyTime).toFixed(2);
        return `**Performance Insight:** 
NumPy was ${slowdown}x faster than CuPy. This suggests the operation may be too small for GPU acceleration or involves significant overhead.`;
      }
    }
    
    return `**Performance Insight:** 
Both implementations completed successfully. Consider the data size, operation complexity, and memory transfer overhead when evaluating GPU vs CPU performance.`;
  }

  private extractExecutionTime(result: string): number | null {
    const timeMatch = result.match(/(\d+(?:\.\d+)?)\s*(?:ms|milliseconds|s|seconds)/i);
    if (timeMatch) {
      const value = parseFloat(timeMatch[1]);
      const unit = timeMatch[2]?.toLowerCase();
      return unit?.startsWith('s') ? value * 1000 : value; // Convert to ms
    }
    return null;
  }
}

// Export singleton instance
export const localBackupRag = new LocalBackupRag();
