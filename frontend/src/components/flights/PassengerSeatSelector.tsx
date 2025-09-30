import React from 'react';
import SeatSelection from './SeatSelection';

interface PassengerSeatSelectorProps {
  selectedSeat: string | null;
  onSelect: (seat: string) => void;
  bookedSeats?: string[];
  passengerIndex: number;
}

const PassengerSeatSelector: React.FC<PassengerSeatSelectorProps> = ({ selectedSeat, onSelect, bookedSeats, passengerIndex }) => {
  return (
    <div style={{ marginTop: 8, marginBottom: 16 }}>
      <SeatSelection
        selectedSeat={selectedSeat}
        onSelect={onSelect}
        bookedSeats={bookedSeats}
      />
    </div>
  );
};

export default PassengerSeatSelector;
