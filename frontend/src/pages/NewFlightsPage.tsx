import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grid, Snackbar, Alert } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flight } from '../types/Flight';
import { fetchFlights, searchFlights } from '../services/flightService';
import './TravelTheme.css';
import '../components/flights/AdminControls.css';
import { useAdmin } from '../contexts/AdminContext';

const australianCities = [
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
  'Gold Coast', 'Canberra', 'Darwin', 'Hobart', 'Cairns'
];

const NewFlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedMinPrice, setSelectedMinPrice] = useState(0);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
  const [fromCity, setFromCity] = useState('Sydney');
  const [toCity, setToCity] = useState('Melbourne');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [searchParams, setSearchParams] = useState<{from: string, to: string, maxPrice: number} | null>(null);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [selectedAirline, setSelectedAirline] = useState('');
  const [depTime, setDepTime] = useState<'morning' | 'afternoon' | 'evening' | ''>('');

  // Auto-search when airline or depTime changes
  useEffect(() => {
    // Only trigger if not initial load
    if (!loading && flights.length > 0) {
      handleSearch(new Event('submit') as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAirline, depTime]);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAdmin();
  
  // Check for query params indicating successful operations
  const queryParams = new URLSearchParams(location.search);
  const created = queryParams.get('created');
  const deleted = queryParams.get('deleted');
  
  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        console.log('Fetching flights from API...');
        const data = await fetchFlights();
        console.log('Flights data received:', data);
        setAllFlights(data);
        setFlights(data);
        // Extract min/max price
        const prices = data.map(f => f.price);
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        setMinPrice(minP);
        setMaxPrice(maxP);
        setSelectedMinPrice(minP);
        setSelectedMaxPrice(maxP);
        // Extract airline codes from flight_number
        const airlineSet = new Set(data.map(f => f.flight_number.substring(0, 2)));
        setAirlines(Array.from(airlineSet));
        setError(null);
      } catch (err) {
        setError('Failed to load flights. Please try again later.');
        console.error('Error loading flights:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
    
    // Listen for flight data changes from admin panel
    const handleFlightDataChanged = () => {
      console.log('Flight data changed - refreshing user view');
      loadFlights();
    };
    
    window.addEventListener('flightDataChanged', handleFlightDataChanged);
    
    // Auto-refresh every 2 minutes to keep data fresh
    const refreshInterval = setInterval(() => {
      loadFlights();
    }, 120000);
    
    // Show appropriate success messages
    if (created === 'true') {
      setSnackbarMessage('Flight created successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Remove the query param
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    
    if (deleted === 'true') {
      setSnackbarMessage('Flight deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Remove the query param
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
    
    return () => {
      window.removeEventListener('flightDataChanged', handleFlightDataChanged);
      clearInterval(refreshInterval);
    };
  }, [created, deleted]);

  const handleBookFlight = (flightId: number) => {
    navigate(`/booking/${flightId}`);
  };
  
  const handleViewFlightDetails = (flightId: number) => {
    navigate(`/flights/${flightId}`);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDuration = (departure: string, arrival: string) => {
    const departureTime = new Date(departure).getTime();
    const arrivalTime = new Date(arrival).getTime();
    const durationMs = arrivalTime - departureTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // No local filtering; always use backend results
  const filteredFlights = flights;

  // Search handler
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      let dep_time_start: string | undefined = undefined;
      let dep_time_end: string | undefined = undefined;
      if (depTime === 'morning') {
        dep_time_start = '00:00'; dep_time_end = '11:59';
      } else if (depTime === 'afternoon') {
        dep_time_start = '12:00'; dep_time_end = '17:59';
      } else if (depTime === 'evening') {
        dep_time_start = '18:00'; dep_time_end = '23:59';
      }
      // Send all filters, including numberOfTravelers and price range
      const params: any = {
        departure_city: fromCity,
        arrival_city: toCity,
        departure_date: departureDate || undefined,
        airline: selectedAirline || undefined,
        dep_time_start,
        dep_time_end,
        min_price: selectedMinPrice / numberOfTravelers, // backend expects per-ticket price
        max_price: selectedMaxPrice / numberOfTravelers, // backend expects per-ticket price
      };
      const filtered = await searchFlights(params);
      setFlights(filtered);
      setError(null);
    } catch (err) {
      setError('Failed to search flights.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-container" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)', minHeight: '100vh', paddingBottom: 40 }}>
      <div className="travel-hero" style={{ borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', margin: '32px auto', maxWidth: 1200 }}>
        <div className="travel-hero-content" style={{ padding: '48px 32px 32px 32px' }}>
          <h1 className="travel-hero-title" style={{ fontSize: 40, fontWeight: 700, color: '#0066cc', marginBottom: 8 }}>Find Your Perfect Flight</h1>
          <p className="travel-hero-subtitle" style={{ fontSize: 20, color: '#333', marginBottom: 32 }}>
            Discover the best deals on flights to your favorite destinations
          </p>
          {loading && (
            <div className="loading-indicator">
              <p>Loading flights...</p>
            </div>
          )}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      <div className="travel-search-container" style={{ margin: '0 auto', maxWidth: 900, marginBottom: 32 }}>
        <div className="travel-search-card" style={{ borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, background: '#fff' }}>
          <div className="travel-search-tabs">
            <div className="travel-search-tab active">Flights</div>
            <div className="travel-search-tab">Hotels</div>
            <div className="travel-search-tab">Holiday Packages</div>
          </div>
          
          <form className="travel-search-form" onSubmit={handleSearch}>
            <div className="travel-search-field">
              <label className="travel-search-label">From</label>
              <span className="travel-search-icon">
                <FlightIcon fontSize="small" style={{ transform: 'rotate(-45deg)' }} />
              </span>
              <select
                className="travel-search-input"
                value={fromCity}
                onChange={e => setFromCity(e.target.value)}
              >
                {australianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">To</label>
              <span className="travel-search-icon">
                <FlightIcon fontSize="small" style={{ transform: 'rotate(45deg)' }} />
              </span>
              <select
                className="travel-search-input"
                value={toCity}
                onChange={e => setToCity(e.target.value)}
              >
                {australianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Departure</label>
              <span className="travel-search-icon">📅</span>
              <input 
                type="date" 
                className="travel-search-input" 
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Travelers</label>
              <span className="travel-search-icon">👤</span>
              <input 
                type="number" 
                className="travel-search-input" 
                value={numberOfTravelers}
                onChange={e => setNumberOfTravelers(parseInt(e.target.value) || 1)}
                min="1"
                max="9"
              />
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Airline</label>
              <select
                className="travel-search-input"
                value={selectedAirline}
                onChange={e => setSelectedAirline(e.target.value)}
              >
                <option value="">All Airlines</option>
                {airlines.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Departure Time</label>
              <select
                className="travel-search-input"
                value={depTime}
                onChange={e => setDepTime(e.target.value as any)}
              >
                <option value="">Any</option>
                <option value="morning">Morning (00:00–11:59)</option>
                <option value="afternoon">Afternoon (12:00–17:59)</option>
                <option value="evening">Evening (18:00–23:59)</option>
              </select>
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Price Range</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>${selectedMinPrice}</span>
                <input
                  type="range"
                  min={minPrice}
                  max={selectedMaxPrice}
                  value={selectedMinPrice}
                  onChange={e => setSelectedMinPrice(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span>${selectedMaxPrice}</span>
                <input
                  type="range"
                  min={selectedMinPrice}
                  max={maxPrice}
                  value={selectedMaxPrice}
                  onChange={e => setSelectedMaxPrice(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            
            <button className="travel-search-button" type="submit">
              Search Flights
            </button>
          </form>
        </div>
      </div>
      
      <div className="travel-results-container" style={{ maxWidth: '100vw', margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 32 }}>
        <div className="travel-filters" style={{ minWidth: 340 }}>
          <h3 className="travel-filters-title">Filter Results</h3>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Max Price</label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, marginRight: 8 }}>
                Up to ${maxPrice.toLocaleString()}
              </span>
              <span style={{ color: '#888', fontSize: 14 }}>(per ticket)</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="50" 
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span>$100</span>
              <span>$2000</span>
            </div>
          </div>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Airlines</label>
            <select
              className="travel-search-input"
              value={selectedAirline}
              onChange={e => setSelectedAirline(e.target.value)}
              style={{ width: '100%', marginTop: 8 }}
            >
              <option value="">All Airlines</option>
              {airlines.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>

          <div className="travel-filter-group">
            <label className="travel-filter-label">Departure Time</label>
            <div className="travel-filter-options" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="travel-filter-option">
                <input
                  type="radio"
                  name="depTime"
                  value=""
                  checked={depTime === ''}
                  onChange={() => setDepTime('')}
                /> Any
              </label>
              <label className="travel-filter-option">
                <input
                  type="radio"
                  name="depTime"
                  value="morning"
                  checked={depTime === 'morning'}
                  onChange={() => setDepTime('morning')}
                /> Morning (00:00–11:59)
              </label>
              <label className="travel-filter-option">
                <input
                  type="radio"
                  name="depTime"
                  value="afternoon"
                  checked={depTime === 'afternoon'}
                  onChange={() => setDepTime('afternoon')}
                /> Afternoon (12:00–17:59)
              </label>
              <label className="travel-filter-option">
                <input
                  type="radio"
                  name="depTime"
                  value="evening"
                  checked={depTime === 'evening'}
                  onChange={() => setDepTime('evening')}
                /> Evening (18:00–23:59)
              </label>
            </div>
          </div>
        </div>
        <div className="travel-flight-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 32, marginTop: 32, flex: 1 }}>
          {!loading && !error && filteredFlights.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 20, padding: 40 }}>
              No flights found for your search.
            </div>
          )}
          {!loading && !error && filteredFlights.map((flight) => (
            <div 
              key={flight.id} 
              className="travel-flight-card" 
              style={{ borderRadius: 18, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', background: '#fff', padding: 32, transition: 'box-shadow 0.2s', cursor: 'pointer', width: '100%', maxWidth: 600, margin: '0 auto' }}
              onClick={() => handleViewFlightDetails(flight.id)}
            >
              <div className="travel-flight-header">
                <div className="travel-flight-airline">
                  <div className="travel-airline-logo">{flight.flight_number.charAt(0)}</div>
                  <div>
                    <div className="travel-airline-name">{flight.flight_number.substring(0, 2)}</div>
                    <div className="travel-flight-number">Flight {flight.flight_number}</div>
                  </div>
                </div>
                <div className="travel-flight-detail-link">
                  View Details
                </div>
              </div>
              
              <div className="travel-flight-content">
                <div className="travel-flight-info">
                  <div className="travel-flight-times">
                    <div className="travel-flight-time">{formatTime(flight.departure_time)}</div>
                    <div className="travel-flight-city">{flight.departure_city}</div>
                  </div>
                  
                  <div className="travel-flight-path">
                    <div className="travel-flight-duration">
                      {calculateDuration(flight.departure_time, flight.arrival_time)}
                    </div>
                    <div className="travel-flight-line"></div>
                    <div className="travel-flight-type">Direct Flight</div>
                  </div>
                  
                  <div className="travel-flight-times">
                    <div className="travel-flight-time">{formatTime(flight.arrival_time)}</div>
                    <div className="travel-flight-city">{flight.arrival_city}</div>
                  </div>
                </div>
                
                <div className="travel-flight-price-container">
                  <div className="travel-flight-price">
                    ${(flight.price * numberOfTravelers).toLocaleString()}
                    {numberOfTravelers > 1 && (
                      <div style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                        ${flight.price} × {numberOfTravelers} travelers
                      </div>
                    )}
                  </div>
                  <div className="travel-flight-seats">{flight.available_seats} seats left</div>
                  <button 
                    className="travel-book-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookFlight(flight.id);
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
              
              <div className="travel-flight-footer">
                <div className="travel-flight-features">
                  <div className="travel-flight-feature">
                    <LuggageIcon fontSize="small" /> Baggage Included
                  </div>
                  <div className="travel-flight-feature">
                    <RestaurantIcon fontSize="small" /> Meal
                  </div>
                  <div className="travel-flight-feature">
                    <WifiIcon fontSize="small" /> Wi-Fi
                  </div>
                </div>
                
                <button className="travel-view-details">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewFlightsPage;