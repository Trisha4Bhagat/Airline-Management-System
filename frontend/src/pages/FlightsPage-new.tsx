import React, { useState } from 'react';

interface Flight {
  id: number;
  flight_number: string;
  departure_city: string;
  arrival_city: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
}

// Sample flight data (in a real app, this would come from an API)
const sampleFlights: Flight[] = [
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
  }
];

// Flight Search Component
const FlightSearchForm = ({ onSearch }: { onSearch: (from: string, to: string) => void }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(from, to);
  };

  return (
    <div className="flight-search">
      <h2>Search Flights</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="departure">From:</label>
          <select
            id="departure"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          >
            <option value="">Select departure city</option>
            <option value="New York">New York</option>
            <option value="London">London</option>
            <option value="Paris">Paris</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="arrival">To:</label>
          <select
            id="arrival"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          >
            <option value="">Select arrival city</option>
            <option value="New York">New York</option>
            <option value="London">London</option>
            <option value="Paris">Paris</option>
          </select>
        </div>
        <button type="submit" className="search-button">Search Flights</button>
      </form>
    </div>
  );
};

// Flight Card Component
const FlightCard = ({ flight, onBook }: { flight: Flight; onBook: (id: number) => void }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flight-card">
      <div className="flight-header">
        <span className="flight-number">{flight.flight_number}</span>
        <span className="flight-price">${flight.price}</span>
      </div>
      <div className="flight-details">
        <div className="flight-route">
          <div className="departure">
            <div className="city">{flight.departure_city}</div>
            <div className="time">{formatDate(flight.departure_time)}</div>
          </div>
          <div className="flight-duration">
            <div className="duration-line"></div>
          </div>
          <div className="arrival">
            <div className="city">{flight.arrival_city}</div>
            <div className="time">{formatDate(flight.arrival_time)}</div>
          </div>
        </div>
        <div className="flight-info">
          <span className="seats">Seats available: {flight.available_seats}</span>
          <button className="book-button" onClick={() => onBook(flight.id)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// Main FlightsPage Component
const FlightsPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (departureCity: string, arrivalCity: string) => {
    if (!departureCity || !arrivalCity) {
      setError('Please select both departure and arrival cities');
      return;
    }

    setLoading(true);
    setError(null);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const filteredFlights = sampleFlights.filter(
        flight => flight.departure_city === departureCity && flight.arrival_city === arrivalCity
      );
      
      setFlights(filteredFlights);
      setSearched(true);
      setLoading(false);
      
      if (filteredFlights.length === 0) {
        setError('No flights found matching your criteria');
      }
    }, 500); // Simulate network delay
  };

  const handleBookFlight = (flightId: number) => {
    // In a real app, this would navigate to the booking page
    alert(`Booking flight with ID: ${flightId}`);
    window.location.href = `/booking/${flightId}`;
  };

  return (
    <div className="page-container">
      <h1>Find Your Flight</h1>
      
      <FlightSearchForm onSearch={handleSearch} />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading flights...</div>
      ) : (
        <div className="flight-results">
          {searched && (
            <>
              <h2>Search Results</h2>
              {flights.length > 0 ? (
                flights.map(flight => (
                  <FlightCard 
                    key={flight.id}
                    flight={flight}
                    onBook={handleBookFlight}
                  />
                ))
              ) : (
                searched && !error && <p>No flights available for this route.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightsPage;