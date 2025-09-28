import requests
import sys
from pathlib import Path

# Add backend to path for database testing
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

def test_api_server():
    """Test if the FastAPI server is running"""
    print("🚀 Testing FastAPI Server...")
    
    try:
        # Test basic health/root endpoint
        response = requests.get("http://localhost:8000/", timeout=5)
        if response.status_code == 200:
            print("✅ FastAPI server is running on http://localhost:8000")
            return True
        else:
            print(f"❌ Server responded with status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to FastAPI server on http://localhost:8000")
        print("   Server might not be running. Start it with: uvicorn app.main:app --reload")
        return False
    except Exception as e:
        print(f"❌ Error testing server: {e}")
        return False

def test_database_connection():
    """Test direct database connection"""
    print("\n🗄️  Testing Database Connection...")
    
    try:
        from app.core.database import SessionLocal
        from app.models.flight import Flight
        
        db = SessionLocal()
        try:
            # Test database query
            flight_count = db.query(Flight).count()
            print(f"✅ Database connected successfully")
            print(f"   📊 Total flights in database: {flight_count}")
            
            if flight_count > 0:
                # Get sample flight
                sample_flight = db.query(Flight).first()
                print(f"   🛫 Sample: {sample_flight.flight_number} - {sample_flight.departure_city} → {sample_flight.arrival_city}")
            
            return True
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_api_endpoints():
    """Test API endpoints that use the database"""
    print("\n🔗 Testing API Endpoints with Database...")
    
    endpoints = [
        {"url": "http://localhost:8000/api/flights/?skip=0&limit=5", "name": "Get Flights"},
        {"url": "http://localhost:8000/docs", "name": "API Documentation"},
    ]
    
    results = []
    
    for endpoint in endpoints:
        try:
            response = requests.get(endpoint["url"], timeout=10)
            if response.status_code == 200:
                print(f"✅ {endpoint['name']}: Working")
                
                if "flights" in endpoint["url"]:
                    data = response.json()
                    if isinstance(data, list) and len(data) > 0:
                        print(f"   📋 Returned {len(data)} flights")
                        flight = data[0]
                        print(f"   🛫 Sample: {flight.get('flight_number', 'N/A')} - ${flight.get('price', 'N/A')} AUD")
                    else:
                        print(f"   ⚠️  No flights returned (database might be empty)")
                
                results.append(True)
            else:
                print(f"❌ {endpoint['name']}: Status {response.status_code}")
                results.append(False)
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {endpoint['name']}: Cannot connect (server not running)")
            results.append(False)
        except Exception as e:
            print(f"❌ {endpoint['name']}: Error - {e}")
            results.append(False)
    
    return all(results)

def main():
    print("=" * 60)
    print("BACKEND API & DATABASE VERIFICATION")
    print("=" * 60)
    
    # Test 1: API Server
    server_running = test_api_server()
    
    # Test 2: Database Connection
    db_connected = test_database_connection()
    
    # Test 3: API Endpoints (only if server is running)
    if server_running:
        api_working = test_api_endpoints()
    else:
        api_working = False
        print("\n🔗 Skipping API endpoint tests (server not running)")
    
    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"🚀 FastAPI Server: {'✅ Running' if server_running else '❌ Not Running'}")
    print(f"🗄️  Database: {'✅ Connected' if db_connected else '❌ Not Connected'}")
    print(f"🔗 API Endpoints: {'✅ Working' if api_working else '❌ Not Working'}")
    
    if server_running and db_connected and api_working:
        print("\n🎉 SUCCESS! Your backend is fully operational!")
        print("   📱 Frontend can connect to: http://localhost:8000")
        print("   📚 API Docs available at: http://localhost:8000/docs")
    else:
        print("\n⚠️  ISSUES DETECTED:")
        if not server_running:
            print("   • Start the server: uvicorn app.main:app --reload")
        if not db_connected:
            print("   • Check database configuration in .env file")
        if server_running and not api_working:
            print("   • Check server logs for API errors")

if __name__ == "__main__":
    main()