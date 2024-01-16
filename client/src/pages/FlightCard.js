import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button, CardActions } from '@material-ui/core';

function FlightCard({ flight, onBookFlight }) {
  return (
    <Card>
      <CardContent>
        {/* Flight Details */}
        <Typography variant="h6">{flight.airline}</Typography>
        <Typography color="textSecondary">{flight.departureTime} - {flight.arrivalTime}</Typography>
        <Typography color="textSecondary">Duration: {flight.duration}</Typography>
        <Typography variant="h5">Price: {flight.price}</Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary" onClick={onBookFlight}>
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
}

// Define PropTypes
FlightCard.propTypes = {
  flight: PropTypes.shape({
    airline: PropTypes.string,
    departureTime: PropTypes.string,
    arrivalTime: PropTypes.string,
    duration: PropTypes.string,
    price: PropTypes.string,
  }).isRequired,
  onBookFlight: PropTypes.func.isRequired,
};

export default FlightCard;

