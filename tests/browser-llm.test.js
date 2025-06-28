/**
 * Test script for Browser LLM functionality
 */

import { browserLLM } from '../src/lib/browser-llm';

async function testBrowserLLM() {
  console.log('🧪 Testing Browser LLM System...');
  
  try {
    // Test initialization
    console.log('1. Initializing models...');
    await browserLLM.initialize();
    
    // Test model info
    console.log('2. Getting model info...');
    const modelInfo = browserLLM.getModelInfo();
    console.log('Model Info:', modelInfo);
    
    // Test text generation
    console.log('3. Testing text generation...');
    const textResponse = await browserLLM.generateText(
      'GPU computing is powerful because',
      100
    );
    console.log('Text Response:', textResponse);
    
    // Test code generation
    console.log('4. Testing code generation...');
    const codeResponse = await browserLLM.generateCode(
      'matrix multiplication with NumPy',
      'python'
    );
    console.log('Code Response:', codeResponse);
    
    // Test question answering
    console.log('5. Testing question answering...');
    const qaResponse = await browserLLM.answerQuestion(
      'What are the benefits of GPU computing?'
    );
    console.log('Q&A Response:', qaResponse);
    
    console.log('✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testBrowserLLM();
}

export { testBrowserLLM };
