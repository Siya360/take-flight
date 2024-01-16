import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, TextField, Typography, Container, CircularProgress, Grid, MenuItem, Paper, Popover, Box} from '@material-ui/core';
import { createFlight } from '../utils/api';
import { makeStyles } from '@material-ui/core/styles';

// Custom styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    backgroundColor: 'white', // Set the background color for input fields
    roundedLeft: {
      '& .MuiOutlinedInput-root': {
        borderTopLeftRadius: '4px',
        borderBottomLeftRadius: '4px',
        borderTopRightRadius: '0',
        borderBottomRightRadius: '0',
      },
    },
    rectangle: {
      '& .MuiOutlinedInput-root': {
        borderRadius: '0',
      },
    },
    roundedRight: {
      '& .MuiOutlinedInput-root': {
        borderTopRightRadius: '4px',
        borderBottomRightRadius: '4px',
        borderTopLeftRadius: '0',
        borderBottomLeftRadius: '0',
      },
    },
  },
  gridItem: {
    padding: theme.spacing(0.5),// ... other styles
  },
}));

const NewFlight = () => {
  const classes = useStyles();
  // State variables for flight details
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  // State and functions for Travellers popover
  const [travellersAnchorEl, setTravellersAnchorEl] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleTravellersClick = (event) => {
    setTravellersAnchorEl(event.currentTarget);
  };

  const handleTravellersClose = () => {
    setTravellersAnchorEl(null);
  };

  const openTravellers = Boolean(travellersAnchorEl);
  const id = openTravellers ? 'travellers-popover' : undefined;

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
          <Grid container spacing={1} alignItems="center">
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
              className={`${classes.inputField} ${classes.roundedLeft}`}
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
              className={`${classes.inputField} ${classes.roundedLeft}`}
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
              className={`${classes.inputField} ${classes.roundedLeft}`}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              select
              label="Cabin Class"
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className={`${classes.inputField} ${classes.roundedLeft}`}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="Economy">Economy</MenuItem>
              <MenuItem value="Premium Economy">Premium Economy</MenuItem>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="First Class">First Class</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
                aria-describedby={id}
                variant="outlined"
                onClick={handleTravellersClick}
                className={`${classes.inputField} ${classes.roundedRight}`}
              >
                Travellers
              </Button>
              <Popover
                id={id}
                open={openTravellers}
                anchorEl={travellersAnchorEl}
                onClose={handleTravellersClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Box p={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        label="Adults (16+)"
                        type="number"
                        InputProps={{ inputProps: { min: 1, max: 9 } }}
                        variant="outlined"
                        fullWidth
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Children (2-15)"
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: 9 } }}
                        variant="outlined"
                        fullWidth
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                    />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Infants (Under 2)"
                        type="number"
                        InputProps={{ inputProps: { min: 0, max: 9 } }}
                        variant="outlined"
                        fullWidth
                        value={infants}
                        onChange={(e) => setInfants(Number(e.target.value))}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Popover>
            </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
    </Paper>    
  );
};

export default NewFlight;
