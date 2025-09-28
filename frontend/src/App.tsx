import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import FlightsPage from './pages/FlightsPage-updated'
import NewFlightsPage from './pages/NewFlightsPage'
import FlightDetailPage from './pages/FlightDetailPage'
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
    <AppBar position="static" sx={{ 
      background: 'linear-gradient(135deg, rgba(0,99,178,0.95) 0%, rgba(0,76,140,0.95) 100%)', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <img src="/images/stylized_plane.svg" alt="Logo" style={{ height: '32px', marginRight: '12px' }} />
          <Typography variant="h6" component="div" sx={{ 
            fontWeight: 600,
            background: 'linear-gradient(90deg, #ffffff, #e6f3ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SkyJourney Airlines
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            sx={{ 
              borderRadius: '20px', 
              '&:hover': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/flights"
            sx={{ 
              borderRadius: '20px', 
              '&:hover': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            Flights
          </Button>
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/bookings"
                sx={{ 
                  borderRadius: '20px', 
                  '&:hover': { background: 'rgba(255,255,255,0.1)' }
                }}
              >
                My Bookings
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/profile"
                sx={{ 
                  borderRadius: '20px', 
                  background: 'rgba(255,255,255,0.1)',
                  '&:hover': { background: 'rgba(255,255,255,0.2)' }
                }}
              >
                {user?.username || 'Profile'}
              </Button>
              <Button 
                color="inherit" 
                onClick={() => logout()}
                sx={{ 
                  borderRadius: '20px', 
                  background: 'rgba(255,107,53,0.8)',
                  '&:hover': { background: 'rgba(255,107,53,1)' }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': { background: 'rgba(255,255,255,0.1)' }
                }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                sx={{ 
                  borderRadius: '20px', 
                  background: 'rgba(255,255,255,0.2)',
                  '&:hover': { background: 'rgba(255,255,255,0.3)' }
                }}
              >
                Register
              </Button>
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
            <Route path="/flights/:id" element={<FlightDetailPage />} />
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