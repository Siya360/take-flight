import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Container, Paper, CircularProgress, Box, Popover, Grid, TextField, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { createFlight } from '../utils/api';
import { styled } from '@mui/material/styles';

// Custom Styles

const CustomGridItem = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  // Style overrides for the TextField itself
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
    // Set a minimum width for the input field to ensure the full date is visible
    minWidth: '140px', // Adjust the minimum width as necessary
  },
  // Style overrides for the label within the TextField
  '& .MuiInputLabel-root': {
    color: '#FFFFFF', // Choose a color that stands out
    fontWeight: 'bold', // Make the label text bolder
    textShadow: '1px 1px 2px black', // Optional text shadow for depth
    backgroundColor: '#555555', // Optional background color for the label
    padding: '0 5px', // If using background color, add some padding
    borderRadius: '4px', // If using background color, round the corners
  },
  // Ensure the text within the input field is not cut off
  '& .MuiInputBase-input': {
    padding: '17px', // Adjust the padding as necessary
  },
}));
   
  const CustomButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }));
    
  const CustomDatePicker = styled(DatePicker)(({ theme }) => ({
    '& .MuiInputBase-root': {
      backgroundColor: 'white',
      borderRadius: theme.shape.borderRadius,
    },
  }));
  

const NewFlight = () => {
  const history = useHistory();

  // State variables for flight details
  const [destination, setDestination] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState(DateTime.local());
  const [cabinClass, setCabinClass] = useState('Economy');
  const [isLoading, setIsLoading] = useState(false);

  // State variable for the departure date picker
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(DateTime.local());

  // State variable for the return date picker
  const [selectedReturnDate, setSelectedReturnDate] = useState(DateTime.local());
  const [isReturnPickerOpen, setReturnPickerOpen] = useState(false); // State for return date picker visibility

  // State variables for travellers popover
  const [travellersAnchorEl, setTravellersAnchorEl] = useState(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  // Define the `id` for the popover
  const id = 'simple-popover';
  const openTravellers = Boolean(travellersAnchorEl); // This should be a boolean value based on your `travellersAnchorEl`

  // Handler functions for opening and closing the travellers popover
  const handleTravellersClick = (event) => {
    setTravellersAnchorEl(event.currentTarget);
  };

  const handleTravellersClose = () => {
    setTravellersAnchorEl(null);
  };

  // Handler functions for date changes
  const handleDepartureDateChange = (date) => {
    setSelectedDepartureDate(date); // Update the state for the UI display
};

const handleReturnDateChange = (date) => {
  setSelectedReturnDate(date); // Update the state for the UI display
  setReturnDate(date); // Update the state for form submission or backend logic
};

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Construct the flight data object from state variables
    const flightData = {
      destination,
      departure,
      flightDate: selectedDepartureDate.toISO(),
      returnDate,
      cabinClass,
      passengers: {
        adults,
        children,
        infants,
      },
    };

    try {
      // Use the createFlight API utility to send the flight data
      const result = await createFlight(flightData);
      console.log(result); // Log the result or handle as needed
      history.push('/flights'); // Navigate to the flight list on success
    } catch (error) {
      console.error('There was an error submitting the flight data:', error);
      // Handle the error appropriately in your UI
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Add custom styles for the Paper component
  const paperStyle = {
    padding: '40px',
    marginTop: '5px',
    marginBottom: '40px',
    backgroundColor: '#3f51b5', 
    color: 'white' // Text color for better readability
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <Paper style={paperStyle} elevation={3}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Search for Flights
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <CustomGridItem container spacing={0.1} alignItems="center">
              <CustomGridItem item xs={12} md={3}>
                {/* Text field for entering the departure location */}
                <CustomTextField
                  label="Enter Departure"
                  variant="outlined"
                  fullWidth
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)} // Updates the departure state when the input changes
                />
              </CustomGridItem>
  
              <CustomGridItem item xs={12} md={3}>
                {/* Text field for entering the destination location */}
                <CustomTextField
                  label="Enter Destination"
                  variant="outlined"
                  fullWidth
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)} // Updates the destination state when the input changes
                />
              </CustomGridItem>
  
              <CustomGridItem item xs={12} md={3}>
                {/* Date picker component */}
                <CustomDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="departure-date-picker"
                  label="Departure Date"
                  value={selectedDepartureDate}
                  onChange={handleDepartureDateChange}
                  renderInput={(params) => <CustomTextField {...params} />}
                />

              </CustomGridItem>
  
              <CustomGridItem item xs={12} md={3}>
                {/* Return date picker component */}
                <CustomDatePicker
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="return-date-picker"
                  label="Return Date"
                  value={selectedReturnDate}
                  onChange={handleReturnDateChange}
                  open={isReturnPickerOpen}
                  onOpen={() => setReturnPickerOpen(true)}
                  onClose={() => setReturnPickerOpen(false)}
                  renderInput={(params) => (
                <CustomTextField {...params} />
              )}
                />
                </CustomGridItem>
  
                <CustomGridItem item xs={12} md={2}>
                {/* Dropdown select for cabin class */}
                <CustomTextField
    select
    label="Cabin Class"
    value={cabinClass}
    onChange={(e) => setCabinClass(e.target.value)}
    variant="outlined"
    fullWidth
    SelectProps={{
      displayEmpty: true,
      renderValue: (value) => {
        if (value) {
          return value;
        }
        return <em>Cabin Class</em>;
      },
    }}
  >
    {/* Options for cabin class */}
    <MenuItem value="Economy">Economy</MenuItem>
    <MenuItem value="Premium Economy">Premium Economy</MenuItem>
    <MenuItem value="Business">Business</MenuItem>
    <MenuItem value="First Class">First Class</MenuItem>
  </CustomTextField>
