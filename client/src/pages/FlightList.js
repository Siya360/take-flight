import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import FlightCard from './FlightCard';
import { fetchFlights } from '../utils/api';
import SortFlights from './SortFlights';

function FlightList() {
  const history = useHistory();
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('Best');

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

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const sortFlights = (flights, option) => {
  // Create a copy of the flights array to avoid mutating the original
  const sortedFlights = [...flights];
  switch (option) {
    case 'Price Low to High':
      return sortedFlights.sort((a, b) => a.price - b.price);
    case 'Price High to Low':
      return sortedFlights.sort((a, b) => b.price - a.price);
    case 'Duration Short to Long':
      return sortedFlights.sort((a, b) => a.duration - b.duration);
    case 'Duration Long to Short':
      return sortedFlights.sort((a, b) => b.duration - a.duration);
    default:
      return sortedFlights; // If no valid option is provided, return the flights unsorted
  }
  };

  const sortedFlights = sortFlights(flights, sortOption);

  if (isLoading) {
    return <Typography>Loading flights...</Typography>;
  }

  if (error) {
    return <Alert severity="error">Error fetching flights: {error.message}</Alert>;
  }

  return (
    <div>
      <SortFlights onSort={handleSortChange} />
      <Grid container spacing={2}>
        {sortedFlights.map(flight => (
          <Grid item key={flight.id} xs={12} sm={6} md={4}>
            <FlightCard
              flight={flight}
              onBookFlight={() => handleBookFlight(flight.id)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default FlightList;