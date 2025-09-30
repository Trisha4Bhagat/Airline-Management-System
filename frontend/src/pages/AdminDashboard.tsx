import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flight as FlightIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Logout as LogoutIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAdmin } from '../contexts/AdminContext';
import { Flight } from '../types/Flight';
import { flightService, getStats } from '../services/flightService';

const AdminDashboard: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [stats, setStats] = useState({
    total_flights: 0,
    total_bookings: 0,
    upcoming_flights: 0
  });
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    loadFlights();
    
    // Set up auto-refresh every 30 seconds to keep dashboard in sync
    const refreshInterval = setInterval(() => {
      loadFlights();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [isAdmin, navigate]);

  const loadFlights = async () => {
    try {
      // Start loading both in parallel for faster performance
      const [flightDataPromise, statsPromise] = await Promise.allSettled([
        flightService.getFlights({ limit: 100 }), // Limit to 100 for faster loading
        getStats()
      ]);

      // Handle flight data
      if (flightDataPromise.status === 'fulfilled') {
        setFlights(flightDataPromise.value);
        console.log('Loaded flights:', flightDataPromise.value.length);
      } else {
        console.error('Error loading flights:', flightDataPromise.reason);
        setFlights([]);
      }

      // Handle stats data
      if (statsPromise.status === 'fulfilled') {
        setStats(statsPromise.value);
        console.log('Real stats from backend:', statsPromise.value);
      } else {
        console.error('Error fetching stats:', statsPromise.reason);
        // Fallback stats
        setStats({
          total_flights: 0,
          total_bookings: 0,
          upcoming_flights: 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleDeleteFlight = async (flightId: number) => {
    if (window.confirm('Are you sure you want to delete this flight? This action cannot be undone.')) {
      try {
        await flightService.deleteFlight(flightId);
        // Immediately refresh data after deletion
        await loadFlights();
        
        // Trigger event for other components to refresh
        window.dispatchEvent(new CustomEvent('flightDataChanged'));
        
        console.log('Flight deleted successfully');
      } catch (error) {
        console.error('Error deleting flight:', error);
        alert('Error deleting flight. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <FlightIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Airline Management - Admin Panel
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            View Site
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          {/* Welcome Header */}
          <Typography variant="h3" component="h1" gutterBottom>
            ✈️ Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Manage flights, view statistics, and control your airline system
          </Typography>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FlightIcon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h3" color="primary.main">
                        {stats.total_flights}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Total Flights
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ fontSize: 48, color: 'success.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h3" color="success.main">
                        {stats.total_bookings}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Total Bookings
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AnalyticsIcon sx={{ fontSize: 48, color: 'warning.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h3" color="warning.main">
                        {stats.upcoming_flights}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        Upcoming Flights
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Flight Management Section */}
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h2">
                  Flight Management
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/admin/flights/create')}
                  sx={{ px: 3 }}
                >
                  Add New Flight
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <TableContainer component={Paper} elevation={1}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell><strong>Flight Number</strong></TableCell>
                      <TableCell><strong>Route</strong></TableCell>
                      <TableCell><strong>Departure</strong></TableCell>
                      <TableCell><strong>Price (AUD)</strong></TableCell>
                      <TableCell><strong>Available Seats</strong></TableCell>
                      <TableCell align="center"><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {flights.map((flight) => (
                      <TableRow key={flight.id} hover>
                        <TableCell>
                          <Chip 
                            label={flight.flight_number} 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            <strong>{flight.departure_city}</strong> → <strong>{flight.arrival_city}</strong>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(flight.departure_time)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="success.main">
                            <strong>${flight.price}</strong>
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={flight.available_seats} 
                            color={flight.available_seats > 50 ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <IconButton
                              onClick={() => navigate(`/admin/flights/${flight.id}`)}
                              color="info"
                              title="View Details"
                            >
                              <ViewIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => navigate(`/admin/flights/edit/${flight.id}`)}
                              color="primary"
                              title="Edit Flight"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteFlight(flight.id)}
                              color="error"
                              title="Delete Flight"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {flights.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No flights found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Start by adding your first flight
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/flights/create')}
                  >
                    Add First Flight
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default AdminDashboard;