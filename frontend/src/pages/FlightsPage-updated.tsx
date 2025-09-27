import React, { useState, useEffect } from 'react';
import { Flight } from '../types/Flight';
import { searchFlights } from '../services/flightService';
import FlightCardSimple from '../components/flights/FlightCardSimple';
import BookingForm, { PassengerDetail } from '../components/flights/BookingForm';
import BookingConfirmation from '../components/flights/BookingConfirmation';
import DashboardLayout from '../components/common/DashboardLayout';
import '../components/flights/BookingForm.css';
import '../components/flights/BookingConfirmation.css';

const FlightsPage: React.FC = () => {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingPassengers, setBookingPassengers] = useState<PassengerDetail[]>([]);

  // Available cities for the dropdown (in a real app, this would come from an API)
  const cities = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Dubai', 'Rome', 'Beijing', 'Mumbai'];

  // Set min date as today for departure date
  const today = new Date().toISOString().split('T')[0];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await searchFlights({
        departure_city: departureCity,
        arrival_city: arrivalCity,
        departure_date: departureDate
      });
      setFlights(data);
      
      // If no flights found, show a message
      if (data.length === 0) {
        setError('No flights found for the selected criteria. Please try different dates or destinations.');
      }
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search flights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (flightId: number) => {
    const flight = flights.find(f => f.id === flightId);
    if (flight) {
      setSelectedFlight(flight);
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = (passengers: PassengerDetail[]) => {
    // In a real app, this would send the booking to the API
    console.log('Booking submitted:', {
      flight: selectedFlight,
      passengers
    });
    
    // Store the passengers for the confirmation page
    setBookingPassengers(passengers);
    
    // Close booking form and show confirmation
    setShowBookingForm(false);
    setShowConfirmation(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedFlight(null);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedFlight(null);
    setBookingPassengers([]);
  };

  const handleBackToFlights = () => {
    setShowConfirmation(false);
    setSelectedFlight(null);
    setBookingPassengers([]);
  };

  return (
    <div className="page-container">
      <h1>Flight Search</h1>
      
      {/* Flight search form */}
      <div className="flight-search-form">
        <form onSubmit={handleSearch}>
          <div className="search-row">
            <div className="search-field">
              <label htmlFor="departureCity">From</label>
              <select
                id="departureCity"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                required
              >
                <option value="">Select departure city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="search-field">
              <label htmlFor="arrivalCity">To</label>
              <select
                id="arrivalCity"
                value={arrivalCity}
                onChange={(e) => setArrivalCity(e.target.value)}
                required
              >
                <option value="">Select arrival city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="search-field">
              <label htmlFor="departureDate">Departure Date</label>
              <input
                id="departureDate"
                type="date"
                min={today}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="search-row">
            <button
              type="submit"
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </form>
      </div>

      {/* Flight search results */}
      <div className="flight-results">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {loading && (
          <div className="loading">
            <p>Searching for flights...</p>
          </div>
        )}
        
        {!loading && !error && flights.length > 0 && (
          <>
            <h2>Available Flights</h2>
            {flights.map(flight => (
              <FlightCardSimple
                key={flight.id}
                flight={flight}
                onBookNow={handleBookNow}
              />
            ))}
          </>
        )}
        
        {!loading && !error && flights.length === 0 && departureCity && arrivalCity && (
          <div>
            <p>No flights found for the selected criteria. Please try different dates or destinations.</p>
          </div>
        )}
      </div>
      
      {/* Booking form modal */}
      {showBookingForm && selectedFlight && (
        <BookingForm
          flight={selectedFlight}
          onClose={handleCloseBookingForm}
          onSubmit={handleBookingSubmit}
        />
      )}
      
      {/* Booking confirmation modal */}
      {showConfirmation && selectedFlight && (
        <BookingConfirmation
          flight={selectedFlight}
          passengers={bookingPassengers}
          onClose={handleCloseConfirmation}
          onBackToFlights={handleBackToFlights}
        />
      )}
    </div>
  );
};

export default FlightsPage;