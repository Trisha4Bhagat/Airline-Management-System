import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Paper, Typography, Grid, Button, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Flight } from '../types/Flight';
import { fetchFlightById } from '../services/flightService';
import EnhancedBookingForm from '../components/flights/EnhancedBookingForm';
import { BookingFormData } from '../components/flights/EnhancedBookingForm';
import './TravelTheme.css';

const BookingPage: React.FC = () => {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  useEffect(() => {
    const loadFlight = async () => {
      if (!flightId) {
        setError('No flight ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await fetchFlightById(parseInt(flightId));
        setFlight(data);
        setError(null);
      } catch (err) {
        setError('Failed to load flight details. Please try again later.');
        console.error('Error loading flight:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFlight();
  }, [flightId]);

  const handleBookFlight = () => {
    setIsBookingFormOpen(true);
  };

  const handleBookingFormClose = () => {
    setIsBookingFormOpen(false);
  };

  const handleBookingSubmit = (formData: BookingFormData) => {
    // Here you would typically call an API to process the booking
    console.log('Booking submitted:', formData);
    setBookingData(formData);
    setIsBookingFormOpen(false);
    setBookingSuccess(true);
    
    // In a real app, you would wait for API response before setting success
    // For this demo, we'll just simulate a successful booking
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleTimeString('en-US', options);
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/flights')}
          sx={{ 
            mb: 2, 
            color: 'var(--primary-color)',
            fontWeight: 500
          }}
        >
          Back to Flights
        </Button>
        
        {loading && (
          <div className="travel-loading">
            <div className="travel-loading-animation"></div>
            <p>Loading flight details...</p>
          </div>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {bookingSuccess && bookingData && (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              mb: 4, 
              bgcolor: 'var(--success-color)',
              color: 'white',
              borderRadius: 2
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom fontWeight="600">
              Booking Confirmed!
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for your booking. Your reservation for {bookingData.passengers.length} passenger(s) has been confirmed.
            </Typography>
            <Typography variant="body2">
              A confirmation email has been sent to {bookingData.contactEmail}. You can also reach us at any time at support@airlineapp.com
            </Typography>
          </Paper>
        )}
        
        {!loading && !error && flight && !bookingSuccess && (
          <>
            <Box
              sx={{
                bgcolor: 'var(--primary-color)',
                color: 'white',
                p: 3,
                borderRadius: 2,
                mb: 3
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
                Flight Details
              </Typography>
              <Typography variant="h6" component="div">
                {flight.origin} → {flight.destination} on {formatDate(flight.departure_time)}
              </Typography>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 0, 
                mb: 4, 
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 'var(--box-shadow)'
              }}
            >
              <Box sx={{ 
                bgcolor: 'var(--primary-light)', 
                p: 3, 
                borderBottom: '1px solid #eee' 
              }}>
                <Grid container alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 50, 
                          height: 50, 
                          bgcolor: 'white', 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mr: 2,
                          boxShadow: 'var(--box-shadow)',
                          color: 'var(--primary-color)',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        {flight.airline.charAt(0)}
                      </Box>
                      <Box>
                        <Typography variant="h6" component="div" fontWeight="600">
                          {flight.airline}
                        </Typography>
                        <Typography variant="body2">
                          Flight {flight.flight_number}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                    <Typography variant="h5" component="div" color="var(--primary-color)" fontWeight="700">
                      ${flight.price}
                    </Typography>
                    <Typography variant="body2">per passenger</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ p: 3 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ textAlign: 'center', width: '30%' }}>
                        <Typography variant="h5" fontWeight="700">
                          {formatTime(flight.departure_time)}
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {flight.origin}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(flight.departure_time).toLocaleDateString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        px: 2
                      }}>
                        <Typography variant="body2" color="var(--primary-color)" fontWeight="500">
                          {calculateDuration(flight.departure_time, flight.arrival_time)}
                        </Typography>
                        <Box sx={{ 
                          width: '100%', 
                          height: 2, 
                          bgcolor: '#ddd', 
                          position: 'relative',
                          my: 1 
                        }}>
                          <Box 
                            component="span" 
                            sx={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%) rotate(90deg)',
                              color: 'var(--primary-color)',
                              fontSize: '1.2rem'
                            }}
                          >
                            ✈
                          </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Direct Flight
                        </Typography>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center', width: '30%' }}>
                        <Typography variant="h5" fontWeight="700">
                          {formatTime(flight.arrival_time)}
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {flight.destination}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(flight.arrival_time).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
                      Flight Details
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Aircraft
                        </Typography>
                        <Typography variant="body1">
                          Boeing 737
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Flight Class
                        </Typography>
                        <Typography variant="body1">
                          Economy
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          Meal
                        </Typography>
                        <Typography variant="body1">
                          Included
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="body2" color="text.secondary">
                          In-flight Entertainment
                        </Typography>
                        <Typography variant="body1">
                          Available
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
                      Baggage Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Cabin Baggage
                        </Typography>
                        <Typography variant="body1">
                          7 kg
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Check-in Baggage
                        </Typography>
                        <Typography variant="body1">
                          15 kg
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography variant="body2" color="text.secondary">
                          Extra Baggage Rate
                        </Typography>
                        <Typography variant="body1">
                          $10 per kg
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 3, 
                        bgcolor: 'var(--background-light)',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="h6" component="h3" fontWeight="600" gutterBottom>
                        Price Summary
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Base Fare</Typography>
                        <Typography variant="body2">${flight.price - 50}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Taxes & Fees</Typography>
                        <Typography variant="body2">$50</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Discount</Typography>
                        <Typography variant="body2" color="var(--success-color)">$0</Typography>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="700">Total Per Person</Typography>
                        <Typography variant="subtitle1" fontWeight="700" color="var(--primary-color)">
                          ${flight.price}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Available Seats: <strong>{flight.available_seats}</strong>
                        </Typography>
                      </Box>
                      
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                          bgcolor: 'var(--secondary-color)', 
                          py: 1.5,
                          '&:hover': { bgcolor: '#e64a19' },
                          fontWeight: 500
                        }}
                        disabled={flight.available_seats <= 0}
                        onClick={handleBookFlight}
                      >
                        Book Now
                      </Button>
                    </Paper>
                    
                    <Box sx={{ mt: 3, p: 3, bgcolor: 'var(--primary-light)', borderRadius: 2 }}>
                      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Need Help?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Our customer service team is available 24/7 to assist you.
                      </Typography>
                      <Typography variant="body2">
                        Call us: <strong>1-800-FLY-WITH-US</strong>
                      </Typography>
                      <Typography variant="body2">
                        Email: <strong>support@airlineapp.com</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </>
        )}
      </Container>
      
      {flight && (
        <EnhancedBookingForm
          open={isBookingFormOpen}
          onClose={handleBookingFormClose}
          flight={flight}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default BookingPage;