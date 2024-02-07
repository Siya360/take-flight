// Import necessary dependencies
import React, { useEffect } from 'react'; // React and useEffect hook
import { useParams } from 'react-router-dom'; // Hook for accessing URL parameters
import { CircularProgress, Typography, Container, Box } from '@mui/material'; // MUI components
import { fetchFlightDetails } from '../utils/api'; // API function to fetch flight details
import { formatPrice, formatDateTime } from '../utils/formatUtils'; // Utility functions for formatting
import useApiCall from '../hooks/useApiCall'; // Custom hook for making API calls

// Define the FlightDetails component
function FlightDetails() {
  // Get the flight ID from the URL parameters
  const { id } = useParams();

  // Use the useApiCall hook to manage the API call state
  const { data: flight, isLoading, error, execute } = useApiCall();

  // Use the useEffect hook to fetch the flight details when the component mounts
  useEffect(() => {
    execute(() => fetchFlightDetails(id));
  }, [id, execute]); // Dependencies for the useEffect hook

  // If the API call is still loading, display a loading spinner
  if (isLoading) {
    return <CircularProgress />;
  }

  // If there was an error with the API call, or if the flight data is not available, display an error message
  if (error || !flight) {
    return <Typography variant="h6">Flight details not available.</Typography>;
  }

  // Render the flight details
  return (
    <Container>
      <Typography variant="h4" gutterBottom>Flight Details</Typography>
      <Box mb={2}>
        <Typography variant="h6">{flight.airline}</Typography>
        <Typography variant="body1">Departure: {formatDateTime(flight.departureTime)}</Typography>
        <Typography variant="body1">Arrival: {formatDateTime(flight.arrivalTime)}</Typography>
        <Typography variant="body1">Duration: {flight.duration}</Typography>
        <Typography variant="body1">Price: {formatPrice(flight.price)}</Typography>
        {/* Add more details as needed */}
      </Box>
      {/* Additional information or components related to the flight details can be added here as needed */}
    </Container>
  );
}

// Export the FlightDetails component as the default export
export default FlightDetails;