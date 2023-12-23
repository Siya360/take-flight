import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Typography, Container, CircularProgress, Box } from '@material-ui/core';

const NewFlight = () => {
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    // Mock a successful flight creation and navigate back to the flight list
    setTimeout(() => {
      setIsLoading(false);
      history.push('/');
    }, 1000);
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Book a New Flight
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Destination"
          variant="outlined"
          fullWidth
          margin="normal"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <TextField
          label="Departure"
          variant="outlined"
          fullWidth
          margin="normal"
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
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
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Book Now'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default NewFlight;