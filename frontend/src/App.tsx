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

// Import admin components
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import FlightFormPage from './pages/FlightFormPage'

// Auth context
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AdminProvider, useAdmin } from './contexts/AdminContext'
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
          <Button 
            color="inherit" 
            component={Link} 
            to="/admin/login"
            sx={{ 
              borderRadius: '20px', 
              '&:hover': { background: 'rgba(255,255,255,0.1)' }
            }}
          >
            Admin
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

// Protected admin route component
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAdmin();
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/flights" element={<><NavigationBar /><NewFlightsPage /></>} />
              <Route path="/flights/:id" element={<><NavigationBar /><FlightDetailPage /></>} />
              <Route path="/flights-classic" element={<><NavigationBar /><FlightsPage /></>} />
              <Route path="/login" element={<><NavigationBar /><LoginPage /></>} />
              <Route path="/register" element={<><NavigationBar /><RegisterPage /></>} />
              
              {/* Protected User Routes */}
              <Route path="/" element={<><NavigationBar /><ProtectedRoute><EnhancedDashboardPage /></ProtectedRoute></>} />
              <Route path="/dashboard" element={<><NavigationBar /><ProtectedRoute><EnhancedDashboardPage /></ProtectedRoute></>} />
              <Route path="/booking/:flightId" element={<><NavigationBar /><ProtectedRoute><BookingPage /></ProtectedRoute></>} />
              <Route path="/bookings" element={<><NavigationBar /><ProtectedRoute><DashboardPage /></ProtectedRoute></>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/flights/create" element={<AdminProtectedRoute><FlightFormPage /></AdminProtectedRoute>} />
              <Route path="/admin/flights/edit/:id" element={<AdminProtectedRoute><FlightFormPage /></AdminProtectedRoute>} />
              <Route path="/admin/flights/:id" element={<AdminProtectedRoute><FlightDetailPage /></AdminProtectedRoute>} />
              
              {/* Default redirect removed for debugging admin route */}
              {/* <Route path="*" element={<Navigate to="/flights" />} /> */}
            </Routes>
          </div>
        </BrowserRouter>
      </AdminProvider>
    </AuthProvider>
  );
}
export default App;