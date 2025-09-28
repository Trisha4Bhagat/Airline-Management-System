import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getFlightById, deleteFlight } from '../services/flightService';
import { Flight } from '../types/Flight';
import './TravelTheme.css';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert } from '@mui/material';

const FlightDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for query params indicating successful updates
  const queryParams = new URLSearchParams(location.search);
  const updated = queryParams.get('updated');

  useEffect(() => {
    const loadFlight = async () => {
      if (!id) {
        setError('Flight ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching flight details for ID:', id);
        const data = await getFlightById(parseInt(id));
        console.log('Flight data received:', data);
        setFlight(data);
        setError(null);
      } catch (err) {
        setError('Failed to load flight details. Please try again later.');
        console.error('Error loading flight details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
    
    // Show snackbar if flight was updated
    if (updated === 'true') {
      setSnackbarMessage('Flight updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Remove the query param
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [id, updated]);

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

  const handleBookFlight = () => {
    if (flight) {
      navigate(`/booking/${flight.id}`);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleEditFlight = () => {
    if (flight) {
      navigate(`/flights/${flight.id}/edit`);
    }
  };
  
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };
  
  const handleDeleteConfirm = async () => {
    if (!id) return;
    
    try {
      setDeleteLoading(true);
      await deleteFlight(parseInt(id));
      setDeleteDialogOpen(false);
      
      // Show success message before navigating
      setSnackbarMessage('Flight deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Delay navigation slightly to allow snackbar to be seen
      setTimeout(() => {
        navigate('/flights?deleted=true');
      }, 1500);
    } catch (err) {
      console.error('Error deleting flight:', err);
      setSnackbarMessage('Failed to delete flight. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="travel-container">
      <div className="flight-detail-banner">
        <img src="/images/travel_bg.svg" alt="Travel background" className="flight-detail-bg" />
        <div className="flight-detail-overlay"></div>
      </div>
      
      <div className="flight-detail-content">
        <div className="flight-detail-header">
          <button className="travel-back-button" onClick={handleGoBack}>
            <ArrowBackIcon fontSize="small" /> Back to Flights
          </button>
          
          <h1 className="flight-detail-title">
            <img src="/images/stylized_plane.svg" className="flight-detail-icon" alt="Airplane" />
            Flight Details
          </h1>
          
          {flight && <div className="flight-detail-flight-number">#{flight.flight_number}</div>}
        </div>
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading flight details...</p>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && flight && (
          <div className="flight-detail-wrapper">
            <div className="flight-detail-card">
              <div className="flight-detail-card-header">
                <div className="flight-detail-airline">
                  <div className="flight-detail-airline-logo">
                    {flight.flight_number.charAt(0)}
                  </div>
                  <div className="flight-detail-airline-info">
                    <div className="flight-detail-airline-name">{flight.flight_number.substring(0, 2)} Airlines</div>
                    <div className="flight-detail-flight-num">Flight {flight.flight_number}</div>
                  </div>
                </div>
                <div className="flight-detail-price">
                  <span className="flight-detail-price-value">${flight.price}</span>
                  <span className="flight-detail-price-label">per person</span>
                </div>
              </div>

              <div className="flight-detail-route-display">
                <div className="flight-detail-location departure">
                  <div className="flight-detail-city-code">{flight.departure_city.substring(0, 3).toUpperCase()}</div>
                  <h3 className="flight-detail-city-name">{flight.departure_city}</h3>
                  <div className="flight-detail-datetime">
                    <p className="flight-detail-time">{formatTime(flight.departure_time)}</p>
                    <p className="flight-detail-date">{formatDate(flight.departure_time)}</p>
                  </div>
                </div>
                
                <div className="flight-detail-journey">
                  <div className="flight-detail-duration">
                    {calculateDuration(flight.departure_time, flight.arrival_time)}
                  </div>
                  <div className="flight-detail-route-line">
                    <div className="flight-detail-plane-icon">
                      <img src="/images/stylized_plane.svg" alt="Plane" width="24" />
                    </div>
                  </div>
                  <div className="flight-detail-flight-type">Direct Flight</div>
                </div>
                
                <div className="flight-detail-location arrival">
                  <div className="flight-detail-city-code">{flight.arrival_city.substring(0, 3).toUpperCase()}</div>
                  <h3 className="flight-detail-city-name">{flight.arrival_city}</h3>
                  <div className="flight-detail-datetime">
                    <p className="flight-detail-time">{formatTime(flight.arrival_time)}</p>
                    <p className="flight-detail-date">{formatDate(flight.arrival_time)}</p>
                  </div>
                </div>
              </div>
              
              <div className="flight-detail-sections">
                <div className="flight-detail-section">
                  <h3 className="flight-detail-section-title">
                    <span className="flight-detail-section-icon">🛫</span>
                    Flight Information
                  </h3>
                  <div className="flight-detail-grid">
                    <div className="flight-detail-item">
                      <span className="flight-detail-label">Aircraft Type</span>
                      <span className="flight-detail-value">Commercial Jet</span>
                    </div>
                    <div className="flight-detail-item">
                      <span className="flight-detail-label">Available Seats</span>
                      <span className="flight-detail-value">{flight.available_seats}</span>
                    </div>
                    <div className="flight-detail-item">
                      <span className="flight-detail-label">Flight Number</span>
                      <span className="flight-detail-value">{flight.flight_number}</span>
                    </div>
                    <div className="flight-detail-item">
                      <span className="flight-detail-label">Duration</span>
                      <span className="flight-detail-value">{calculateDuration(flight.departure_time, flight.arrival_time)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flight-detail-section">
                  <h3 className="flight-detail-section-title">
                    <span className="flight-detail-section-icon">✨</span>
                    Amenities & Services
                  </h3>
                  <div className="flight-detail-amenities">
                    <div className="flight-detail-amenity">
                      <LuggageIcon fontSize="small" /> Baggage Included
                    </div>
                    <div className="flight-detail-amenity">
                      <RestaurantIcon fontSize="small" /> Complimentary Meal
                    </div>
                    <div className="flight-detail-amenity">
                      <WifiIcon fontSize="small" /> In-flight Wi-Fi
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flight-detail-booking-section">
                <img src="/images/boarding_pass.svg" alt="Boarding pass" className="flight-detail-boarding-pass" />
                <div className="flight-detail-booking-content">
                  <h3 className="flight-detail-booking-title">Ready to Book?</h3>
                  <p className="flight-detail-booking-text">Secure your seat on this flight now for a smooth travel experience.</p>
                  <button 
                    className="flight-detail-book-button"
                    onClick={handleBookFlight}
                  >
                    Book This Flight
                  </button>
                </div>
              </div>
              
              <div className="flight-detail-admin-actions">
                <button 
                  className="flight-detail-edit-button"
                  onClick={handleEditFlight}
                >
                  <EditIcon fontSize="small" /> Edit Flight
                </button>
                <button 
                  className="flight-detail-delete-button"
                  onClick={handleDeleteClick}
                >
                  <DeleteIcon fontSize="small" /> Delete Flight
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirm Flight Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete flight {flight?.flight_number} from {flight?.departure_city} to {flight?.arrival_city}?
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              autoFocus
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
        
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
    </div>
  );
};

export default FlightDetailPage;