import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Alert,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Flight as FlightIcon
} from '@mui/icons-material';
import { useAdmin } from '../contexts/AdminContext';
import { flightService } from '../services/flightService';
import { Flight } from '../types/Flight';

const FlightFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const [formData, setFormData] = useState({
    flight_number: '',
    departure_city: '',
    arrival_city: '',
    departure_time: '',
    arrival_time: '',
    price: '',
    available_seats: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const australianCities = [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
    'Gold Coast', 'Canberra', 'Darwin', 'Hobart', 'Cairns'
  ];

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }

    if (isEdit && id) {
      loadFlight(parseInt(id));
    }
  }, [isAdmin, navigate, isEdit, id]);

  const loadFlight = async (flightId: number) => {
    try {
      setLoading(true);
      const flight = await flightService.getFlight(flightId);
      
      // Format datetime for input fields
      const departureDate = new Date(flight.departure_time);
      const arrivalDate = new Date(flight.arrival_time);
      
      setFormData({
        flight_number: flight.flight_number,
        departure_city: flight.departure_city,
        arrival_city: flight.arrival_city,
        departure_time: departureDate.toISOString().slice(0, 16),
        arrival_time: arrivalDate.toISOString().slice(0, 16),
        price: flight.price.toString(),
        available_seats: flight.available_seats.toString()
      });
    } catch (error) {
      setError('Failed to load flight data');
      console.error('Error loading flight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.flight_number || !formData.departure_city || !formData.arrival_city ||
        !formData.departure_time || !formData.arrival_time || !formData.price || !formData.available_seats) {
      setError('All fields are required');
      return false;
    }

    if (formData.departure_city === formData.arrival_city) {
      setError('Departure and arrival cities must be different');
      return false;
    }

    if (new Date(formData.departure_time) >= new Date(formData.arrival_time)) {
      setError('Arrival time must be after departure time');
      return false;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }

    if (parseInt(formData.available_seats) <= 0) {
      setError('Available seats must be greater than 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Ensure seconds are present in datetime strings
      const ensureSeconds = (dt: string) => dt.length === 16 ? dt + ':00' : dt;
      const flightData = {
        flight_number: formData.flight_number,
        departure_city: formData.departure_city,
        arrival_city: formData.arrival_city,
        departure_time: ensureSeconds(formData.departure_time),
        arrival_time: ensureSeconds(formData.arrival_time),
        price: parseFloat(formData.price),
        available_seats: parseInt(formData.available_seats)
      };

      if (isEdit && id) {
        await flightService.updateFlight(parseInt(id), flightData);
        setSuccess('Flight updated successfully!');
      } else {
        await flightService.createFlight(flightData);
        setSuccess('Flight created successfully!');
      }

      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000);

    } catch (error) {
      setError(`Failed to ${isEdit ? 'update' : 'create'} flight. Please try again.`);
      console.error('Error saving flight:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <FlightIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {isEdit ? 'Edit Flight' : 'Add New Flight'}
          </Typography>
          <Button color="inherit" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {isEdit ? '✏️ Edit Flight' : '➕ Add New Flight'}
              </Typography>
              
              <Divider sx={{ mb: 3 }} />

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Flight Number"
                      name="flight_number"
                      value={formData.flight_number}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., QF401"
                      helperText="Use airline code + number (e.g., QF401, VA123)"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Available Seats"
                      name="available_seats"
                      type="number"
                      value={formData.available_seats}
                      onChange={handleInputChange}
                      required
                      inputProps={{ min: 1, max: 500 }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Departure City"
                      name="departure_city"
                      value={formData.departure_city}
                      onChange={handleInputChange}
                      required
                    >
                      {australianCities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Arrival City"
                      name="arrival_city"
                      value={formData.arrival_city}
                      onChange={handleInputChange}
                      required
                    >
                      {australianCities.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Departure Time"
                      name="departure_time"
                      type="datetime-local"
                      value={formData.departure_time}
                      onChange={handleInputChange}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Arrival Time"
                      name="arrival_time"
                      type="datetime-local"
                      value={formData.arrival_time}
                      onChange={handleInputChange}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Price (AUD)"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      inputProps={{ 
                        min: 0, 
                        step: 0.01 
                      }}
                      helperText="Price in Australian Dollars"
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    startIcon={<CancelIcon />}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={<SaveIcon />}
                    size="large"
                  >
                    {loading ? 'Saving...' : (isEdit ? 'Update Flight' : 'Create Flight')}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default FlightFormPage;