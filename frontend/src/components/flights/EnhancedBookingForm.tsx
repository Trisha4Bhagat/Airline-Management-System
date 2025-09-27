import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, Divider, FormControl, InputLabel, Select, MenuItem, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Flight } from '../../types/Flight';
import '../../pages/TravelTheme.css';

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  flight: Flight | null;
  onSubmit: (formData: BookingFormData) => void;
}

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  seatPreference: string;
  mealPreference: string;
}

export interface BookingFormData {
  flightId: number;
  contactEmail: string;
  contactPhone: string;
  passengers: PassengerInfo[];
}

const EnhancedBookingForm: React.FC<BookingFormProps> = ({ open, onClose, flight, onSubmit }) => {
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    {
      firstName: '',
      lastName: '',
      age: 30,
      gender: 'male',
      seatPreference: 'window',
      mealPreference: 'regular'
    }
  ]);
  
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    passengers?: {
      firstName?: string;
      lastName?: string;
      age?: string;
    }[];
  }>({});

  const handleAddPassenger = () => {
    setPassengers([
      ...passengers,
      {
        firstName: '',
        lastName: '',
        age: 30,
        gender: 'male',
        seatPreference: 'window',
        mealPreference: 'regular'
      }
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      const newPassengers = [...passengers];
      newPassengers.splice(index, 1);
      setPassengers(newPassengers);
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string | number) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value
    };
    setPassengers(newPassengers);
  };

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      phone?: string;
      passengers?: {
        firstName?: string;
        lastName?: string;
        age?: string;
      }[];
    } = {};
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail || !emailRegex.test(contactEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate phone
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!contactPhone || !phoneRegex.test(contactPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Validate passengers
    const passengerErrors = passengers.map(passenger => {
      const errors: {
        firstName?: string;
        lastName?: string;
        age?: string;
      } = {};
      
      if (!passenger.firstName) {
        errors.firstName = 'First name is required';
      }
      
      if (!passenger.lastName) {
        errors.lastName = 'Last name is required';
      }
      
      if (!passenger.age || passenger.age < 0 || passenger.age > 120) {
        errors.age = 'Please enter a valid age';
      }
      
      return errors;
    });
    
    if (passengerErrors.some(errors => Object.keys(errors).length > 0)) {
      newErrors.passengers = passengerErrors;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && flight) {
      onSubmit({
        flightId: flight.id,
        contactEmail,
        contactPhone,
        passengers
      });
    }
  };

  if (!flight) return null;

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
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

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'var(--primary-color)', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 2
      }}>
        <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
          Complete Your Booking
        </Typography>
        <IconButton 
          size="small" 
          onClick={onClose} 
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ padding: 3 }}>
        <Box sx={{ mb: 3, p: 2, bgcolor: 'var(--primary-light)', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="textSecondary">Flight</Typography>
              <Typography variant="body1" fontWeight="500">
                {flight.airline} {flight.flight_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle2" color="textSecondary">Route</Typography>
              <Typography variant="body1" fontWeight="500">
                {flight.origin} ({formatTime(flight.departure_time)}) → {flight.destination} ({formatTime(flight.arrival_time)})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="textSecondary">Date</Typography>
              <Typography variant="body1" fontWeight="500">
                {formatDate(flight.departure_time)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="textSecondary">Price</Typography>
              <Typography variant="body1" fontWeight="500" color="var(--primary-color)">
                ${flight.price} per passenger
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2" color="textSecondary">Available Seats</Typography>
              <Typography variant="body1" fontWeight="500">
                {flight.available_seats}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
          Contact Information
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email Address"
              fullWidth
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
              required
              placeholder="+1234567890"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
            Passenger Details
          </Typography>
          <Button 
            startIcon={<AddIcon />} 
            onClick={handleAddPassenger}
            color="primary"
            variant="outlined"
            disabled={passengers.length >= flight.available_seats}
            sx={{ borderRadius: '20px', fontWeight: 500 }}
          >
            Add Passenger
          </Button>
        </Box>
        
        {passengers.map((passenger, index) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < passengers.length - 1 ? '1px solid #eee' : 'none' }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1
            }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Passenger {index + 1}
              </Typography>
              {passengers.length > 1 && (
                <IconButton 
                  size="small" 
                  onClick={() => handleRemovePassenger(index)}
                  color="error"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={passenger.firstName}
                  onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                  required
                  error={!!errors.passengers?.[index]?.firstName}
                  helperText={errors.passengers?.[index]?.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={passenger.lastName}
                  onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                  required
                  error={!!errors.passengers?.[index]?.lastName}
                  helperText={errors.passengers?.[index]?.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={passenger.age}
                  onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value))}
                  required
                  error={!!errors.passengers?.[index]?.age}
                  helperText={errors.passengers?.[index]?.age}
                  InputProps={{
                    inputProps: { min: 0, max: 120 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    value={passenger.gender}
                    label="Gender"
                    onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Seat Preference</InputLabel>
                  <Select
                    value={passenger.seatPreference}
                    label="Seat Preference"
                    onChange={(e) => handlePassengerChange(index, 'seatPreference', e.target.value)}
                  >
                    <MenuItem value="window">Window</MenuItem>
                    <MenuItem value="middle">Middle</MenuItem>
                    <MenuItem value="aisle">Aisle</MenuItem>
                    <MenuItem value="no-preference">No Preference</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Meal Preference</InputLabel>
                  <Select
                    value={passenger.mealPreference}
                    label="Meal Preference"
                    onChange={(e) => handlePassengerChange(index, 'mealPreference', e.target.value)}
                  >
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="kosher">Kosher</MenuItem>
                    <MenuItem value="halal">Halal</MenuItem>
                    <MenuItem value="gluten-free">Gluten Free</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        ))}
        
        <Box sx={{ 
          bgcolor: 'var(--primary-light)', 
          p: 2, 
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center' 
        }}>
          <div>
            <Typography variant="subtitle1" fontWeight="500">
              Total Price
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {passengers.length} passenger{passengers.length > 1 ? 's' : ''}
            </Typography>
          </div>
          <Typography variant="h5" fontWeight="700" color="var(--primary-color)">
            ${flight.price * passengers.length}
          </Typography>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: '4px', fontWeight: 500 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          sx={{ 
            bgcolor: 'var(--secondary-color)', 
            '&:hover': { bgcolor: '#e64a19' },
            borderRadius: '4px',
            fontWeight: 500
          }}
        >
          Complete Booking
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnhancedBookingForm;