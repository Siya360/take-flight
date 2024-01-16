// Import necessary hooks and components from React, React Router, and Material UI
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import FlightCard from './FlightCard'; // Adjust the relative path as necessary
// Import the fetchFlights function from the API utility
import { fetchFlights } from '../utils/api';

// Define the FlightList component
function FlightList() {
  // Use the useHistory hook to allow for navigation
  const history = useHistory();
  // Use the useState hook to manage the flights state
  const [flights, setFlights] = useState([]);

// State variables for flight details
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the useEffect hook to fetch flights when the component mounts
  useEffect(() => {
    fetchFlights()
      .then(data => {
        setFlights(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  const handleBookFlight = (flightId) => {
    console.log('Book flight:', flightId);
    history.push(`/flight-details/${flightId}`);
  };

  if (isLoading) {
    return <Typography>Loading flights...</Typography>;
  }

  if (error) {
    return <Typography>Error fetching flights: {error.message}</Typography>;
  }

  // Render the component
  return (
    <Grid container spacing={2}>
      {flights.map(flight => (
        <Grid item key={flight.id} xs={12} sm={6} md={4}>
          <FlightCard
            flight={flight}
            onBookFlight={() => handleBookFlight(flight.id)} // This is the booking logic
          />
        </Grid>
      ))}
    </Grid>
  );
}

// Export the FlightList component as the default export
export default FlightList;