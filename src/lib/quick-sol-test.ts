// Quick test utility for checking Sol backend status
import { SolBackendService } from '@/lib/sol-backend';

export async function quickSolTest() {
  const backendUrl = process.env.NEXT_PUBLIC_SOL_BACKEND_URL || 'http://192.168.1.100:8000';
  const solBackend = new SolBackendService(backendUrl);
  
  console.log('🔍 Quick Sol Backend Test');
  console.log('Backend URL:', backendUrl);
  console.log('Current time:', new Date().toISOString());
  
  try {
    const health = await solBackend.healthCheck();
    console.log('✅ CONNECTED: Sol backend is online!');
    console.log('Backend info:', health);
    return { status: 'connected', data: health };
  } catch (error: any) {
    console.log('❌ DISCONNECTED: Sol backend is offline');
    console.log('Error:', error.message);
    console.log('💡 This is normal if Sol backend is not running');
    return { status: 'disconnected', error: error.message };
  }
}

// Auto-run test
if (typeof window !== 'undefined') {
  setTimeout(() => {
    quickSolTest();
  }, 2000);
}
