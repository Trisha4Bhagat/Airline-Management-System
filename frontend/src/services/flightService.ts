import api from './api';
import { Flight } from '../types/Flight';

interface SearchParams {
  departure_city?: string;
  arrival_city?: string;
  departure_date?: string;
}

export const getAllFlights = async (): Promise<Flight[]> => {
  const response = await api.get('/flights');
  return response.data;
};

export const getFlightById = async (id: number): Promise<Flight> => {
  const response = await api.get(`/flights/${id}`);
  return response.data;
};

// Add aliases for compatibility with components using different function names
export const fetchFlights = getAllFlights;
export const fetchFlightById = getFlightById;

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  try {
    const response = await api.get('/flights/search', { params });
    return response.data;
  } catch (error) {
    // For development, return sample flights if API fails
    console.log('Error fetching flights, using sample data:', error);
    return getSampleFlights(params);
  }
};

export const bookFlight = async (
  flightId: number,
  userId: number, 
  passengerCount: number
) => {
  const response = await api.post('/bookings', {
    flight_id: flightId,
    user_id: userId,
    passenger_count: passengerCount
  });
  return response.data;
};

// Sample data for development
const getSampleFlights = (params: SearchParams): Flight[] => {
  let sampleFlights = [
    {
      id: 1,
      flight_number: 'FL100',
      departure_city: 'New York',
      arrival_city: 'London',
      departure_time: '2025-10-10T08:00:00',
      arrival_time: '2025-10-10T20:00:00',
      price: 750,
      available_seats: 120
    },
    {
      id: 2,
      flight_number: 'FL200',
      departure_city: 'London',
      arrival_city: 'Paris',
      departure_time: '2025-10-11T09:00:00',
      arrival_time: '2025-10-11T11:00:00',
      price: 320,
      available_seats: 80
    },
    {
      id: 3,
      flight_number: 'FL300',
      departure_city: 'Paris',
      arrival_city: 'New York',
      departure_time: '2025-10-12T13:00:00',
      arrival_time: '2025-10-12T22:00:00',
      price: 890,
      available_seats: 50
    },
    {
      id: 4,
      flight_number: 'FL400',
      departure_city: 'New York',
      arrival_city: 'Tokyo',
      departure_time: '2025-10-15T12:00:00',
      arrival_time: '2025-10-16T14:00:00',
      price: 1200,
      available_seats: 200
    },
    {
      id: 5,
      flight_number: 'FL500',
      departure_city: 'Tokyo',
      arrival_city: 'Sydney',
      departure_time: '2025-10-20T22:00:00',
      arrival_time: '2025-10-21T08:00:00',
      price: 950,
      available_seats: 150
    }
  ];

  // Filter by params
  if (params.departure_city) {
    sampleFlights = sampleFlights.filter(
      flight => flight.departure_city === params.departure_city
    );
  }
  
  if (params.arrival_city) {
    sampleFlights = sampleFlights.filter(
      flight => flight.arrival_city === params.arrival_city
    );
  }
  
  if (params.departure_date) {
    const requestedDate = new Date(params.departure_date).toISOString().split('T')[0];
    sampleFlights = sampleFlights.filter(flight => {
      const flightDate = new Date(flight.departure_time).toISOString().split('T')[0];
      return flightDate === requestedDate;
    });
  }
  
  return sampleFlights;
};