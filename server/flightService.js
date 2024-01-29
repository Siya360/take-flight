const axios = require('axios');
const FLIGHTS_API_KEY = process.env.FLIGHTS_API_KEY; // Your API key

// Function within the microservice to call the external Flight Data API
const searchFlights = async (departure, arrival, date) => {
  const response = await axios.get('https://external-flights-api.com/search', {
    params: { departure, arrival, date },
    headers: { 'x-api-key': FLIGHTS_API_KEY },
  });
  return response.data;
};

module.exports = { searchFlights };
