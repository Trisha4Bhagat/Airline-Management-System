import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import FlightsPage from './pages/FlightsPage-updated'
import NewFlightsPage from './pages/NewFlightsPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Import dashboard components
import DashboardPage from './pages/DashboardPage'
import EnhancedDashboardPage from './pages/EnhancedDashboardPage'

// Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AppBar, Toolbar, Typography, Button, Box, Container, CircularProgress } from '@mui/material'

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Navigation bar component
const NavigationBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Airline Reservation System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/flights">Flights</Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/bookings">My Bookings</Button>
              <Button color="inherit" component={Link} to="/profile">
                {user?.username || 'Profile'}
              </Button>
              <Button color="inherit" onClick={() => logout()}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <NavigationBar />
        <main>
          <Routes>
            <Route path="/" element={<ProtectedRoute><EnhancedDashboardPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><EnhancedDashboardPage /></ProtectedRoute>} />
            <Route path="/flights" element={<NewFlightsPage />} />
            <Route path="/flights-classic" element={<FlightsPage />} />
            <Route path="/booking/:flightId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/flights" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App;