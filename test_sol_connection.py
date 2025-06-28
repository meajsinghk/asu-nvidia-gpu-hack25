"""
Connection Test Script
Run this to test if Sol backend is reachable
"""

import requests
import json

SOL_URL = "http://192.168.1.100:8000"

def test_connection():
    print(f"🔍 Testing connection to Sol backend at {SOL_URL}")
    
    try:
        # Test health endpoint
        print("1. Testing health endpoint...")
        response = requests.get(f"{SOL_URL}/health", timeout=5)
        
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Health check successful!")
            print(f"   GPU Available: {health_data.get('gpu_available')}")
            print(f"   Connected Clients: {len(health_data.get('connection_stats', {}).get('connected_clients', []))}")
            print(f"   Total Requests: {health_data.get('connection_stats', {}).get('total_requests', 0)}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
            
        # Test stats endpoint
        print("\n2. Testing stats endpoint...")
        response = requests.get(f"{SOL_URL}/stats", timeout=5)
        
        if response.status_code == 200:
            stats = response.json()
            print("✅ Stats endpoint working!")
            uptime = stats.get('connection_stats', {}).get('uptime_human', 'Unknown')
            print(f"   Backend uptime: {uptime}")
        
        return True
        
    except requests.exceptions.ConnectError:
        print("❌ Connection refused - Sol backend is not running")
        return False
    except requests.exceptions.Timeout:
        print("❌ Connection timeout - Sol backend might be slow")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_connection()
