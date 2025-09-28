import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grid, Snackbar, Alert } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flight } from '../types/Flight';
import { fetchFlights } from '../services/flightService';
import './TravelTheme.css';
import '../components/flights/AdminControls.css';

// Australian cities for the search dropdowns
const australianCities = [
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 
  'Gold Coast', 'Canberra', 'Darwin', 'Hobart', 'Cairns'
];

const NewFlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    departureCity: '',
    arrivalCity: '',
    departureDate: new Date().toISOString().split('T')[0],
    travelers: 1
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  
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
        setFlights(data);
        setError(null);
      } catch (err) {
        setError('Failed to load flights. Please try again later.');
        console.error('Error loading flights:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
    
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
  }, [created, deleted]);

  const handleSearch = async () => {
    if (!searchForm.departureCity || !searchForm.arrivalCity) {
      setSnackbarMessage('Please select both departure and arrival cities');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      console.log('Searching flights with:', searchForm);
      
      // Search flights with the selected criteria
      const searchParams = new URLSearchParams({
        departure_city: searchForm.departureCity,
        arrival_city: searchForm.arrivalCity,
        departure_date: searchForm.departureDate,
        skip: '0',
        limit: '50'
      });
      
      const response = await fetch(`http://localhost:8000/api/flights/?${searchParams}`);
      if (!response.ok) {
        throw new Error('Failed to search flights');
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      setFlights(data);
      setError(null);
      
      if (data.length === 0) {
        setSnackbarMessage(`No flights found from ${searchForm.departureCity} to ${searchForm.arrivalCity}`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setError('Failed to search flights. Please try again later.');
      console.error('Error searching flights:', err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="travel-container">
      <div className="travel-hero">
        <div className="travel-hero-content">
          <h1 className="travel-hero-title">Find Your Perfect Flight</h1>
          <p className="travel-hero-subtitle">
            Discover the best deals on Australian domestic flights
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
      
      <div className="travel-search-container">
        <div className="travel-search-card">          
          <div className="travel-search-form">
            <div className="travel-search-field">
              <label className="travel-search-label">From</label>
              <span className="travel-search-icon">
                <FlightIcon fontSize="small" style={{ transform: 'rotate(-45deg)' }} />
              </span>
              <select 
                className="travel-search-input" 
                value={searchForm.departureCity}
                onChange={(e) => setSearchForm({...searchForm, departureCity: e.target.value})}
              >
                <option value="">Select departure city</option>
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
                value={searchForm.arrivalCity}
                onChange={(e) => setSearchForm({...searchForm, arrivalCity: e.target.value})}
              >
                <option value="">Select arrival city</option>
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
                value={searchForm.departureDate}
                onChange={(e) => setSearchForm({...searchForm, departureDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Travelers</label>
              <span className="travel-search-icon">👤</span>
              <input 
                type="number" 
                className="travel-search-input" 
                value={searchForm.travelers}
                onChange={(e) => setSearchForm({...searchForm, travelers: parseInt(e.target.value)})}
                min="1"
                max="9"
              />
            </div>
            
            <button 
              className="travel-search-button"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="travel-results-container">        
        <div className="travel-filters">
          <h3 className="travel-filters-title">Filter Results</h3>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Price Range (AUD)</label>
            <input 
              type="range" 
              min="50" 
              max="1000" 
              step="10" 
              defaultValue="500" 
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span>$50</span>
              <span>$1000</span>
            </div>
          </div>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Airlines</label>
            <div className="travel-filter-options">
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Qantas
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Virgin Australia
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Jetstar
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Rex Airlines
              </label>
            </div>
          </div>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Stops</label>
            <div className="travel-filter-options">
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Direct
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> 1 Stop
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" /> 2+ Stops
              </label>
            </div>
          </div>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Departure Time</label>
            <div className="travel-filter-options">
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Morning
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Afternoon
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Evening
              </label>
            </div>
          </div>
        </div>
        
        <div className="travel-flight-results">
          <div className="travel-flight-list-header">
            <h2>Available Flights</h2>
            <p>
              {searchForm.departureCity && searchForm.arrivalCity 
                ? `${searchForm.departureCity} → ${searchForm.arrivalCity}, ${formatDate(searchForm.departureDate)}`
                : `All Australian Flights, ${formatDate(new Date().toISOString())}`
              }
            </p>
          </div>
          
          {loading && (
            <div className="travel-loading">
              <div className="travel-loading-animation"></div>
              <p>Searching for the best flights...</p>
            </div>
          )}
          
          {error && (
            <div className="travel-error-message">
              {error}
            </div>
          )}
          
          {!loading && !error && flights.length === 0 && (
            <div className="travel-no-results">
              <div className="travel-no-results-icon">🔍</div>
              <h3>No Flights Found</h3>
              <p>We couldn't find any flights matching your search criteria.</p>
              <p>Please try adjusting your search or filters.</p>
            </div>
          )}
          
          <div className="travel-flight-list">
            {!loading && !error && flights.map((flight) => (
              <div 
                key={flight.id} 
                className="travel-flight-card" 
                onClick={() => handleViewFlightDetails(flight.id)}
                style={{ cursor: 'pointer' }}
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
                    <div className="travel-flight-price">${Math.round(flight.price)} AUD</div>
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