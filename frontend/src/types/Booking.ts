export interface Booking {
  id: number;
  user_id: number;
  flight_id: number;
  booking_date: string;
  passenger_count: number;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}