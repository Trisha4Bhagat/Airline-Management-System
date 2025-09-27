import React, { useState } from 'react';
import { Flight } from '../types/Flight';
import BookingForm, { PassengerDetail } from '../components/flights/BookingForm';
import './BookingConfirmation.css';

interface BookingConfirmationProps {
  flight: Flight;
  passengers: PassengerDetail[];
  onClose: () => void;
  onBackToFlights: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ 
  flight, 
  passengers, 
  onClose, 
  onBackToFlights 
}) => {
  const [isEmailSent, setIsEmailSent] = useState(true);
  
  // Generate a random booking reference
  const bookingReference = `BK${Math.floor(100000 + Math.random() * 900000)}`;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const calculateTotal = () => {
    return flight.price * passengers.length;
  };
  
  // In a real app, this would send an API request to email the confirmation
  const handleSendEmail = () => {
    setIsEmailSent(true);
    setTimeout(() => {
      alert(`Confirmation email sent to ${passengers[0].email}`);
    }, 1000);
  };
  
  return (
    <div className="booking-confirmation">
      <div className="confirmation-header">
        <h2>Booking Confirmed!</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      
      <div className="confirmation-content">
        <div className="confirmation-icon">✓</div>
        
        <div className="booking-reference">
          <h3>Booking Reference</h3>
          <div className="reference-code">{bookingReference}</div>
        </div>
        
        <div className="confirmation-details">
          <div className="confirmation-section">
            <h4>Flight Details</h4>
            <div className="detail-row">
              <span className="detail-label">Flight Number:</span>
              <span className="detail-value">{flight.flight_number}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(flight.departure_time)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">From:</span>
              <span className="detail-value">{flight.departure_city}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">To:</span>
              <span className="detail-value">{flight.arrival_city}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Departure:</span>
              <span className="detail-value">{formatTime(flight.departure_time)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Arrival:</span>
              <span className="detail-value">{formatTime(flight.arrival_time)}</span>
            </div>
          </div>
          
          <div className="confirmation-section">
            <h4>Passenger Details</h4>
            {passengers.map((passenger, index) => (
              <div key={index} className="passenger-summary">
                <div className="detail-row">
                  <span className="detail-label">Passenger {index + 1}:</span>
                  <span className="detail-value">{passenger.firstName} {passenger.lastName}</span>
                </div>
              </div>
            ))}
            <div className="detail-row">
              <span className="detail-label">Total Passengers:</span>
              <span className="detail-value">{passengers.length}</span>
            </div>
          </div>
          
          <div className="confirmation-section">
            <h4>Payment Details</h4>
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value price">${calculateTotal()}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Status:</span>
              <span className="detail-value payment-status">Paid</span>
            </div>
          </div>
        </div>
        
        <div className="confirmation-message">
          <p>
            Thank you for booking with SkyAirlines! A confirmation email has been sent to <strong>{passengers[0].email}</strong>.
            Please keep your booking reference for future inquiries.
          </p>
          {!isEmailSent && (
            <button 
              className="resend-email-button" 
              onClick={handleSendEmail}
            >
              Resend Email
            </button>
          )}
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="back-to-flights-button"
            onClick={onBackToFlights}
          >
            Back to Flights
          </button>
          <button 
            className="print-button"
            onClick={() => window.print()}
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;