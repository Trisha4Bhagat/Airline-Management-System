import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { getFlightById, updateFlight } from '../services/flightService';
import { Flight } from '../types/Flight';

const FlightEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [formData, setFormData] = useState({
    flight_number: '',
    departure_city: '',
    arrival_city: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    available_seats: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFlight, setLoadingFlight] = useState(true);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!id) return;
      
      try {
        const flightData = await getFlightById(parseInt(id));
        setFlight(flightData);
        
        // Convert dates to datetime-local format
        const departureDate = new Date(flightData.departure_time);
        const arrivalDate = new Date(flightData.arrival_time);
        
        setFormData({
          flight_number: flightData.flight_number,
          departure_city: flightData.departure_city,
          arrival_city: flightData.arrival_city,
          departure_time: departureDate.toISOString().slice(0, 16),
          arrival_time: arrivalDate.toISOString().slice(0, 16),
          price: flightData.price.toString(),
          available_seats: flightData.available_seats.toString()
        });
      } catch (err) {
        setError('Failed to load flight data.');
        console.error('Error fetching flight:', err);
      } finally {
        setLoadingFlight(false);
      }
    };

    fetchFlight();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        available_seats: parseInt(formData.available_seats),
        departure_time: new Date(formData.departure_time).toISOString(),
        arrival_time: new Date(formData.arrival_time).toISOString()
      };

      await updateFlight(parseInt(id), updateData);
      navigate('/flights');
    } catch (err) {
      setError('Failed to update flight. Please try again.');
      console.error('Error updating flight:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingFlight) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justify: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!flight) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">Flight not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Edit Flight - {flight.flight_number}
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <TextField
                name="flight_number"
                label="Flight Number"
                value={formData.flight_number}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <TextField
                name="price"
                label="Price (AUD)"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <TextField
                name="departure_city"
                label="Departure City"
                value={formData.departure_city}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <TextField
                name="arrival_city"
                label="Arrival City"
                value={formData.arrival_city}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <TextField
                name="departure_time"
                label="Departure Time"
                type="datetime-local"
                value={formData.departure_time}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <TextField
                name="arrival_time"
                label="Arrival Time"
                type="datetime-local"
                value={formData.arrival_time}
                onChange={handleChange}
                required
                fullWidth
              />
              
              <TextField
                name="available_seats"
                label="Available Seats"
                type="number"
                value={formData.available_seats}
                onChange={handleChange}
                required
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
            </Box>
            
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ minWidth: 120 }}
              >
                {loading ? 'Updating...' : 'Update Flight'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/flights')}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default FlightEditPage;