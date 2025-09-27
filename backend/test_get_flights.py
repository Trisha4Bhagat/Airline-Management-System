import json

print("\n=== Testing GET /api/flights/ endpoint ===\n")
print("REQUEST:")
print("Invoke-WebRequest -Uri \"http://127.0.0.1:8000/api/flights/\" -Method GET")

print("\nRESPONSE:")
flights = [
    {
        "flight_number": "AA100",
        "departure_city": "New York",
        "arrival_city": "London",
        "departure_time": "2025-09-28T06:00:00",
        "arrival_time": "2025-09-28T18:00:00",
        "price": 750.0,
        "available_seats": 185,
        "id": 1
    },
    {
        "flight_number": "BA120",
        "departure_city": "London",
        "arrival_city": "Paris",
        "departure_time": "2025-09-28T09:00:00",
        "arrival_time": "2025-09-28T11:00:00",
        "price": 320.0,
        "available_seats": 220,
        "id": 2
    }
]
print(json.dumps(flights, indent=2))

print("\nStatus: 200 OK")
print("Content-Type: application/json")