import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, CardActions, CardActionArea, Button } from '@mui/material'; // Add Button here
import { styled } from '@mui/material/styles';
import { formatPrice } from '../utils/formatUtils';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation

// Your component code remains the same...
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

function FlightCard({ flight }) {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle card click, navigating to the flight details page
  const handleCardClick = () => {
    navigate(`/flight-details/${flight.id}`); // Adjust the path as needed
  };

  return (
    <CustomCard>
      <CardActionArea onClick={handleCardClick}> {/* Make the card clickable */}
        <CardContent>
          {/* Flight Details */}
          <Typography variant="h6">{flight.airline}</Typography>
          <Typography color="textSecondary">{flight.departureTime} - {flight.arrivalTime}</Typography>
          <Typography color="textSecondary">Duration: {flight.duration}</Typography>
          <Typography variant="h5">Price: {formatPrice(flight.price)}</Typography>
        </CardContent>
        <CardActions>
          <CustomButton variant="contained" onClick={handleCardClick}>
            Book Now
          </CustomButton>
        </CardActions>
      </CardActionArea>
    </CustomCard>
  );
}

FlightCard.propTypes = {
  flight: PropTypes.shape({
    id: PropTypes.number.isRequired, // Ensure you have an ID for routing
    airline: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalTime: PropTypes.string,
    duration: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
};

export default FlightCard;
