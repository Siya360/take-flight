import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Typography, Container, CircularProgress, Grid, MenuItem, Paper } from '@material-ui/core';
import { createFlight } from '../utils/api'; // Import the API utility function
import { makeStyles } from '@material-ui/core/styles';

// Define your custom styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    backgroundColor: 'white', // Set the background color for input fields
    // Add other styles if needed
  },
  // ... other styles
}));

const NewFlight = () => {
  const classes = useStyles();
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

  // Add custom styles for the Paper component
  const paperStyle = {
    padding: '40px',
    marginTop: '5px',
    marginBottom: '40px',
    backgroundColor: '#3f51b5', 
    color: 'white' // Text color for better readability
  };
     
return (
  <Paper style={paperStyle} elevation={3}>
      <Container maxWidth="md"> {/* Set maxWidth to your desired width */}
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Search for Flights
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              label="Enter Departure"
              variant="outlined"
              fullWidth
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className={classes.inputField}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Enter Destination"
              variant="outlined"
              fullWidth
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className={classes.inputField}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Flight Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              value={flightDate}
              onChange={(e) => setFlightDate(e.target.value)}
              className={classes.inputField}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Return Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className={classes.inputField}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Adults (16+)"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 9 } }}
            variant="outlined"
            fullWidth
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className={classes.inputField}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Children (2-15)"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 9 } }}
            variant="outlined"
            fullWidth
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className={classes.inputField}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Infants (Under 2)"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 9 } }}
            variant="outlined"
            fullWidth
            value={infants}
            onChange={(e) => setInfants(Number(e.target.value))}
            className={classes.inputField}
          />
        </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              label="Cabin Class"
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="Economy">Economy</MenuItem>
              <MenuItem value="Premium Economy">Premium Economy</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="First Class">First Class</MenuItem>
              className={classes.inputField}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Search Flights'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
    </Paper>    
  );
};

export default NewFlight;
