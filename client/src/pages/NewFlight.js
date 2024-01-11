import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Typography, Container, CircularProgress, Box, MenuItem } from '@material-ui/core';
import { createFlight } from '../utils/api'; // Import the API utility function

const NewFlight = () => {
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // Construct the flight data object
    const flightData = {
      destination,
      departure,
      flightDate,
      returnDate,
      cabinClass, // Add cabin class to your flight data object
    };

    try {
      // Use the createFlight API utility to send the data
      const result = await createFlight(flightData);
      console.log(result); // Log the result or handle as needed
      history.push('/'); // Navigate back to the flight list
    } catch (error) {
      console.error(error); // Handle the error appropriately
    } finally {
      setIsLoading(false); // Stop the loading indicator
    }
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Search for Flights
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Enter Departure"
          variant="outlined"
          fullWidth
          margin="normal"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
        />
        <TextField
          label="Enter Destination"
          variant="outlined"
          fullWidth
          margin="normal"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <TextField
          label="Flight Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
          margin="normal"
          value={flightDate}
          onChange={(e) => setFlightDate(e.target.value)}
        />
        <TextField
          label="Return Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
          margin="normal"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        />
        <TextField
          label="Adults (18+)"
          type="number"
          InputProps={{ inputProps: { min: 1, max: 9 } }}
          variant="outlined"
          fullWidth
          margin="normal"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
        />
        <TextField
          label="Children (2-11)"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 9 } }}
          variant="outlined"
          fullWidth
          margin="normal"
          value={children}
          onChange={(e) => setChildren(Number(e.target.value))}
        />
        <TextField
          label="Infants (Under 2)"
          type="number"
          InputProps={{ inputProps: { min: 0, max: 9 } }}
          variant="outlined"
          fullWidth
          margin="normal"
          value={infants}
          onChange={(e) => setInfants(Number(e.target.value))}
        />
        {/* Add a dropdown field for cabin class */}
        <TextField
          select
          label="Cabin Class"
          value={cabinClass}
          onChange={(e) => setCabinClass(e.target.value)}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          <MenuItem value="Economy">Economy</MenuItem>
          <MenuItem value="Premium Economy">Premium Economy</MenuItem>
          <MenuItem value="Business">Business</MenuItem>
          <MenuItem value="First Class">First Class</MenuItem>
        </TextField>
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Search Flights'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default NewFlight;