</CustomGridItem>

<CustomGridItem item xs={12} sm={6} md={2}>
  {/* Button to trigger the travellers popover */}
  <CustomButton
    aria-describedby={id}
    variant="outlined"
    onClick={handleTravellersClick}
  >
    Travellers
    </CustomButton>
  {/* Popover that appears when the 'Travellers' button is clicked */}
  <Popover
    id={id} // Connects the Popover to the button for accessibility purposes
    open={openTravellers} // Controlled by state to show/hide the Popover
    anchorEl={travellersAnchorEl} // The element that the Popover is positioned relative to
    onClose={handleTravellersClose} // Function to handle closing of the Popover
    anchorOrigin={{
      vertical: 'bottom', // Popover appears below the anchor element
      horizontal: 'center', // Popover is horizontally centered to the anchor element
    }}
    transformOrigin={{
      vertical: 'top', // Popover animates from the top
      horizontal: 'center', // Popover animates from the center
    }}
  >
    <Box p={2}>
      <CustomGridItem container spacing={1}>
        {/* Input fields for specifying the number of adults, children, and infants */}
        <CustomGridItem item xs={12} sm={6} md={2}>
          <CustomTextField
            label="Adults (16+)"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 9 } }} // Sets the min and max values
            variant="outlined"
            fullWidth
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))} // Updates the adults state
          />
        </CustomGridItem>
        <CustomGridItem item xs={12} sm={6} md={2}>
          <CustomTextField
            label="Children (2-15)"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 9 } }} // Sets the min and max values
            variant="outlined"
            fullWidth
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))} // Updates the children state
          />
        </CustomGridItem>
        <CustomGridItem item xs={12}>
          <CustomTextField
            label="Infants (Under 2)"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 9 } }} // Sets the min and max values
            variant="outlined"
            fullWidth
            value={infants}
            onChange={(e) => setInfants(Number(e.target.value))} // Updates the infants state
          />
        </CustomGridItem>
      </CustomGridItem>
    </Box>
  </Popover>
</CustomGridItem>
<CustomGridItem item xs={12} md={2}>
  {/* The Button component is used as the submit button for the form */}
  <CustomButton
    type="submit" // Setting type as submit will trigger form submission on click
    variant="contained" // The contained variant gives the button a filled style
    color="secondary" // This sets the button color to the secondary theme color
    fullWidth // Makes the button expand to the full width of the Grid item
    disabled={isLoading} // Disables the button when isLoading is true
  >
    {/* Conditional rendering: if isLoading is true, show a spinner, otherwise show 'Search' */}
    {isLoading ? <CircularProgress size={24} /> : 'Search'}
  </CustomButton>
</CustomGridItem>
</CustomGridItem> {/* Closing tag for the main grid container */}
        </form> {/* Closing tag for the form */}
      </Container> {/* Closing tag for the container wrapping the form */}
    </Paper> {/* Closing tag for the paper component wrapping everything */}
  </LocalizationProvider>
);
   
  };  
export default NewFlight;






