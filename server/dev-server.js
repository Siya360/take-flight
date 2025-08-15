// dev-server.js - Development server without AWS dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    service: 'Take-Flight Development Server'
  });
});

// Mock authentication endpoints for development
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  console.log('Mock register:', { username, email });
  res.json({ 
    success: true, 
    message: 'User registered successfully (mock)',
    user: { username, email }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Mock login:', { username });
  res.json({
    success: true,
    message: 'Login successful (mock)',
    tokens: {
      idToken: 'mock-id-token',
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    }
  });
});

// Mock flight search endpoint
app.get('/api/flights/search', (req, res) => {
  const { departure, arrival, date } = req.query;
  console.log('Mock flight search:', { departure, arrival, date });
  
  // Mock flight data
  const mockFlights = [
    {
      id: 1,
      departure: departure || 'JFK',
      arrival: arrival || 'LAX',
      date: date || '2024-01-15',
      price: 299,
      airline: 'American Airlines',
      duration: '5h 30m'
    },
    {
      id: 2,
      departure: departure || 'JFK',
      arrival: arrival || 'LAX',
      date: date || '2024-01-15',
      price: 349,
      airline: 'Delta Airlines',
      duration: '5h 45m'
    }
  ];
  
  res.json({
    flights: mockFlights,
    total: mockFlights.length
  });
});

// Mock protected routes
app.get('/protected-route', (req, res) => {
  res.json({ message: 'This is a protected route (mock)' });
});

// Catch-all route
app.get('*', (req, res) => {
  res.json({ 
    message: 'Take-Flight Development Server',
    endpoints: [
      'GET /health',
      'POST /register',
      'POST /login',
      'GET /api/flights/search'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Take-Flight Development Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Flight search: http://localhost:${PORT}/api/flights/search`);
});

module.exports = app;
