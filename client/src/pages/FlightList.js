import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container, Typography, Alert, CircularProgress } from '@mui/material';
import FlightCard from './FlightCard';
import SortFlights from './SortFlights';
import useApiCall from '../hooks/useApiCall';

function FlightList() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { execute, isLoading, error } = useApiCall(); // Adjust based on actual useApiCall implementation

  // Correctly handle sort change
  const handleSortChange = useCallback((sortOption) => {
    // Implement sorting logic or re-fetch flights based on the new sort option
    console.log(sortOption); // Placeholder
  }, []);

  const loadMoreFlights = useCallback(async () => {
    if (hasMore && !isLoading) {
      // Example of execute function adjusted to return both flights data and a flag indicating more data
      const response = await execute(currentPage); // Adjust this to your actual API call structure
      const newFlights = response.flights; // Assuming the response contains flights data
      const moreFlightsAvailable = response.moreAvailable; // This flag should come from your API response
      
      setFlights(prev => [...prev, ...newFlights]);
      setHasMore(moreFlightsAvailable); // Update based on the API response
      if (moreFlightsAvailable) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    }
}, [currentPage, execute, hasMore, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      loadMoreFlights();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreFlights]);

  useEffect(() => {
    loadMoreFlights();
  }, [loadMoreFlights]);

  if (isLoading && currentPage === 1) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <SortFlights onSort={handleSortChange} />
      <Grid container spacing={2}>
        {flights.map((flight, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <FlightCard flight={flight} onBookFlight={() => navigate(`/flight-details/${flight.id}`)} />
          </Grid>
        ))}
      </Grid>
      {isLoading && <Typography>Loading more flights...</Typography>}
    </Container>
  );
}

export default FlightList;
