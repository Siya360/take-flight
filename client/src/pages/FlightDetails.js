import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Container, Box } from '@mui/material';
import { fetchFlightDetails } from '../utils/api';
import { formatPrice } from '../utils/formatUtils';

function formatDateTime(dateTime) {
  // Add formatting function for date and time if needed
  return dateTime; // Replace this with actual formatting
}

function FlightDetails() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlightDetails(id)
      .then(data => {
        setFlight(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching flight details:", err);
        setError(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !flight) {
    return <Typography variant="h6">Flight details not available.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Flight Details</Typography>
      <Box mb={2}>
        <Typography variant="h6">{flight.airline}</Typography>
        <Typography variant="body1">Departure: {formatDateTime(flight.departureTime)}</Typography>
        <Typography variant="body1">Arrival: {formatDateTime(flight.arrivalTime)}</Typography>
        <Typography variant="body1">Duration: {flight.duration}</Typography>
        <Typography variant="body1">Price: {formatPrice(flight.price)}</Typography>
        {/* Add more details as needed */}
      </Box>
      {/* Additional information or components related to the flight details can be added here as needed */}
    </Container>
  );
}

export default FlightDetails;
