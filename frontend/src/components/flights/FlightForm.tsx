import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Typography, 
  InputAdornment,
  Alert, 
  Paper
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { Flight } from '../../types/Flight';
import './FlightForm.css';

interface FlightFormProps {
  initialData?: Partial<Flight>;
  onSubmit: (flightData: Omit<Flight, 'id'>) => Promise<void>;
  submitButtonText: string;
  isEditing?: boolean;
}

const FlightForm: React.FC<FlightFormProps> = ({ 
  initialData = {}, 
  onSubmit, 
  submitButtonText,
  isEditing = false
}) => {
  // Prepare default values
  const defaultValues = {
    flight_number: '',
    departure_city: '',
    arrival_city: '',
    departure_time: new Date().toISOString(),
    arrival_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Default 2 hours later
    price: 0,
    available_seats: 0,
    ...initialData
  };
  
  const [formData, setFormData] = useState(defaultValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Convert string dates to Date objects for the date pickers
  const [departureDate, setDepartureDate] = useState<Date | null>(
    formData.departure_time ? new Date(formData.departure_time) : new Date()
  );
  const [arrivalDate, setArrivalDate] = useState<Date | null>(
    formData.arrival_time ? new Date(formData.arrival_time) : new Date(Date.now() + 2 * 60 * 60 * 1000)
  );

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.flight_number) {
      errors.flight_number = 'Flight number is required';
    } else if (!/^[A-Z0-9]{2,6}$/.test(formData.flight_number)) {
      errors.flight_number = 'Flight number should be 2-6 uppercase letters/numbers';
    }

    if (!formData.departure_city) {
      errors.departure_city = 'Departure city is required';
    }

    if (!formData.arrival_city) {
      errors.arrival_city = 'Arrival city is required';
    }

    if (formData.departure_city === formData.arrival_city && formData.departure_city) {
      errors.arrival_city = 'Arrival city must be different from departure city';
    }

    if (new Date(formData.departure_time) >= new Date(formData.arrival_time)) {
      errors.arrival_time = 'Arrival time must be after departure time';
    }

    if (formData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (formData.available_seats <= 0 || !Number.isInteger(formData.available_seats)) {
      errors.available_seats = 'Available seats must be a positive integer';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: name === 'available_seats' ? parseInt(value) : parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDepartureDateChange = (date: Date | null) => {
    if (date) {
      setDepartureDate(date);
      setFormData({
        ...formData,
        departure_time: date.toISOString()
      });
    }
  };

  const handleArrivalDateChange = (date: Date | null) => {
    if (date) {
      setArrivalDate(date);
      setFormData({
        ...formData,
        arrival_time: date.toISOString()
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Ensure dates are in ISO format
      const submissionData = {
        ...formData,
        departure_time: new Date(formData.departure_time).toISOString(),
        arrival_time: new Date(formData.arrival_time).toISOString(),
      };
      
      await onSubmit(submissionData);
      setSuccess(isEditing ? 'Flight updated successfully!' : 'Flight created successfully!');
      
      // Reset form if not editing
      if (!isEditing) {
        setFormData(defaultValues);
        setDepartureDate(new Date());
        setArrivalDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
      }
    } catch (err) {
      setError('Failed to save flight. Please try again.');
      console.error('Error saving flight:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} className="flight-form-container">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {isEditing ? 'Edit Flight' : 'Create New Flight'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="flight_number"
              label="Flight Number"
              name="flight_number"
              value={formData.flight_number}
              onChange={handleInputChange}
              error={!!validationErrors.flight_number}
              helperText={validationErrors.flight_number}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AirplaneTicketIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              error={!!validationErrors.price}
              helperText={validationErrors.price}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="departure_city"
              label="Departure City"
              name="departure_city"
              value={formData.departure_city}
              onChange={handleInputChange}
              error={!!validationErrors.departure_city}
              helperText={validationErrors.departure_city}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightTakeoffIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="arrival_city"
              label="Arrival City"
              name="arrival_city"
              value={formData.arrival_city}
              onChange={handleInputChange}
              error={!!validationErrors.arrival_city}
              helperText={validationErrors.arrival_city}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FlightLandIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Departure Time"
                value={departureDate}
                onChange={handleDepartureDateChange}
                sx={{ width: '100%', mt: 2 }}
              />
            </LocalizationProvider>
            {validationErrors.departure_time && (
              <Typography color="error" variant="caption" sx={{ pl: 1 }}>
                {validationErrors.departure_time}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Arrival Time"
                value={arrivalDate}
                onChange={handleArrivalDateChange}
                sx={{ width: '100%', mt: 2 }}
              />
            </LocalizationProvider>
            {validationErrors.arrival_time && (
              <Typography color="error" variant="caption" sx={{ pl: 1 }}>
                {validationErrors.arrival_time}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="available_seats"
              label="Available Seats"
              name="available_seats"
              type="number"
              value={formData.available_seats}
              onChange={handleInputChange}
              error={!!validationErrors.available_seats}
              helperText={validationErrors.available_seats}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventSeatIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Saving...' : submitButtonText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FlightForm;