const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Existing imports and functions

// Function to fetch details of a specific flight
export const fetchFlightDetails = async (flightId) => {
  try {
    const response = await fetch(`${BASE_URL}/flights/${flightId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching flight details:', error);
    throw error;
  }
};

export const fetchFlights = async () => {
  try {
    const response = await fetch(`${BASE_URL}/flights`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error; // Re-throw to handle it in the calling component
  }
};

export const createFlight = async (flightData) => {
  try {
    const response = await fetch(`${BASE_URL}/flights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flightData),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating new flight:', error);
    throw error;
  }
};
