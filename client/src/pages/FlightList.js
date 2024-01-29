import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Container, Typography, Button, Alert } from '@mui/material';
import FlightCard from './FlightCard';
import SortFlights from './SortFlights';
import { fetchFlights, pollFlights } from '../utils/api';
import { connectWebSocket, closeWebSocket } from '../utils/websocket'; 

function FlightList() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('Best');
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const itemsPerPage = 16; // Define how many items you want per page
  const [totalPages, setTotalPages] = useState(0); // State for total pages
  const [flightsCache, setFlightsCache] = useState({}); // Object with pageNumber as key and flights data as value
  
    useEffect(() => {
      const loadFlights = async () => {
        setIsLoading(true);
  
        // Check if the current page flights are in cache
        if (flightsCache[currentPage]) {
          // Use cached flights data
          setFlights(flightsCache[currentPage]);
          setIsLoading(false);
        } else {
          // Fetch flights as they are not in cache
          try {
            const data = await fetchFlights(currentPage, itemsPerPage);
            setFlights(data.flights);
            setTotalPages(data.totalPages); // Set total pages based on response

            // Update cache with newly fetched flights
            setFlightsCache(prevCache => ({
              ...prevCache,
              [currentPage]: data.flights
            }));
          } catch (err) {
            setError(err);
          }
          setIsLoading(false);
        }
      };
  
      loadFlights();
    
     // Connect to WebSocket when the component mounts
      connectWebSocket();

    // Close WebSocket connection when the component unmounts
    return () => {
      closeWebSocket();
    };
  }, [currentPage, itemsPerPage, flightsCache]); // Add any additional dependencies if needed

  const loadMoreFlights = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      const moreFlights = await pollFlights(currentPage + 1, itemsPerPage);
      setFlights([...flights, ...moreFlights]); // Append new flights to the existing list
    }
  };

  const handleBookFlight = (flightId) => {
    navigate(`/flight-details/${flightId}`);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const sortFlights = (flights, option) => {
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
        return sortedFlights;
    }
  };

  const displayedFlights = sortFlights(flights.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), sortOption);

  if (isLoading) {
    return <Typography>Loading flights...</Typography>;
  }

  if (error) {
    return <Alert severity="error">Error fetching flights: {error.message}</Alert>;
  }

  return (
    <Container>
      <SortFlights onSort={handleSortChange} />
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
      {currentPage < totalPages && (
        <Button onClick={loadMoreFlights}>Load More</Button>
      )}
    </Container>
  );
}

export default FlightList;
