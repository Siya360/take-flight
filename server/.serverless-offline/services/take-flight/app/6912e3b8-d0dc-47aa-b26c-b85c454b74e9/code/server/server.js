const express = require('express');
const app = express();

// Define a route that sends a "Hello World" message
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Export the app for serverless use
module.exports = app;
