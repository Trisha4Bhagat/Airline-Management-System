import sys
from pathlib import Path

# Fix the path to point to the backend directory (parent of scripts)
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal, engine
from app.core.config import settings
from sqlalchemy import text
import os

def check_database_status():
    print("=" * 60)
    print("DATABASE STATUS CHECK")
    print("=" * 60)
    
    # Check configuration
    print(f"🔧 Config DATABASE_URL: {settings.DATABASE_URL}")
    print(f"🔧 Engine URL: {engine.url}")
    
    # Check if SQLite file exists
    sqlite_file = Path("airline.db")
    if sqlite_file.exists():
        print(f"⚠️  SQLite file found: {sqlite_file.absolute()} (size: {sqlite_file.stat().st_size} bytes)")
    else:
        print("✓ No SQLite file found")
    
    print("-" * 60)
    
    try:
        db = SessionLocal()
        
        # Test connection and get database info
        result = db.execute(text("SELECT version();"))
        version = result.fetchone()[0]
        print(f"🗄️  Database Version: {version}")
        
        # Check if this is PostgreSQL or SQLite
        if "PostgreSQL" in version:
            print("✅ CONNECTED TO POSTGRESQL")
            
            # Get current database and user
            result = db.execute(text("SELECT current_database(), current_user;"))
            db_info = result.fetchone()
            print(f"📊 Database: {db_info[0]}")
            print(f"👤 User: {db_info[1]}")
            
            # PostgreSQL specific proof
            print("\n🐘 POSTGRESQL SPECIFIC INFO:")
            
            # Database size
            result = db.execute(text("SELECT pg_size_pretty(pg_database_size(current_database()));"))
            db_size = result.fetchone()[0]
            print(f"   💾 Database Size: {db_size}")
            
            # Connection count
            result = db.execute(text("SELECT count(*) FROM pg_stat_activity WHERE datname = current_database();"))
            connections = result.fetchone()[0]
            print(f"   🔗 Active Connections: {connections}")
            
            # Simple table count (avoiding complex XML functions)
            result = db.execute(text("""
                SELECT schemaname, tablename 
                FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY tablename
            """))
            
            print(f"   📋 Tables from PostgreSQL catalogs:")
            for row in result:
                table_name = row[1]
                try:
                    count_result = db.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                    row_count = count_result.fetchone()[0]
                    print(f"      • {table_name}: {row_count} rows")
                except:
                    print(f"      • {table_name}: (could not count)")
            
        elif "SQLite" in version:
            print("⚠️  CONNECTED TO SQLITE (not PostgreSQL)")
            
        print("-" * 60)
        
        # Check existing tables and data
        from app.models.user import User
        from app.models.flight import Flight
        from app.models.booking import Booking
        
        user_count = db.query(User).count()
        flight_count = db.query(Flight).count()
        booking_count = db.query(Booking).count()
        
        print("📈 CURRENT DATA:")
        print(f"   👥 Users: {user_count}")
        print(f"   ✈️  Flights: {flight_count}")
        print(f"   🎫 Bookings: {booking_count}")
        
        if flight_count > 0:
            print("\n🛫 SAMPLE FLIGHTS:")
            flights = db.query(Flight).limit(5).all()
            for flight in flights:
                print(f"   {flight.flight_number}: {flight.departure_city} → {flight.arrival_city} (${flight.price} AUD)")
                
            # Flight distribution analysis
            print(f"\n📊 FLIGHT ANALYSIS:")
            result = db.execute(text("""
                SELECT 
                    departure_city,
                    arrival_city,
                    COUNT(*) as flight_count,
                    AVG(price) as avg_price
                FROM flights 
                GROUP BY departure_city, arrival_city
                ORDER BY flight_count DESC
                LIMIT 5
            """))
            
            print(f"   Top Routes:")
            for row in result:
                print(f"   • {row[0]} → {row[1]}: {row[2]} flights, Avg ${row[3]:.0f}")
            
            # Airline distribution
            result = db.execute(text("""
                SELECT 
                    SUBSTRING(flight_number FROM 1 FOR 2) as airline,
                    COUNT(*) as count
                FROM flights 
                GROUP BY SUBSTRING(flight_number FROM 1 FOR 2)
                ORDER BY count DESC
            """))
            
            print(f"   Airlines:")
            airline_names = {'QF': 'Qantas', 'VA': 'Virgin Australia', 'JQ': 'Jetstar', 'ZL': 'Rex Airlines', 'TT': 'Tigerair'}
            for row in result:
                airline_name = airline_names.get(row[0], 'Unknown')
                print(f"   • {row[0]} ({airline_name}): {row[1]} flights")
            
            # Price analysis
            result = db.execute(text("""
                SELECT 
                    MIN(price) as min_price,
                    MAX(price) as max_price,
                    AVG(price) as avg_price
                FROM flights
            """))
            row = result.fetchone()
            print(f"   Price Range: ${row[0]:.0f} - ${row[1]:.0f} AUD (Avg: ${row[2]:.0f})")
        
        if user_count > 0:
            print(f"\n👤 SAMPLE USERS:")
            users = db.query(User).limit(3).all()
            for user in users:
                print(f"   {user.username} ({user.email}) - Admin: {user.is_admin}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        print("\nThis might mean:")
        print("1. PostgreSQL is not running")
        print("2. Database credentials are wrong")
        print("3. Tables don't exist yet")

if __name__ == "__main__":
    check_database_status()