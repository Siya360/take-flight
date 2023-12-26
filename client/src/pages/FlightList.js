import React from 'react';
import { useHistory } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';

function FlightList() {
  const history = useHistory();

  function handleBookFlight() {
    // Directly navigate to the NewFlight page without checking for user
    history.push('/new');
  }

  const flights = [
    // ... your flights data here
  ];

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
            <TableRow>
              <TableCell colSpan={5} align="center">No flights available at the moment.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FlightList;
