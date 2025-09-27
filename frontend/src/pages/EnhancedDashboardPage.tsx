import React from 'react';
import './EnhancedDashboard.css';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';

// Material UI Icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import HelpIcon from '@mui/icons-material/Help';

// Sample data for the dashboard
const flightStatistics = {
  totalFlights: 128,
  onTime: 89.4,
  delayed: 8.2,
  cancelled: 2.4
};

const popularDestinations = [
  { city: 'London', count: 457, growth: 12.3 },
  { city: 'New York', count: 389, growth: 8.7 },
  { city: 'Tokyo', count: 324, growth: 15.2 },
  { city: 'Paris', count: 298, growth: 5.6 },
  { city: 'Dubai', count: 276, growth: 18.9 }
];

const recentBookings = [
  { id: 'BK893421', passenger: 'John Smith', destination: 'Paris', date: '2025-10-15', status: 'Confirmed' },
  { id: 'BK563789', passenger: 'Sarah Johnson', destination: 'Tokyo', date: '2025-10-18', status: 'Processing' },
  { id: 'BK127634', passenger: 'Michael Brown', destination: 'New York', date: '2025-10-20', status: 'Confirmed' },
  { id: 'BK438976', passenger: 'Emma Wilson', destination: 'Dubai', date: '2025-10-22', status: 'Confirmed' }
];

const upcomingFlights = [
  { id: 1, flightNumber: 'SA1234', from: 'New York', to: 'London', departureTime: '2025-10-15 08:30', status: 'On Time' },
  { id: 2, flightNumber: 'SA2156', from: 'London', to: 'Paris', departureTime: '2025-10-16 14:45', status: 'Delayed' },
  { id: 3, flightNumber: 'SA3789', from: 'Paris', to: 'Tokyo', departureTime: '2025-10-18 23:15', status: 'On Time' }
];

// Special offers data
const specialOffers = [
  { 
    destination: 'Paris', 
    description: 'Enjoy 20% off on all flights to Paris this month!', 
    price: 'From $349'
  },
  { 
    destination: 'Bali', 
    description: 'Escape to paradise with our summer special package.', 
    price: 'From $599'
  }
];

// Weather data for top destinations
const weatherData = {
  location: 'New York',
  temperature: 72,
  description: 'Partly Cloudy',
  humidity: '65%',
  wind: '8 mph'
};

