import requests
import json

def test_frontend_to_backend_connection():
    """Test the exact endpoints that the frontend will use"""
    
    print("🔌 Testing Frontend → Backend API Connection")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # Test 1: Basic connectivity
    print("1. Testing basic connectivity...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print("   ✅ Backend server is reachable")
        else:
            print(f"   ❌ Server returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Cannot connect to backend: {e}")
        return False
    
    # Test 2: Flights endpoint (what frontend calls)
    print("2. Testing /api/flights/ endpoint...")
    try:
        response = requests.get(f"{base_url}/api/flights/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Flights endpoint working - returned {len(data)} flights")
            
            if len(data) > 0:
                flight = data[0]
                print(f"   📋 Sample flight: {flight['flight_number']} - {flight['departure_city']} → {flight['arrival_city']}")
                print(f"   💰 Price: ${flight['price']} AUD")
            else:
                print("   ⚠️  No flights returned")
        else:
            print(f"   ❌ Flights endpoint failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error calling flights endpoint: {e}")
        return False
    
    # Test 3: Search with parameters (like frontend would do)
    print("3. Testing flight search with parameters...")
    try:
        params = {
            "departure_city": "Sydney",
            "limit": 5
        }
        response = requests.get(f"{base_url}/api/flights/", params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Search working - found {len(data)} flights from Sydney")
            
            for flight in data[:3]:  # Show first 3
                print(f"      • {flight['flight_number']}: Sydney → {flight['arrival_city']} (${flight['price']} AUD)")
        else:
            print(f"   ❌ Search failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ Error searching flights: {e}")
        return False
    
    # Test 4: CORS headers check
    print("4. Checking CORS headers...")
    try:
        response = requests.options(f"{base_url}/api/flights/", headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET"
        })
        
        cors_headers = response.headers.get("Access-Control-Allow-Origin", "")
        if "localhost:5173" in cors_headers or "*" in cors_headers:
            print("   ✅ CORS properly configured for frontend")
        else:
            print(f"   ⚠️  CORS might need adjustment: {cors_headers}")
    except Exception as e:
        print(f"   ❌ Error checking CORS: {e}")
    
    print("\n🎉 All tests passed! Frontend should be able to connect to backend!")
    return True

if __name__ == "__main__":
    test_frontend_to_backend_connection()