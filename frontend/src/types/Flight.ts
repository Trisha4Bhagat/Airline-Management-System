export interface Flight {
  id: number;
  flight_number: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
}