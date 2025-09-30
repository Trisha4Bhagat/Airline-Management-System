import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface SeatSelectionProps {
  selectedSeat: string | null;
  onSelect: (seat: string) => void;
  bookedSeats?: string[];
}

const rows = 20;
const cols = ['A', 'B', 'C', 'D', 'E', 'F'];

const SeatSelection: React.FC<SeatSelectionProps> = ({ selectedSeat, onSelect, bookedSeats = [] }) => {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Select a seat:</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, 36px)`, gap: 1 }}>
        {Array.from({ length: rows }).map((_, rowIdx) =>
          cols.map((col, colIdx) => {
            const seat = `${rowIdx + 1}${col}`;
            const isBooked = bookedSeats.includes(seat);
            const isSelected = selectedSeat === seat;
            return (
              <Button
                key={seat}
                variant={isSelected ? 'contained' : 'outlined'}
                color={isBooked ? 'error' : isSelected ? 'primary' : 'inherit'}
                size="small"
                disabled={isBooked}
                sx={{ minWidth: 0, width: 36, height: 36, p: 0, m: 0.5 }}
                onClick={() => onSelect(seat)}
              >
                {seat}
              </Button>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default SeatSelection;
