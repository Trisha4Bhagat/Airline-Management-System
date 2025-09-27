import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Typography,
  Chip,
  Button,
  Divider,
  Stack
} from '@mui/material';
import { Flight } from '../../types/Flight';
import FlightIcon from '@mui/icons-material/Flight';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface FlightCardProps {
  flight: Flight;
  onBookNow: (flightId: number) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onBookNow }) => {
  // Format date and time for display
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Calculate duration between departure and arrival
  const calculateDuration = () => {
    const departure = new Date(flight.departure_time);
    const arrival = new Date(flight.arrival_time);
    const durationMs = arrival.getTime() - departure.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          {/* Flight number and basic info */}
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FlightIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  {flight.flight_number}
                </Typography>
              </Box>
              <Chip 
                label={flight.available_seats > 10 ? 'Available' : 'Limited Seats'} 
                color={flight.available_seats > 10 ? 'success' : 'warning'} 
              />
            </Stack>
          </Grid>

          {/* Route and time information */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {flight.departure_city}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {calculateDuration()}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {flight.arrival_city}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {formatDateTime(flight.departure_time)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mx: 2 }}>
                  <Divider sx={{ width: '100%' }} />
                </Box>
                <Typography variant="body2">
                  {formatDateTime(flight.arrival_time)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Price and booking */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h5" component="div" color="success.main">
                  ${flight.price}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventSeatIcon sx={{ mr: 1, fontSize: 'small' }} />
                <Typography variant="body2">
                  {flight.available_seats} seats available
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => onBookNow(flight.id)}
              >
                Book Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default FlightCard;