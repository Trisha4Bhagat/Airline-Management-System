import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert
} from '@mui/material';
import { createFlight } from '../services/flightService';

const FlightCreatePage: React.FC = () => {
  const navigate = useNavigate();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const flightData = {
        ...formData,
        price: parseFloat(formData.price),
        available_seats: parseInt(formData.available_seats),
        departure_time: new Date(formData.departure_time).toISOString(),
        arrival_time: new Date(formData.arrival_time).toISOString()
      };

      await createFlight(flightData);
      
      // Trigger event to notify other components
      window.dispatchEvent(new CustomEvent('flightDataChanged'));
      
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to create flight. Please try again.');
      console.error('Error creating flight:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create New Flight
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
                {loading ? 'Creating...' : 'Create Flight'}
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

export default FlightCreatePage;