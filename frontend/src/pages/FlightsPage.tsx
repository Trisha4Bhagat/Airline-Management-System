import Reacconst FlightSearchForm = ({ onSearch }: { onSearch: (from: string, to: string, date: string) => void }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  
  // Set min date as today for departure date
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(from, to, date);
  };State } from 'react';

import { Flight } from '../types/Flight';
import { searchFlights } from '../services/flightService';
import FlightCardSimple from '../components/flights/FlightCardSimple';
import BookingForm, { PassengerDetail } from '../components/flights/BookingForm';
import BookingConfirmation from '../components/flights/BookingConfirmation';
import '../components/flights/BookingForm.css';
import '../components/flights/BookingConfirmation.css';

// Flight Search Component
const FlightSearchForm = ({ onSearch }: { onSearch: (from: string, to: string, date: string) => void }) => {
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
      setFlights(data);
    } catch (err) {
      console.error('Error loading flights:', err);
      setError('Failed to load flights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (departure: string, arrival: string, date: Date | null) => {
    if (!departure || !arrival || !date) {
      setError('Please fill in all search fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const data = await FlightService.searchFlights(departure, arrival, formattedDate);
      setFlights(data);
      if (data.length === 0) {
        setError('No flights found matching your criteria');
      }
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search flights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flightId: number) => {
    navigate(`/booking/${flightId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Find Your Flight
        </Typography>
        
        <FlightSearch onSearch={handleSearch} />
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              {flights.length > 0 
                ? `Available Flights (${flights.length})` 
                : 'No flights found'}
            </Typography>
            
            {flights.map(flight => (
              <FlightCard 
                key={flight.id} 
                flight={flight} 
                onBookNow={handleBookFlight} 
              />
            ))}
          </>
        )}
      </Box>
    </Container>
  );
};

export default FlightsPage;