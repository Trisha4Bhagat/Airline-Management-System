import { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  FormControl, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface FlightSearchProps {
  onSearch: (departure: string, arrival: string, date: Date | null) => void;
}

const FlightSearch = ({ onSearch }: FlightSearchProps) => {
  const [departureCity, setDepartureCity] = useState('');
  const [arrivalCity, setArrivalCity] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);

  const handleSearch = () => {
    onSearch(departureCity, arrivalCity, departureDate);
  };

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Search for Flights
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="departure-city-label">From</InputLabel>
                <Select
                  labelId="departure-city-label"
                  id="departure-city"
                  value={departureCity}
                  label="From"
                  onChange={(e) => setDepartureCity(e.target.value)}
                >
                  <MenuItem value="New York">New York</MenuItem>
                  <MenuItem value="Los Angeles">Los Angeles</MenuItem>
                  <MenuItem value="Chicago">Chicago</MenuItem>
                  <MenuItem value="Dallas">Dallas</MenuItem>
                  <MenuItem value="Miami">Miami</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel id="arrival-city-label">To</InputLabel>
                <Select
                  labelId="arrival-city-label"
                  id="arrival-city"
                  value={arrivalCity}
                  label="To"
                  onChange={(e) => setArrivalCity(e.target.value)}
                >
                  <MenuItem value="New York">New York</MenuItem>
                  <MenuItem value="Los Angeles">Los Angeles</MenuItem>
                  <MenuItem value="Chicago">Chicago</MenuItem>
                  <MenuItem value="Dallas">Dallas</MenuItem>
                  <MenuItem value="Miami">Miami</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Departure Date"
                  value={departureDate}
                  onChange={(newValue) => setDepartureDate(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleSearch}
                sx={{ mt: 1 }}
              >
                Search Flights
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlightSearch;