import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container, Typography, Button, Alert } from '@mui/material';
import FlightCard from './FlightCard';
import SortFlights from './SortFlights';
import { fetchFlights, pollFlights } from '../utils/api';
import { connectWebSocket, closeWebSocket } from '../utils/websocket'; 
import useApiCall from '../hooks/useApiCall'; 

function FlightList() {
  const navigate = useNavigate();
  const { error, isLoading, execute, data } = useApiCall();

  const [sortOption, setSortOption] = useState('Best'); // State for selected sorting option
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  
  useEffect(() => {
    const fetchFlightsData = async () => {
      await execute(() => fetchFlights(currentPage, itemsPerPage));
    };

    fetchFlightsData();
    connectWebSocket();

    return () => {
      closeWebSocket();
    };
  }, [currentPage, execute]);

  const loadMoreFlights = async () => {
    if (currentPage < data.totalPages) {
      setCurrentPage(currentPage + 1);
      await execute(() => pollFlights(currentPage + 1, itemsPerPage));
    }
  };

  const handleBookFlight = (flightId) => {
    navigate(`/flight-details/${flightId}`);
  };

  const handleSortChange = (option) => {
    setSortOption(option); // Update the selected sorting option
  };

  const sortFlights = (flights, option) => {
    switch (option) {
      case 'Price Low to High':
        return flights.sort((a, b) => a.price - b.price);
      case 'Price High to Low':
        return flights.sort((a, b) => b.price - a.price);
      case 'Duration Short to Long':
        return flights.sort((a, b) => a.duration - b.duration);
      case 'Duration Long to Short':
        return flights.sort((a, b) => b.duration - a.duration);
      default:
        return flights;
    }
  };

  const displayedFlights = isLoading ? [] : sortFlights(data?.flights || [], sortOption);

  if (isLoading) {
    return <Typography>Loading flights...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Container>
      <SortFlights onSort={handleSortChange} /> {/* Pass the handleSortChange function to SortFlights */}
      <Grid container spacing={2}>
        {displayedFlights.map(flight => (
          <Grid item key={flight.id} xs={12} sm={6} md={4}>
            <FlightCard
              flight={flight}
              onBookFlight={() => handleBookFlight(flight.id)}
            />
          </Grid>
        ))}
      </Grid>
      {currentPage < data.totalPages && (
        <Button onClick={loadMoreFlights}>Load More</Button>
      )}
    </Container>
  );
}

export default FlightList;
