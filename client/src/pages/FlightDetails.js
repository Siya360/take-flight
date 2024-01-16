import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Container } from '@material-ui/core';
import { fetchFlightDetails } from '../utils/api';

function FlightDetails() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFlightDetails(id)
      .then(data => {
        setFlight(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching flight details:", err);
        setError(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error || !flight) {
    return <Typography variant="h6">Flight details not available.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4">Flight Details</Typography>
      {/* Render detailed flight information here */}
    </Container>
  );
}

export default FlightDetails;
