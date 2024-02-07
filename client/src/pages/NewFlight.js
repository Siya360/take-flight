import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container, Paper, CircularProgress, Box, Popover, Grid, TextField, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTime } from 'luxon';
import { createFlight } from '../utils/api';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import useApiCall from '../hooks/useApiCall'; 

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

  // Add custom styles for the Paper component
  const paperStyle = {
    padding: '40px',
    marginTop: '5px',
    marginBottom: '40px',
    backgroundColor: '#3f51b5', 
    color: 'white' // Text color for better readability
  };
  
  const NewFlight = () => {
    const navigate = useNavigate();
    const { execute, data, isLoading, error } = useApiCall(createFlight);
  
    // State variables for flight form fields
    const [destination, setDestination] = useState('');
    const [departure, setDeparture] = useState('');
    const [selectedDepartureDate, setSelectedDepartureDate] = useState(DateTime.local());
    const [selectedReturnDate, setSelectedReturnDate] = useState(DateTime.local());
    const [cabinClass, setCabinClass] = useState('Economy');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);
    const [openTravellers, setOpenTravellers] = useState(false);
    const [travellersAnchorEl, setTravellersAnchorEl] = useState(null);
    const [isReturnPickerOpen, setReturnPickerOpen] = useState(false);
    const id = 'simple-popover';

    const handleDepartureDateChange = (date) => {
      setSelectedDepartureDate(date);
    };
  
    const handleReturnDateChange = (date) => {
      setSelectedReturnDate(date);
    };
  
    const handleAdultsChange = (e) => {
      setAdults(Number(e.target.value));
    };
  
    const handleChildrenChange = (e) => {
      setChildren(Number(e.target.value));
    };
  
    const handleInfantsChange = (e) => {
      setInfants(Number(e.target.value));
    };

    const handleTravellersClick = (event) => {
      setTravellersAnchorEl(event.currentTarget);
      setOpenTravellers(true); // Open the popover
    };
    
    const handleTravellersClose = () => {
      setTravellersAnchorEl(null);
      setOpenTravellers(false); // Close the popover
    };
  
    useEffect(() => {
      // Any side effects related to state changes
    }, [adults, children, infants]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      const flightData = {
        // ... your flight data
      };
  
      execute(flightData);
    };
  
    // Redirect on successful API call
    useEffect(() => {
      if (data) {
        navigate('/flights');
      }
    }, [data, navigate]);

  return (
    <Container>
      {/* Conditionally render the error message */}
      {error && <Alert severity="error">{error}</Alert>}
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
                  format="yyyy-MM-dd"
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
                  format="yyyy-MM-dd"
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
  <CustomGridItem container spacing={2} direction="column"> {/* Set direction to column */}
    {/* Input field for specifying the number of adults */}
    <CustomGridItem item xs={12}>
      <CustomTextField
        label="Adults (16+)"
        type="number"
        InputProps={{ inputProps: { min: 1, max: 9 } }}
        variant="outlined"
        fullWidth
        value={adults}
        onChange={handleAdultsChange}
      />
    </CustomGridItem>
    {/* Input field for specifying the number of children */}
    <CustomGridItem item xs={12}>
      <CustomTextField
        label="Children (2-15)"
        type="number"
        InputProps={{ inputProps: { min: 0, max: 9 } }}
        variant="outlined"
        fullWidth
        value={children}
        onChange={handleChildrenChange}
      />
    </CustomGridItem>
    {/* Input field for specifying the number of infants */}
    <CustomGridItem item xs={12}>
      <CustomTextField
        label="Infants (Under 2)"
        type="number"
        InputProps={{ inputProps: { min: 0, max: 9 } }}
        variant="outlined"
        fullWidth
        value={infants}
        onChange={handleInfantsChange}
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
  </Container>
);
   
  };  
export default NewFlight;






