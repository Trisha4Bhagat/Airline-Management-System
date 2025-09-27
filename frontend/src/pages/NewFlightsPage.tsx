import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import { useNavigate } from 'react-router-dom';
import { Flight } from '../types/Flight';
import { fetchFlights } from '../services/flightService';
import './TravelTheme.css';

const NewFlightsPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        const data = await fetchFlights();
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
  }, []);

  const handleBookFlight = (flightId: number) => {
    navigate(`/booking/${flightId}`);
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
            Discover the best deals on flights to your favorite destinations
          </p>
        </div>
      </div>
      
      <div className="travel-search-container">
        <div className="travel-search-card">
          <div className="travel-search-tabs">
            <div className="travel-search-tab active">Flights</div>
            <div className="travel-search-tab">Hotels</div>
            <div className="travel-search-tab">Holiday Packages</div>
          </div>
          
          <div className="travel-search-form">
            <div className="travel-search-field">
              <label className="travel-search-label">From</label>
              <span className="travel-search-icon">
                <FlightIcon fontSize="small" style={{ transform: 'rotate(-45deg)' }} />
              </span>
              <input 
                type="text" 
                className="travel-search-input" 
                placeholder="Departure City or Airport"
                defaultValue="New York (JFK)"
              />
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">To</label>
              <span className="travel-search-icon">
                <FlightIcon fontSize="small" style={{ transform: 'rotate(45deg)' }} />
              </span>
              <input 
                type="text" 
                className="travel-search-input" 
                placeholder="Arrival City or Airport"
                defaultValue="Los Angeles (LAX)"
              />
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Departure</label>
              <span className="travel-search-icon">📅</span>
              <input 
                type="date" 
                className="travel-search-input" 
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Return</label>
              <span className="travel-search-icon">📅</span>
              <input 
                type="date" 
                className="travel-search-input" 
              />
            </div>
            
            <div className="travel-search-field">
              <label className="travel-search-label">Travelers</label>
              <span className="travel-search-icon">👤</span>
              <input 
                type="number" 
                className="travel-search-input" 
                defaultValue="1"
                min="1"
              />
            </div>
            
            <button className="travel-search-button">
              Search Flights
            </button>
          </div>
        </div>
      </div>
      
      <div className="travel-results-container">
        <div className="travel-filters">
          <h3 className="travel-filters-title">Filter Results</h3>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Price Range</label>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="50" 
              defaultValue="1000" 
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span>$100</span>
              <span>$2000</span>
            </div>
          </div>
          
          <div className="travel-filter-group">
            <label className="travel-filter-label">Airlines</label>
            <div className="travel-filter-options">
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Air Canada
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> Delta
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> United Airlines
              </label>
              <label className="travel-filter-option">
                <input type="checkbox" className="travel-filter-checkbox" defaultChecked /> American Airlines
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
            <p>JFK → LAX, {formatDate(new Date().toISOString())}</p>
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
              <p>Please try adjusting your filters or search for a different route.</p>
            </div>
          )}
          
          <div className="travel-flight-list">
            {!loading && !error && flights.map((flight) => (
              <div key={flight.id} className="travel-flight-card">
                <div className="travel-flight-header">
                  <div className="travel-flight-airline">
                    <div className="travel-airline-logo">{flight.airline.charAt(0)}</div>
                    <div>
                      <div className="travel-airline-name">{flight.airline}</div>
                      <div className="travel-flight-number">Flight {flight.flight_number}</div>
                    </div>
                  </div>
                </div>
                
                <div className="travel-flight-content">
                  <div className="travel-flight-info">
                    <div className="travel-flight-times">
                      <div className="travel-flight-time">{formatTime(flight.departure_time)}</div>
                      <div className="travel-flight-city">{flight.origin}</div>
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
                      <div className="travel-flight-city">{flight.destination}</div>
                    </div>
                  </div>
                  
                  <div className="travel-flight-price-container">
                    <div className="travel-flight-price">${flight.price}</div>
                    <div className="travel-flight-seats">{flight.available_seats} seats left</div>
                    <button 
                      className="travel-book-button"
                      onClick={() => handleBookFlight(flight.id)}
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
    </div>
  );
};

export default NewFlightsPage;