import React from 'react';
import { Flight } from '../../types/Flight';
import './FlightCard.css';

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
  
  const formatDate = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
    <div className="flight-card">
      <div className="flight-card-header">
        <div className="flight-card-airline">SkyAirlines</div>
        <div className="flight-card-flight-number">{flight.flight_number}</div>
      </div>
      
      <div className="flight-card-route">
        <div className="flight-card-city">
          <div className="flight-card-city-code">{flight.departure_city.substring(0, 3).toUpperCase()}</div>
          <div className="flight-card-city-name">{flight.departure_city}</div>
          <div className="flight-card-value">{formatDateTime(flight.departure_time)}</div>
        </div>
        
        <div className="flight-card-route-line" title={calculateDuration()}></div>
        
        <div className="flight-card-city">
          <div className="flight-card-city-code">{flight.arrival_city.substring(0, 3).toUpperCase()}</div>
          <div className="flight-card-city-name">{flight.arrival_city}</div>
          <div className="flight-card-value">{formatDateTime(flight.arrival_time)}</div>
        </div>
      </div>
      
      <div className="flight-card-details">
        <div className="flight-card-info">
          <span className="flight-card-label">Date</span>
          <span className="flight-card-value">{formatDate(flight.departure_time)}</span>
        </div>
        
        <div className="flight-card-info">
          <span className="flight-card-label">Duration</span>
          <span className="flight-card-value">{calculateDuration()}</span>
        </div>
        
        <div className="flight-card-info">
          <span className="flight-card-label">Available Seats</span>
          <span className="flight-card-value">{flight.available_seats}</span>
        </div>
        
        <div className="flight-card-price">${flight.price}</div>
      </div>
      
      <div className="flight-card-actions">
        <button 
          className="search-button" 
          onClick={() => onBookNow(flight.id)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default FlightCard;