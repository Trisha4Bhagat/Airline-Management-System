export interface Flight {
  id: number;
  flight_number: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number; // Total price for all travelers (calculated in frontend)
  available_seats: number;
  
  // Additional price fields for clarity
  pricePerPerson?: number; // Original per-person price from database
  basePrice?: number; // Same as pricePerPerson (for backward compatibility)
}