const EnhancedDashboard: React.FC = () => {
  // Get current date for greeting
  const now = new Date();
  const hours = now.getHours();
  
  let greeting;
  if (hours < 12) {
    greeting = 'Good Morning';
  } else if (hours < 18) {
    greeting = 'Good Afternoon';
  } else {
    greeting = 'Good Evening';
  }
  
  // Format date for display
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const dateString = now.toLocaleDateString(undefined, options);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>{greeting}, Admin</h1>
            <p className="date">{dateString}</p>
          </div>
          <div className="dashboard-actions">
            <button className="action-button primary">
              <AddIcon /> Add New Flight
            </button>
            <button className="action-button secondary">
              <FileDownloadIcon /> Export Report
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Quick Stats Section */}
          <div className="dashboard-card stats-card">
            <h2>
              <span className="card-icon"><InsertChartIcon /></span>
              Flight Statistics
            </h2>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">{flightStatistics.totalFlights}</div>
                <div className="stat-label">Total Flights</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{flightStatistics.onTime}%</div>
                <div className="stat-label">On Time</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{flightStatistics.delayed}%</div>
                <div className="stat-label">Delayed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{flightStatistics.cancelled}%</div>
                <div className="stat-label">Cancelled</div>
              </div>
            </div>
            <div className="flight-status-chart">
              <div className="chart-placeholder">
                <div className="bar on-time" style={{ height: `${flightStatistics.onTime}%` }}></div>
                <div className="bar delayed" style={{ height: `${flightStatistics.delayed * 5}%` }}></div>
                <div className="bar cancelled" style={{ height: `${flightStatistics.cancelled * 10}%` }}></div>
              </div>
            </div>
            <div className="chart-labels">
              <span>On Time</span>
              <span>Delayed</span>
              <span>Cancelled</span>
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="dashboard-card destinations-card">
            <h2>
              <span className="card-icon"><LocationOnIcon /></span>
              Popular Destinations
            </h2>
            <div className="destinations-list">
              {popularDestinations.map((destination, index) => (
                <div key={index} className="destination-item">
                  <div className="destination-info">
                    <div className="destination-name">{destination.city}</div>
                    <div className="destination-count">{destination.count} bookings</div>
                  </div>
                  <div className="destination-growth">
                    <span className={`growth-indicator ${destination.growth > 0 ? 'positive' : 'negative'}`}>
                      {destination.growth > 0 ? '↑' : '↓'} {Math.abs(destination.growth)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/analytics" className="card-footer-link">View Full Analytics</Link>
          </div>

          {/* Recent Bookings */}
          <div className="dashboard-card bookings-card">
            <h2>
              <span className="card-icon"><BookOnlineIcon /></span>
              Recent Bookings
            </h2>
            <div className="table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Destination</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking, index) => (
                    <tr key={index}>
                      <td>{booking.id}</td>
                      <td>{booking.passenger}</td>
                      <td>{booking.destination}</td>
                      <td>{booking.date}</td>
                      <td>
                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/bookings" className="card-footer-link">View All Bookings</Link>
          </div>

          {/* Upcoming Flights */}
          <div className="dashboard-card flights-card">
            <h2>
              <span className="card-icon"><FlightTakeoffIcon /></span>
              Upcoming Flights
            </h2>
            <div className="upcoming-flights">
              {upcomingFlights.map((flight, index) => (
                <div key={index} className="flight-item">
                  <div className="flight-info">
                    <div className="flight-number">{flight.flightNumber}</div>
                    <div className="flight-route">
                      {flight.from} → {flight.to}
                    </div>
                  </div>
                  <div className="flight-schedule">
                    <div className="departure-time">
                      {new Date(flight.departureTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className={`flight-status ${flight.status.replace(' ', '-').toLowerCase()}`}>
                      {flight.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/flights" className="card-footer-link">View All Flights</Link>
          </div>

          {/* Special Offers */}
          <div className="dashboard-card special-offers-card">
            <h2>
              <span className="card-icon"><LocalOfferIcon /></span>
              Special Offers
            </h2>
            <div className="offers-container">
              {specialOffers.map((offer, index) => (
                <div key={index} className="offer-item">
                  <div>
                    <div className="offer-title">{offer.destination}</div>
                    <div className="offer-description">{offer.description}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div className="offer-price">{offer.price}</div>
                    <button className="offer-button">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/offers" className="card-footer-link">View All Offers</Link>
          </div>

          {/* Weather Widget */}
          <div className="dashboard-card weather-card">
            <h2>
              <span className="card-icon"><WbSunnyIcon /></span>
              Weather Updates
            </h2>
            <div className="weather-container">
              <div className="weather-current">
                <div className="weather-icon">
                  <WbSunnyIcon fontSize="large" />
                </div>
                <div className="weather-temp">{weatherData.temperature}°F</div>
                <div className="weather-desc">{weatherData.description} in {weatherData.location}</div>
              </div>
              <div className="weather-details">
                <div className="weather-detail">
                  <div className="detail-label">
                    <OpacityIcon fontSize="small" /> Humidity
                  </div>
                  <div className="detail-value">{weatherData.humidity}</div>
                </div>
                <div className="weather-detail">
                  <div className="detail-label">
                    <AirIcon fontSize="small" /> Wind
                  </div>
                  <div className="detail-value">{weatherData.wind}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Search */}
          <div className="dashboard-card search-card">
            <h2>
              <span className="card-icon"><SearchIcon /></span>
              Quick Search
            </h2>
            <div className="quick-search-form">
              <div className="form-group">
                <label htmlFor="quickSearchType">Search By</label>
                <select id="quickSearchType" className="form-control">
                  <option value="flight">Flight Number</option>
                  <option value="booking">Booking ID</option>
                  <option value="passenger">Passenger Name</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="quickSearchQuery">Search Query</label>
                <input 
                  type="text" 
                  id="quickSearchQuery" 
                  className="form-control"
                  placeholder="Enter search term..." 
                />
              </div>
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <div className="help-card">
            <div className="help-icon">
              <HelpIcon fontSize="large" />
            </div>
            <div className="help-content">
              <h3>Need Help?</h3>
              <p>Check out our admin guide or contact technical support for assistance.</p>
              <div className="help-actions">
                <button className="help-button">View Admin Guide</button>
                <button className="help-button secondary">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EnhancedDashboard;