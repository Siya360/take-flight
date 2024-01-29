// import to use websocket to send message to server
import { connectWebSocket, sendMessage, closeWebSocket } from './websocket';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

// Use this header configuration in all the fetch calls that need the API key
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY, // Include the API key in the request header
};

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

// Example function to fetch flights with the API key
export const fetchFlights = async () => {
  try {
    const response = await fetch(`${BASE_URL}/flights`, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw error;
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

// Function to handle user login
export const loginUser = async (loginData) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    if (!response.ok) {
      throw new Error('Login failed.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

// Function to handle user sign-up
export const signUpUser = async (signUpData) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signUpData),
    });
    if (!response.ok) {
      throw new Error('Sign-up failed.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error during sign-up:', error);
    throw error;
  }
};

// Function to handle the pagination or to fetch more flights
export const pollFlights = async (pageNumber, itemsPerPage) => {
  try {
    const response = await fetch(`${BASE_URL}/flights?page=${pageNumber}&limit=${itemsPerPage}`);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return await response.json();
  } catch (error) {
    console.error('Error polling flights:', error);
    throw error;
  }
};

export { connectWebSocket, sendMessage, closeWebSocket };

