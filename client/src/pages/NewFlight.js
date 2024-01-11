import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Typography, Container, CircularProgress, Box, MenuItem } from '@material-ui/core';
import { createFlight } from '../utils/api'; // Import the API utility function

const NewFlight = () => {
  // State variables for flight details
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  // State variables for passenger numbers
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  // State variable for cabin class selection
  const [cabinClass, setCabinClass] = useState('Economy');
  // State variable for loading state
  const [isLoading, setIsLoading] = useState(false);
  // Hook for navigation
  const history = useHistory();

  // Function to handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    // Construct the flight data object with all necessary information
    const flightData = {
      destination,
      departure,
      flightDate,
      returnDate,
      cabinClass,
      passengers: { // Include passenger counts in the flight data
        adults,
        children,
        infants,
      },
    };

    try {
      // Use the createFlight API utility to send the flight data
      const result = await createFlight(flightData);
      console.log(result); // Log the result or handle as needed
      history.push('/'); // Navigate back to the flight list on success
    } catch (error) {
      console.error(error); // Handle the error appropriately
    } finally {
      setIsLoading(false); // Reset loading state
    }
  }

  // JSX for the form component
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Search for Flights
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        {/* Input fields for flight details */}
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
        {/* Input fields for passenger numbers */}
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
        {/* Submit button with loading indicator */}
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
