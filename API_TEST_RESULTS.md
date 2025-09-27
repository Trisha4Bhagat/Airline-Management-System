# API Endpoint Testing Results

## Endpoint: GET /api/flights/
### Request:
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/flights/" -Method GET
```

### Response:
```json
[
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
  },
  {
    "flight_number": "UA150",
    "departure_city": "Los Angeles",
    "arrival_city": "Tokyo",
    "departure_time": "2025-09-28T12:00:00",
    "arrival_time": "2025-09-29T05:00:00",
    "price": 1450.0,
    "available_seats": 195,
    "id": 3
  }
]
```

## Endpoint: GET /api/flights/1
### Request:
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/flights/1" -Method GET
```

### Response:
```json
{
  "flight_number": "AA100",
  "departure_city": "New York",
  "arrival_city": "London",
  "departure_time": "2025-09-28T06:00:00",
  "arrival_time": "2025-09-28T18:00:00",
  "price": 750.0,
  "available_seats": 185,
  "id": 1
}
```

## Endpoint: POST /api/flights/
### Request:
```powershell
$body = @{
    "flight_number" = "FL999"
    "departure_city" = "New York"
    "arrival_city" = "Tokyo"
    "departure_time" = "2025-10-15T08:00:00"
    "arrival_time" = "2025-10-15T22:00:00"
    "price" = 1200
    "available_seats" = 200
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/flights/" -Method POST -Body $body -ContentType "application/json"
```

### Response:
```json
{
  "flight_number": "FL999",
  "departure_city": "New York",
  "arrival_city": "Tokyo",
  "departure_time": "2025-10-15T08:00:00",
  "arrival_time": "2025-10-15T22:00:00",
  "price": 1200.0,
  "available_seats": 200,
  "id": 4
}
```

## API Issue Resolution
- Identified mismatch between config settings (`/api/v1`) and actual implementation (`/api`)
- Confirmed all endpoints are working at the `/api/flights/` path
- Successfully created and retrieved flight data
- API documentation available at http://127.0.0.1:8000/docs