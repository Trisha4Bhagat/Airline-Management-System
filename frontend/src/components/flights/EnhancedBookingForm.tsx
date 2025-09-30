import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Typography, Divider, FormControl, InputLabel, Select, MenuItem, IconButton, Box } from '@mui/material';
import PassengerSeatSelector from './PassengerSeatSelector';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Flight } from '../../types/Flight';
import { getBookedSeats } from '../../services/flightService';
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
  seat?: string; // selected seat number
}

export interface BookingFormData {
  flightId: number;
  contactEmail: string;
  contactPhone: string;
  passengers: PassengerInfo[];
  bookingReference?: string;
}

const EnhancedBookingForm: React.FC<BookingFormProps> = ({ open, onClose, flight, onSubmit }) => {
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [travelerCount, setTravelerCount] = useState<number>(1);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [loadingSeats, setLoadingSeats] = useState<boolean>(false);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    {
      firstName: '',
      lastName: '',
      age: 30,
      gender: 'male',
      seatPreference: 'window',
      mealPreference: 'regular',
      seat: undefined
    }
  ]);
  // Sync passengers array with travelerCount
  useEffect(() => {
    if (travelerCount > passengers.length) {
      setPassengers(prev => [
        ...prev,
        ...Array(travelerCount - prev.length).fill(null).map(() => ({
          firstName: '',
          lastName: '',
          age: 30,
          gender: 'male',
          seatPreference: 'window',
          mealPreference: 'regular',
          seat: undefined
        }))
      ]);
    } else if (travelerCount < passengers.length) {
      setPassengers(prev => prev.slice(0, travelerCount));
    }
  }, [travelerCount]);

  // Clear any validation errors when traveler count changes
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setErrors(prev => ({
        ...prev,
        passengers: prev.passengers?.slice(0, travelerCount)
      }));
    }
  }, [travelerCount]);

  // Fetch booked seats when form opens
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (open && flight) {
        setLoadingSeats(true);
        try {
          const seats = await getBookedSeats(flight.id);
          setBookedSeats(seats);
        } catch (error) {
          console.error('Error fetching booked seats:', error);
          setBookedSeats([]); // Fallback to empty array
        } finally {
          setLoadingSeats(false);
        }
      }
    };
    
    fetchBookedSeats();
  }, [open, flight]);
  // Traveler count handlers
  const handleTravelerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Prevent string concatenation by replacing the entire value
    let value = parseInt(inputValue);
    if (isNaN(value) || inputValue === '') {
      value = 1;
    }
    if (value < 1) value = 1;
    if (flight && value > flight.available_seats) value = flight.available_seats;
    setTravelerCount(value);
  };
  
  const handleAddTraveler = () => {
    if (flight && travelerCount < flight.available_seats) {
      setTravelerCount(prev => prev + 1);
    }
  };
  
  const handleRemoveTraveler = () => {
    if (travelerCount > 1) {
      setTravelerCount(prev => prev - 1);
    }
  };
  
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    passengers?: {
      firstName?: string;
      lastName?: string;
      age?: string;
      seat?: string;
    }[];
  }>({});

  const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string | number) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value
    };
    setPassengers(newPassengers);
  };

  // Seat selection handler for a passenger
  const handleSeatSelect = (index: number, seat: string) => {
    // Check if seat is already booked by the system
    if (bookedSeats.includes(seat)) {
      // Refresh booked seats to get latest data
      if (flight) {
        getBookedSeats(flight.id).then(setBookedSeats).catch(console.error);
      }
      return;
    }
    
    const newPassengers = [...passengers];
    
    // Check if seat is already selected by another passenger in this booking
    const isDuplicate = passengers.some((p, i) => i !== index && p.seat === seat);
    if (isDuplicate) {
      // Remove the seat from other passengers who selected it
      passengers.forEach((p, i) => {
        if (i !== index && p.seat === seat) {
          newPassengers[i] = { ...newPassengers[i], seat: undefined };
        }
      });
    }
    
    // Set the seat for current passenger
    newPassengers[index] = { ...newPassengers[index], seat };
    setPassengers(newPassengers);
    
    // Clear any seat-related errors for this passenger
    if (errors.passengers?.[index]?.seat) {
      const newErrors = { ...errors };
      if (newErrors.passengers) {
        newErrors.passengers[index] = {
          ...newErrors.passengers[index],
          seat: undefined
        };
      }
      setErrors(newErrors);
    }
  };

  // Get all selected seats to pass as booked to prevent conflicts
  const getSelectedSeats = (excludeIndex?: number) => {
    const selectedSeats = passengers
      .map((p, i) => i !== excludeIndex ? p.seat : null)
      .filter(Boolean) as string[];
    
    // Combine real booked seats with currently selected seats
    return [...bookedSeats, ...selectedSeats];
  };

  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      phone?: string;
      passengers?: {
        firstName?: string;
        lastName?: string;
        age?: string;
        seat?: string;
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
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }
    
    // Validate passengers
    const passengerErrors = passengers.slice(0, travelerCount).map((passenger, index) => {
      const errors: {
        firstName?: string;
        lastName?: string;
        age?: string;
        seat?: string;
      } = {};
      
      if (!passenger.firstName?.trim()) {
        errors.firstName = 'First name is required';
      }
      if (!passenger.lastName?.trim()) {
        errors.lastName = 'Last name is required';
      }
      if (!passenger.age || passenger.age < 0 || passenger.age > 120) {
        errors.age = 'Please enter a valid age (0-120)';
      }
      if (!passenger.seat) {
        errors.seat = 'Please select a seat';
      } else if (bookedSeats.includes(passenger.seat)) {
        errors.seat = 'This seat is no longer available';
      }
      
      return errors;
    });
    
    // Check for duplicate seat selections
    const selectedSeats = passengers.slice(0, travelerCount).map(p => p.seat).filter(Boolean);
    const duplicateSeats = selectedSeats.filter((seat, index) => selectedSeats.indexOf(seat) !== index);
    
    if (duplicateSeats.length > 0) {
      passengerErrors.forEach((errors, index) => {
        const passenger = passengers[index];
        if (passenger.seat && duplicateSeats.includes(passenger.seat)) {
          errors.seat = 'Duplicate seat selection';
        }
      });
    }
    
    if (passengerErrors.some(errors => Object.keys(errors).length > 0)) {
      newErrors.passengers = passengerErrors;
    }
    
    // Validate traveler count vs available seats
    if (flight && travelerCount > flight.available_seats) {
      if (!newErrors.passengers) newErrors.passengers = [];
      newErrors.passengers[0] = {
        ...newErrors.passengers[0],
        seat: `Only ${flight.available_seats} seats available`
      };
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
                Flight {flight.flight_number}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="subtitle2" color="textSecondary">Route</Typography>
              <Typography variant="body1" fontWeight="500">
                {flight.departure_city} ({formatTime(flight.departure_time)}) → {flight.arrival_city} ({formatTime(flight.arrival_time)})
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
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
              Number of Travelers
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid #ccc', 
              borderRadius: 1, 
              overflow: 'hidden',
              width: 'fit-content'
            }}>
              <IconButton 
                onClick={handleRemoveTraveler} 
                disabled={travelerCount <= 1}
                size="small"
                sx={{ 
                  borderRadius: 0, 
                  minWidth: 40,
                  height: 40,
                  '&:disabled': { opacity: 0.5 }
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <TextField
                type="number"
                value={travelerCount}
                onChange={handleTravelerChange}
                inputProps={{ 
                  min: 1, 
                  max: flight?.available_seats || 1,
                  style: { textAlign: 'center', width: 60, padding: '8px 4px' }
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' }
                  }
                }}
                onFocus={(e) => e.target.select()} // Select all text on focus to prevent concatenation
              />
              <IconButton 
                onClick={handleAddTraveler} 
                disabled={flight && travelerCount >= flight.available_seats}
                size="small"
                sx={{ 
                  borderRadius: 0, 
                  minWidth: 40,
                  height: 40,
                  '&:disabled': { opacity: 0.5 }
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
              Max: {flight?.available_seats || 0} seats
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
        
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
          Passenger Details
        </Typography>
        
        {passengers.slice(0, travelerCount).map((passenger, index) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < travelerCount - 1 ? '1px solid #eee' : 'none' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
              Passenger {index + 1}
            </Typography>
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
              <Grid item xs={12}>
                {loadingSeats ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      Loading seat availability...
                    </Typography>
                  </Box>
                ) : (
                  <PassengerSeatSelector
                    selectedSeat={passenger.seat || null}
                    onSelect={(seat) => handleSeatSelect(index, seat)}
                    bookedSeats={getSelectedSeats(index)}
                    passengerIndex={index}
                  />
                )}
                {errors.passengers?.[index]?.seat && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.passengers[index]?.seat}
                  </Typography>
                )}
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
              {travelerCount} traveler{travelerCount > 1 ? 's' : ''}
            </Typography>
          </div>
          <Typography variant="h5" fontWeight="700" color="var(--primary-color)">
            ${flight.price * travelerCount}
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