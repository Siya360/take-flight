// Correct import statements for MUI v5
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';
import { formatPrice } from '../utils/formatUtils';

// Styled components using MUI's 'styled' utility
const CustomCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
}));

const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));
function FlightCard({ flight, onBookFlight }) {
  return (
    <CustomCard>
      <CardContent>
        {/* Flight Details */}
        <Typography variant="h6">{flight.airline}</Typography>
        <Typography color="textSecondary">{flight.departureTime} - {flight.arrivalTime}</Typography>
        <Typography color="textSecondary">Duration: {flight.duration}</Typography>
        {/* Use the formatPrice function to display the price */}
        <Typography variant="h5">Price: {formatPrice(flight.price)}</Typography>
      </CardContent>
      <CardActions>
        <CustomButton variant="contained" color="primary" onClick={() => onBookFlight(flight)}>
          Book Now
        </CustomButton>
      </CardActions>
    </CustomCard>
  );
}

// PropTypes should reflect that price is expected to be a number
FlightCard.propTypes = {
  flight: PropTypes.shape({
    airline: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalTime: PropTypes.string,
    duration: PropTypes.string,
    price: PropTypes.number, // Note that this is a number now
    // ... other props
  }).isRequired,
  onBookFlight: PropTypes.func.isRequired,
};

export default FlightCard;
