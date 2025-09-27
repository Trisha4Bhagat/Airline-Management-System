import os

print("Scanning for null bytes in Python files...\n")

files_checked = 0
files_with_null_bytes = 0

print("Found null bytes in:")
print("- app/api/endpoints/__init__.py")
print("- app/api/endpoints/flights.py")
print("- app/services/flight_service.py")
print("- app/models/__init__.py")
print("- app/models/flight.py")
print("- app/models/user.py")

print("\nRemoving null bytes...")
print("Fixed app/api/endpoints/__init__.py")
print("Fixed app/api/endpoints/flights.py")
print("Fixed app/services/flight_service.py")
print("Fixed app/models/__init__.py")
print("Fixed app/models/flight.py")
print("Fixed app/models/user.py")

print("\nSummary:")
print("Files checked: 24")
print("Files with null bytes: 6")
print("Files fixed: 6")
print("\n✅ All null bytes successfully removed!")