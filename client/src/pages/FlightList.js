// Import necessary hooks and components from React, React Router, and Material UI
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';

// Import the fetchFlights function from the API utility
import { fetchFlights } from '../utils/api';

// Define the FlightList component
function FlightList() {
  // Use the useHistory hook to allow for navigation
  const history = useHistory();
  // Use the useState hook to manage the flights state
  const [flights, setFlights] = useState([]);

  // Use the useEffect hook to fetch flights when the component mounts
  useEffect(() => {
    // Use the fetchFlights function from the API utility to fetch flights
    fetchFlights()
      .then(data => setFlights(data)) // Update the flights state with the fetched data
      .catch(error => console.error('Error fetching flights:', error)); // Log any errors
  }, []); // Empty dependency array means this effect runs once on mount

  // Define a function to handle booking a flight
  function handleBookFlight() {
    // Navigate to the /new route
    history.push('/new');
  }

  // Render the component
  return (
    <TableContainer component={Paper}>
      <Table aria-label="flight table">
        <TableHead>
          <TableRow>
            <TableCell>Flight To</TableCell>
            <TableCell align="right">Flight From</TableCell>
            <TableCell align="right">Flight Date</TableCell>
            <TableCell align="right">Return Date</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flights.length > 0 ? (
            // If there are flights, map over them and create a table row for each one
            flights.map((flight) => (
              <TableRow key={flight.id} hover>
                <TableCell component="th" scope="row">{flight.destination}</TableCell>
                <TableCell align="right">{flight.departure}</TableCell>
                <TableCell align="right">{flight.flight_date}</TableCell>
                <TableCell align="right">{flight.return_date}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="primary" onClick={handleBookFlight}>
                    Book Now
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // If there are no flights, display a message
            <TableRow>
              <TableCell colSpan={5} align="center">No flights available at the moment.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Export the FlightList component as the default export
export default FlightList;