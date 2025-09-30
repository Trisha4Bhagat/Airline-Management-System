import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grid, Snackbar, Alert } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import { useNavigate, useLocation } from 'react-router-dom';
import { Flight } from '../types/Flight';
import { fetchFlights, searchFlights, getAirlines, getPriceRange } from '../services/flightService';
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
  const [searchLoading, setSearchLoading] = useState<boolean>(false); // Separate search loading
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [basePriceRange, setBasePriceRange] = useState({min: 0, max: 0}); // Cache base prices
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
  const [fromCity, setFromCity] = useState('Sydney');
  const [toCity, setToCity] = useState('Melbourne');
  const [departureDate, setDepartureDate] = useState(new Date().toISOString().split('T')[0]);
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [searchParams, setSearchParams] = useState<{from: string, to: string, maxPrice: number} | null>(null);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [selectedAirline, setSelectedAirline] = useState('');
  const [depTime, setDepTime] = useState<'morning' | 'afternoon' | 'evening' | ''>('');

  // Reset price range when number of travelers changes
  useEffect(() => {
    if (minPrice > 0 && maxPrice > 0) {
      setSelectedMaxPrice(maxPrice);
    }
  }, [numberOfTravelers, minPrice, maxPrice]);

  // Auto-search when filters change (optimized with faster debounce)
  useEffect(() => {
    // Only trigger if not initial load and we have completed initial data load
    if (!loading && allFlights.length > 0 && fromCity && toCity) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 150); // Reduced debounce for faster response
      
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAirline, depTime, numberOfTravelers, selectedMaxPrice, fromCity, toCity, departureDate]);
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
        const data = await fetchFlights();
        setAllFlights(data);
        setFlights(data);
        
        // Get initial price range for 1 traveler and airlines
        const [initialPriceData, airlinesList] = await Promise.all([
          getPriceRange(numberOfTravelers), // Get range for current number of travelers
          getAirlines()
        ]);
        
        // Store base (per-person) prices for calculation
        setBasePriceRange({min: initialPriceData.min_price, max: initialPriceData.max_price});
        
        // Calculate total prices for display (per-person price × travelers)
        setMinPrice(initialPriceData.min_price * numberOfTravelers);
        setMaxPrice(initialPriceData.max_price * numberOfTravelers);
        setSelectedMaxPrice(initialPriceData.max_price * numberOfTravelers);
        setAirlines(airlinesList);
        
        setError(null);
      } catch (err) {
        setError('Failed to load flights. Please try again later.');
        console.error('Error loading flights:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
    
    // Listen for flight data changes from admin panel (but remove auto-refresh)
    const handleFlightDataChanged = () => {
      loadFlights();
    };
    
    window.addEventListener('flightDataChanged', handleFlightDataChanged);
    
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
    };
  }, [created, deleted]);

  // Update price range when number of travelers changes
  useEffect(() => {
    const updatePriceRange = async () => {
      if (numberOfTravelers > 0) {
        try {
          // Get updated price range from backend (returns per-person prices)
          const priceRange = await getPriceRange(numberOfTravelers);
          
          // Update base prices cache
          setBasePriceRange({min: priceRange.min_price, max: priceRange.max_price});
          
          // Calculate total prices for display
          const totalMin = priceRange.min_price * numberOfTravelers;
          const totalMax = priceRange.max_price * numberOfTravelers;
          
          setMinPrice(totalMin);
          setMaxPrice(totalMax);
          setSelectedMaxPrice(totalMax);
        } catch (error) {
          console.error('Error updating price range:', error);
          // Fallback to simple multiplication if API fails
          if (basePriceRange.min > 0 && basePriceRange.max > 0) {
            const newMin = basePriceRange.min * numberOfTravelers;
            const newMax = basePriceRange.max * numberOfTravelers;
            setMinPrice(newMin);
            setMaxPrice(newMax);
            setSelectedMaxPrice(newMax);
          }
        }
      }
    };

    updatePriceRange();
  }, [numberOfTravelers]);

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

  // Search handler (optimized with separate loading state)
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchLoading(true); // Use separate loading state for searches
    try {
      let dep_time_start: string | undefined = undefined;
      let dep_time_end: string | undefined = undefined;
      if (depTime === 'morning') {
        dep_time_start = '06:00'; dep_time_end = '11:59';
      } else if (depTime === 'afternoon') {
        dep_time_start = '12:00'; dep_time_end = '17:59';
      } else if (depTime === 'evening') {
        dep_time_start = '18:00'; dep_time_end = '23:59';
      }
      
      // Build search parameters - send per-person max price to backend
      const params: any = {
        departure_city: fromCity,
        arrival_city: toCity,
        departure_date: departureDate || undefined,
        airline: selectedAirline || undefined,
        dep_time_start,
        dep_time_end,
        max_price: Math.round(selectedMaxPrice / numberOfTravelers), // Convert to per-person price
      };
      
      // Remove undefined values to clean up the query
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      const searchResults = await searchFlights(params);
      
      // Apply travelers multiplier for display (backend returns per-person prices)
      const resultsWithTotalPricing = searchResults.map(flight => ({
        ...flight,
        basePrice: flight.price, // Store original per-person price
        price: flight.price * numberOfTravelers, // Display total price
        pricePerPerson: flight.price // Keep per-person price for reference
      }));
      
      setFlights(resultsWithTotalPricing);
      setError(null);
      
      if (searchResults.length === 0) {
        setError('No flights found matching your criteria. Try adjusting your filters.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search flights. Please try again.');
      setFlights([]);
    } finally {
      setSearchLoading(false); // Reset search loading state
    }
  };

  return (
    <div className="travel-container" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', paddingBottom: 40 }}>
      <div className="travel-hero">
        <div className="hero-container">
          <div className="hero-text-column">
            <h1 className="hero-main-heading">Welcome to SkyJourney Airlines</h1>
            <h2 className="hero-subheading">Find your perfect flight</h2>
            <button className="hero-cta-button" onClick={() => {
              const searchSection = document.querySelector('.travel-search-container');
              if (searchSection) {
                searchSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}>
              Book Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading and Error States */}
      {loading && allFlights.length === 0 && (
        <div className="loading-indicator" style={{ 
          textAlign: 'center', 
          padding: '20px 24px', 
          background: 'linear-gradient(135deg, rgba(0,99,178,0.05) 0%, rgba(255,255,255,0.8) 100%)',
          borderRadius: 16,
          border: '1px solid rgba(0,99,178,0.1)',
          backdropFilter: 'blur(10px)',
          animation: 'pulse 2s ease-in-out infinite',
          margin: '24px auto',
          maxWidth: 600
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🔄</div>
          <p style={{ color: '#1976d2', margin: 0, fontWeight: 500 }}>Loading flights and setting up search...</p>
        </div>
      )}
      {error && !loading && (
        <div className="error-message" style={{ 
          textAlign: 'center', 
          padding: '20px 24px', 
          background: 'linear-gradient(135deg, rgba(244,67,54,0.05) 0%, rgba(255,255,255,0.9) 100%)',
          borderRadius: 16,
          border: '1px solid rgba(244,67,54,0.2)',
          backdropFilter: 'blur(10px)',
          margin: '24px auto',
          maxWidth: 600
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⚠️</div>
          <p style={{ color: '#d32f2f', margin: 0, fontWeight: 500 }}>{error}</p>
        </div>
      )}
      
      <div className="travel-search-container" style={{ margin: '0 auto', maxWidth: 900, marginBottom: 32 }}>
        <div className="travel-search-card" style={{ borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', padding: 32, background: '#fff' }}>
          <div className="travel-search-tabs">
            <div className="travel-search-tab active">Flights</div>
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
                <option value="morning">Morning (06:00–11:59)</option>
                <option value="afternoon">Afternoon (12:00–17:59)</option>
                <option value="evening">Evening (18:00–23:59)</option>
              </select>
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Maximum Price (Total for {numberOfTravelers} traveler{numberOfTravelers > 1 ? 's' : ''})</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={selectedMaxPrice}
                  onChange={e => setSelectedMaxPrice(Math.round(Number(e.target.value)))}
                  style={{ flex: 1, accentColor: 'var(--primary-color)' }}
                />
                <input
                  type="number"
                  value={selectedMaxPrice}
                  onChange={e => setSelectedMaxPrice(Math.round(Number(e.target.value)))}
                  style={{ 
                    width: '100px', 
                    padding: '8px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  min={minPrice}
                  max={maxPrice}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Show flights up to ${selectedMaxPrice.toLocaleString()} (Range: ${minPrice} - ${maxPrice})
              </div>
            </div>
            
            <button className="travel-search-button" type="submit" disabled={searchLoading}>
              {searchLoading ? 'Searching...' : 'Search Flights'}
            </button>
          </form>
          
          {/* Search Loading Indicator */}
          {searchLoading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '12px',
              color: '#1976d2',
              fontSize: '14px',
              fontWeight: 500
            }}>
              🔍 Searching for flights...
            </div>
          )}
        </div>
      </div>
      
      <div className="travel-results-container" style={{ maxWidth: '100vw', margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 32 }}>
        <div className="travel-filters" style={{ minWidth: 340 }}>
          <h3 className="travel-filters-title">Filter Results</h3>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Maximum Price (Total)</label>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, marginRight: 8 }}>
                Up to ${(selectedMaxPrice * numberOfTravelers).toLocaleString()}
              </span>
              <span style={{ color: '#888', fontSize: 14 }}>
                (for {numberOfTravelers} traveler{numberOfTravelers > 1 ? 's' : ''})
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input 
                type="range" 
                min={minPrice * numberOfTravelers}
                max={maxPrice * numberOfTravelers}
                value={selectedMaxPrice * numberOfTravelers}
                onChange={e => setSelectedMaxPrice(Math.ceil(Number(e.target.value) / numberOfTravelers))}
                style={{ flex: 1, accentColor: 'var(--primary-color)' }}
              />
              <input
                type="number"
                value={selectedMaxPrice * numberOfTravelers}
                onChange={e => setSelectedMaxPrice(Math.ceil(Number(e.target.value) / numberOfTravelers))}
                style={{ 
                  width: '80px', 
                  padding: '4px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                min={minPrice * numberOfTravelers}
                max={maxPrice * numberOfTravelers}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '12px', color: '#666' }}>
              <span>${minPrice * numberOfTravelers} total</span>
              <span>${maxPrice * numberOfTravelers} total</span>
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
                /> Morning (06:00–11:59)
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
          {loading && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 18, color: '#666' }}>🔍 Searching for flights...</div>
            </div>
          )}
          {!loading && error && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 18, color: '#e44', marginBottom: 8 }}>❌ Error</div>
              <div style={{ color: '#666' }}>{error}</div>
            </div>
          )}
          {!loading && !error && filteredFlights.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 24, color: '#888', marginBottom: 16 }}>✈️ No flights found</div>
              <div style={{ fontSize: 16, color: '#aaa', marginBottom: 16 }}>
                No flights match your current search criteria.
              </div>
              <div style={{ fontSize: 14, color: '#999' }}>
                Try adjusting your filters:
                <ul style={{ listStyle: 'none', padding: 0, marginTop: 8 }}>
                  <li>• Change departure or arrival cities</li>
                  <li>• Select a different date</li>
                  <li>• Adjust your budget range</li>
                  <li>• Try a different departure time</li>
                  <li>• Select "All Airlines"</li>
                </ul>
              </div>
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
                    ${flight.price.toLocaleString()}
                    {numberOfTravelers > 1 && (
                      <div style={{ fontSize: '14px', color: '#666', fontWeight: 'normal' }}>
                        ${(flight.pricePerPerson || flight.basePrice || flight.price / numberOfTravelers).toLocaleString()} × {numberOfTravelers} travelers
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