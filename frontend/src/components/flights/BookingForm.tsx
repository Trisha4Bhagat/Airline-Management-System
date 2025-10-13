import React, { useState } from 'react';
import { Flight } from '../../types/Flight';

export interface PassengerData {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  seat?: string;
  mealPreference: string;
  seatPreference: string;
}

export interface PassengerDetail {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passportNumber: string;
  specialRequests: string;
}

export interface BookingFormData {
  contactEmail: string;
  contactPhone: string;
  passengers: PassengerData[];
  bookingReference?: string;
}

interface BookingFormProps {
  flight: Flight | null;
  onClose: () => void;
  onSubmit: (data: BookingFormData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ flight, onClose, onSubmit }) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [passengers, setPassengers] = useState<PassengerDetail[]>([
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      passportNumber: '',
      specialRequests: '',
    },
  ]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  if (!flight) return null;

  const handlePassengerCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value, 10);
    setPassengerCount(count);
    
    // Update passenger array based on new count
    if (count > passengers.length) {
      // Add more passenger forms
      const additionalPassengers = Array(count - passengers.length).fill({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        passportNumber: '',
        specialRequests: '',
      });
      setPassengers([...passengers, ...additionalPassengers]);
    } else if (count < passengers.length) {
      // Remove excess passenger forms
      setPassengers(passengers.slice(0, count));
    }
  };

  const handlePassengerChange = (index: number, field: keyof PassengerDetail, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value,
    };
    setPassengers(updatedPassengers);
    
    // Clear error when field is updated
    if (formErrors[`passenger${index}-${field}`]) {
      const updatedErrors = { ...formErrors };
      delete updatedErrors[`passenger${index}-${field}`];
      setFormErrors(updatedErrors);
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    // Validate contact information
    if (!contactEmail.trim()) {
      errors['contactEmail'] = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactEmail)) {
      errors['contactEmail'] = 'Contact email is invalid';
    }
    
    if (!contactPhone.trim()) {
      errors['contactPhone'] = 'Contact phone is required';
    }
    
    passengers.forEach((passenger, index) => {
      if (!passenger.firstName.trim()) {
        errors[`passenger${index}-firstName`] = 'First name is required';
      }
      
      if (!passenger.lastName.trim()) {
        errors[`passenger${index}-lastName`] = 'Last name is required';
      }
      
      if (!passenger.email.trim()) {
        errors[`passenger${index}-email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(passenger.email)) {
        errors[`passenger${index}-email`] = 'Email is invalid';
      }
      
      if (!passenger.phone.trim()) {
        errors[`passenger${index}-phone`] = 'Phone number is required';
      }
      
      if (!passenger.dateOfBirth.trim()) {
        errors[`passenger${index}-dateOfBirth`] = 'Date of birth is required';
      }
      
      if (!passenger.passportNumber.trim()) {
        errors[`passenger${index}-passportNumber`] = 'Passport number is required';
      }
    });
    
    if (!agreeTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert PassengerDetail[] to PassengerData[] and create BookingFormData
      const passengerData: PassengerData[] = passengers.map(passenger => ({
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        age: new Date().getFullYear() - new Date(passenger.dateOfBirth).getFullYear(),
        gender: '', // Default value, could be added to form
        mealPreference: 'standard', // Default value
        seatPreference: 'any' // Default value
      }));

      const bookingData: BookingFormData = {
        contactEmail,
        contactPhone,
        passengers: passengerData
      };

      onSubmit(bookingData);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDateOfBirth = new Date();
  maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 12); // Minimum 12 years old
  const maxDateOfBirthString = maxDateOfBirth.toISOString().split('T')[0];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    return flight.price * passengerCount;
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <div className="booking-form-header">
          <h2>Book Your Flight</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="flight-summary">
          <h3>Flight Details</h3>
          <div className="flight-info-row">
            <div>
              <strong>Flight Number:</strong> {flight.flight_number}
            </div>
            <div>
              <strong>Date:</strong> {formatDate(flight.departure_time)}
            </div>
          </div>
          <div className="flight-info-row">
            <div>
              <strong>From:</strong> {flight.departure_city}
            </div>
            <div>
              <strong>To:</strong> {flight.arrival_city}
            </div>
          </div>
          <div className="flight-info-row">
            <div>
              <strong>Departure:</strong> {new Date(flight.departure_time).toLocaleTimeString()}
            </div>
            <div>
              <strong>Arrival:</strong> {new Date(flight.arrival_time).toLocaleTimeString()}
            </div>
          </div>
          <div className="flight-info-price">
            <strong>Price per passenger:</strong> ${flight.price}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="contact-section">
            <h3>Contact Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email:</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={formErrors['contactEmail'] ? 'form-control error' : 'form-control'}
                  required
                />
                {formErrors['contactEmail'] && (
                  <div className="error-message">{formErrors['contactEmail']}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="contactPhone">Contact Phone:</label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={formErrors['contactPhone'] ? 'form-control error' : 'form-control'}
                  required
                />
                {formErrors['contactPhone'] && (
                  <div className="error-message">{formErrors['contactPhone']}</div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="passengerCount">Number of Passengers:</label>
            <select 
              id="passengerCount" 
              value={passengerCount}
              onChange={handlePassengerCountChange}
              className="form-control"
            >
              {Array.from({ length: Math.min(flight.available_seats, 10) }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-details">
              <h3>Passenger {index + 1}</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`firstName-${index}`}>First Name:</label>
                  <input
                    id={`firstName-${index}`}
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                    className={formErrors[`passenger${index}-firstName`] ? 'form-control error' : 'form-control'}
                    required
                  />
                  {formErrors[`passenger${index}-firstName`] && (
                    <div className="error-message">{formErrors[`passenger${index}-firstName`]}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`lastName-${index}`}>Last Name:</label>
                  <input
                    id={`lastName-${index}`}
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                    className={formErrors[`passenger${index}-lastName`] ? 'form-control error' : 'form-control'}
                    required
                  />
                  {formErrors[`passenger${index}-lastName`] && (
                    <div className="error-message">{formErrors[`passenger${index}-lastName`]}</div>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`email-${index}`}>Email:</label>
                  <input
                    id={`email-${index}`}
                    type="email"
                    value={passenger.email}
                    onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                    className={formErrors[`passenger${index}-email`] ? 'form-control error' : 'form-control'}
                    required
                  />
                  {formErrors[`passenger${index}-email`] && (
                    <div className="error-message">{formErrors[`passenger${index}-email`]}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`phone-${index}`}>Phone:</label>
                  <input
                    id={`phone-${index}`}
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                    className={formErrors[`passenger${index}-phone`] ? 'form-control error' : 'form-control'}
                    required
                  />
                  {formErrors[`passenger${index}-phone`] && (
                    <div className="error-message">{formErrors[`passenger${index}-phone`]}</div>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`dateOfBirth-${index}`}>Date of Birth:</label>
                  <input
                    id={`dateOfBirth-${index}`}
                    type="date"
                    max={maxDateOfBirthString}
                    value={passenger.dateOfBirth}
                    onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                    className={formErrors[`passenger${index}-dateOfBirth`] ? 'form-control error' : 'form-control'}
                    required
                  />
                  {formErrors[`passenger${index}-dateOfBirth`] && (
                    <div className="error-message">{formErrors[`passenger${index}-dateOfBirth`]}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor={`passportNumber-${index}`}>Passport Number:</label>
                  <input
                    id={`passportNumber-${index}`}
                    type="text"
                    value={passenger.passportNumber}
                    onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                    className={formErrors[`passenger${index}-passportNumber`] ? 'form-control error' : 'form-control'}
                    required
                  />
                  {formErrors[`passenger${index}-passportNumber`] && (
                    <div className="error-message">{formErrors[`passenger${index}-passportNumber`]}</div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`specialRequests-${index}`}>Special Requests (optional):</label>
                <textarea
                  id={`specialRequests-${index}`}
                  value={passenger.specialRequests || ''}
                  onChange={(e) => handlePassengerChange(index, 'specialRequests', e.target.value)}
                  className="form-control"
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          <div className="form-group terms-checkbox">
            <input
              id="agreeTerms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className={formErrors.terms ? 'checkbox error' : 'checkbox'}
            />
            <label htmlFor="agreeTerms">I agree to the terms and conditions</label>
            {formErrors.terms && (
              <div className="error-message">{formErrors.terms}</div>
            )}
          </div>
          
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-row">
              <span>Base fare ({passengerCount} {passengerCount > 1 ? 'passengers' : 'passenger'}):</span>
              <span>${flight.price} × {passengerCount} = ${flight.price * passengerCount}</span>
            </div>
            <div className="summary-row">
              <span>Taxes & Fees:</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-button">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;