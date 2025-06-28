// Test connection to Sol backend
import { SolBackendService } from '@/lib/sol-backend';

export async function testSolConnection() {
  const backendUrl = process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://192.168.1.100:8000';
  const solBackend = new SolBackendService(backendUrl);
  
  try {
    console.log('🔗 Testing Sol backend connection...');
    console.log('Backend URL:', backendUrl);
    
    // Test health check
    const health = await solBackend.healthCheck();
    console.log('✅ Health check successful:', health);
    
    // Test performance metrics
    const performance = await solBackend.getPerformanceMetrics();
    console.log('📊 Performance metrics:', performance);
    
    // Test simple NumPy operation
    const numpyResult = await solBackend.executeNumPy('mean');
    console.log('🐍 NumPy test:', numpyResult);
    
    return {
      status: 'connected',
      backend: health,
      performance,
      numpy: numpyResult
    };
    
  } catch (error: any) {
    console.warn('⚠️ Sol backend connection failed (expected if backend offline):', error.message);
    return {
      status: 'failed',
      error: error.message,
      fallback: 'Using local simulation mode'
    };
  }
}

// Auto-test connection when imported (graceful fallback)
if (typeof window !== 'undefined') {
  testSolConnection().then(result => {
    if (result.status === 'connected') {
      console.log('🚀 Sol GPU backend is connected and ready!');
      console.log('📊 Backend info:', result.backend);
    } else {
      console.log('⚠️ Sol backend unavailable - using local simulation mode');
      console.log('💡 To connect to Sol backend:');
      console.log('   1. Ensure Sol backend is running');
      console.log('   2. Check .env.local for correct URL');
      console.log('   3. Restart development server');
    }
  }).catch(err => {
    console.warn('Connection test failed silently:', err.message);
  });
}
