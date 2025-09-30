import api from './api';
import { Flight } from '../types/Flight';

interface SearchParams {
  departure_city?: string;
  arrival_city?: string;
  departure_date?: string;
  min_price?: number;
  max_price?: number;
  airline?: string;
  dep_time_start?: string;
  dep_time_end?: string;
}

export const getAirlines = async (): Promise<string[]> => {
  try {
    const response = await api.get('/api/flights/airlines');
    return response.data;
  } catch (error) {
    console.error('Error fetching airlines:', error);
    throw error;
  }
};

export const getPriceRange = async (travelers: number = 1): Promise<{min_price: number, max_price: number}> => {
  try {
    const response = await api.get(`/api/flights/price-range?travelers=${travelers}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching price range:', error);
    throw error;
  }
};

export const getAllFlights = async (): Promise<Flight[]> => {
  try {
    const response = await api.get('/api/flights/');
    return response.data;
  } catch (error) {
    console.error('Error fetching all flights:', error);
    throw error;
  }
};

export const getFlightById = async (id: number): Promise<Flight> => {
  try {
    const response = await api.get(`/api/flights/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flight by ID:', error);
    throw error;
  }
};

// Add aliases for compatibility with components using different function names
export const fetchFlights = getAllFlights;
export const fetchFlightById = getFlightById;

export const searchFlights = async (params: SearchParams): Promise<Flight[]> => {
  try {
    // Map departure_date to date for the API
    const apiParams = { ...params };
    if (apiParams.departure_date) {
      (apiParams as any).date = apiParams.departure_date;
      delete apiParams.departure_date;
    }
    
    const response = await api.get('/api/flights/', { params: apiParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching flights from API:', error);
    throw error; // Don't fall back to sample data, let the component handle the error
  }
};

export const bookFlight = async ({
  flightId,
  userId,
  bookingReference,
  seatNumbers
}: {
  flightId: number;
  userId: number;
  bookingReference: string;
  seatNumbers: string[];
}) => {
  try {
    const response = await api.post('/api/bookings/', {
      flight_id: flightId,
      user_id: userId,
      booking_reference: bookingReference,
      seat_numbers: seatNumbers
    });
    return response.data;
  } catch (error) {
    console.error('Error booking flight:', error);
    throw error;
  }
};

// Get booked seats for a flight
export const getBookedSeats = async (flightId: number): Promise<string[]> => {
  try {
    const response = await api.get(`/api/bookings/flight/${flightId}/seats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    throw error;
  }
};

// Create booking with passenger info and contact details
export const createBooking = async (bookingData: {
  flightId: number;
  contactEmail: string;
  contactPhone: string;
  passengers: Array<{
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    seatPreference: string;
    mealPreference: string;
    seat?: string;
  }>;
}) => {
  try {
    // Generate a unique booking reference
    const bookingReference = `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // Extract seat numbers from passengers
    const seatNumbers = bookingData.passengers
      .map(p => p.seat)
      .filter(Boolean) as string[];
    
    if (seatNumbers.length === 0) {
      throw new Error('No seats selected');
    }
    
    // For now, use a default user ID (in a real app, this would come from auth)
    const userId = 1;
    
    const response = await api.post('/api/bookings/', {
      flight_id: bookingData.flightId,
      user_id: userId,
      booking_reference: bookingReference,
      seat_numbers: seatNumbers
    });
    
    return {
      ...response.data,
      bookingReference,
      contactEmail: bookingData.contactEmail,
      contactPhone: bookingData.contactPhone,
      passengers: bookingData.passengers
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

// Create a new flight
export const createFlight = async (flightData: Omit<Flight, 'id'>): Promise<Flight> => {
  try {
    const response = await api.post('/api/flights/', flightData);
    return response.data;
  } catch (error) {
    console.error('Error creating flight:', error);
    throw error;
  }
};

// Update an existing flight
export const updateFlight = async (id: number, flightData: Partial<Omit<Flight, 'id'>>): Promise<Flight> => {
  try {
    const response = await api.put(`/api/flights/${id}`, flightData);
    return response.data;
  } catch (error) {
    console.error('Error updating flight:', error);
    throw error;
  }
};

// Delete a flight
export const deleteFlight = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/flights/${id}`);
  } catch (error) {
    console.error('Error deleting flight:', error);
    throw error;
  }
};

// Get flights with parameters
interface GetFlightsParams {
  skip?: number;
  limit?: number;
  departure_city?: string;
  arrival_city?: string;
  departure_date?: string;
}

export const getFlights = async (params?: GetFlightsParams): Promise<Flight[]> => {
  try {
    const response = await api.get('/api/flights/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
  }
};

// Get single flight
export const getFlight = async (id: number): Promise<Flight> => {
  try {
    const response = await api.get(`/api/flights/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flight:', error);
    throw error;
  }
};

// Flight service object for easier importing
export const flightService = {
  getFlights,
  getFlight,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
  getAllFlights,
  getFlightById,
  bookFlight,
  createBooking,
  getBookedSeats,
  getAirlines,
  getPriceRange
};

// Stats endpoint
export const getStats = async () => {
  try {
    const response = await api.get('/api/stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// Export default service for convenience
export default flightService;
